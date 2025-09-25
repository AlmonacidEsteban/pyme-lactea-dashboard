from rest_framework import serializers

from .models import MovimientoFinanciero, PagoCliente


class PagoClienteSerializer(serializers.ModelSerializer):
    cliente_nombre = serializers.CharField(source="cliente.nombre", read_only=True)
    medio = serializers.ChoiceField(choices=PagoCliente.Medio.choices)
    medio_display = serializers.CharField(source="get_medio_display", read_only=True)

    class Meta:
        model = PagoCliente
        fields = (
            "id",
            "fecha",
            "cliente",
            "cliente_nombre",
            "monto",
            "medio",
            "medio_display",
            "observacion",
        )


class MovimientoFinancieroSerializer(serializers.ModelSerializer):
    compra_id = serializers.IntegerField(source="compra.id", read_only=True)
    venta_id = serializers.IntegerField(source="venta.id", read_only=True)
    origen_display = serializers.CharField(source="get_origen_display", read_only=True)

    class Meta:
        model = MovimientoFinanciero
        fields = (
            "id",
            "fecha",
            "tipo",
            "origen",
            "origen_display",
            "monto",
            "descripcion",
            "compra",
            "compra_id",
            "venta",
            "venta_id",
            "referencia_extra",
        )
class GastoManualSerializer(serializers.Serializer):
    fecha = serializers.DateField(required=False)
    monto = serializers.DecimalField(max_digits=12, decimal_places=2)
    descripcion = serializers.CharField(max_length=255)
    origen = serializers.ChoiceField(choices=MovimientoFinanciero.Origen.choices, default=MovimientoFinanciero.Origen.MANUAL)

    def create(self, validated_data):
        fecha = validated_data.get("fecha")
        if fecha is None:
            from django.utils import timezone
            fecha = timezone.now().date()
        return MovimientoFinanciero.objects.create(
            fecha=fecha,
            tipo=MovimientoFinanciero.Tipo.EGRESO,
            origen=validated_data.get("origen", MovimientoFinanciero.Origen.MANUAL),
            monto=validated_data["monto"],
            descripcion=validated_data["descripcion"],
        )
