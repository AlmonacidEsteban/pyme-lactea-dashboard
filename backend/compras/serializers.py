from decimal import Decimal

from rest_framework import serializers

from productos.models import Producto
from .models import CategoriaCompra, Compra, CompraLinea


class CategoriaCompraSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoriaCompra
        fields = ("id", "nombre", "descripcion")


class CompraLineaSerializer(serializers.ModelSerializer):
    producto = serializers.PrimaryKeyRelatedField(
        queryset=Producto.objects.all(), allow_null=True, required=False
    )
    subtotal = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    producto_nombre = serializers.CharField(source="producto.nombre", read_only=True)

    class Meta:
        model = CompraLinea
        fields = (
            "id",
            "producto",
            "producto_nombre",
            "descripcion",
            "cantidad",
            "kilaje",
            "precio_unitario",
            "total_linea",
            "subtotal",
        )

    def validate(self, attrs):
        cantidad = attrs.get("cantidad")
        kilaje = attrs.get("kilaje")
        precio = attrs.get("precio_unitario")
        total_linea = attrs.get("total_linea")
        producto = attrs.get("producto")

        def is_positive(value):
            return value is not None and value > 0

        if not any(map(is_positive, (cantidad, kilaje, total_linea))):
            raise serializers.ValidationError(
                "Debes especificar cantidad, kilaje o un total_linea para la compra."
            )

        if total_linea is None:
            if precio is None or precio <= 0:
                raise serializers.ValidationError(
                    "Si no indicas total_linea debes indicar precio_unitario positivo."
                )
        if cantidad is not None and cantidad <= 0:
            raise serializers.ValidationError("La cantidad debe ser mayor a cero si se informa.")
        if kilaje is not None and kilaje <= 0:
            raise serializers.ValidationError("El kilaje debe ser mayor a cero si se informa.")
        if total_linea is not None and total_linea <= 0:
            raise serializers.ValidationError("El total_linea debe ser mayor a cero si se informa.")
        if producto and not any(map(is_positive, (cantidad, kilaje))):
            raise serializers.ValidationError(
                "Para actualizar el stock del producto debes informar cantidad o kilaje."
            )
        return attrs


class CompraSerializer(serializers.ModelSerializer):
    proveedor_nombre = serializers.CharField(source="proveedor.nombre", read_only=True)
    categoria_nombre = serializers.CharField(source="categoria.nombre", read_only=True)
    lineas = CompraLineaSerializer(many=True)

    class Meta:
        model = Compra
        fields = (
            "id",
            "fecha",
            "numero",
            "proveedor",
            "proveedor_nombre",
            "categoria",
            "categoria_nombre",
            "total",
            "notas",
            "lineas",
        )

    def _build_lineas(self, compra: Compra, lineas_data):
        total = Decimal("0")

        # revert stock from existing lines
        for linea in compra.lineas.select_related("producto"):
            if linea.producto and linea.unidades_para_stock > 0:
                linea.producto.quitar_stock(linea.unidades_para_stock)
        compra.lineas.all().delete()

        for linea_data in lineas_data:
            linea = CompraLinea.objects.create(compra=compra, **linea_data)
            subtotal = linea.subtotal
            total += subtotal
            if linea.producto and linea.unidades_para_stock > 0:
                linea.producto.agregar_stock(linea.unidades_para_stock)
        compra.total = total
        compra.save(update_fields=["total"])
        return total

    def create(self, validated_data):
        lineas_data = validated_data.pop("lineas", [])
        compra = Compra.objects.create(**validated_data)
        total = self._build_lineas(compra, lineas_data)
        self._sync_movimiento_financiero(compra, total)
        return compra

    def update(self, instance, validated_data):
        lineas_data = validated_data.pop("lineas", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if lineas_data is not None:
            total = self._build_lineas(instance, lineas_data)
        else:
            total = instance.recalcular_total()
        self._sync_movimiento_financiero(instance, total)
        return instance

    def _sync_movimiento_financiero(self, compra: Compra, total):
        from finanzas_reportes.models import MovimientoFinanciero

        descripcion = f"Compra #{compra.numero or compra.id} - {compra.proveedor.nombre}"
        movimiento, _created = MovimientoFinanciero.objects.get_or_create(
            compra=compra,
            defaults={
                "fecha": compra.fecha,
                "tipo": MovimientoFinanciero.Tipo.EGRESO,
                "origen": MovimientoFinanciero.Origen.COMPRA,
                "monto": total,
                "descripcion": descripcion,
            },
        )
        if not _created:
            movimiento.fecha = compra.fecha
            movimiento.monto = total
            movimiento.tipo = MovimientoFinanciero.Tipo.EGRESO
            movimiento.origen = MovimientoFinanciero.Origen.COMPRA
            movimiento.descripcion = descripcion
            movimiento.save(update_fields=["fecha", "monto", "tipo", "descripcion"])