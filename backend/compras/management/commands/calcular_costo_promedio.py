"""
Comando para calcular y actualizar el costo promedio móvil de productos.
Este comando se puede ejecutar manualmente o programar para ejecutarse automáticamente.
"""

from django.core.management.base import BaseCommand
from django.db import transaction
from django.db.models import Sum, Avg, F
from decimal import Decimal
from productos.models import Producto
from compras.models import MovimientoStock
import logging

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = 'Calcula y actualiza el costo promedio móvil de todos los productos'

    def add_arguments(self, parser):
        parser.add_argument(
            '--producto-id',
            type=int,
            help='ID específico del producto a recalcular (opcional)'
        )
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Ejecutar sin hacer cambios reales (solo mostrar resultados)'
        )
        parser.add_argument(
            '--verbose',
            action='store_true',
            help='Mostrar información detallada del proceso'
        )

    def handle(self, *args, **options):
        producto_id = options.get('producto_id')
        dry_run = options.get('dry_run', False)
        verbose = options.get('verbose', False)

        if dry_run:
            self.stdout.write(
                self.style.WARNING('MODO DRY-RUN: No se realizarán cambios reales')
            )

        try:
            if producto_id:
                productos = Producto.objects.filter(id=producto_id)
                if not productos.exists():
                    self.stdout.write(
                        self.style.ERROR(f'Producto con ID {producto_id} no encontrado')
                    )
                    return
            else:
                productos = Producto.objects.all()

            total_productos = productos.count()
            productos_actualizados = 0
            productos_sin_movimientos = 0

            self.stdout.write(f'Procesando {total_productos} productos...')

            with transaction.atomic():
                for producto in productos:
                    costo_anterior = producto.avg_cost
                    nuevo_costo = self.calcular_costo_promedio_movil(producto)

                    if nuevo_costo is not None:
                        if verbose:
                            self.stdout.write(
                                f'Producto: {producto.nombre} | '
                                f'Costo anterior: ${costo_anterior} | '
                                f'Nuevo costo: ${nuevo_costo}'
                            )

                        if not dry_run:
                            producto.avg_cost = nuevo_costo
                            producto.save(update_fields=['avg_cost'])

                        productos_actualizados += 1
                    else:
                        if verbose:
                            self.stdout.write(
                                f'Producto: {producto.nombre} | Sin movimientos de entrada'
                            )
                        productos_sin_movimientos += 1

                if dry_run:
                    # En modo dry-run, revertir la transacción
                    transaction.set_rollback(True)

            # Mostrar resumen
            self.stdout.write(
                self.style.SUCCESS(
                    f'\n--- RESUMEN ---\n'
                    f'Productos procesados: {total_productos}\n'
                    f'Productos actualizados: {productos_actualizados}\n'
                    f'Productos sin movimientos: {productos_sin_movimientos}'
                )
            )

            if dry_run:
                self.stdout.write(
                    self.style.WARNING('Ningún cambio fue guardado (modo dry-run)')
                )

        except Exception as e:
            logger.error(f'Error al calcular costos promedio: {str(e)}')
            self.stdout.write(
                self.style.ERROR(f'Error: {str(e)}')
            )

    def calcular_costo_promedio_movil(self, producto):
        """
        Calcula el costo promedio móvil basado en los movimientos de entrada.
        
        Fórmula: Costo Promedio = (Stock Actual * Costo Actual + Cantidad Entrada * Costo Entrada) 
                                 / (Stock Actual + Cantidad Entrada)
        """
        # Obtener movimientos de entrada con costo unitario
        movimientos_entrada = MovimientoStock.objects.filter(
            producto=producto,
            tipo='entrada',
            costo_unitario__isnull=False
        ).order_by('created_at')

        if not movimientos_entrada.exists():
            return None

        # Calcular costo promedio ponderado
        total_cantidad = Decimal('0')
        total_costo = Decimal('0')

        for movimiento in movimientos_entrada:
            cantidad = movimiento.cantidad
            costo_unitario = movimiento.costo_unitario

            total_cantidad += cantidad
            total_costo += (cantidad * costo_unitario)

        if total_cantidad > 0:
            costo_promedio = total_costo / total_cantidad
            return round(costo_promedio, 2)

        return None

    def calcular_costo_promedio_movil_incremental(self, producto, nueva_cantidad, nuevo_costo):
        """
        Calcula el nuevo costo promedio cuando se recibe nueva mercadería.
        Esta función se puede usar en tiempo real al recibir mercadería.
        """
        stock_actual = producto.stock
        costo_actual = producto.avg_cost or Decimal('0')

        if stock_actual <= 0:
            # Si no hay stock, el nuevo costo es el costo de la mercadería recibida
            return nuevo_costo

        # Aplicar fórmula de costo promedio móvil
        valor_stock_actual = stock_actual * costo_actual
        valor_nueva_mercaderia = nueva_cantidad * nuevo_costo
        total_valor = valor_stock_actual + valor_nueva_mercaderia
        total_cantidad = stock_actual + nueva_cantidad

        nuevo_costo_promedio = total_valor / total_cantidad
        return round(nuevo_costo_promedio, 2)


# Función auxiliar para usar en las vistas
def actualizar_costo_promedio_producto(producto, cantidad_entrada, costo_unitario):
    """
    Función auxiliar para actualizar el costo promedio de un producto
    cuando se recibe nueva mercadería.
    """
    command = Command()
    nuevo_costo = command.calcular_costo_promedio_movil_incremental(
        producto, cantidad_entrada, costo_unitario
    )
    
    if nuevo_costo is not None:
        producto.avg_cost = nuevo_costo
        producto.save(update_fields=['avg_cost'])
        
        logger.info(
            f'Costo promedio actualizado para {producto.nombre}: ${nuevo_costo}'
        )
    
    return nuevo_costo