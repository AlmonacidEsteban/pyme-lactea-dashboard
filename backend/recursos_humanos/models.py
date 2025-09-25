from django.db import models


class Empleado(models.Model):
    nombre = models.CharField(max_length=120)
    identificacion = models.CharField(max_length=40, blank=True)
    puesto = models.CharField(max_length=120, blank=True)
    activo = models.BooleanField(default=True)

    class Meta:
        ordering = ["nombre"]

    def __str__(self):
        return self.nombre


class PagoEmpleado(models.Model):
    empleado = models.ForeignKey(Empleado, on_delete=models.PROTECT, related_name="pagos")
    fecha = models.DateField(auto_now_add=True)
    monto = models.DecimalField(max_digits=12, decimal_places=2)
    concepto = models.CharField(max_length=200, blank=True)

    class Meta:
        ordering = ["-fecha", "-id"]

    def __str__(self):
        return f"Pago {self.monto} a {self.empleado.nombre}"