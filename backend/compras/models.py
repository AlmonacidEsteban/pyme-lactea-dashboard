from decimal import Decimal

from django.db import models
from django.utils import timezone
from django.conf import settings

from productos.models import Producto
from proveedores.models import Proveedor


class CategoriaCompra(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    descripcion = models.CharField(max_length=255, blank=True)

    class Meta:
        ordering = ["nombre"]
        verbose_name = "categoría de compra"
        verbose_name_plural = "categorías de compra"

    def __str__(self) -> str:
        return self.nombre


class Compra(models.Model):
    proveedor = models.ForeignKey(Proveedor, on_delete=models.PROTECT, related_name="compras")
    categoria = models.ForeignKey(
        CategoriaCompra, on_delete=models.SET_NULL, null=True, blank=True, related_name="compras"
    )
    fecha = models.DateField(default=timezone.now)
    numero = models.CharField(max_length=40, blank=True)
    total = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("0"))
    notas = models.TextField(blank=True)

    class Meta:
        ordering = ["-fecha", "-id"]

    def __str__(self) -> str:
        return f"Compra #{self.numero or self.id} - {self.proveedor.nombre}"

    def recalcular_total(self) -> Decimal:
        total = sum((linea.subtotal for linea in self.lineas.all()), Decimal("0"))
        self.total = total
        self.save(update_fields=["total"])
        return total


class CompraLinea(models.Model):
    compra = models.ForeignKey(Compra, on_delete=models.CASCADE, related_name="lineas")
    producto = models.ForeignKey(Producto, on_delete=models.PROTECT, null=True, blank=True, related_name="compras")
    descripcion = models.CharField(max_length=200)
    cantidad = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    kilaje = models.DecimalField(max_digits=10, decimal_places=3, null=True, blank=True)
    precio_unitario = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    total_linea = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)

    class Meta:
        ordering = ["id"]

    @property
    def subtotal(self) -> Decimal:
        if self.total_linea is not None:
            return self.total_linea
        base = self.cantidad or self.kilaje or Decimal("0")
        precio = self.precio_unitario or Decimal("0")
        return base * precio

    @property
    def unidades_para_stock(self) -> Decimal:
        return (self.cantidad or self.kilaje or Decimal("0"))

    def __str__(self) -> str:
        unidades = self.cantidad if self.cantidad is not None else self.kilaje
        return f"{self.descripcion} x {unidades or 0}"


# Nuevos modelos extendidos para el módulo de compras

class OrdenCompra(models.Model):
    ESTADO_CHOICES = [
        ('borrador', 'Borrador'),
        ('enviada', 'Enviada'),
        ('confirmada', 'Confirmada'),
        ('recibida_parcial', 'Recibida Parcial'),
        ('recibida_completa', 'Recibida Completa'),
        ('cancelada', 'Cancelada'),
    ]

    numero = models.CharField(max_length=50, unique=True)
    proveedor = models.ForeignKey(Proveedor, on_delete=models.PROTECT, related_name="ordenes_compra")
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_envio = models.DateTimeField(null=True, blank=True)
    fecha_entrega_esperada = models.DateField(null=True, blank=True)
    fecha_entrega_real = models.DateField(null=True, blank=True)
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='borrador')
    subtotal = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0'))
    impuestos = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0'))
    total = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0'))
    notas = models.TextField(blank=True)
    creado_por = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="ordenes_compra_creadas")
    aprobado_por = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, null=True, blank=True, related_name="ordenes_compra_aprobadas")

    class Meta:
        ordering = ['-fecha_creacion']
        verbose_name = "Orden de Compra"
        verbose_name_plural = "Órdenes de Compra"

    def __str__(self):
        return f"OC-{self.numero} - {self.proveedor.nombre}"

    def calcular_totales(self):
        """Calcula subtotal, impuestos y total basado en los ítems"""
        subtotal = sum(item.subtotal for item in self.items.all())
        self.subtotal = subtotal
        self.impuestos = subtotal * Decimal('0.21')  # IVA 21%
        self.total = self.subtotal + self.impuestos
        self.save(update_fields=['subtotal', 'impuestos', 'total'])

    def puede_recibir_mercaderia(self):
        """Verifica si la orden puede recibir mercadería"""
        return self.estado in ['enviada', 'confirmada', 'recibida_parcial']


class OrdenCompraItem(models.Model):
    orden_compra = models.ForeignKey(OrdenCompra, on_delete=models.CASCADE, related_name="items")
    producto = models.ForeignKey(Producto, on_delete=models.PROTECT)
    cantidad_solicitada = models.DecimalField(max_digits=10, decimal_places=2)
    cantidad_recibida = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0'))
    precio_unitario = models.DecimalField(max_digits=12, decimal_places=2)
    subtotal = models.DecimalField(max_digits=12, decimal_places=2)
    notas = models.TextField(blank=True)

    class Meta:
        ordering = ['id']
        verbose_name = "Item de Orden de Compra"
        verbose_name_plural = "Items de Orden de Compra"

    def __str__(self):
        return f"{self.producto.nombre} - {self.cantidad_solicitada}"

    def save(self, *args, **kwargs):
        # Calcular subtotal automáticamente
        self.subtotal = self.cantidad_solicitada * self.precio_unitario
        super().save(*args, **kwargs)

    @property
    def cantidad_pendiente(self):
        """Cantidad que aún falta por recibir"""
        return self.cantidad_solicitada - self.cantidad_recibida

    @property
    def esta_completo(self):
        """Verifica si el item está completamente recibido"""
        return self.cantidad_recibida >= self.cantidad_solicitada


class MovimientoStock(models.Model):
    TIPO_CHOICES = [
        ('entrada', 'Entrada'),
        ('salida', 'Salida'),
        ('ajuste', 'Ajuste'),
        ('transferencia', 'Transferencia'),
    ]

    producto = models.ForeignKey(Producto, on_delete=models.PROTECT, related_name="movimientos_stock")
    tipo = models.CharField(max_length=15, choices=TIPO_CHOICES)
    cantidad = models.DecimalField(max_digits=10, decimal_places=2)
    costo_unitario = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    fecha = models.DateTimeField(auto_now_add=True)
    referencia = models.CharField(max_length=100, blank=True)  # Número de compra, orden, etc.
    orden_compra_item = models.ForeignKey(OrdenCompraItem, on_delete=models.SET_NULL, null=True, blank=True)
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    notas = models.TextField(blank=True)

    class Meta:
        ordering = ['-fecha']
        verbose_name = "Movimiento de Stock"
        verbose_name_plural = "Movimientos de Stock"

    def __str__(self):
        return f"{self.tipo.title()} - {self.producto.nombre} - {self.cantidad}"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Actualizar stock del producto
        self.actualizar_stock_producto()

    def actualizar_stock_producto(self):
        """Actualiza el stock del producto basado en el movimiento"""
        if self.tipo == 'entrada':
            self.producto.stock += self.cantidad
        elif self.tipo == 'salida':
            self.producto.stock -= self.cantidad
        elif self.tipo == 'ajuste':
            # Para ajustes, la cantidad es el nuevo stock total
            self.producto.stock = self.cantidad
        
        self.producto.save(update_fields=['stock'])


class HistorialPrecios(models.Model):
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE, related_name="historial_precios")
    proveedor = models.ForeignKey(Proveedor, on_delete=models.CASCADE, related_name="historial_precios")
    precio = models.DecimalField(max_digits=12, decimal_places=2)
    fecha = models.DateTimeField(auto_now_add=True)
    orden_compra_item = models.ForeignKey(OrdenCompraItem, on_delete=models.SET_NULL, null=True, blank=True)
    cantidad_comprada = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    class Meta:
        ordering = ['-fecha']
        verbose_name = "Historial de Precios"
        verbose_name_plural = "Historial de Precios"

    def __str__(self):
        return f"{self.producto.nombre} - {self.proveedor.nombre} - ${self.precio}"


class AlertaStock(models.Model):
    TIPO_CHOICES = [
        ('stock_minimo', 'Stock Mínimo'),
        ('precio_atipico', 'Precio Atípico'),
        ('vencimiento', 'Próximo a Vencer'),
    ]

    ESTADO_CHOICES = [
        ('activa', 'Activa'),
        ('vista', 'Vista'),
        ('resuelta', 'Resuelta'),
        ('ignorada', 'Ignorada'),
    ]

    tipo = models.CharField(max_length=15, choices=TIPO_CHOICES)
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE, related_name="alertas_stock")
    proveedor = models.ForeignKey(Proveedor, on_delete=models.CASCADE, null=True, blank=True)
    mensaje = models.TextField()
    estado = models.CharField(max_length=10, choices=ESTADO_CHOICES, default='activa')
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_resolucion = models.DateTimeField(null=True, blank=True)
    resuelto_por = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    valor_referencia = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)

    class Meta:
        ordering = ['-fecha_creacion']
        verbose_name = "Alerta de Stock"
        verbose_name_plural = "Alertas de Stock"

    def __str__(self):
        return f"{self.get_tipo_display()} - {self.producto.nombre}"

    def marcar_como_resuelta(self, usuario):
        """Marca la alerta como resuelta"""
        self.estado = 'resuelta'
        self.fecha_resolucion = timezone.now()
        self.resuelto_por = usuario
        self.save(update_fields=['estado', 'fecha_resolucion', 'resuelto_por'])