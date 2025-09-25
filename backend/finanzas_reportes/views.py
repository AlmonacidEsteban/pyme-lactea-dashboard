from decimal import Decimal
from django.db.models import Sum
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from ventas.models import Venta
from .models import MovimientoFinanciero, PagoCliente
from .serializers import (
    GastoManualSerializer,
    MovimientoFinancieroSerializer,
    PagoClienteSerializer,
)


class PagoClienteViewSet(viewsets.ModelViewSet):
    queryset = PagoCliente.objects.select_related("cliente").all()
    serializer_class = PagoClienteSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["cliente", "medio", "fecha"]
    search_fields = ["cliente__nombre", "medio", "observacion"]
    ordering_fields = ["fecha", "monto", "cliente__nombre"]
    ordering = ["-fecha", "-id"]


class MovimientoFinancieroViewSet(viewsets.ModelViewSet):
    queryset = MovimientoFinanciero.objects.select_related("compra", "venta").all()
    serializer_class = MovimientoFinancieroSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = {
        "tipo": ["exact"],
        "origen": ["exact"],
        "fecha": ["gte", "lte"],
        "compra": ["exact"],
        "venta": ["exact"],
    }
    search_fields = ["descripcion", "referencia_extra"]
    ordering_fields = ["fecha", "monto", "tipo", "origen"]
    ordering = ["-fecha", "-id"]

    @action(detail=False, methods=["get"], url_path="gastos")
    def listar_gastos(self, request):
        queryset = self.filter_queryset(self.get_queryset().filter(tipo=MovimientoFinanciero.Tipo.EGRESO))
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"], url_path="ingresos")
    def listar_ingresos(self, request):
        queryset = self.filter_queryset(self.get_queryset().filter(tipo=MovimientoFinanciero.Tipo.INGRESO))
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["post"], url_path="registrar-gasto")
    def registrar_gasto(self, request):
        serializer = GastoManualSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        movimiento = serializer.save()
        data = self.get_serializer(movimiento).data
        return Response(data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=["get"], url_path="resumen/pendiente")
    def resumen_pendiente(self, request):
        total_ventas = Venta.objects.aggregate(total=Sum("total")) or {}
        total_pagos = PagoCliente.objects.aggregate(total=Sum("monto")) or {}
        total_ventas_val = total_ventas.get("total") or Decimal("0")
        total_pagos_val = total_pagos.get("total") or Decimal("0")
        pendiente = total_ventas_val - total_pagos_val
        return Response({
            "total_ventas": str(total_ventas_val),
            "total_pagos": str(total_pagos_val),
            "pendiente_cobro": str(pendiente),
        })