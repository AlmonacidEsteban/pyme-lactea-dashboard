from rest_framework import serializers

from finanzas_reportes.models import MovimientoFinanciero
from .models import Empleado, PagoEmpleado, Equipo, Rol, AuditoriaEquipo, AuditoriaEmpleado


class EmpleadoSerializer(serializers.ModelSerializer):
    equipo_nombre = serializers.CharField(source="equipo.nombre", read_only=True)
    rol_nombre = serializers.CharField(source="rol.nombre", read_only=True)
    nombre_completo = serializers.CharField(read_only=True)

    class Meta:
        model = Empleado
        fields = (
            "id", "nombre", "apellido", "nombre_completo", "identificacion", 
            "email", "telefono", "puesto", "equipo", "equipo_nombre", 
            "rol", "rol_nombre", "turno", "salario_por_hora", "fecha_ingreso", 
            "experiencia_anos", "especialidad", "activo", "fecha_creacion", 
            "fecha_modificacion"
        )


class PagoEmpleadoSerializer(serializers.ModelSerializer):
    empleado_nombre = serializers.CharField(source="empleado.nombre_completo", read_only=True)
    aprobado_por_nombre = serializers.CharField(source="aprobado_por.username", read_only=True)

    class Meta:
        model = PagoEmpleado
        fields = (
            "id", "fecha", "empleado", "empleado_nombre", "monto", "concepto", 
            "horas_trabajadas", "aprobado_por", "aprobado_por_nombre"
        )

    def create(self, validated_data):
        pago = super().create(validated_data)
        MovimientoFinanciero.objects.create(
            fecha=pago.fecha,
            tipo=MovimientoFinanciero.Tipo.EGRESO,
            origen=MovimientoFinanciero.Origen.PAGO_EMPLEADO,
            monto=pago.monto,
            descripcion=pago.concepto or f"Pago a {pago.empleado.nombre_completo}",
            referencia_extra=f"empleado:{pago.empleado_id}",
        )
        return pago


class RolSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rol
        fields = ("id", "nombre", "descripcion", "permisos", "activo")


class EquipoSerializer(serializers.ModelSerializer):
    creado_por = serializers.PrimaryKeyRelatedField(read_only=True)
    creado_por_nombre = serializers.CharField(source="creado_por.username", read_only=True)
    total_miembros = serializers.SerializerMethodField()
    miembros = EmpleadoSerializer(many=True, read_only=True)
    lider = EmpleadoSerializer(read_only=True)

    class Meta:
        model = Equipo
        fields = (
            "id", "nombre", "descripcion", "tipo", "activo", 
            "fecha_creacion", "fecha_modificacion", "creado_por", 
            "creado_por_nombre", "total_miembros", "miembros", "lider"
        )

    def get_total_miembros(self, obj):
        return obj.miembros.filter(activo=True).count()


class EquipoListSerializer(serializers.ModelSerializer):
    """Serializer simplificado para listados de equipos"""
    creado_por_nombre = serializers.CharField(source="creado_por.username", read_only=True)
    total_miembros = serializers.SerializerMethodField()
    lider = EmpleadoSerializer(read_only=True)

    class Meta:
        model = Equipo
        fields = (
            "id", "nombre", "descripcion", "tipo", "activo", 
            "fecha_creacion", "creado_por_nombre", "total_miembros", "lider"
        )

    def get_total_miembros(self, obj):
        return obj.miembros.filter(activo=True).count()


class AuditoriaEquipoSerializer(serializers.ModelSerializer):
    usuario_nombre = serializers.CharField(source="usuario.username", read_only=True)
    equipo_nombre = serializers.CharField(source="equipo.nombre", read_only=True)

    class Meta:
        model = AuditoriaEquipo
        fields = (
            "id", "equipo", "equipo_nombre", "accion", "usuario", 
            "usuario_nombre", "fecha", "datos_anteriores", "datos_nuevos", 
            "comentario"
        )


class AuditoriaEmpleadoSerializer(serializers.ModelSerializer):
    usuario_nombre = serializers.CharField(source="usuario.username", read_only=True)
    empleado_nombre = serializers.CharField(source="empleado.nombre_completo", read_only=True)

    class Meta:
        model = AuditoriaEmpleado
        fields = (
            "id", "empleado", "empleado_nombre", "accion", "usuario", 
            "usuario_nombre", "fecha", "datos_anteriores", "datos_nuevos", 
            "comentario"
        )