from django.db import models
from clientes.models import Cliente

class Venta(models.Model):
    cliente = models.ForeignKey(Cliente, on_delete=models.PROTECT, related_name="ventas")
    fecha = models.DateField(auto_now_add=True)
    numero = models.CharField(max_length=20, blank=True)  # ej. Nro factura
    total = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    class Meta:
        ordering = ["-fecha", "-id"]

    def __str__(self):
        return f"Venta #{self.numero or self.id} - {self.cliente.nombre}"

class LineaVenta(models.Model):
    venta = models.ForeignKey(Venta, on_delete=models.CASCADE, related_name="lineas")
    descripcion = models.CharField(max_length=200)     # si más adelante tienen Producto, acá va FK
    cantidad = models.DecimalField(max_digits=10, decimal_places=2, default=1)
    precio_unitario = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    @property
    def subtotal(self):
        return self.cantidad * self.precio_unitario

    def __str__(self):
        return f"{self.descripcion} x {self.cantidad}"
