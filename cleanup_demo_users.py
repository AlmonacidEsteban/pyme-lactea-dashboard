#!/usr/bin/env python
import os
import sys
import django

# Configurar Django
sys.path.append('backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from authentication.models import User

def cleanup_demo_users():
    """Eliminar todas las cuentas demo y usuarios de prueba"""
    
    print("🧹 LIMPIANDO CUENTAS DEMO Y USUARIOS DE PRUEBA")
    print("=" * 60)
    
    # Lista de usuarios a eliminar
    users_to_delete = [
        'demo_restaurant',
        'demo_retail', 
        'demo_services',
        'testuser9',
        'testeruser',
        'testuser8'
    ]
    
    deleted_count = 0
    
    for username in users_to_delete:
        try:
            user = User.objects.get(username=username)
            email = user.email
            print(f"🗑️  Eliminando: {username} ({email})")
            user.delete()
            deleted_count += 1
            print(f"   ✅ Eliminado exitosamente")
        except User.DoesNotExist:
            print(f"   ⚠️  Usuario '{username}' no encontrado")
        except Exception as e:
            print(f"   ❌ Error eliminando '{username}': {e}")
    
    print("\n" + "=" * 60)
    print(f"📊 RESUMEN: {deleted_count} usuarios eliminados")
    
    return deleted_count

def show_remaining_users():
    """Mostrar usuarios que quedan en el sistema"""
    
    print("\n👥 USUARIOS RESTANTES EN EL SISTEMA:")
    print("=" * 40)
    
    users = User.objects.all().order_by('username')
    
    if users.exists():
        for i, user in enumerate(users, 1):
            status = "🔑 Admin" if user.is_superuser else "👤 Usuario"
            active = "✅ Activo" if user.is_active else "❌ Inactivo"
            
            print(f"{i}. {status} - {user.username}")
            print(f"   📧 Email: {user.email}")
            print(f"   📛 Nombre: {user.first_name} {user.last_name}")
            print(f"   🔄 Estado: {active}")
            print("   " + "-" * 30)
    else:
        print("❌ No hay usuarios en el sistema")
    
    print(f"\n📈 Total de usuarios: {users.count()}")

def verify_admin_exists():
    """Verificar que existe al menos un usuario administrador"""
    
    admin_users = User.objects.filter(is_superuser=True)
    
    if admin_users.exists():
        print(f"\n✅ ADMINISTRADORES DISPONIBLES: {admin_users.count()}")
        for admin in admin_users:
            print(f"   🔑 {admin.username} ({admin.email})")
    else:
        print("\n⚠️  ADVERTENCIA: No hay usuarios administradores")
        print("   Se recomienda mantener al menos un admin para gestión")

if __name__ == "__main__":
    print("🔧 LIMPIEZA DE USUARIOS DEMO")
    print("Este script eliminará todas las cuentas demo y de prueba")
    print("=" * 60)
    
    # Mostrar usuarios actuales
    print("👥 USUARIOS ACTUALES:")
    current_users = User.objects.all()
    for user in current_users:
        print(f"   - {user.username} ({user.email})")
    
    print(f"\nTotal actual: {current_users.count()} usuarios")
    
    # Realizar limpieza
    deleted = cleanup_demo_users()
    
    # Mostrar usuarios restantes
    show_remaining_users()
    
    # Verificar administradores
    verify_admin_exists()
    
    print("\n🎉 LIMPIEZA COMPLETADA")
    print("💡 Ahora el sistema solo permitirá acceso mediante registro")