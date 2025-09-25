from django.contrib import admin

from .models import MovimientoFinanciero, PagoCliente


@admin.register(PagoCliente)
class PagoClienteAdmin(admin.ModelAdmin):
    list_display = ("id", "fecha", "cliente", "monto", "medio")
    search_fields = ("cliente__nombre", "cliente__identificacion", "medio", "observacion")
    list_filter = ("fecha", "medio")


@admin.register(MovimientoFinanciero)
class MovimientoFinancieroAdmin(admin.ModelAdmin):
    list_display = ("id", "fecha", "tipo", "monto", "descripcion", "compra")
    list_filter = ("fecha", "tipo")
    search_fields = ("descripcion", "referencia_extra")