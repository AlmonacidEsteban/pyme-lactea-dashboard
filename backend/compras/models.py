from decimal import Decimal

from django.db import models
from django.utils import timezone

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