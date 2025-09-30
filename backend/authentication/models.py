from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import RegexValidator


class User(AbstractUser):
    """
    Modelo de usuario personalizado para la aplicación Mi PyME
    """
    
    # Campos adicionales
    phone_regex = RegexValidator(
        regex=r'^\+?1?\d{9,15}$',
        message="El número de teléfono debe estar en formato: '+999999999'. Hasta 15 dígitos permitidos."
    )
    
    phone_number = models.CharField(
        validators=[phone_regex], 
        max_length=17, 
        blank=True,
        verbose_name="Número de teléfono"
    )
    
    company_name = models.CharField(
        max_length=200, 
        blank=True,
        verbose_name="Nombre de la empresa"
    )
    
    company_type = models.CharField(
        max_length=100,
        blank=True,
        verbose_name="Tipo de empresa"
    )
    
    position = models.CharField(
        max_length=100,
        blank=True,
        verbose_name="Cargo/Posición"
    )
    
    profile_picture = models.ImageField(
        upload_to='profile_pictures/',
        blank=True,
        null=True,
        verbose_name="Foto de perfil"
    )
    
    is_verified = models.BooleanField(
        default=False,
        verbose_name="Usuario verificado"
    )
    
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Fecha de creación"
    )
    
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name="Fecha de actualización"
    )
    
    # Configuración de campos únicos
    email = models.EmailField(unique=True, verbose_name="Correo electrónico")
    
    # Permitir login con email o username
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']
    
    class Meta:
        verbose_name = "Usuario"
        verbose_name_plural = "Usuarios"
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.get_full_name()} ({self.email})"
    
    def get_full_name(self):
        """Retorna el nombre completo del usuario"""
        return f"{self.first_name} {self.last_name}".strip()
    
    def get_short_name(self):
        """Retorna el primer nombre del usuario"""
        return self.first_name


class UserProfile(models.Model):
    """
    Perfil extendido del usuario con información adicional de la empresa
    """
    user = models.OneToOneField(
        User, 
        on_delete=models.CASCADE, 
        related_name='profile'
    )
    
    # Información de la empresa
    company_address = models.TextField(
        blank=True,
        verbose_name="Dirección de la empresa"
    )
    
    company_city = models.CharField(
        max_length=100,
        blank=True,
        verbose_name="Ciudad"
    )
    
    company_state = models.CharField(
        max_length=100,
        blank=True,
        verbose_name="Estado/Provincia"
    )
    
    company_country = models.CharField(
        max_length=100,
        blank=True,
        verbose_name="País"
    )
    
    company_postal_code = models.CharField(
        max_length=20,
        blank=True,
        verbose_name="Código postal"
    )
    
    tax_id = models.CharField(
        max_length=50,
        blank=True,
        verbose_name="ID fiscal/RUC/NIT"
    )
    
    website = models.URLField(
        blank=True,
        verbose_name="Sitio web"
    )
    
    # Configuraciones de la cuenta
    timezone = models.CharField(
        max_length=50,
        default='America/Lima',
        verbose_name="Zona horaria"
    )
    
    language = models.CharField(
        max_length=10,
        default='es',
        verbose_name="Idioma"
    )
    
    currency = models.CharField(
        max_length=10,
        default='PEN',
        verbose_name="Moneda"
    )
    
    # Configuraciones de notificaciones
    email_notifications = models.BooleanField(
        default=True,
        verbose_name="Notificaciones por email"
    )
    
    sms_notifications = models.BooleanField(
        default=False,
        verbose_name="Notificaciones por SMS"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Perfil de usuario"
        verbose_name_plural = "Perfiles de usuario"
    
    def __str__(self):
        return f"Perfil de {self.user.get_full_name()}"
