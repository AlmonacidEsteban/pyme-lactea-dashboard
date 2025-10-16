from rest_framework import serializers
from .models import Cliente, Rubro


class RubroSerializer(serializers.ModelSerializer):
    """Serializador para el modelo Rubro"""
    
    class Meta:
        model = Rubro
        fields = ['id', 'nombre', 'descripcion', 'activo', 'fecha_creacion']
        read_only_fields = ['fecha_creacion']

class ClienteSerializer(serializers.ModelSerializer):
    deuda = serializers.ReadOnlyField()
    promedio_pedido = serializers.ReadOnlyField()
    saldo = serializers.ReadOnlyField()
    rubro_nombre = serializers.CharField(source='rubro.nombre', read_only=True)
    
    class Meta:
        model = Cliente
        fields = [
            'id', 'nombre', 'identificacion', 'direccion', 'telefono', 'correo',
            'zona', 'tipo', 'limite_credito', 'rubro', 'rubro_nombre', 'activo', 'fecha_creacion', 
            'fecha_actualizacion', 'ultima_compra', 'deuda', 'promedio_pedido', 'saldo'
        ]
        read_only_fields = ['fecha_creacion', 'fecha_actualizacion']

class ClienteListSerializer(serializers.ModelSerializer):
    """Serializador optimizado para listados de clientes"""
    deuda = serializers.ReadOnlyField()
    rubro_nombre = serializers.CharField(source='rubro.nombre', read_only=True)
    
    class Meta:
        model = Cliente
        fields = [
            'id', 'nombre', 'identificacion', 'telefono', 'correo',
            'zona', 'tipo', 'limite_credito', 'rubro', 'rubro_nombre', 'activo', 'ultima_compra', 'deuda'
        ]
