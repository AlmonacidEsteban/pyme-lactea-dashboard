from django.db import models
from django.utils import timezone
from decimal import Decimal


class Rubro(models.Model):
    """
    Modelo para almacenar los diferentes rubros/tipos de negocio de los clientes.
    Permite categorizar clientes de forma dinámica (ej: Fábrica de Pasta, Supermercado, Kiosco, etc.)
    """
    nombre = models.CharField(max_length=100, unique=True)
    descripcion = models.TextField(blank=True, help_text="Descripción opcional del rubro")
    activo = models.BooleanField(default=True)
    fecha_creacion = models.DateTimeField(default=timezone.now)
    
    class Meta:
        ordering = ['nombre']
        verbose_name = 'Rubro'
        verbose_name_plural = 'Rubros'
    
    def __str__(self):
        return self.nombre

class Cliente(models.Model):
    TIPO_CHOICES = [
        ('minorista', 'Minorista'),
        ('mayorista', 'Mayorista'),
        ('distribuidor', 'Distribuidor'),
    ]
    
    # Información básica
    nombre = models.CharField(max_length=100)
    identificacion = models.CharField(max_length=20)  # Removido unique=True para permitir sucursales
    direccion = models.CharField(max_length=200, blank=True)
    telefono = models.CharField(max_length=20, blank=True)
    correo = models.EmailField(blank=True)
    
    # Información comercial
    zona = models.CharField(max_length=100, blank=True)
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES, default='minorista')
    limite_credito = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    rubro = models.ForeignKey(Rubro, on_delete=models.SET_NULL, null=True, blank=True, 
                             help_text="Tipo de negocio del cliente (ej: Supermercado, Kiosco, Fábrica)")
    activo = models.BooleanField(default=True)
    
    # Fechas
    fecha_creacion = models.DateTimeField(default=timezone.now)
    fecha_actualizacion = models.DateTimeField(auto_now=True)
    ultima_compra = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['nombre']
        verbose_name = 'Cliente'
        verbose_name_plural = 'Clientes'

    def __str__(self):
        return self.nombre
    
    @property
    def deuda(self):
        """
        Calcula la deuda del cliente:
        total de ventas a crédito - total de pagos.
        """
        try:
            total_ventas = sum(v.total for v in self.ventas.filter(metodo_pago='credito'))
            total_pagos = sum(p.monto for p in self.pagos.all())
            return max(0, total_ventas - total_pagos)
        except:
            return 0
    
    @property
    def promedio_pedido(self):
        """
        Calcula el promedio de pedidos del cliente.
        """
        try:
            ventas = self.ventas.all()
            if ventas.exists():
                return sum(v.total for v in ventas) / ventas.count()
            return 0
        except:
            return 0
    
    @property
    def saldo(self):
        """
        Calcula el saldo del cliente (alias para deuda para compatibilidad).
        """
        return self.deuda