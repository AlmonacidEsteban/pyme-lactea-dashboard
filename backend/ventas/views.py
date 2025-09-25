from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from finanzas_reportes.serializers import PagoClienteSerializer
from .models import Venta
from .serializers import (
    RegistroPagoSerializer,
    VentaRapidaSerializer,
    VentaSerializer,
)


class VentaViewSet(viewsets.ModelViewSet):
    queryset = Venta.objects.select_related("cliente").prefetch_related("lineas").all()
    serializer_class = VentaSerializer

    @action(detail=False, methods=["post"], url_path="agregar-simple")
    def agregar_simple(self, request):
        serializer = VentaRapidaSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        venta = serializer.save()
        data = self.get_serializer(venta).data
        return Response(data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=["post"], url_path="registrar-pago")
    def registrar_pago(self, request):
        serializer = RegistroPagoSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        pago = serializer.save()
        data = PagoClienteSerializer(pago, context={"request": request}).data
        return Response(data, status=status.HTTP_201_CREATED)