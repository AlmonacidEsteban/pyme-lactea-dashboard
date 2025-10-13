# NUEVOS MODELOS PARA EL MÓDULO DE COMPRAS
# Este archivo contiene los modelos adicionales que se integrarán al models.py principal

from decimal import Decimal
from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator

from productos.models import Producto
from proveedores.models import Proveedor


class OrdenCompra(models.Model):
    ESTADO_CHOICES = [
        ('borrador', 'Borrador'),
        ('enviada', 'Enviada'),
        ('confirmada', 'Confirmada'),
        ('parcial', 'Recibida Parcial'),
        ('completa', 'Recibida Completa'),
        ('cancelada', 'Cancelada'),
    ]
    
    PRIORIDAD_CHOICES = [
        ('baja', 'Baja'),
        ('normal', 'Normal'),
        ('alta', 'Alta'),
        ('urgente', 'Urgente'),
    ]

    numero = models.CharField(max_length=50, unique=True)
    proveedor = models.ForeignKey(Proveedor, on_delete=models.PROTECT, related_name="ordenes_compra")
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='borrador')
    prioridad = models.CharField(max_length=20, choices=PRIORIDAD_CHOICES, default='normal')
    
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_envio = models.DateTimeField(null=True, blank=True)
    fecha_entrega_esperada = models.DateField(null=True, blank=True)
    fecha_entrega_real = models.DateField(null=True, blank=True)
    
    subtotal = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("0"))
    impuestos = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("0"))
    descuento = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("0"))
    total = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("0"))
    
    notas = models.TextField(blank=True)
    terminos_pago = models.CharField(max_length=100, blank=True)
    
    # Auditoría
    created_by = models.ForeignKey(User, on_delete=models.PROTECT, related_name="ordenes_creadas")
    updated_by = models.ForeignKey(User, on_delete=models.PROTECT, related_name="ordenes_actualizadas", null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    is_demo = models.BooleanField(default=False)

    class Meta:
        ordering = ["-fecha_creacion"]
        verbose_name = "Orden de Compra"
        verbose_name_plural = "Órdenes de Compra"

    def __str__(self):
        return f"OC-{self.numero} - {self.proveedor.nombre}"

    def recalcular_totales(self):
        """Recalcula subtotal, impuestos y total basado en los items"""
        items = self.items.all()
        self.subtotal = sum(item.subtotal for item in items)
        self.impuestos = self.subtotal * Decimal("0.19")  # IVA 19%
        self.total = self.subtotal + self.impuestos - self.descuento
        self.save(update_fields=['subtotal', 'impuestos', 'total'])

    def puede_recibir(self):
        """Verifica si la orden puede recibir mercadería"""
        return self.estado in ['confirmada', 'parcial']

    def marcar_como_enviada(self, user):
        """Marca la orden como enviada"""
        self.estado = 'enviada'
        self.fecha_envio = timezone.now()
        self.updated_by = user
        self.save(update_fields=['estado', 'fecha_envio', 'updated_by', 'updated_at'])


class OrdenCompraItem(models.Model):
    orden = models.ForeignKey(OrdenCompra, on_delete=models.CASCADE, related_name="items")
    producto = models.ForeignKey(Producto, on_delete=models.PROTECT, related_name="items_orden")
    
    cantidad_solicitada = models.DecimalField(max_digits=10, decimal_places=2)
    cantidad_recibida = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal("0"))
    precio_unitario = models.DecimalField(max_digits=12, decimal_places=2)
    
    notas = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["id"]
        unique_together = ['orden', 'producto']

    def __str__(self):
        return f"{self.producto.nombre} - {self.cantidad_solicitada} unidades"

    @property
    def subtotal(self):
        return self.cantidad_solicitada * self.precio_unitario

    @property
    def cantidad_pendiente(self):
        return self.cantidad_solicitada - self.cantidad_recibida

    @property
    def porcentaje_recibido(self):
        if self.cantidad_solicitada == 0:
            return 0
        return (self.cantidad_recibida / self.cantidad_solicitada) * 100

    def esta_completo(self):
        return self.cantidad_recibida >= self.cantidad_solicitada


class MovimientoStock(models.Model):
    TIPO_CHOICES = [
        ('entrada', 'Entrada'),
        ('salida', 'Salida'),
        ('ajuste', 'Ajuste'),
        ('transferencia', 'Transferencia'),
    ]
    
    MOTIVO_CHOICES = [
        ('compra', 'Compra'),
        ('venta', 'Venta'),
        ('devolucion', 'Devolución'),
        ('ajuste_inventario', 'Ajuste de Inventario'),
        ('merma', 'Merma'),
        ('transferencia', 'Transferencia'),
        ('produccion', 'Producción'),
    ]

    producto = models.ForeignKey(Producto, on_delete=models.PROTECT, related_name="movimientos_stock")
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES)
    motivo = models.CharField(max_length=30, choices=MOTIVO_CHOICES)
    
    cantidad = models.DecimalField(max_digits=10, decimal_places=2)
    stock_anterior = models.DecimalField(max_digits=10, decimal_places=2)
    stock_nuevo = models.DecimalField(max_digits=10, decimal_places=2)
    
    costo_unitario = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    costo_promedio_anterior = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    costo_promedio_nuevo = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    
    # Referencias a documentos relacionados
    orden_compra = models.ForeignKey('OrdenCompra', on_delete=models.SET_NULL, null=True, blank=True, related_name="movimientos")
    compra = models.ForeignKey('Compra', on_delete=models.SET_NULL, null=True, blank=True, related_name="movimientos")
    
    notas = models.TextField(blank=True)
    
    # Auditoría
    created_by = models.ForeignKey(User, on_delete=models.PROTECT, related_name="movimientos_creados")
    created_at = models.DateTimeField(auto_now_add=True)
    
    is_demo = models.BooleanField(default=False)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Movimiento de Stock"
        verbose_name_plural = "Movimientos de Stock"

    def __str__(self):
        return f"{self.tipo.title()} - {self.producto.nombre} - {self.cantidad}"


class HistorialPrecios(models.Model):
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE, related_name="historial_precios")
    proveedor = models.ForeignKey(Proveedor, on_delete=models.CASCADE, related_name="historial_precios")
    
    precio = models.DecimalField(max_digits=12, decimal_places=2)
    fecha = models.DateTimeField(auto_now_add=True)
    
    # Referencia al documento que generó este precio
    orden_compra = models.ForeignKey('OrdenCompra', on_delete=models.SET_NULL, null=True, blank=True)
    compra = models.ForeignKey('Compra', on_delete=models.SET_NULL, null=True, blank=True)
    
    notas = models.TextField(blank=True)
    is_demo = models.BooleanField(default=False)

    class Meta:
        ordering = ["-fecha"]
        verbose_name = "Historial de Precios"
        verbose_name_plural = "Historial de Precios"

    def __str__(self):
        return f"{self.producto.nombre} - {self.proveedor.nombre} - ${self.precio}"


class AlertaStock(models.Model):
    TIPO_CHOICES = [
        ('stock_minimo', 'Stock Mínimo'),
        ('precio_atipico', 'Precio Atípico'),
        ('orden_vencida', 'Orden Vencida'),
        ('proveedor_confiabilidad', 'Confiabilidad Proveedor'),
    ]
    
    ESTADO_CHOICES = [
        ('activa', 'Activa'),
        ('vista', 'Vista'),
        ('resuelta', 'Resuelta'),
        ('ignorada', 'Ignorada'),
    ]

    tipo = models.CharField(max_length=30, choices=TIPO_CHOICES)
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='activa')
    
    titulo = models.CharField(max_length=200)
    mensaje = models.TextField()
    
    # Referencias opcionales
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE, null=True, blank=True, related_name="alertas")
    proveedor = models.ForeignKey(Proveedor, on_delete=models.CASCADE, null=True, blank=True, related_name="alertas")
    orden_compra = models.ForeignKey('OrdenCompra', on_delete=models.CASCADE, null=True, blank=True, related_name="alertas")
    
    created_at = models.DateTimeField(auto_now_add=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    resolved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="alertas_resueltas")
    
    is_demo = models.BooleanField(default=False)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Alerta"
        verbose_name_plural = "Alertas"

    def __str__(self):
        return f"{self.get_tipo_display()}: {self.titulo}"