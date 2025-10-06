from rest_framework import serializers
from .models import Cliente

class ClienteSerializer(serializers.ModelSerializer):
    deuda = serializers.ReadOnlyField()
    promedio_pedido = serializers.ReadOnlyField()
    saldo = serializers.ReadOnlyField()
    
    class Meta:
        model = Cliente
        fields = [
            'id', 'nombre', 'identificacion', 'direccion', 'telefono', 'correo',
            'zona', 'tipo', 'limite_credito', 'activo', 'fecha_creacion', 
            'fecha_actualizacion', 'ultima_compra', 'deuda', 'promedio_pedido', 'saldo'
        ]
        read_only_fields = ['fecha_creacion', 'fecha_actualizacion']

class ClienteListSerializer(serializers.ModelSerializer):
    """Serializador optimizado para listados de clientes"""
    deuda = serializers.ReadOnlyField()
    
    class Meta:
        model = Cliente
        fields = [
            'id', 'nombre', 'identificacion', 'telefono', 'correo',
            'zona', 'tipo', 'limite_credito', 'activo', 'ultima_compra', 'deuda'
        ]
