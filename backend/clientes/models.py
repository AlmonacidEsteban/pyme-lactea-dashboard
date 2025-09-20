from django.db import models

class Cliente(models.Model):
    nombre = models.CharField(max_length=100)                  # Nombre completo del cliente
    identificacion = models.CharField(max_length=20, unique=True)  # CUIT/DNI, único
    direccion = models.CharField(max_length=200, blank=True)
    telefono = models.CharField(max_length=20, blank=True)
    correo = models.EmailField(blank=True)

    def __str__(self):
        return self.nombre
    @property
    def saldo(self):
        """
        Calcula el saldo del cliente:
        total de ventas - total de pagos.
        (Esto se ajusta cuando creemos modelos de Ventas y Pagos)
        """
        total_ventas = sum(v.total for v in self.ventas.all())
        total_pagos = sum(p.monto for p in self.pagos.all())
        return total_ventas - total_pagos