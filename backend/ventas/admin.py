from django.contrib import admin
from .models import Venta, LineaVenta

class LineaVentaInline(admin.TabularInline):
    model = LineaVenta
    extra = 1

@admin.register(Venta)
class VentaAdmin(admin.ModelAdmin):
    list_display = ("id", "fecha", "cliente", "total", "numero")
    search_fields = ("numero", "cliente__nombre", "cliente__identificacion")
    list_filter = ("fecha",)
    inlines = [LineaVentaInline]
