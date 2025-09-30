from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _
from .models import User, UserProfile


class UserProfileInline(admin.StackedInline):
    """
    Inline para mostrar el perfil del usuario en el admin
    """
    model = UserProfile
    can_delete = False
    verbose_name_plural = 'Perfil'
    fk_name = 'user'


class UserAdmin(BaseUserAdmin):
    """
    Administración personalizada para el modelo User
    """
    inlines = (UserProfileInline,)
    
    # Campos a mostrar en la lista
    list_display = (
        'email', 'username', 'first_name', 'last_name',
        'company_name', 'company_type', 'is_verified',
        'is_active', 'is_staff', 'date_joined'
    )
    
    # Campos por los que se puede filtrar
    list_filter = (
        'is_active', 'is_staff', 'is_superuser', 'is_verified',
        'company_type', 'date_joined', 'last_login'
    )
    
    # Campos de búsqueda
    search_fields = (
        'email', 'username', 'first_name', 'last_name',
        'company_name', 'phone_number'
    )
    
    # Ordenamiento
    ordering = ('-date_joined',)
    
    # Campos de solo lectura
    readonly_fields = ('date_joined', 'last_login', 'created_at', 'updated_at')
    
    # Configuración de fieldsets para el formulario de edición
    fieldsets = (
        (None, {
            'fields': ('username', 'password')
        }),
        (_('Información Personal'), {
            'fields': (
                'first_name', 'last_name', 'email', 'phone_number',
                'profile_picture'
            )
        }),
        (_('Información de la Empresa'), {
            'fields': ('company_name', 'company_type', 'position')
        }),
        (_('Permisos'), {
            'fields': (
                'is_active', 'is_staff', 'is_superuser', 'is_verified',
                'groups', 'user_permissions'
            ),
        }),
        (_('Fechas Importantes'), {
            'fields': ('last_login', 'date_joined', 'created_at', 'updated_at')
        }),
    )
    
    # Configuración para agregar usuario
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': (
                'username', 'email', 'first_name', 'last_name',
                'password1', 'password2', 'company_name', 'company_type'
            ),
        }),
    )
    
    def get_inline_instances(self, request, obj=None):
        if not obj:
            return list()
        return super(UserAdmin, self).get_inline_instances(request, obj)


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    """
    Administración para el modelo UserProfile
    """
    list_display = (
        'user', 'company_city', 'company_country',
        'timezone', 'language', 'currency'
    )
    
    list_filter = (
        'company_country', 'company_state', 'timezone',
        'language', 'currency', 'email_notifications', 'sms_notifications'
    )
    
    search_fields = (
        'user__email', 'user__first_name', 'user__last_name',
        'company_address', 'company_city', 'tax_id'
    )
    
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        (_('Usuario'), {
            'fields': ('user',)
        }),
        (_('Dirección de la Empresa'), {
            'fields': (
                'company_address', 'company_city', 'company_state',
                'company_country', 'company_postal_code'
            )
        }),
        (_('Información Fiscal'), {
            'fields': ('tax_id', 'website')
        }),
        (_('Configuraciones'), {
            'fields': ('timezone', 'language', 'currency')
        }),
        (_('Notificaciones'), {
            'fields': ('email_notifications', 'sms_notifications')
        }),
        (_('Fechas'), {
            'fields': ('created_at', 'updated_at')
        }),
    )


# Registrar el modelo User con la configuración personalizada
admin.site.register(User, UserAdmin)
