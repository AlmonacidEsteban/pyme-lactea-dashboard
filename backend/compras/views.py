from django.db.models import Count, Sum, Avg, Q, F
from django.db import models
from django.utils import timezone
from django.http import HttpResponse
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from decimal import Decimal
import csv
from datetime import datetime, timedelta

from .models import (
    CategoriaCompra, Compra, OrdenCompra, OrdenCompraItem,
    MovimientoStock, HistorialPrecios, AlertaStock
)
from .serializers import (
    CategoriaCompraSerializer, CompraSerializer,
    OrdenCompraSerializer, OrdenCompraItemSerializer,
    MovimientoStockSerializer, HistorialPreciosSerializer,
    AlertaStockSerializer, EstadisticasComprasSerializer
)
from .permissions import ComprasBasePermission


class CategoriaCompraViewSet(viewsets.ModelViewSet):
    queryset = CategoriaCompra.objects.all()
    serializer_class = CategoriaCompraSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["nombre"]
    ordering_fields = ["nombre"]
    ordering = ["nombre"]


class CompraViewSet(viewsets.ModelViewSet):
    queryset = (
        Compra.objects.select_related("proveedor", "categoria")
        .prefetch_related("lineas__producto")
    )
    serializer_class = CompraSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = {"proveedor": ["exact"], "categoria": ["exact"], "fecha": ["gte", "lte"]}
    search_fields = ["numero", "proveedor__nombre", "notas"]
    ordering_fields = ["fecha", "total", "proveedor__nombre"]
    ordering = ["-fecha", "-id"]

    @action(detail=False, methods=["get"], url_path="resumen/proveedores")
    def resumen_por_proveedor(self, request):
        queryset = self.filter_queryset(self.get_queryset())
        data = (
            queryset.values("proveedor__id", "proveedor__nombre")
            .annotate(total=Sum("total"), compras=Count("id"))
            .order_by("proveedor__nombre")
        )
        return Response(
            [
                {
                    "proveedor_id": item["proveedor__id"],
                    "proveedor": item["proveedor__nombre"],
                    "total": item["total"] or 0,
                    "compras": item["compras"],
                }
                for item in data
            ]
        )


# Nuevas vistas extendidas para el módulo de compras

class OrdenCompraViewSet(viewsets.ModelViewSet):
    queryset = OrdenCompra.objects.select_related('proveedor', 'creado_por', 'aprobado_por').prefetch_related('items__producto')
    serializer_class = OrdenCompraSerializer
    permission_classes = [IsAuthenticated, ComprasBasePermission]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = {
        'proveedor': ['exact'],
        'estado': ['exact'],
        'fecha_creacion': ['gte', 'lte'],
        'fecha_entrega_esperada': ['gte', 'lte']
    }
    search_fields = ['numero', 'proveedor__nombre', 'notas']
    ordering_fields = ['fecha_creacion', 'total', 'estado']
    ordering = ['-fecha_creacion']

    @action(detail=True, methods=['post'])
    def enviar(self, request, pk=None):
        """Envía la orden de compra al proveedor"""
        orden = self.get_object()
        
        if orden.estado != 'borrador':
            return Response(
                {'error': 'Solo se pueden enviar órdenes en estado borrador'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        orden.estado = 'enviada'
        orden.fecha_envio = timezone.now()
        orden.save(update_fields=['estado', 'fecha_envio'])
        
        return Response({'message': 'Orden enviada exitosamente'})

    @action(detail=True, methods=['post'])
    def recibir_mercaderia(self, request, pk=None):
        """Registra la recepción de mercadería"""
        orden = self.get_object()
        
        if not orden.puede_recibir_mercaderia():
            return Response(
                {'error': 'La orden no puede recibir mercadería en su estado actual'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        items_data = request.data.get('items', [])
        
        for item_data in items_data:
            try:
                item = orden.items.get(id=item_data['id'])
                cantidad_recibida = Decimal(str(item_data['cantidad_recibida']))
                
                if cantidad_recibida > item.cantidad_pendiente:
                    return Response(
                        {'error': f'Cantidad recibida excede la cantidad pendiente para {item.producto.nombre}'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                item.cantidad_recibida += cantidad_recibida
                item.save()
                
                # Crear movimiento de stock
                MovimientoStock.objects.create(
                    producto=item.producto,
                    tipo='entrada',
                    cantidad=cantidad_recibida,
                    costo_unitario=item.precio_unitario,
                    referencia=f'OC-{orden.numero}',
                    orden_compra_item=item,
                    usuario=request.user,
                    notas=f'Recepción de mercadería - OC {orden.numero}'
                )
                
                # Registrar en historial de precios
                HistorialPrecios.objects.create(
                    producto=item.producto,
                    proveedor=orden.proveedor,
                    precio=item.precio_unitario,
                    orden_compra_item=item,
                    cantidad_comprada=cantidad_recibida
                )
                
            except OrdenCompraItem.DoesNotExist:
                return Response(
                    {'error': f'Item con ID {item_data["id"]} no encontrado'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        # Actualizar estado de la orden
        items_completos = all(item.esta_completo for item in orden.items.all())
        if items_completos:
            orden.estado = 'recibida_completa'
            orden.fecha_entrega_real = timezone.now().date()
        else:
            orden.estado = 'recibida_parcial'
        
        orden.save(update_fields=['estado', 'fecha_entrega_real'])
        
        return Response({'message': 'Mercadería recibida exitosamente'})

    @action(detail=False, methods=['get'])
    def estadisticas_dashboard(self, request):
        """Estadísticas para el dashboard"""
        hoy = timezone.now().date()
        hace_30_dias = hoy - timedelta(days=30)
        
        ordenes_mes = self.get_queryset().filter(fecha_creacion__date__gte=hace_30_dias)
        
        estadisticas = {
            'ordenes_pendientes': self.get_queryset().filter(estado__in=['enviada', 'confirmada']).count(),
            'ordenes_mes': ordenes_mes.count(),
            'monto_mes': ordenes_mes.aggregate(total=Sum('total'))['total'] or 0,
            'ordenes_vencidas': self.get_queryset().filter(
                fecha_entrega_esperada__lt=hoy,
                estado__in=['enviada', 'confirmada']
            ).count()
        }
        
        return Response(estadisticas)

    @action(detail=False, methods=['get'])
    def exportar_csv(self, request):
        """Exporta órdenes de compra a CSV"""
        queryset = self.filter_queryset(self.get_queryset())
        
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="ordenes_compra.csv"'
        
        writer = csv.writer(response)
        writer.writerow([
            'Número', 'Proveedor', 'Fecha Creación', 'Estado',
            'Fecha Entrega Esperada', 'Total', 'Creado Por'
        ])
        
        for orden in queryset:
            writer.writerow([
                orden.numero,
                orden.proveedor.nombre,
                orden.fecha_creacion.strftime('%Y-%m-%d'),
                orden.get_estado_display(),
                orden.fecha_entrega_esperada.strftime('%Y-%m-%d') if orden.fecha_entrega_esperada else '',
                orden.total,
                orden.creado_por.username
            ])
        
        return response


class MovimientoStockViewSet(viewsets.ModelViewSet):
    queryset = MovimientoStock.objects.select_related('producto', 'usuario', 'orden_compra_item')
    serializer_class = MovimientoStockSerializer
    permission_classes = [IsAuthenticated, ComprasBasePermission]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = {
        'producto': ['exact'],
        'tipo': ['exact'],
        'fecha': ['gte', 'lte'],
        'usuario': ['exact']
    }
    search_fields = ['producto__nombre', 'referencia', 'notas']
    ordering_fields = ['fecha', 'cantidad']
    ordering = ['-fecha']

    @action(detail=False, methods=['get'])
    def resumen_por_producto(self, request):
        """Resumen de movimientos por producto"""
        queryset = self.filter_queryset(self.get_queryset())
        
        resumen = queryset.values(
            'producto__id', 'producto__nombre', 'tipo'
        ).annotate(
            total_cantidad=Sum('cantidad'),
            total_movimientos=Count('id')
        ).order_by('producto__nombre', 'tipo')
        
        return Response(resumen)

    @action(detail=False, methods=['post'])
    def ajustar_inventario(self, request):
        """Realiza un ajuste de inventario"""
        producto_id = request.data.get('producto_id')
        nuevo_stock = request.data.get('nuevo_stock')
        motivo = request.data.get('motivo', '')
        
        if not producto_id or nuevo_stock is None:
            return Response(
                {'error': 'producto_id y nuevo_stock son requeridos'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            from productos.models import Producto
            producto = Producto.objects.get(id=producto_id)
            
            MovimientoStock.objects.create(
                producto=producto,
                tipo='ajuste',
                cantidad=Decimal(str(nuevo_stock)),
                usuario=request.user,
                referencia='AJUSTE-INV',
                notas=f'Ajuste de inventario: {motivo}'
            )
            
            return Response({'message': 'Inventario ajustado exitosamente'})
            
        except Producto.DoesNotExist:
            return Response(
                {'error': 'Producto no encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )


class HistorialPreciosViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = HistorialPrecios.objects.select_related('producto', 'proveedor', 'orden_compra_item')
    serializer_class = HistorialPreciosSerializer
    permission_classes = [IsAuthenticated, ComprasBasePermission]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = {
        'producto': ['exact'],
        'proveedor': ['exact'],
        'fecha': ['gte', 'lte']
    }
    search_fields = ['producto__nombre', 'proveedor__nombre']
    ordering_fields = ['fecha', 'precio']
    ordering = ['-fecha']

    @action(detail=False, methods=['get'])
    def comparar_precios(self, request):
        """Compara precios entre proveedores para un producto"""
        producto_id = request.query_params.get('producto_id')
        
        if not producto_id:
            return Response(
                {'error': 'producto_id es requerido'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Obtener último precio por proveedor
        precios = self.get_queryset().filter(
            producto_id=producto_id
        ).values(
            'proveedor__id', 'proveedor__nombre'
        ).annotate(
            ultimo_precio=Avg('precio'),
            ultima_fecha=Max('fecha')
        ).order_by('ultimo_precio')
        
        return Response(precios)

    @action(detail=False, methods=['get'])
    def tendencia_precios(self, request):
        """Muestra la tendencia de precios para un producto"""
        producto_id = request.query_params.get('producto_id')
        dias = int(request.query_params.get('dias', 90))
        
        if not producto_id:
            return Response(
                {'error': 'producto_id es requerido'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        fecha_desde = timezone.now().date() - timedelta(days=dias)
        
        tendencia = self.get_queryset().filter(
            producto_id=producto_id,
            fecha__date__gte=fecha_desde
        ).values(
            'fecha__date'
        ).annotate(
            precio_promedio=Avg('precio')
        ).order_by('fecha__date')
        
        return Response(tendencia)


class AlertaStockViewSet(viewsets.ModelViewSet):
    queryset = AlertaStock.objects.select_related('producto', 'proveedor', 'resuelto_por')
    serializer_class = AlertaStockSerializer
    permission_classes = [IsAuthenticated, ComprasBasePermission]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = {
        'tipo': ['exact'],
        'estado': ['exact'],
        'producto': ['exact'],
        'fecha_creacion': ['gte', 'lte']
    }
    search_fields = ['producto__nombre', 'mensaje']
    ordering_fields = ['fecha_creacion', 'tipo']
    ordering = ['-fecha_creacion']

    @action(detail=True, methods=['post'])
    def marcar_vista(self, request, pk=None):
        """Marca la alerta como vista"""
        alerta = self.get_object()
        
        if alerta.estado == 'activa':
            alerta.estado = 'vista'
            alerta.save(update_fields=['estado'])
        
        return Response({'message': 'Alerta marcada como vista'})

    @action(detail=True, methods=['post'])
    def resolver(self, request, pk=None):
        """Resuelve la alerta"""
        alerta = self.get_object()
        alerta.marcar_como_resuelta(request.user)
        
        return Response({'message': 'Alerta resuelta exitosamente'})

    @action(detail=False, methods=['post'])
    def generar_alertas_stock_minimo(self, request):
        """Genera alertas para productos con stock mínimo"""
        from productos.models import Producto
        
        productos_bajo_stock = Producto.objects.filter(
            stock__lte=models.F('stock_minimo')
        ).exclude(
            alertas_stock__tipo='stock_minimo',
            alertas_stock__estado='activa'
        )
        
        alertas_creadas = 0
        
        for producto in productos_bajo_stock:
            AlertaStock.objects.create(
                tipo='stock_minimo',
                producto=producto,
                mensaje=f'Stock bajo: {producto.stock} unidades (mínimo: {producto.stock_minimo})',
                valor_referencia=producto.stock
            )
            alertas_creadas += 1
        
        return Response({
            'message': f'{alertas_creadas} alertas de stock mínimo generadas'
        })


class ComprasReportesViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated, ComprasBasePermission]

    @action(detail=False, methods=['get'])
    def estadisticas_dashboard(self, request):
        """Estadísticas generales para el dashboard"""
        from django.apps import apps
        from datetime import timedelta
        from django.utils import timezone
        
        fecha_desde = request.query_params.get('fecha_desde')
        fecha_hasta = request.query_params.get('fecha_hasta')
        
        # Filtros de fecha
        filtros = {}
        if fecha_desde:
            filtros['fecha_creacion__date__gte'] = datetime.strptime(fecha_desde, '%Y-%m-%d').date()
        if fecha_hasta:
            filtros['fecha_creacion__date__lte'] = datetime.strptime(fecha_hasta, '%Y-%m-%d').date()
        
        # Estadísticas de órdenes de compra
        ordenes = OrdenCompra.objects.filter(**filtros)
        
        # Obtener modelos relacionados
        try:
            Producto = apps.get_model('productos', 'Producto')
            productos_bajo_stock = Producto.objects.filter(
                stock__lte=F('min_stock'),
                min_stock__gt=0
            ).count() if Producto else 0
        except:
            productos_bajo_stock = 0
            
        try:
            AlertaStock = apps.get_model('compras', 'AlertaStock')
            alertas_activas = AlertaStock.objects.filter(estado='activa').count() if AlertaStock else 0
        except:
            alertas_activas = 0
        
        # Fecha actual y hace 30 días para estadísticas adicionales
        hoy = timezone.now().date()
        hace_30_dias = hoy - timedelta(days=30)
        
        # Compras por mes (últimos 6 meses)
        compras_por_mes = []
        for i in range(6):
            fecha = hoy.replace(day=1) - timedelta(days=30*i)
            mes_siguiente = (fecha.replace(day=28) + timedelta(days=4)).replace(day=1)
            
            total_mes = OrdenCompra.objects.filter(
                fecha_creacion__gte=fecha,
                fecha_creacion__lt=mes_siguiente,
                estado__in=['recibida_completa', 'recibida_parcial']
            ).aggregate(total=Sum('total'))['total'] or 0
            
            compras_por_mes.append({
                'mes': fecha.strftime('%Y-%m'),
                'total': float(total_mes)
            })
        
        # Top 5 proveedores
        top_proveedores = ordenes.filter(
            fecha_creacion__gte=hace_30_dias,
            estado__in=['recibida_completa', 'recibida_parcial']
        ).values(
            'proveedor__id', 'proveedor__nombre'
        ).annotate(
            total=Sum('total'),
            ordenes=Count('id')
        ).order_by('-total')[:5]
        
        # Formatear top_proveedores para el frontend
        top_proveedores_formatted = []
        for proveedor in top_proveedores:
            top_proveedores_formatted.append({
                'proveedor__nombre': proveedor['proveedor__nombre'] or 'Sin nombre',
                'total': float(proveedor['total'] or 0),
                'ordenes': proveedor['ordenes']
            })
        
        # Total gastado este mes
        total_gastado_mes = OrdenCompra.objects.filter(
            fecha_creacion__gte=hace_30_dias,
            estado__in=['recibida_completa', 'recibida_parcial']
        ).aggregate(total=Sum('total'))['total'] or 0
        
        estadisticas = {
            'total_ordenes': ordenes.count(),
            'ordenes_borrador': ordenes.filter(estado='borrador').count(),
            'ordenes_enviadas': ordenes.filter(estado='enviada').count(),
            'ordenes_confirmadas': ordenes.filter(estado='confirmada').count(),
            'ordenes_pendientes': ordenes.filter(estado__in=['enviada', 'confirmada']).count(),
            'ordenes_completadas': ordenes.filter(estado='recibida_completa').count(),
            'total_valor': float(ordenes.aggregate(total=Sum('total'))['total'] or 0),
            'total_gastado_mes': float(total_gastado_mes),
            'productos_bajo_stock': productos_bajo_stock,
            'alertas_activas': alertas_activas,
            'proveedores_activos': ordenes.values('proveedor').distinct().count(),
            'compras_por_mes': list(reversed(compras_por_mes)),
            'top_proveedores': top_proveedores_formatted,
            'productos_mas_comprados': []  # Se puede implementar después si es necesario
        }
        
        return Response(estadisticas)

    @action(detail=False, methods=['get'])
    def exportar_compras_csv(self, request):
        """Exporta reporte de compras a CSV"""
        fecha_desde = request.query_params.get('fecha_desde')
        fecha_hasta = request.query_params.get('fecha_hasta')
        
        # Filtros
        filtros = {}
        if fecha_desde:
            filtros['fecha_creacion__date__gte'] = datetime.strptime(fecha_desde, '%Y-%m-%d').date()
        if fecha_hasta:
            filtros['fecha_creacion__date__lte'] = datetime.strptime(fecha_hasta, '%Y-%m-%d').date()
        
        ordenes = OrdenCompra.objects.filter(**filtros).select_related('proveedor', 'creado_por')
        
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="reporte_compras.csv"'
        
        writer = csv.writer(response)
        writer.writerow([
            'Fecha', 'Número Orden', 'Proveedor', 'Estado',
            'Subtotal', 'Impuestos', 'Total', 'Creado Por'
        ])
        
        for orden in ordenes:
            writer.writerow([
                orden.fecha_creacion.strftime('%Y-%m-%d'),
                orden.numero,
                orden.proveedor.nombre,
                orden.get_estado_display(),
                orden.subtotal,
                orden.impuestos,
                orden.total,
                orden.creado_por.username
            ])
        
        return response

    @action(detail=False, methods=["get"], url_path="resumen/categorias")
    def resumen_por_categoria(self, request):
        queryset = self.filter_queryset(self.get_queryset())
        data = (
            queryset.values("categoria__id", "categoria__nombre")
            .annotate(total=Sum("total"), compras=Count("id"))
            .order_by("categoria__nombre")
        )
        return Response(
            [
                {
                    "categoria_id": item["categoria__id"],
                    "categoria": item["categoria__nombre"] or "Sin categoría",
                    "total": item["total"] or 0,
                    "compras": item["compras"],
                }
                for item in data
            ]
        )