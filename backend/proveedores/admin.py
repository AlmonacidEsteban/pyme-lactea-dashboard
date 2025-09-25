from django.contrib import admin

from .models import Proveedor


@admin.register(Proveedor)
class ProveedorAdmin(admin.ModelAdmin):
    list_display = ("id", "nombre", "identificacion", "telefono", "correo", "activo")
    list_filter = ("activo",)
    search_fields = ("nombre", "identificacion", "correo")
    ordering = ("nombre",)