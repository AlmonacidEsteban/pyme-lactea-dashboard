from decimal import Decimal, InvalidOperation

from django.db.models import F
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Producto, Marca, Categoria
from .serializers import ProductoSerializer, MarcaSerializer, CategoriaSerializer


class ProductoViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.AllowAny]
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["activo", "sku"]
    search_fields = ["nombre", "sku", "descripcion"]
    ordering_fields = ["nombre", "sku", "stock", "precio"]
    ordering = ["nombre"]

    @action(detail=True, methods=["post"], url_path="agregar-stock")
    def agregar_stock(self, request, pk=None):
        producto = self.get_object()
        cantidad = self._parse_cantidad(request.data.get("cantidad"))
        if isinstance(cantidad, Response):
            return cantidad

        Producto.objects.filter(pk=producto.pk).update(stock=F("stock") + cantidad)
        producto.refresh_from_db(fields=["stock"])
        return Response(self.get_serializer(producto).data)

    @action(detail=True, methods=["post"], url_path="quitar-stock")
    def quitar_stock(self, request, pk=None):
        producto = self.get_object()
        cantidad = self._parse_cantidad(request.data.get("cantidad"))
        if isinstance(cantidad, Response):
            return cantidad
        if cantidad > producto.stock:
            return Response(
                {"detail": "La cantidad supera el stock disponible"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        Producto.objects.filter(pk=producto.pk).update(stock=F("stock") - cantidad)
        producto.refresh_from_db(fields=["stock"])
        return Response(self.get_serializer(producto).data)

    def _parse_cantidad(self, raw_value):
        try:
            cantidad = Decimal(str(raw_value))
        except (TypeError, InvalidOperation):
            return Response(
                {"detail": "Debes enviar un número válido en el campo 'cantidad'"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if cantidad <= 0:
            return Response(
                {"detail": "La cantidad debe ser mayor a cero"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return cantidad


class MarcaViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.AllowAny]
    queryset = Marca.objects.filter(activo=True)
    serializer_class = MarcaSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["nombre"]
    ordering_fields = ["nombre"]
    ordering = ["nombre"]


class CategoriaViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.AllowAny]
    queryset = Categoria.objects.filter(activo=True)
    serializer_class = CategoriaSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["nombre"]
    ordering_fields = ["nombre"]
    ordering = ["nombre"]