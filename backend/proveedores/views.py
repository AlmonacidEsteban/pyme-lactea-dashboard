from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Sum, Count, Q, Min
from datetime import datetime, timedelta
from django.utils import timezone

from .models import Proveedor, CuentaPorPagar
from .serializers import ProveedorSerializer, ProveedorListSerializer, CuentaPorPagarSerializer


class ProveedorViewSet(viewsets.ModelViewSet):
    queryset = Proveedor.objects.all()
    serializer_class = ProveedorSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["activo", "is_demo"]
    search_fields = ["nombre", "identificacion", "contacto", "correo"]
    ordering_fields = ["nombre", "identificacion", "confiabilidad", "created_at"]
    ordering = ["nombre"]
    
    def get_serializer_class(self):
        if self.action == 'list':
            return ProveedorListSerializer
        return ProveedorSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        # Filtrar datos demo por defecto
        if not self.request.query_params.get('incluir_demo'):
            queryset = queryset.filter(is_demo=False)
        return queryset
    
    @action(detail=False, methods=['get'])
    def estadisticas(self, request):
        """Estadísticas generales de proveedores"""
        queryset = self.get_queryset()
        
        total_proveedores = queryset.count()
        proveedores_activos = queryset.filter(activo=True).count()
        
        # Estadísticas de cuentas por pagar
        cuentas_pendientes = CuentaPorPagar.objects.exclude(estado='paid')
        total_deuda = cuentas_pendientes.aggregate(total=Sum('monto'))['total'] or 0
        cuentas_vencidas = cuentas_pendientes.filter(fecha_vencimiento__lt=timezone.now().date()).count()
        cuentas_urgentes = cuentas_pendientes.filter(
            fecha_vencimiento__lte=timezone.now().date() + timedelta(days=3),
            fecha_vencimiento__gte=timezone.now().date()
        ).count()
        
        return Response({
            'total_proveedores': total_proveedores,
            'proveedores_activos': proveedores_activos,
            'total_deuda': total_deuda,
            'cuentas_pendientes': cuentas_pendientes.count(),
            'cuentas_vencidas': cuentas_vencidas,
            'cuentas_urgentes': cuentas_urgentes,
        })
    
    @action(detail=True, methods=['get'])
    def historial_compras(self, request, pk=None):
        """Historial de compras de un proveedor"""
        proveedor = self.get_object()
        
        # Obtener compras del proveedor
        try:
            from compras.models import Compra, OrdenCompra
            
            # Compras realizadas
            compras = Compra.objects.filter(proveedor=proveedor).order_by('-fecha')[:20]
            compras_data = []
            for compra in compras:
                compras_data.append({
                    'id': compra.id,
                    'fecha': compra.fecha,
                    'total': compra.total,
                    'numero': getattr(compra, 'numero', ''),
                    'estado': 'completada'
                })
            
            # Órdenes de compra
            ordenes = OrdenCompra.objects.filter(proveedor=proveedor).order_by('-fecha_creacion')[:20]
            ordenes_data = []
            for orden in ordenes:
                ordenes_data.append({
                    'id': orden.id,
                    'numero': orden.numero,
                    'fecha': orden.fecha_creacion,
                    'total': orden.total,
                    'estado': orden.estado
                })
            
            return Response({
                'compras': compras_data,
                'ordenes': ordenes_data
            })
            
        except ImportError:
            return Response({
                'compras': [],
                'ordenes': [],
                'mensaje': 'Módulo de compras no disponible'
            })


class CuentaPorPagarViewSet(viewsets.ModelViewSet):
    queryset = CuentaPorPagar.objects.select_related('proveedor').all()
    serializer_class = CuentaPorPagarSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = {
        'proveedor': ['exact'],
        'estado': ['exact'],
        'fecha_vencimiento': ['gte', 'lte'],
        'fecha_creacion': ['gte', 'lte'],
        'is_demo': ['exact']
    }
    search_fields = ['proveedor__nombre', 'descripcion', 'numero_factura']
    ordering_fields = ['fecha_vencimiento', 'monto', 'fecha_creacion']
    ordering = ['fecha_vencimiento', '-fecha_creacion']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        # Filtrar datos demo por defecto
        if not self.request.query_params.get('incluir_demo'):
            queryset = queryset.filter(is_demo=False)
        return queryset
    
    @action(detail=False, methods=['get'])
    def cronograma_pagos(self, request):
        """Cronograma de pagos ordenado por fecha de vencimiento"""
        queryset = self.filter_queryset(self.get_queryset())
        queryset = queryset.exclude(estado='paid').order_by('fecha_vencimiento')
        
        # Agrupar por estado
        pendientes = queryset.filter(estado='pending')
        urgentes = queryset.filter(estado='urgent')
        vencidas = queryset.filter(estado='overdue')
        
        serializer = self.get_serializer(queryset, many=True)
        
        return Response({
            'todas': serializer.data,
            'pendientes': self.get_serializer(pendientes, many=True).data,
            'urgentes': self.get_serializer(urgentes, many=True).data,
            'vencidas': self.get_serializer(vencidas, many=True).data,
            'resumen': {
                'total_pendientes': pendientes.count(),
                'total_urgentes': urgentes.count(),
                'total_vencidas': vencidas.count(),
                'monto_total': queryset.aggregate(total=Sum('monto'))['total'] or 0
            }
        })
    
    @action(detail=True, methods=['post'])
    def marcar_pagado(self, request, pk=None):
        """Marcar una cuenta como pagada"""
        cuenta = self.get_object()
        
        if cuenta.estado == 'paid':
            return Response(
                {'error': 'La cuenta ya está marcada como pagada'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        cuenta.estado = 'paid'
        cuenta.fecha_pago = timezone.now()
        cuenta.save()
        
        serializer = self.get_serializer(cuenta)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def resumen_por_proveedor(self, request):
        """Resumen de cuentas por pagar agrupadas por proveedor"""
        queryset = self.filter_queryset(self.get_queryset())
        queryset = queryset.exclude(estado='paid')
        
        resumen = queryset.values(
            'proveedor__id', 'proveedor__nombre'
        ).annotate(
            total_deuda=Sum('monto'),
            cuentas_pendientes=Count('id'),
            proxima_fecha=Min('fecha_vencimiento')
        ).order_by('proxima_fecha')
        
        return Response(resumen)