from rest_framework import serializers

from .models import Producto, Marca, Categoria


class MarcaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Marca
        fields = ("id", "nombre", "activo")


class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ("id", "nombre", "activo")


class ProductoSerializer(serializers.ModelSerializer):
    marca_nombre = serializers.CharField(source='marca.nombre', read_only=True)
    categoria_nombre = serializers.CharField(source='categoria.nombre', read_only=True)
    
    class Meta:
        model = Producto
        fields = (
            "id",
            "marca",
            "marca_nombre",
            "categoria", 
            "categoria_nombre",
            "nombre",
            "sku",
            "descripcion",
            "precio",
            "stock",
            "activo",
        )