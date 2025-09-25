from django.contrib import admin

from .models import Producto


@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    list_display = ("id", "nombre", "sku", "stock", "precio", "activo")
    search_fields = ("nombre", "sku")
    list_filter = ("activo",)