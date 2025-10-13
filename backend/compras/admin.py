from django.contrib import admin

from .models import (
    CategoriaCompra, 
    Compra, 
    CompraLinea,
    OrdenCompra,
    OrdenCompraItem,
    MovimientoStock,
    HistorialPrecios,
    AlertaStock
)


class CompraLineaInline(admin.TabularInline):
    model = CompraLinea
    extra = 1


class OrdenCompraItemInline(admin.TabularInline):
    model = OrdenCompraItem
    extra = 1
    readonly_fields = ('subtotal',)


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


@admin.register(OrdenCompra)
class OrdenCompraAdmin(admin.ModelAdmin):
    list_display = ("numero", "proveedor", "estado", "fecha_creacion", "total", "creado_por")
    list_filter = ("estado", "fecha_creacion", "proveedor")
    search_fields = ("numero", "proveedor__nombre", "notas")
    readonly_fields = ("numero", "subtotal", "impuestos", "total", "fecha_creacion")
    inlines = [OrdenCompraItemInline]
    
    def save_model(self, request, obj, form, change):
        if not change:  # Si es una nueva orden
            obj.creado_por = request.user
        super().save_model(request, obj, form, change)


@admin.register(MovimientoStock)
class MovimientoStockAdmin(admin.ModelAdmin):
    list_display = ("producto", "tipo", "cantidad", "fecha", "usuario", "referencia")
    list_filter = ("tipo", "fecha", "usuario")
    search_fields = ("producto__nombre", "referencia", "notas")
    readonly_fields = ("fecha",)
    
    def save_model(self, request, obj, form, change):
        if not change:  # Si es un nuevo movimiento
            obj.usuario = request.user
        super().save_model(request, obj, form, change)


@admin.register(HistorialPrecios)
class HistorialPreciosAdmin(admin.ModelAdmin):
    list_display = ("producto", "proveedor", "precio", "fecha", "cantidad_comprada")
    list_filter = ("fecha", "proveedor")
    search_fields = ("producto__nombre", "proveedor__nombre")
    readonly_fields = ("fecha",)


@admin.register(AlertaStock)
class AlertaStockAdmin(admin.ModelAdmin):
    list_display = ("producto", "tipo", "estado", "fecha_creacion", "valor_referencia")
    list_filter = ("tipo", "estado", "fecha_creacion")
    search_fields = ("producto__nombre", "mensaje")
    readonly_fields = ("fecha_creacion", "fecha_resolucion")
    
    actions = ['marcar_como_vista', 'resolver_alertas']
    
    def marcar_como_vista(self, request, queryset):
        queryset.filter(estado='activa').update(estado='vista')
        self.message_user(request, f"{queryset.count()} alertas marcadas como vistas.")
    marcar_como_vista.short_description = "Marcar como vista"
    
    def resolver_alertas(self, request, queryset):
        for alerta in queryset.filter(estado__in=['activa', 'vista']):
            alerta.marcar_como_resuelta(request.user)
        self.message_user(request, f"{queryset.count()} alertas resueltas.")
    resolver_alertas.short_description = "Resolver alertas"