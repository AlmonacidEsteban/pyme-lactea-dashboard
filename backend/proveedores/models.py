from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone


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
    # Relación Many-to-Many con productos que vende este proveedor
    productos = models.ManyToManyField(
        'productos.Producto',
        blank=True,
        related_name='proveedores',
        help_text="Productos que vende este proveedor"
    )
    is_demo = models.BooleanField(default=False, help_text="Marca si es dato de demostración")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["nombre"]
        verbose_name = "proveedor"
        verbose_name_plural = "proveedores"

    def __str__(self) -> str:
        return self.nombre


class CuentaPorPagar(models.Model):
    ESTADO_CHOICES = [
        ('pending', 'Pendiente'),
        ('urgent', 'Urgente'),
        ('overdue', 'Vencido'),
        ('paid', 'Pagado'),
    ]
    
    proveedor = models.ForeignKey(Proveedor, on_delete=models.CASCADE, related_name='cuentas_por_pagar')
    monto = models.DecimalField(max_digits=12, decimal_places=2)
    fecha_vencimiento = models.DateField()
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_pago = models.DateTimeField(null=True, blank=True)
    estado = models.CharField(max_length=10, choices=ESTADO_CHOICES, default='pending')
    descripcion = models.CharField(max_length=200, blank=True)
    numero_factura = models.CharField(max_length=50, blank=True)
    # orden_compra = models.ForeignKey('compras.OrdenCompra', on_delete=models.SET_NULL, null=True, blank=True)
    is_demo = models.BooleanField(default=False, help_text="Marca si es dato de demostración")
    
    class Meta:
        ordering = ['fecha_vencimiento', '-fecha_creacion']
        verbose_name = "Cuenta por Pagar"
        verbose_name_plural = "Cuentas por Pagar"
    
    def __str__(self):
        return f"{self.proveedor.nombre} - ${self.monto} - {self.fecha_vencimiento}"
    
    @property
    def dias_restantes(self):
        """Calcula los días restantes hasta el vencimiento"""
        if self.estado == 'paid':
            return None
        
        hoy = timezone.now().date()
        diferencia = (self.fecha_vencimiento - hoy).days
        return diferencia
    
    @property
    def estado_calculado(self):
        """Calcula el estado basado en los días restantes"""
        if self.estado == 'paid':
            return 'paid'
        
        dias = self.dias_restantes
        if dias < 0:
            return 'overdue'
        elif dias <= 3:
            return 'urgent'
        else:
            return 'pending'
    
    def save(self, *args, **kwargs):
        # Actualizar estado automáticamente si no está pagado
        if self.estado != 'paid':
            self.estado = self.estado_calculado
        super().save(*args, **kwargs)