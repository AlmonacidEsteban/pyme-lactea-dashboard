from django.contrib import admin

from .models import CategoriaCompra, Compra, CompraLinea


class CompraLineaInline(admin.TabularInline):
    model = CompraLinea
    extra = 1


@admin.register(Compra)
class CompraAdmin(admin.ModelAdmin):
    list_display = ("id", "fecha", "proveedor", "categoria", "numero", "total")
    list_filter = ("fecha", "categoria", "proveedor")
    search_fields = ("numero", "proveedor__nombre", "proveedor__identificacion")
    inlines = [CompraLineaInline]


@admin.register(CategoriaCompra)
class CategoriaCompraAdmin(admin.ModelAdmin):
    list_display = ("id", "nombre")
    search_fields = ("nombre",)