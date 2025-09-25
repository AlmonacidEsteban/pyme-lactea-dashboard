from django.db import models


class Proveedor(models.Model):
    nombre = models.CharField(max_length=120, unique=True)
    identificacion = models.CharField(max_length=30, blank=True)
    contacto = models.CharField(max_length=120, blank=True)
    telefono = models.CharField(max_length=30, blank=True)
    correo = models.EmailField(blank=True)
    direccion = models.CharField(max_length=200, blank=True)
    notas = models.TextField(blank=True)
    activo = models.BooleanField(default=True)

    class Meta:
        ordering = ["nombre"]
        verbose_name = "proveedor"
        verbose_name_plural = "proveedores"

    def __str__(self) -> str:
        return self.nombre