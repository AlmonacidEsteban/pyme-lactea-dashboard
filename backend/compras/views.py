from django.db.models import Count, Sum
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import CategoriaCompra, Compra
from .serializers import CategoriaCompraSerializer, CompraSerializer


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