from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, viewsets

from .models import Proveedor
from .serializers import ProveedorSerializer


class ProveedorViewSet(viewsets.ModelViewSet):
    queryset = Proveedor.objects.all()
    serializer_class = ProveedorSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["activo"]
    search_fields = ["nombre", "identificacion", "contacto", "correo"]
    ordering_fields = ["nombre", "identificacion"]
    ordering = ["nombre"]