from rest_framework import serializers

from .models import Proveedor, CuentaPorPagar


class CuentaPorPagarSerializer(serializers.ModelSerializer):
    proveedor_nombre = serializers.CharField(source='proveedor.nombre', read_only=True)
    dias_restantes = serializers.ReadOnlyField()
    estado_calculado = serializers.ReadOnlyField()
    
    class Meta:
        model = CuentaPorPagar
        fields = (
            "id",
            "proveedor",
            "proveedor_nombre",
            "monto",
            "fecha_vencimiento",
            "fecha_creacion",
            "fecha_pago",
            "estado",
            "estado_calculado",
            "descripcion",
            "numero_factura",
            "orden_compra",
            "dias_restantes",
            "is_demo",
        )
        read_only_fields = ("fecha_creacion",)


class ProveedorSerializer(serializers.ModelSerializer):
    cuentas_pendientes = serializers.SerializerMethodField()
    total_deuda = serializers.SerializerMethodField()
    
    class Meta:
        model = Proveedor
        fields = (
            "id",
            "nombre",
            "identificacion",
            "contacto",
            "telefono",
            "correo",
            "direccion",
            "confiabilidad",
            "dias_pago",
            "notas",
            "activo",
            "is_demo",
            "created_at",
            "updated_at",
            "cuentas_pendientes",
            "total_deuda",
        )
        read_only_fields = ("created_at", "updated_at")
    
    def get_cuentas_pendientes(self, obj):
        """Obtiene el número de cuentas pendientes de pago"""
        return obj.cuentas_por_pagar.exclude(estado='paid').count()
    
    def get_total_deuda(self, obj):
        """Calcula el total de deuda pendiente"""
        from django.db.models import Sum
        total = obj.cuentas_por_pagar.exclude(estado='paid').aggregate(
            total=Sum('monto')
        )['total']
        return total or 0


class ProveedorListSerializer(serializers.ModelSerializer):
    """Serializer simplificado para listados"""
    cuentas_pendientes = serializers.SerializerMethodField()
    total_deuda = serializers.SerializerMethodField()
    
    class Meta:
        model = Proveedor
        fields = (
            "id",
            "nombre",
            "telefono",
            "correo",
            "direccion",
            "confiabilidad",
            "dias_pago",
            "activo",
            "cuentas_pendientes",
            "total_deuda",
        )
    
    def get_cuentas_pendientes(self, obj):
        return obj.cuentas_por_pagar.exclude(estado='paid').count()
    
    def get_total_deuda(self, obj):
        from django.db.models import Sum
        total = obj.cuentas_por_pagar.exclude(estado='paid').aggregate(
            total=Sum('monto')
        )['total']
        return total or 0