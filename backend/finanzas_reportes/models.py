from decimal import Decimal

from django.db import models
from django.utils import timezone

from clientes.models import Cliente


class PagoCliente(models.Model):
    class Medio(models.TextChoices):
        EFECTIVO = "EFECTIVO", "Efectivo"
        TRANSFERENCIA = "TRANSFERENCIA", "Transferencia"
        CHEQUE = "CHEQUE", "Cheque"

    cliente = models.ForeignKey(Cliente, on_delete=models.PROTECT, related_name="pagos")
    fecha = models.DateField(default=timezone.now)
    monto = models.DecimalField(max_digits=12, decimal_places=2)
    medio = models.CharField(max_length=20, choices=Medio.choices, default=Medio.EFECTIVO)
    observacion = models.CharField(max_length=200, blank=True)

    class Meta:
        ordering = ["-fecha", "-id"]

    def __str__(self):
        return f"Pago {self.monto} de {self.cliente.nombre} ({self.get_medio_display()})"


class MovimientoFinanciero(models.Model):
    class Tipo(models.TextChoices):
        INGRESO = "INGRESO", "Ingreso"
        EGRESO = "EGRESO", "Egreso"

    class Origen(models.TextChoices):
        MANUAL = "MANUAL", "Manual"
        COMPRA = "COMPRA", "Compra"
        VENTA = "VENTA", "Venta"
        PAGO_EMPLEADO = "PAGO_EMPLEADO", "Pago empleado"

    fecha = models.DateField(default=timezone.now)
    tipo = models.CharField(max_length=10, choices=Tipo.choices)
    origen = models.CharField(max_length=20, choices=Origen.choices, default=Origen.MANUAL)
    monto = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("0"))
    descripcion = models.CharField(max_length=255, blank=True)
    compra = models.OneToOneField(
        "compras.Compra",
        on_delete=models.CASCADE,
        related_name="movimiento_financiero",
        null=True,
        blank=True,
    )
    venta = models.OneToOneField(
        "ventas.Venta",
        on_delete=models.CASCADE,
        related_name="movimiento_financiero",
        null=True,
        blank=True,
    )
    referencia_extra = models.CharField(max_length=100, blank=True)

    class Meta:
        ordering = ["-fecha", "-id"]
        verbose_name = "movimiento financiero"
        verbose_name_plural = "movimientos financieros"

    def __str__(self) -> str:
        return f"{self.get_tipo_display()} - {self.monto} ({self.get_origen_display()})"