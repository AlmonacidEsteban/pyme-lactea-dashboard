#!/usr/bin/env python
import os
import sys
import django

# Configurar Django
sys.path.append('backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from authentication.models import User

def create_simple_admin():
    try:
        # Intentar eliminar usuario test si existe
        try:
            test_user = User.objects.get(username='test')
            test_user.delete()
            print("🗑️ Usuario 'test' anterior eliminado")
        except User.DoesNotExist:
            pass
        
        # Crear nuevo superusuario con credenciales simples
        user = User.objects.create_user(
            username='test',
            email='test@test.com',
            password='test',
            first_name='Test',
            last_name='Admin'
        )
        user.is_staff = True
        user.is_superuser = True
        user.save()
        
        print("✅ NUEVO SUPERUSUARIO CREADO")
        print("=" * 40)
        print("👤 Usuario: test")
        print("🔑 Contraseña: test")
        print("📧 Email: test@test.com")
        print("=" * 40)
        print("🌐 URL Admin: http://127.0.0.1:8000/admin/")
        
    except Exception as e:
        print(f"❌ Error: {e}")

def reset_existing_passwords():
    try:
        # Resetear admin
        admin = User.objects.get(username='admin')
        admin.set_password('123')
        admin.save()
        print("✅ Contraseña de 'admin' reseteada a '123'")
        
        # Resetear Esteban
        esteban = User.objects.get(username='Esteban')
        esteban.set_password('123')
        esteban.save()
        print("✅ Contraseña de 'Esteban' reseteada a '123'")
        
    except Exception as e:
        print(f"❌ Error reseteando contraseñas: {e}")

if __name__ == "__main__":
    print("🔧 SOLUCIONANDO ACCESO AL ADMIN...")
    print()
    
    # Resetear contraseñas existentes
    reset_existing_passwords()
    print()
    
    # Crear usuario de prueba simple
    create_simple_admin()
    
    print("\n💡 OPCIONES PARA HACER LOGIN:")
    print("1. Usuario: admin, Contraseña: 123")
    print("2. Usuario: Esteban, Contraseña: 123") 
    print("3. Usuario: test, Contraseña: test")
    print("\n🌐 Ve a: http://127.0.0.1:8000/admin/")