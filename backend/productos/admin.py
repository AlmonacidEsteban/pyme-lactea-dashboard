from django.contrib import admin

from .models import Producto, Marca, Categoria


@admin.register(Marca)
class MarcaAdmin(admin.ModelAdmin):
    list_display = ("id", "nombre", "activo")
    search_fields = ("nombre",)
    list_filter = ("activo",)


@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ("id", "nombre", "activo")
    search_fields = ("nombre",)
    list_filter = ("activo",)


@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    list_display = ("id", "nombre", "sku", "marca", "categoria", "stock", "precio", "activo")
    search_fields = ("nombre", "sku")
    list_filter = ("activo", "marca", "categoria")