"""
Comando para configurar grupos y permisos iniciales del módulo de compras.
Crea los grupos 'Compras Admin' y 'Compras Operador' con sus respectivos permisos.
"""

from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from django.db import transaction


class Command(BaseCommand):
    help = 'Configura grupos y permisos iniciales para el módulo de compras'

    def add_arguments(self, parser):
        parser.add_argument(
            '--reset',
            action='store_true',
            help='Eliminar grupos existentes antes de crearlos'
        )

    def handle(self, *args, **options):
        reset = options.get('reset', False)

        try:
            with transaction.atomic():
                if reset:
                    self.stdout.write('Eliminando grupos existentes...')
                    Group.objects.filter(
                        name__in=['Compras Admin', 'Compras Operador']
                    ).delete()

                # Crear grupos
                admin_group = self.create_admin_group()
                operador_group = self.create_operador_group()

                # Asignar permisos
                self.assign_admin_permissions(admin_group)
                self.assign_operador_permissions(operador_group)

                self.stdout.write(
                    self.style.SUCCESS(
                        'Grupos y permisos configurados exitosamente:\n'
                        f'- {admin_group.name}: {admin_group.permissions.count()} permisos\n'
                        f'- {operador_group.name}: {operador_group.permissions.count()} permisos'
                    )
                )

        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error al configurar permisos: {str(e)}')
            )

    def create_admin_group(self):
        """Crea el grupo de administradores de compras"""
        group, created = Group.objects.get_or_create(
            name='Compras Admin'
        )
        
        if created:
            self.stdout.write(f'Grupo creado: {group.name}')
        else:
            self.stdout.write(f'Grupo existente: {group.name}')
        
        return group

    def create_operador_group(self):
        """Crea el grupo de operadores de compras"""
        group, created = Group.objects.get_or_create(
            name='Compras Operador'
        )
        
        if created:
            self.stdout.write(f'Grupo creado: {group.name}')
        else:
            self.stdout.write(f'Grupo existente: {group.name}')
        
        return group

    def assign_admin_permissions(self, group):
        """Asigna permisos completos a administradores"""
        # Obtener content types de los modelos de compras
        compras_models = [
            'ordencompra',
            'ordencompraitem', 
            'movimientostock',
            'historialprecios',
            'alertastock',
            'categoriacompra',
            'compra',
            'compralinea'
        ]

        permissions = []
        
        for model_name in compras_models:
            try:
                content_type = ContentType.objects.get(
                    app_label='compras',
                    model=model_name
                )
                
                # Permisos CRUD completos
                model_permissions = Permission.objects.filter(
                    content_type=content_type
                )
                permissions.extend(model_permissions)
                
            except ContentType.DoesNotExist:
                self.stdout.write(
                    self.style.WARNING(f'Modelo no encontrado: {model_name}')
                )

        # También permisos de productos relacionados
        try:
            producto_ct = ContentType.objects.get(
                app_label='productos',
                model='producto'
            )
            proveedor_ct = ContentType.objects.get(
                app_label='productos', 
                model='proveedor'
            )
            
            producto_permissions = Permission.objects.filter(
                content_type__in=[producto_ct, proveedor_ct]
            )
            permissions.extend(producto_permissions)
            
        except ContentType.DoesNotExist:
            self.stdout.write(
                self.style.WARNING('Modelos de productos no encontrados')
            )

        # Asignar todos los permisos al grupo admin
        group.permissions.set(permissions)
        
        self.stdout.write(
            f'Permisos asignados a {group.name}: {len(permissions)}'
        )

    def assign_operador_permissions(self, group):
        """Asigna permisos limitados a operadores"""
        # Modelos que los operadores pueden ver y editar (limitado)
        operador_models = [
            'ordencompra',
            'ordencompraitem',
            'alertastock',
            'categoriacompra',
            'compra',
            'compralinea'
        ]

        permissions = []
        
        for model_name in operador_models:
            try:
                content_type = ContentType.objects.get(
                    app_label='compras',
                    model=model_name
                )
                
                # Solo permisos de ver y agregar (no eliminar)
                model_permissions = Permission.objects.filter(
                    content_type=content_type,
                    codename__in=[
                        f'view_{model_name}',
                        f'add_{model_name}',
                        f'change_{model_name}'
                    ]
                )
                permissions.extend(model_permissions)
                
            except ContentType.DoesNotExist:
                self.stdout.write(
                    self.style.WARNING(f'Modelo no encontrado: {model_name}')
                )

        # Permisos de solo lectura para movimientos y historial
        readonly_models = ['movimientostock', 'historialprecios']
        
        for model_name in readonly_models:
            try:
                content_type = ContentType.objects.get(
                    app_label='compras',
                    model=model_name
                )
                
                # Solo permiso de ver
                view_permission = Permission.objects.filter(
                    content_type=content_type,
                    codename=f'view_{model_name}'
                )
                permissions.extend(view_permission)
                
            except ContentType.DoesNotExist:
                self.stdout.write(
                    self.style.WARNING(f'Modelo no encontrado: {model_name}')
                )

        # Permisos de lectura para productos
        try:
            producto_ct = ContentType.objects.get(
                app_label='productos',
                model='producto'
            )
            proveedor_ct = ContentType.objects.get(
                app_label='productos',
                model='proveedor'
            )
            
            readonly_permissions = Permission.objects.filter(
                content_type__in=[producto_ct, proveedor_ct],
                codename__startswith='view_'
            )
            permissions.extend(readonly_permissions)
            
        except ContentType.DoesNotExist:
            self.stdout.write(
                self.style.WARNING('Modelos de productos no encontrados')
            )

        # Asignar permisos limitados al grupo operador
        group.permissions.set(permissions)
        
        self.stdout.write(
            f'Permisos asignados a {group.name}: {len(permissions)}'
        )

    def create_custom_permissions(self):
        """Crea permisos personalizados adicionales"""
        custom_permissions = [
            ('can_approve_orders', 'Puede aprobar órdenes de compra'),
            ('can_receive_merchandise', 'Puede recibir mercadería'),
            ('can_adjust_inventory', 'Puede ajustar inventario'),
            ('can_generate_alerts', 'Puede generar alertas'),
            ('can_export_reports', 'Puede exportar reportes'),
            ('can_view_cost_analysis', 'Puede ver análisis de costos'),
        ]

        # Obtener content type de OrdenCompra para asociar permisos personalizados
        try:
            content_type = ContentType.objects.get(
                app_label='compras',
                model='ordencompra'
            )
            
            for codename, name in custom_permissions:
                permission, created = Permission.objects.get_or_create(
                    codename=codename,
                    name=name,
                    content_type=content_type
                )
                
                if created:
                    self.stdout.write(f'Permiso personalizado creado: {name}')
                    
        except ContentType.DoesNotExist:
            self.stdout.write(
                self.style.WARNING('No se pudieron crear permisos personalizados')
            )