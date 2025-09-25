from django.contrib import admin

from .models import Empleado, PagoEmpleado


@admin.register(Empleado)
class EmpleadoAdmin(admin.ModelAdmin):
    list_display = ("id", "nombre", "identificacion", "puesto", "activo")
    search_fields = ("nombre", "identificacion", "puesto")
    list_filter = ("activo",)


@admin.register(PagoEmpleado)
class PagoEmpleadoAdmin(admin.ModelAdmin):
    list_display = ("id", "fecha", "empleado", "monto", "concepto")
    list_filter = ("fecha", "empleado")
    search_fields = ("empleado__nombre", "concepto")