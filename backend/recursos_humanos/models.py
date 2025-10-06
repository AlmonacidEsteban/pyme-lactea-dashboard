from django.db import models
from django.conf import settings
from django.utils import timezone


class Equipo(models.Model):
    """Modelo para representar equipos de trabajo"""
    TIPO_EQUIPO_CHOICES = [
        ('produccion', 'Producción'),
        ('logistica', 'Logística'),
        ('administracion', 'Administración'),
        ('ventas', 'Ventas'),
        ('calidad', 'Control de Calidad'),
        ('mantenimiento', 'Mantenimiento'),
    ]
    
    nombre = models.CharField(max_length=120)
    descripcion = models.TextField(blank=True)
    tipo = models.CharField(max_length=20, choices=TIPO_EQUIPO_CHOICES)
    activo = models.BooleanField(default=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_modificacion = models.DateTimeField(auto_now=True)
    creado_por = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="equipos_creados")
    lider = models.ForeignKey('Empleado', on_delete=models.SET_NULL, null=True, blank=True, related_name="equipos_liderados")
    
    class Meta:
        ordering = ["nombre"]
        verbose_name = "Equipo"
        verbose_name_plural = "Equipos"

    def __str__(self):
        return f"{self.nombre} ({self.get_tipo_display()})"


class Rol(models.Model):
    """Modelo para definir roles y permisos"""
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True)
    permisos = models.JSONField(default=dict, help_text="Permisos específicos del rol")
    activo = models.BooleanField(default=True)
    
    class Meta:
        ordering = ["nombre"]
        verbose_name = "Rol"
        verbose_name_plural = "Roles"

    def __str__(self):
        return self.nombre


class Empleado(models.Model):
    """Modelo extendido para empleados"""
    TURNO_CHOICES = [
        ('manana', 'Turno Mañana (6:00-14:00)'),
        ('tarde', 'Turno Tarde (14:00-22:00)'),
        ('noche', 'Turno Noche (22:00-6:00)'),
        ('completo', 'Tiempo Completo'),
        ('parcial', 'Tiempo Parcial'),
    ]
    
    nombre = models.CharField(max_length=120)
    apellido = models.CharField(max_length=120, default='')
    identificacion = models.CharField(max_length=40, unique=True)
    email = models.EmailField(blank=True)
    telefono = models.CharField(max_length=20, blank=True)
    puesto = models.CharField(max_length=120)
    equipo = models.ForeignKey(Equipo, on_delete=models.PROTECT, related_name="miembros", null=True, blank=True)
    rol = models.ForeignKey(Rol, on_delete=models.PROTECT, related_name="empleados", null=True, blank=True)
    turno = models.CharField(max_length=20, choices=TURNO_CHOICES, default='completo')
    salario_por_hora = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    fecha_ingreso = models.DateField(default=timezone.now)
    experiencia_anos = models.PositiveIntegerField(default=0)
    especialidad = models.CharField(max_length=200, blank=True)
    activo = models.BooleanField(default=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_modificacion = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ["apellido", "nombre"]
        verbose_name = "Empleado"
        verbose_name_plural = "Empleados"

    def __str__(self):
        return f"{self.nombre} {self.apellido}"
    
    @property
    def nombre_completo(self):
        return f"{self.nombre} {self.apellido}"


class PagoEmpleado(models.Model):
    empleado = models.ForeignKey(Empleado, on_delete=models.PROTECT, related_name="pagos")
    fecha = models.DateField(auto_now_add=True)
    monto = models.DecimalField(max_digits=12, decimal_places=2)
    concepto = models.CharField(max_length=200, blank=True)
    horas_trabajadas = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    aprobado_por = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="pagos_aprobados", null=True, blank=True)

    class Meta:
        ordering = ["-fecha", "-id"]
        verbose_name = "Pago de Empleado"
        verbose_name_plural = "Pagos de Empleados"

    def __str__(self):
        return f"Pago {self.monto} a {self.empleado.nombre_completo}"


class AuditoriaEquipo(models.Model):
    """Modelo para auditoría de cambios en equipos"""
    ACCION_CHOICES = [
        ('crear', 'Crear'),
        ('modificar', 'Modificar'),
        ('eliminar', 'Eliminar'),
        ('activar', 'Activar'),
        ('desactivar', 'Desactivar'),
    ]
    
    equipo = models.ForeignKey(Equipo, on_delete=models.CASCADE, related_name="auditoria")
    accion = models.CharField(max_length=20, choices=ACCION_CHOICES)
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    fecha = models.DateTimeField(auto_now_add=True)
    datos_anteriores = models.JSONField(null=True, blank=True)
    datos_nuevos = models.JSONField(null=True, blank=True)
    comentario = models.TextField(blank=True)
    
    class Meta:
        ordering = ["-fecha"]
        verbose_name = "Auditoría de Equipo"
        verbose_name_plural = "Auditorías de Equipos"

    def __str__(self):
        return f"{self.accion.title()} - {self.equipo.nombre} por {self.usuario.username}"


class AuditoriaEmpleado(models.Model):
    """Modelo para auditoría de cambios en empleados"""
    ACCION_CHOICES = [
        ('crear', 'Crear'),
        ('modificar', 'Modificar'),
        ('eliminar', 'Eliminar'),
        ('activar', 'Activar'),
        ('desactivar', 'Desactivar'),
        ('cambiar_equipo', 'Cambiar Equipo'),
        ('cambiar_rol', 'Cambiar Rol'),
    ]
    
    empleado = models.ForeignKey(Empleado, on_delete=models.CASCADE, related_name="auditoria")
    accion = models.CharField(max_length=20, choices=ACCION_CHOICES)
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    fecha = models.DateTimeField(auto_now_add=True)
    datos_anteriores = models.JSONField(null=True, blank=True)
    datos_nuevos = models.JSONField(null=True, blank=True)
    comentario = models.TextField(blank=True)
    
    class Meta:
        ordering = ["-fecha"]
        verbose_name = "Auditoría de Empleado"
        verbose_name_plural = "Auditorías de Empleados"

    def __str__(self):
        return f"{self.accion.title()} - {self.empleado.nombre_completo} por {self.usuario.username}"