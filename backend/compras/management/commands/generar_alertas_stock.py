"""
Comando para generar alertas automáticas de stock mínimo y precios atípicos.
Este comando se puede programar para ejecutarse periódicamente.
"""

from django.core.management.base import BaseCommand
from django.db import transaction
from django.db.models import Avg, Count, Q
from django.utils import timezone
from decimal import Decimal
from datetime import datetime, timedelta
from productos.models import Producto
from compras.models import AlertaStock, HistorialPrecios
import logging

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = 'Genera alertas automáticas de stock mínimo y precios atípicos'

    def add_arguments(self, parser):
        parser.add_argument(
            '--tipo',
            choices=['stock', 'precios', 'all'],
            default='all',
            help='Tipo de alertas a generar (stock, precios, all)'
        )
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Ejecutar sin crear alertas reales (solo mostrar resultados)'
        )
        parser.add_argument(
            '--verbose',
            action='store_true',
            help='Mostrar información detallada del proceso'
        )
        parser.add_argument(
            '--dias-historial',
            type=int,
            default=30,
            help='Días de historial para analizar precios atípicos (default: 30)'
        )

    def handle(self, *args, **options):
        tipo = options.get('tipo', 'all')
        dry_run = options.get('dry_run', False)
        verbose = options.get('verbose', False)
        dias_historial = options.get('dias_historial', 30)

        if dry_run:
            self.stdout.write(
                self.style.WARNING('MODO DRY-RUN: No se crearán alertas reales')
            )

        alertas_creadas = 0

        try:
            with transaction.atomic():
                if tipo in ['stock', 'all']:
                    alertas_stock = self.generar_alertas_stock(verbose, dry_run)
                    alertas_creadas += alertas_stock

                if tipo in ['precios', 'all']:
                    alertas_precios = self.generar_alertas_precios(
                        dias_historial, verbose, dry_run
                    )
                    alertas_creadas += alertas_precios

                if dry_run:
                    transaction.set_rollback(True)

            self.stdout.write(
                self.style.SUCCESS(
                    f'\n--- RESUMEN ---\n'
                    f'Total de alertas generadas: {alertas_creadas}'
                )
            )

            if dry_run:
                self.stdout.write(
                    self.style.WARNING('Ninguna alerta fue guardada (modo dry-run)')
                )

        except Exception as e:
            logger.error(f'Error al generar alertas: {str(e)}')
            self.stdout.write(
                self.style.ERROR(f'Error: {str(e)}')
            )

    def generar_alertas_stock(self, verbose, dry_run):
        """Genera alertas de stock mínimo y stock agotado"""
        alertas_creadas = 0

        # Productos con stock agotado
        productos_agotados = Producto.objects.filter(stock=0)
        
        for producto in productos_agotados:
            # Verificar si ya existe una alerta activa
            alerta_existente = AlertaStock.objects.filter(
                producto=producto,
                tipo='stock_agotado',
                estado__in=['activa', 'vista']
            ).exists()

            if not alerta_existente:
                if verbose:
                    self.stdout.write(f'Stock agotado: {producto.nombre}')

                if not dry_run:
                    AlertaStock.objects.create(
                        producto=producto,
                        tipo='stock_agotado',
                        prioridad='alta',
                        titulo=f'Stock Agotado - {producto.nombre}',
                        mensaje=f'El producto {producto.nombre} se encuentra sin stock.',
                        datos_adicionales={
                            'stock_actual': float(producto.stock),
                            'stock_minimo': float(producto.min_stock),
                            'sku': producto.sku
                        }
                    )
                alertas_creadas += 1

        # Productos con stock mínimo
        productos_stock_minimo = Producto.objects.filter(
            stock__gt=0,
            stock__lte=F('min_stock')
        )

        for producto in productos_stock_minimo:
            # Verificar si ya existe una alerta activa
            alerta_existente = AlertaStock.objects.filter(
                producto=producto,
                tipo='stock_minimo',
                estado__in=['activa', 'vista']
            ).exists()

            if not alerta_existente:
                # Calcular prioridad basada en qué tan cerca está del agotamiento
                porcentaje_stock = (producto.stock / producto.min_stock) * 100
                
                if porcentaje_stock <= 25:
                    prioridad = 'alta'
                elif porcentaje_stock <= 50:
                    prioridad = 'media'
                else:
                    prioridad = 'baja'

                if verbose:
                    self.stdout.write(
                        f'Stock mínimo: {producto.nombre} '
                        f'(Stock: {producto.stock}, Mínimo: {producto.min_stock})'
                    )

                if not dry_run:
                    AlertaStock.objects.create(
                        producto=producto,
                        tipo='stock_minimo',
                        prioridad=prioridad,
                        titulo=f'Stock Mínimo - {producto.nombre}',
                        mensaje=f'El producto {producto.nombre} ha alcanzado el stock mínimo.',
                        datos_adicionales={
                            'stock_actual': float(producto.stock),
                            'stock_minimo': float(producto.min_stock),
                            'porcentaje_stock': round(porcentaje_stock, 2),
                            'sku': producto.sku
                        }
                    )
                alertas_creadas += 1

        if verbose:
            self.stdout.write(f'Alertas de stock generadas: {alertas_creadas}')

        return alertas_creadas

    def generar_alertas_precios(self, dias_historial, verbose, dry_run):
        """Genera alertas de precios atípicos"""
        alertas_creadas = 0
        fecha_limite = timezone.now() - timedelta(days=dias_historial)

        # Obtener productos con historial de precios reciente
        productos_con_historial = Producto.objects.filter(
            historial_precios__fecha__gte=fecha_limite
        ).distinct()

        for producto in productos_con_historial:
            # Obtener historial de precios del período
            historial = HistorialPrecios.objects.filter(
                producto=producto,
                fecha__gte=fecha_limite
            ).order_by('-fecha')

            if historial.count() < 3:  # Necesitamos al menos 3 registros
                continue

            # Calcular estadísticas de precios
            precios = [float(h.precio) for h in historial]
            precio_actual = precios[0]  # El más reciente
            precio_promedio = sum(precios) / len(precios)
            
            # Calcular desviación estándar simple
            varianza = sum((p - precio_promedio) ** 2 for p in precios) / len(precios)
            desviacion = varianza ** 0.5

            # Detectar precio atípico (más de 2 desviaciones estándar)
            umbral_superior = precio_promedio + (2 * desviacion)
            umbral_inferior = precio_promedio - (2 * desviacion)

            es_atipico = precio_actual > umbral_superior or precio_actual < umbral_inferior

            if es_atipico:
                # Verificar si ya existe una alerta activa reciente
                alerta_existente = AlertaStock.objects.filter(
                    producto=producto,
                    tipo='precio_atipico',
                    estado__in=['activa', 'vista'],
                    created_at__gte=timezone.now() - timedelta(days=7)
                ).exists()

                if not alerta_existente:
                    variacion_porcentual = ((precio_actual - precio_promedio) / precio_promedio) * 100
                    
                    # Determinar prioridad basada en la magnitud de la variación
                    if abs(variacion_porcentual) > 50:
                        prioridad = 'alta'
                    elif abs(variacion_porcentual) > 25:
                        prioridad = 'media'
                    else:
                        prioridad = 'baja'

                    if verbose:
                        self.stdout.write(
                            f'Precio atípico: {producto.nombre} '
                            f'(Actual: ${precio_actual}, Promedio: ${precio_promedio:.2f}, '
                            f'Variación: {variacion_porcentual:.1f}%)'
                        )

                    if not dry_run:
                        AlertaStock.objects.create(
                            producto=producto,
                            tipo='precio_atipico',
                            prioridad=prioridad,
                            titulo=f'Precio Atípico - {producto.nombre}',
                            mensaje=f'Se detectó un precio inusual para {producto.nombre}.',
                            datos_adicionales={
                                'precio_actual': precio_actual,
                                'precio_promedio': round(precio_promedio, 2),
                                'variacion_porcentual': round(variacion_porcentual, 2),
                                'umbral_superior': round(umbral_superior, 2),
                                'umbral_inferior': round(umbral_inferior, 2),
                                'sku': producto.sku,
                                'dias_analisis': dias_historial
                            }
                        )

                        # Marcar el registro en el historial como atípico
                        historial.first().es_precio_atipico = True
                        historial.first().save()

                    alertas_creadas += 1

        if verbose:
            self.stdout.write(f'Alertas de precios generadas: {alertas_creadas}')

        return alertas_creadas

    def limpiar_alertas_antiguas(self, dias_antiguedad=30):
        """Limpia alertas resueltas o descartadas antiguas"""
        fecha_limite = timezone.now() - timedelta(days=dias_antiguedad)
        
        alertas_eliminadas = AlertaStock.objects.filter(
            estado__in=['resuelta', 'descartada'],
            resolved_at__lt=fecha_limite
        ).delete()

        return alertas_eliminadas[0] if alertas_eliminadas else 0