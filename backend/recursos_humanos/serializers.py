from rest_framework import serializers

from finanzas_reportes.models import MovimientoFinanciero
from .models import Empleado, PagoEmpleado


class EmpleadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Empleado
        fields = ("id", "nombre", "identificacion", "puesto", "activo")


class PagoEmpleadoSerializer(serializers.ModelSerializer):
    empleado_nombre = serializers.CharField(source="empleado.nombre", read_only=True)

    class Meta:
        model = PagoEmpleado
        fields = ("id", "fecha", "empleado", "empleado_nombre", "monto", "concepto")

    def create(self, validated_data):
        pago = super().create(validated_data)
        MovimientoFinanciero.objects.create(
            fecha=pago.fecha,
            tipo=MovimientoFinanciero.Tipo.EGRESO,
            origen=MovimientoFinanciero.Origen.PAGO_EMPLEADO,
            monto=pago.monto,
            descripcion=pago.concepto or f"Pago a {pago.empleado.nombre}",
            referencia_extra=f"empleado:{pago.empleado_id}",
        )
        return pago