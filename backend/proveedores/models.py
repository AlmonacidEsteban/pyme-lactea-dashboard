from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


class Proveedor(models.Model):
    nombre = models.CharField(max_length=120, unique=True)
    identificacion = models.CharField(max_length=30, blank=True)
    contacto = models.CharField(max_length=120, blank=True)
    telefono = models.CharField(max_length=30, blank=True)
    correo = models.EmailField(blank=True)
    direccion = models.CharField(max_length=200, blank=True)
    confiabilidad = models.IntegerField(
        default=100,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        help_text="Confiabilidad del proveedor (0-100)"
    )
    dias_pago = models.IntegerField(
        default=30,
        validators=[MinValueValidator(0)],
        help_text="Días de plazo de pago"
    )
    notas = models.TextField(blank=True)
    activo = models.BooleanField(default=True)
    is_demo = models.BooleanField(default=False, help_text="Marca si es dato de demostración")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["nombre"]
        verbose_name = "proveedor"
        verbose_name_plural = "proveedores"

    def __str__(self) -> str:
        return self.nombre