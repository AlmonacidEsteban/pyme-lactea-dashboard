from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, viewsets

from .models import Empleado, PagoEmpleado
from .serializers import EmpleadoSerializer, PagoEmpleadoSerializer


class EmpleadoViewSet(viewsets.ModelViewSet):
    queryset = Empleado.objects.all()
    serializer_class = EmpleadoSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["activo"]
    search_fields = ["nombre", "identificacion", "puesto"]
    ordering_fields = ["nombre", "identificacion"]
    ordering = ["nombre"]


class PagoEmpleadoViewSet(viewsets.ModelViewSet):
    queryset = PagoEmpleado.objects.select_related("empleado").all()
    serializer_class = PagoEmpleadoSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["empleado", "fecha"]
    search_fields = ["empleado__nombre", "concepto"]
    ordering_fields = ["fecha", "monto"]
    ordering = ["-fecha", "-id"]