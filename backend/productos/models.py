from decimal import Decimal

from django.core.validators import MinValueValidator
from django.db import models


class Marca(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    activo = models.BooleanField(default=True)
    
    class Meta:
        ordering = ["nombre"]
        verbose_name = "marca"
        verbose_name_plural = "marcas"
    
    def __str__(self):
        return self.nombre


class Categoria(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    activo = models.BooleanField(default=True)
    
    class Meta:
        ordering = ["nombre"]
        verbose_name = "categoría"
        verbose_name_plural = "categorías"
    
    def __str__(self):
        return self.nombre


class Producto(models.Model):
    UNIDADES_CHOICES = [
        ('kg', 'Kilogramos'),
        ('u', 'Unidades'),
        ('l', 'Litros'),
        ('m', 'Metros'),
        ('m2', 'Metros cuadrados'),
        ('m3', 'Metros cúbicos'),
        ('caja', 'Cajas'),
        ('paquete', 'Paquetes'),
    ]
    
    marca = models.ForeignKey(Marca, on_delete=models.PROTECT, null=True, blank=True)
    categoria = models.ForeignKey(Categoria, on_delete=models.PROTECT, null=True, blank=True)
    nombre = models.CharField(max_length=120)
    sku = models.CharField(max_length=50, unique=True, blank=True)
    descripcion = models.TextField(blank=True)
    unidad = models.CharField(max_length=20, choices=UNIDADES_CHOICES, default='u')
    precio = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=Decimal("0"),
        validators=[MinValueValidator(0)],
    )
    stock = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=Decimal("0"),
        validators=[MinValueValidator(0)],
        help_text="Stock actual (currentStock)"
    )
    min_stock = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=Decimal("0"),
        validators=[MinValueValidator(0)],
        help_text="Stock mínimo para alertas"
    )
    avg_cost = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=Decimal("0"),
        validators=[MinValueValidator(0)],
        help_text="Costo promedio móvil"
    )
    activo = models.BooleanField(default=True)
    is_demo = models.BooleanField(default=False, help_text="Marca si es dato de demostración")

    class Meta:
        ordering = ["nombre"]
        verbose_name = "producto"
        verbose_name_plural = "productos"

    def __str__(self) -> str:
        display = self.nombre
        if self.sku:
            display = f"{self.nombre} ({self.sku})"
        return display

    def _normalizar_cantidad(self, cantidad) -> Decimal:
        if cantidad is None:
            raise ValueError("Debes indicar una cantidad válida")
        if not isinstance(cantidad, Decimal):
            cantidad = Decimal(str(cantidad))
        if cantidad <= 0:
            raise ValueError("La cantidad debe ser positiva")
        return cantidad

    def agregar_stock(self, cantidad) -> None:
        cantidad = self._normalizar_cantidad(cantidad)
        self.stock += cantidad
        self.save(update_fields=["stock"])

    def quitar_stock(self, cantidad) -> None:
        cantidad = self._normalizar_cantidad(cantidad)
        if cantidad > self.stock:
            raise ValueError("La cantidad supera el stock disponible")
        self.stock -= cantidad
        self.save(update_fields=["stock"])