"""
Sistema de permisos personalizados para el módulo de compras.
Define roles específicos: Admin y Operador con diferentes niveles de acceso.
"""

from rest_framework import permissions
from django.contrib.auth.models import Group
from django.core.exceptions import PermissionDenied


class ComprasBasePermission(permissions.BasePermission):
    """Permiso base para el módulo de compras"""
    
    def has_permission(self, request, view):
        # El usuario debe estar autenticado
        if not request.user or not request.user.is_authenticated:
            return False
        
        # Los superusuarios tienen acceso completo
        if request.user.is_superuser:
            return True
        
        # Verificar si el usuario pertenece a algún grupo de compras
        grupos_compras = ['Compras Admin', 'Compras Operador']
        user_groups = request.user.groups.values_list('name', flat=True)
        
        return any(grupo in user_groups for grupo in grupos_compras)


class ComprasAdminPermission(ComprasBasePermission):
    """Permisos para administradores de compras"""
    
    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False
        
        # Solo admins de compras o superusuarios
        return (
            request.user.is_superuser or 
            request.user.groups.filter(name='Compras Admin').exists()
        )


class ComprasOperadorPermission(ComprasBasePermission):
    """Permisos para operadores de compras"""
    
    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False
        
        # Operadores pueden ver y crear, pero no eliminar
        if request.method in ['DELETE']:
            return (
                request.user.is_superuser or 
                request.user.groups.filter(name='Compras Admin').exists()
            )
        
        return True


class OrdenCompraPermission(ComprasBasePermission):
    """Permisos específicos para órdenes de compra"""
    
    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False
        
        # Verificar permisos por acción
        action = getattr(view, 'action', None)
        
        # Solo admins pueden eliminar órdenes
        if action == 'destroy':
            return (
                request.user.is_superuser or 
                request.user.groups.filter(name='Compras Admin').exists()
            )
        
        # Solo admins pueden enviar órdenes
        if action == 'enviar':
            return (
                request.user.is_superuser or 
                request.user.groups.filter(name='Compras Admin').exists()
            )
        
        # Operadores pueden crear y editar borradores
        if action in ['create', 'update', 'partial_update']:
            return True
        
        # Todos pueden ver
        if action in ['list', 'retrieve']:
            return True
        
        return False
    
    def has_object_permission(self, request, view, obj):
        if not self.has_permission(request, view):
            return False
        
        # Los admins pueden editar cualquier orden
        if (request.user.is_superuser or 
            request.user.groups.filter(name='Compras Admin').exists()):
            return True
        
        # Los operadores solo pueden editar órdenes en borrador
        if request.method in ['PUT', 'PATCH']:
            return obj.estado == 'borrador'
        
        # Todos pueden ver
        if request.method in ['GET']:
            return True
        
        return False


class MovimientoStockPermission(ComprasBasePermission):
    """Permisos para movimientos de stock"""
    
    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False
        
        action = getattr(view, 'action', None)
        
        # Solo admins pueden hacer ajustes de inventario
        if action == 'ajuste_inventario':
            return (
                request.user.is_superuser or 
                request.user.groups.filter(name='Compras Admin').exists()
            )
        
        # Solo lectura para operadores en movimientos
        if request.method in ['POST', 'PUT', 'PATCH', 'DELETE']:
            return (
                request.user.is_superuser or 
                request.user.groups.filter(name='Compras Admin').exists()
            )
        
        return True


class AlertaStockPermission(ComprasBasePermission):
    """Permisos para alertas de stock"""
    
    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False
        
        action = getattr(view, 'action', None)
        
        # Solo admins pueden generar alertas masivamente
        if action == 'generar_stock_minimo':
            return (
                request.user.is_superuser or 
                request.user.groups.filter(name='Compras Admin').exists()
            )
        
        # Operadores pueden marcar como vista y resolver
        if action in ['marcar_vista', 'resolver']:
            return True
        
        # Solo lectura para crear/eliminar alertas
        if request.method in ['POST', 'DELETE']:
            return (
                request.user.is_superuser or 
                request.user.groups.filter(name='Compras Admin').exists()
            )
        
        return True


class ReportesComprasPermission(ComprasBasePermission):
    """Permisos para reportes de compras"""
    
    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False
        
        # Todos los usuarios de compras pueden ver reportes
        return True


# Decorador para auditoría
def audit_action(action_type):
    """Decorador para registrar acciones de auditoría"""
    def decorator(func):
        def wrapper(self, request, *args, **kwargs):
            # Registrar la acción antes de ejecutarla
            user_id = request.user.id if request.user.is_authenticated else None
            
            # Aquí se podría implementar un sistema de auditoría más completo
            # Por ahora, solo registramos en logs
            import logging
            logger = logging.getLogger('compras.audit')
            logger.info(
                f'Acción: {action_type} | Usuario: {user_id} | '
                f'IP: {request.META.get("REMOTE_ADDR")} | '
                f'Timestamp: {timezone.now()}'
            )
            
            return func(self, request, *args, **kwargs)
        return wrapper
    return decorator


# Funciones auxiliares para verificar roles
def is_compras_admin(user):
    """Verifica si el usuario es admin de compras"""
    return (
        user.is_superuser or 
        user.groups.filter(name='Compras Admin').exists()
    )


def is_compras_operador(user):
    """Verifica si el usuario es operador de compras"""
    return user.groups.filter(name='Compras Operador').exists()


def has_compras_access(user):
    """Verifica si el usuario tiene acceso al módulo de compras"""
    return (
        user.is_superuser or 
        user.groups.filter(name__in=['Compras Admin', 'Compras Operador']).exists()
    )


# Middleware para auditoría (opcional)
class ComprasAuditMiddleware:
    """Middleware para registrar todas las acciones en el módulo de compras"""
    
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        # Procesar request antes de la vista
        if request.path.startswith('/api/compras/'):
            self.log_request(request)
        
        response = self.get_response(request)
        
        # Procesar response después de la vista
        if request.path.startswith('/api/compras/'):
            self.log_response(request, response)
        
        return response
    
    def log_request(self, request):
        """Registra la solicitud entrante"""
        import logging
        logger = logging.getLogger('compras.audit')
        
        user_id = request.user.id if request.user.is_authenticated else 'Anonymous'
        logger.info(
            f'REQUEST | Usuario: {user_id} | Método: {request.method} | '
            f'Path: {request.path} | IP: {request.META.get("REMOTE_ADDR")}'
        )
    
    def log_response(self, request, response):
        """Registra la respuesta saliente"""
        import logging
        logger = logging.getLogger('compras.audit')
        
        user_id = request.user.id if request.user.is_authenticated else 'Anonymous'
        logger.info(
            f'RESPONSE | Usuario: {user_id} | Status: {response.status_code} | '
            f'Path: {request.path}'
        )