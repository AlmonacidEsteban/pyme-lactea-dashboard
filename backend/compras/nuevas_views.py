# NUEVAS VISTAS PARA EL MÓDULO DE COMPRAS EXTENDIDO
import csv
from datetime import datetime, timedelta
from decimal import Decimal
from django.db.models import Count, Sum, Q, F, Avg
from django.http import HttpResponse
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from productos.models import Producto
from proveedores.models import Proveedor

# Importar los nuevos modelos y serializers (cuando se integren)
# from .models import OrdenCompra, OrdenCompraItem, MovimientoStock, HistorialPrecios, AlertaStock
# from .nuevos_serializers import (
#     OrdenCompraSerializer, OrdenCompraCreateSerializer, OrdenCompraItemSerializer,
#     MovimientoStockSerializer, HistorialPreciosSerializer, AlertaStockSerializer,
#     ComprasReporteSerializer, EstadisticasComprasSerializer, RecepcionMercaderiaSerializer
# )


class OrdenCompraViewSet(viewsets.ModelViewSet):
    """ViewSet para gestionar Órdenes de Compra"""
    # queryset = OrdenCompra.objects.select_related('proveedor', 'created_by', 'updated_by').prefetch_related('items__producto')
    # serializer_class = OrdenCompraSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = {
        'proveedor': ['exact'],
        'estado': ['exact'],
        'prioridad': ['exact'],
        'fecha_creacion': ['gte', 'lte'],
        'fecha_entrega_esperada': ['gte', 'lte'],
    }
    search_fields = ['numero', 'proveedor__nombre', 'notas']
    ordering_fields = ['fecha_creacion', 'fecha_entrega_esperada', 'total', 'proveedor__nombre']
    ordering = ['-fecha_creacion']

    def get_serializer_class(self):
        if self.action == 'create':
            return OrdenCompraCreateSerializer
        return OrdenCompraSerializer

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user)

    @action(detail=True, methods=['post'], url_path='enviar')
    def enviar_orden(self, request, pk=None):
        """Marca una orden como enviada"""
        orden = self.get_object()
        if orden.estado != 'borrador':
            return Response(
                {'error': 'Solo se pueden enviar órdenes en estado borrador'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        orden.marcar_como_enviada(request.user)
        return Response({'message': 'Orden enviada correctamente'})

    @action(detail=True, methods=['post'], url_path='recibir-mercaderia')
    def recibir_mercaderia(self, request, pk=None):
        """Recibe mercadería de una orden de compra"""
        orden = self.get_object()
        serializer = RecepcionMercaderiaSerializer(data=request.data)
        
        if serializer.is_valid():
            if not orden.puede_recibir():
                return Response(
                    {'error': f'La orden no puede recibir mercadería en estado {orden.get_estado_display()}'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            items_data = serializer.validated_data['items']
            notas = serializer.validated_data.get('notas', '')
            fecha_recepcion = serializer.validated_data.get('fecha_recepcion', timezone.now().date())
            
            # Procesar cada item
            for item_data in items_data:
                item_id = item_data['item_id']
                cantidad_recibida = item_data['cantidad_recibida']
                
                try:
                    item = orden.items.get(id=item_id)
                    item.cantidad_recibida += cantidad_recibida
                    item.save()
                    
                    # Crear movimiento de stock
                    MovimientoStock.objects.create(
                        producto=item.producto,
                        tipo='entrada',
                        motivo='compra',
                        cantidad=cantidad_recibida,
                        costo_unitario=item.precio_unitario,
                        orden_compra=orden,
                        notas=f'Recepción OC-{orden.numero}: {notas}',
                        created_by=request.user
                    )
                    
                    # Registrar precio en historial
                    HistorialPrecios.registrar_precio(
                        producto=item.producto,
                        proveedor=orden.proveedor,
                        precio=item.precio_unitario,
                        orden_compra=orden,
                        notas=f'Precio de OC-{orden.numero}'
                    )
                    
                except OrdenCompraItem.DoesNotExist:
                    return Response(
                        {'error': f'Item {item_id} no encontrado'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            
            # Actualizar estado de la orden
            items_completos = orden.items.filter(cantidad_recibida__gte=F('cantidad_solicitada')).count()
            total_items = orden.items.count()
            
            if items_completos == total_items:
                orden.estado = 'completa'
                orden.fecha_entrega_real = fecha_recepcion
            elif items_completos > 0:
                orden.estado = 'parcial'
            
            orden.updated_by = request.user
            orden.save()
            
            return Response({'message': 'Mercadería recibida correctamente'})
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'], url_path='dashboard')
    def dashboard_stats(self, request):
        """Estadísticas para el dashboard de órdenes de compra"""
        queryset = self.filter_queryset(self.get_queryset())
        
        stats = {
            'total_ordenes': queryset.count(),
            'ordenes_borrador': queryset.filter(estado='borrador').count(),
            'ordenes_enviadas': queryset.filter(estado='enviada').count(),
            'ordenes_confirmadas': queryset.filter(estado='confirmada').count(),
            'ordenes_pendientes': queryset.filter(estado__in=['enviada', 'confirmada', 'parcial']).count(),
            'ordenes_completadas': queryset.filter(estado='completa').count(),
            'total_valor': queryset.aggregate(total=Sum('total'))['total'] or 0,
        }
        
        return Response(stats)

    @action(detail=False, methods=['get'], url_path='exportar-csv')
    def exportar_csv(self, request):
        """Exporta órdenes de compra a CSV"""
        queryset = self.filter_queryset(self.get_queryset())
        
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="ordenes_compra_{datetime.now().strftime("%Y%m%d")}.csv"'
        
        writer = csv.writer(response)
        writer.writerow([
            'Número', 'Proveedor', 'Estado', 'Prioridad', 'Fecha Creación',
            'Fecha Entrega Esperada', 'Subtotal', 'Impuestos', 'Descuento', 'Total', 'Notas'
        ])
        
        for orden in queryset:
            writer.writerow([
                orden.numero,
                orden.proveedor.nombre,
                orden.get_estado_display(),
                orden.get_prioridad_display(),
                orden.fecha_creacion.strftime('%Y-%m-%d'),
                orden.fecha_entrega_esperada.strftime('%Y-%m-%d') if orden.fecha_entrega_esperada else '',
                orden.subtotal,
                orden.impuestos,
                orden.descuento,
                orden.total,
                orden.notas
            ])
        
        return response


class MovimientoStockViewSet(viewsets.ModelViewSet):
    """ViewSet para gestionar Movimientos de Stock"""
    # queryset = MovimientoStock.objects.select_related('producto', 'created_by', 'orden_compra', 'compra')
    # serializer_class = MovimientoStockSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = {
        'producto': ['exact'],
        'tipo': ['exact'],
        'motivo': ['exact'],
        'created_at': ['gte', 'lte'],
    }
    search_fields = ['producto__nombre', 'producto__sku', 'notas']
    ordering_fields = ['created_at', 'cantidad', 'stock_nuevo']
    ordering = ['-created_at']

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=False, methods=['get'], url_path='resumen-por-producto')
    def resumen_por_producto(self, request):
        """Resumen de movimientos agrupados por producto"""
        queryset = self.filter_queryset(self.get_queryset())
        
        resumen = queryset.values(
            'producto__id', 'producto__nombre', 'producto__sku'
        ).annotate(
            total_entradas=Sum('cantidad', filter=Q(tipo='entrada')),
            total_salidas=Sum('cantidad', filter=Q(tipo='salida')),
            total_movimientos=Count('id'),
            stock_actual=F('producto__stock')
        ).order_by('producto__nombre')
        
        return Response(list(resumen))

    @action(detail=False, methods=['post'], url_path='ajuste-inventario')
    def ajuste_inventario(self, request):
        """Realiza un ajuste de inventario"""
        producto_id = request.data.get('producto_id')
        nuevo_stock = request.data.get('nuevo_stock')
        notas = request.data.get('notas', '')
        
        try:
            producto = Producto.objects.get(id=producto_id)
            nuevo_stock = Decimal(str(nuevo_stock))
            
            if nuevo_stock < 0:
                return Response(
                    {'error': 'El stock no puede ser negativo'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Crear movimiento de ajuste
            MovimientoStock.objects.create(
                producto=producto,
                tipo='ajuste',
                motivo='ajuste_inventario',
                cantidad=nuevo_stock,  # En ajustes, cantidad es el nuevo stock
                notas=notas,
                created_by=request.user
            )
            
            return Response({'message': 'Ajuste de inventario realizado correctamente'})
            
        except Producto.DoesNotExist:
            return Response(
                {'error': 'Producto no encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )
        except (ValueError, TypeError):
            return Response(
                {'error': 'Stock inválido'},
                status=status.HTTP_400_BAD_REQUEST
            )


class HistorialPreciosViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet para consultar Historial de Precios"""
    # queryset = HistorialPrecios.objects.select_related('producto', 'proveedor', 'orden_compra', 'compra')
    # serializer_class = HistorialPreciosSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = {
        'producto': ['exact'],
        'proveedor': ['exact'],
        'fecha': ['gte', 'lte'],
    }
    search_fields = ['producto__nombre', 'producto__sku', 'proveedor__nombre']
    ordering_fields = ['fecha', 'precio']
    ordering = ['-fecha']

    @action(detail=False, methods=['get'], url_path='comparar-precios')
    def comparar_precios(self, request):
        """Compara precios de un producto entre proveedores"""
        producto_id = request.query_params.get('producto_id')
        
        if not producto_id:
            return Response(
                {'error': 'Debe especificar un producto_id'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Obtener últimos precios por proveedor
        precios = self.get_queryset().filter(
            producto_id=producto_id
        ).values(
            'proveedor__id', 'proveedor__nombre'
        ).annotate(
            ultimo_precio=F('precio'),
            fecha_ultimo_precio=F('fecha')
        ).order_by('proveedor__nombre', '-fecha').distinct('proveedor__nombre')
        
        return Response(list(precios))

    @action(detail=False, methods=['get'], url_path='tendencia-precios')
    def tendencia_precios(self, request):
        """Muestra la tendencia de precios de un producto"""
        producto_id = request.query_params.get('producto_id')
        proveedor_id = request.query_params.get('proveedor_id')
        dias = int(request.query_params.get('dias', 90))
        
        if not producto_id:
            return Response(
                {'error': 'Debe especificar un producto_id'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        fecha_desde = timezone.now() - timedelta(days=dias)
        queryset = self.get_queryset().filter(
            producto_id=producto_id,
            fecha__gte=fecha_desde
        )
        
        if proveedor_id:
            queryset = queryset.filter(proveedor_id=proveedor_id)
        
        tendencia = queryset.values(
            'fecha', 'precio', 'proveedor__nombre'
        ).order_by('fecha')
        
        return Response(list(tendencia))


class AlertaStockViewSet(viewsets.ModelViewSet):
    """ViewSet para gestionar Alertas de Stock"""
    # queryset = AlertaStock.objects.select_related('producto', 'proveedor', 'orden_compra', 'resolved_by')
    # serializer_class = AlertaStockSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = {
        'tipo': ['exact'],
        'estado': ['exact'],
        'producto': ['exact'],
        'proveedor': ['exact'],
        'created_at': ['gte', 'lte'],
    }
    search_fields = ['titulo', 'mensaje', 'producto__nombre', 'proveedor__nombre']
    ordering_fields = ['created_at', 'tipo']
    ordering = ['-created_at']

    @action(detail=True, methods=['post'], url_path='marcar-vista')
    def marcar_vista(self, request, pk=None):
        """Marca una alerta como vista"""
        alerta = self.get_object()
        alerta.marcar_como_vista()
        return Response({'message': 'Alerta marcada como vista'})

    @action(detail=True, methods=['post'], url_path='resolver')
    def resolver_alerta(self, request, pk=None):
        """Resuelve una alerta"""
        alerta = self.get_object()
        alerta.resolver(request.user)
        return Response({'message': 'Alerta resuelta'})

    @action(detail=False, methods=['get'], url_path='activas')
    def alertas_activas(self, request):
        """Obtiene solo las alertas activas"""
        alertas = self.get_queryset().filter(estado='activa')
        serializer = self.get_serializer(alertas, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'], url_path='generar-alertas-stock')
    def generar_alertas_stock(self, request):
        """Genera alertas de stock mínimo para todos los productos"""
        productos_bajo_stock = Producto.objects.filter(
            stock__lte=F('min_stock'),
            min_stock__gt=0
        )
        
        alertas_creadas = 0
        for producto in productos_bajo_stock:
            alerta = AlertaStock.crear_alerta_stock_minimo(producto)
            if alerta:
                alertas_creadas += 1
        
        return Response({
            'message': f'Se generaron {alertas_creadas} alertas de stock mínimo'
        })


class ComprasReportesViewSet(viewsets.ViewSet):
    """ViewSet para reportes y estadísticas de compras"""
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'], url_path='dashboard')
    def dashboard_estadisticas(self, request):
        """Estadísticas generales para el dashboard"""
        # Fecha actual y hace 30 días
        hoy = timezone.now().date()
        hace_30_dias = hoy - timedelta(days=30)
        
        # Estadísticas básicas
        stats = {
            'total_ordenes': OrdenCompra.objects.count(),
            'ordenes_pendientes': OrdenCompra.objects.filter(
                estado__in=['enviada', 'confirmada', 'parcial']
            ).count(),
            'ordenes_completadas': OrdenCompra.objects.filter(estado='completa').count(),
            'total_gastado_mes': OrdenCompra.objects.filter(
                fecha_creacion__gte=hace_30_dias,
                estado__in=['completa', 'parcial']
            ).aggregate(total=Sum('total'))['total'] or 0,
            'productos_bajo_stock': Producto.objects.filter(
                stock__lte=F('min_stock'),
                min_stock__gt=0
            ).count(),
            'alertas_activas': AlertaStock.objects.filter(estado='activa').count(),
            'proveedores_activos': Proveedor.objects.filter(activo=True).count(),
        }
        
        # Compras por mes (últimos 6 meses)
        compras_por_mes = []
        for i in range(6):
            fecha = hoy.replace(day=1) - timedelta(days=30*i)
            mes_siguiente = (fecha.replace(day=28) + timedelta(days=4)).replace(day=1)
            
            total_mes = OrdenCompra.objects.filter(
                fecha_creacion__gte=fecha,
                fecha_creacion__lt=mes_siguiente,
                estado__in=['completa', 'parcial']
            ).aggregate(total=Sum('total'))['total'] or 0
            
            compras_por_mes.append({
                'mes': fecha.strftime('%Y-%m'),
                'total': float(total_mes)
            })
        
        stats['compras_por_mes'] = list(reversed(compras_por_mes))
        
        # Top 5 proveedores
        top_proveedores = OrdenCompra.objects.filter(
            fecha_creacion__gte=hace_30_dias,
            estado__in=['completa', 'parcial']
        ).values(
            'proveedor__id', 'proveedor__nombre'
        ).annotate(
            total=Sum('total'),
            ordenes=Count('id')
        ).order_by('-total')[:5]
        
        stats['top_proveedores'] = list(top_proveedores)
        
        # Productos más comprados
        productos_mas_comprados = OrdenCompraItem.objects.filter(
            orden__fecha_creacion__gte=hace_30_dias,
            orden__estado__in=['completa', 'parcial']
        ).values(
            'producto__id', 'producto__nombre'
        ).annotate(
            cantidad_total=Sum('cantidad_recibida'),
            ordenes=Count('orden', distinct=True)
        ).order_by('-cantidad_total')[:5]
        
        stats['productos_mas_comprados'] = list(productos_mas_comprados)
        
        return Response(stats)

    @action(detail=False, methods=['post'], url_path='exportar-compras')
    def exportar_compras_csv(self, request):
        """Exporta compras por período a CSV"""
        serializer = ComprasReporteSerializer(data=request.data)
        
        if serializer.is_valid():
            fecha_inicio = serializer.validated_data['fecha_inicio']
            fecha_fin = serializer.validated_data['fecha_fin']
            proveedor = serializer.validated_data.get('proveedor')
            formato = serializer.validated_data.get('formato', 'csv')
            
            # Filtrar órdenes
            ordenes = OrdenCompra.objects.filter(
                fecha_creacion__date__gte=fecha_inicio,
                fecha_creacion__date__lte=fecha_fin
            )
            
            if proveedor:
                ordenes = ordenes.filter(proveedor=proveedor)
            
            if formato == 'csv':
                response = HttpResponse(content_type='text/csv')
                response['Content-Disposition'] = f'attachment; filename="compras_{fecha_inicio}_{fecha_fin}.csv"'
                
                writer = csv.writer(response)
                writer.writerow([
                    'Fecha', 'Número OC', 'Proveedor', 'Estado', 'Subtotal', 
                    'Impuestos', 'Descuento', 'Total', 'Items', 'Notas'
                ])
                
                for orden in ordenes.select_related('proveedor'):
                    writer.writerow([
                        orden.fecha_creacion.strftime('%Y-%m-%d'),
                        orden.numero,
                        orden.proveedor.nombre,
                        orden.get_estado_display(),
                        orden.subtotal,
                        orden.impuestos,
                        orden.descuento,
                        orden.total,
                        orden.items.count(),
                        orden.notas
                    ])
                
                return response
            
            else:  # JSON
                data = []
                for orden in ordenes.select_related('proveedor'):
                    data.append({
                        'fecha': orden.fecha_creacion.strftime('%Y-%m-%d'),
                        'numero': orden.numero,
                        'proveedor': orden.proveedor.nombre,
                        'estado': orden.get_estado_display(),
                        'subtotal': float(orden.subtotal),
                        'impuestos': float(orden.impuestos),
                        'descuento': float(orden.descuento),
                        'total': float(orden.total),
                        'items': orden.items.count(),
                        'notas': orden.notas
                    })
                
                return Response(data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)