from decimal import Decimal

from django.utils import timezone
from rest_framework import serializers

from clientes.models import Cliente
from finanzas_reportes.models import MovimientoFinanciero, PagoCliente
from .models import LineaVenta, Venta


class LineaVentaSerializer(serializers.ModelSerializer):
    subtotal = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)

    class Meta:
        model = LineaVenta
        fields = ("id", "descripcion", "cantidad", "precio_unitario", "subtotal")


class VentaSerializer(serializers.ModelSerializer):
    lineas = LineaVentaSerializer(many=True)
    cliente_nombre = serializers.CharField(source="cliente.nombre", read_only=True)

    class Meta:
        model = Venta
        fields = ("id", "fecha", "numero", "cliente", "cliente_nombre", "total", "lineas")

    def _sync_movimiento(self, venta: Venta) -> None:
        MovimientoFinanciero.objects.update_or_create(
            venta=venta,
            defaults={
                "fecha": venta.fecha,
                "tipo": MovimientoFinanciero.Tipo.INGRESO,
                "origen": MovimientoFinanciero.Origen.VENTA,
                "monto": venta.total,
                "descripcion": f"Venta #{venta.numero or venta.id} - {venta.cliente.nombre}",
            },
        )

    def create(self, validated_data):
        lineas_data = validated_data.pop("lineas", [])
        venta = Venta.objects.create(**validated_data)
        total = Decimal("0")
        for linea_data in lineas_data:
            linea = LineaVenta.objects.create(venta=venta, **linea_data)
            total += linea.subtotal
        venta.total = total
        venta.save(update_fields=["total"])
        self._sync_movimiento(venta)
        return venta

    def update(self, instance, validated_data):
        lineas_data = validated_data.pop("lineas", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if lineas_data is not None:
            instance.lineas.all().delete()
            total = Decimal("0")
            for linea_data in lineas_data:
                linea = LineaVenta.objects.create(venta=instance, **linea_data)
                total += linea.subtotal
            instance.total = total
        instance.save()
        self._sync_movimiento(instance)
        return instance


class VentaRapidaSerializer(serializers.Serializer):
    cliente = serializers.PrimaryKeyRelatedField(queryset=Cliente.objects.all())
    descripcion = serializers.CharField(max_length=200)
    cantidad = serializers.DecimalField(max_digits=10, decimal_places=2)
    precio_unitario = serializers.DecimalField(max_digits=12, decimal_places=2)
    numero = serializers.CharField(max_length=40, required=False, allow_blank=True)

    def create(self, validated_data):
        cliente = validated_data["cliente"]
        descripcion = validated_data["descripcion"]
        cantidad = validated_data["cantidad"]
        precio_unitario = validated_data["precio_unitario"]
        numero = validated_data.get("numero", "")

        venta = Venta.objects.create(cliente=cliente, numero=numero)
        linea = LineaVenta.objects.create(
            venta=venta,
            descripcion=descripcion,
            cantidad=cantidad,
            precio_unitario=precio_unitario,
        )
        venta.total = linea.subtotal
        venta.save(update_fields=["total"])
        MovimientoFinanciero.objects.create(
            venta=venta,
            fecha=venta.fecha,
            tipo=MovimientoFinanciero.Tipo.INGRESO,
            origen=MovimientoFinanciero.Origen.VENTA,
            monto=venta.total,
            descripcion=f"Venta #{venta.numero or venta.id} - {venta.cliente.nombre}",
        )
        return venta


class RegistroPagoSerializer(serializers.Serializer):
    cliente = serializers.PrimaryKeyRelatedField(queryset=Cliente.objects.all())
    monto = serializers.DecimalField(max_digits=12, decimal_places=2)
    medio = serializers.ChoiceField(choices=PagoCliente.Medio.choices)
    observacion = serializers.CharField(required=False, allow_blank=True, max_length=200)
    fecha = serializers.DateField(required=False)

    def create(self, validated_data):
        if not validated_data.get("fecha"):
            validated_data["fecha"] = timezone.now().date()
        return PagoCliente.objects.create(**validated_data)