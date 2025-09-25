from decimal import Decimal

from django.apps import apps
from django.db.models import Sum
from django.db.models.functions import Substr, Upper
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Cliente
from .serializers import ClienteSerializer


class ClienteViewSet(viewsets.ModelViewSet):
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer

    # Filtros, búsqueda y orden
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["identificacion"]
    search_fields = ["nombre", "correo", "telefono"]
    ordering_fields = ["nombre", "identificacion"]
    ordering = ["nombre"]

    # Acción personalizada para TreeView
    @action(detail=False, methods=["get"], url_path="tree")
    def tree(self, request):
        """Devuelve datos agrupados para armar un TreeView agrupado por inicial del nombre."""
        qs = self.get_queryset().annotate(inicial=Upper(Substr("nombre", 1, 1)))
        grupos = {}

        for cliente in qs.values("id", "nombre", "identificacion", "correo", "inicial"):
            key = cliente["inicial"] or "#"
            grupos.setdefault(key, []).append(
                {
                    "id": cliente["id"],
                    "label": cliente["nombre"],
                    "identificacion": cliente["identificacion"],
                    "correo": cliente["correo"] or "",
                }
            )

        tree = [
            {"label": initial, "children": sorted(children, key=lambda item: item["label"])}
            for initial, children in sorted(grupos.items(), key=lambda item: item[0])
        ]
        return Response(tree)

    @action(detail=True, methods=["get"], url_path="perfil")
    def perfil(self, request, pk=None):
        cliente = self.get_object()
        data = ClienteSerializer(cliente).data

        ventas = []
        compras = []
        pagos = []
        total_ventas = Decimal("0")
        total_compras = Decimal("0")
        total_pagos = Decimal("0")

        Venta = apps.get_model("ventas", "Venta")
        if Venta is not None:
            ventas_qs = Venta.objects.filter(cliente=cliente).order_by("-fecha", "-id")
            ventas = [
                {"id": venta.id, "fecha": venta.fecha, "total": str(venta.total)}
                for venta in ventas_qs[:50]
            ]
            aggregated = ventas_qs.aggregate(total=Sum("total"))
            total_ventas = aggregated["total"] or Decimal("0")

        Compra = apps.get_model("compras", "Compra")
        if Compra is not None:
            compras_qs = Compra.objects.filter(cliente=cliente).order_by("-fecha", "-id")
            compras = [
                {"id": compra.id, "fecha": compra.fecha, "total": str(getattr(compra, "total", Decimal("0")))}
                for compra in compras_qs[:50]
            ]
            if hasattr(Compra, "total"):
                total_compras_value = compras_qs.aggregate(total=Sum("total"))
                total_compras = total_compras_value["total"] or Decimal("0")

        PagoCliente = apps.get_model("finanzas_reportes", "PagoCliente")
        if PagoCliente is not None:
            pagos_qs = PagoCliente.objects.filter(cliente=cliente).order_by("-fecha", "-id")
            pagos = [
                {
                    "id": pago.id,
                    "fecha": pago.fecha,
                    "monto": str(pago.monto),
                    "medio": pago.medio,
                }
                for pago in pagos_qs[:50]
            ]
            total_pagos_value = pagos_qs.aggregate(total=Sum("monto"))
            total_pagos = total_pagos_value["total"] or Decimal("0")

        saldo = (total_ventas - total_pagos) if (total_ventas or total_pagos) else Decimal("0")

        return Response(
            {
                "cliente": data,
                "historial_ventas": ventas,
                "historial_compras": compras,
                "pagos": pagos,
                "saldo": str(saldo.quantize(Decimal("0.01")) if isinstance(saldo, Decimal) else saldo),
                "total_ventas": str(total_ventas),
                "total_compras": str(total_compras),
                "total_pagos": str(total_pagos),
            }
        )