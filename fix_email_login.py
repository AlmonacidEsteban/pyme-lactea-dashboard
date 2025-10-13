#!/usr/bin/env python
import os
import sys
import django

# Configurar Django
sys.path.append('backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from authentication.models import User

def create_working_users():
    """
    Crear usuarios que funcionen con el sistema de autenticación por email
    """
    
    print("🔧 CREANDO USUARIOS PARA AUTENTICACIÓN POR EMAIL...")
    print("=" * 60)
    
    # Usuario 1: Tu email
    try:
        # Eliminar si existe
        try:
            User.objects.get(email='estebana311@gmail.com').delete()
        except User.DoesNotExist:
            pass
        
        user1 = User.objects.create_user(
            username='esteban_admin',  # Username único
            email='estebana311@gmail.com',  # Email para login
            password='123456',
            first_name='Esteban',
            last_name='Almonacid'
        )
        user1.is_staff = True
        user1.is_superuser = True
        user1.save()
        
        print("✅ USUARIO 1 CREADO:")
        print(f"   📧 Email (para login): estebana311@gmail.com")
        print(f"   🔑 Contraseña: 123456")
        print()
        
    except Exception as e:
        print(f"❌ Error creando usuario 1: {e}")
    
    # Usuario 2: Admin simple
    try:
        # Eliminar si existe
        try:
            User.objects.get(email='admin@test.com').delete()
        except User.DoesNotExist:
            pass
        
        user2 = User.objects.create_user(
            username='admin_user',
            email='admin@test.com',
            password='admin123',
            first_name='Admin',
            last_name='User'
        )
        user2.is_staff = True
        user2.is_superuser = True
        user2.save()
        
        print("✅ USUARIO 2 CREADO:")
        print(f"   📧 Email (para login): admin@test.com")
        print(f"   🔑 Contraseña: admin123")
        print()
        
    except Exception as e:
        print(f"❌ Error creando usuario 2: {e}")
    
    # Usuario 3: Test súper simple
    try:
        # Eliminar si existe
        try:
            User.objects.get(email='test@test.com').delete()
        except User.DoesNotExist:
            pass
        
        user3 = User.objects.create_user(
            username='test_user',
            email='test@test.com',
            password='test',
            first_name='Test',
            last_name='User'
        )
        user3.is_staff = True
        user3.is_superuser = True
        user3.save()
        
        print("✅ USUARIO 3 CREADO:")
        print(f"   📧 Email (para login): test@test.com")
        print(f"   🔑 Contraseña: test")
        print()
        
    except Exception as e:
        print(f"❌ Error creando usuario 3: {e}")

def show_instructions():
    print("🎯 INSTRUCCIONES PARA LOGIN:")
    print("=" * 60)
    print("⚠️  IMPORTANTE: Este sistema usa EMAIL para login, no username!")
    print()
    print("🌐 Ve a: http://127.0.0.1:8000/admin/")
    print()
    print("📝 En el formulario de login:")
    print("   - Campo 'Username': Escribe el EMAIL completo")
    print("   - Campo 'Password': Escribe la contraseña")
    print()
    print("🔑 OPCIONES DISPONIBLES:")
    print()
    print("OPCIÓN 1 (Tu email):")
    print("   Username: estebana311@gmail.com")
    print("   Password: 123456")
    print()
    print("OPCIÓN 2 (Admin):")
    print("   Username: admin@test.com")
    print("   Password: admin123")
    print()
    print("OPCIÓN 3 (Test):")
    print("   Username: test@test.com")
    print("   Password: test")
    print()
    print("=" * 60)

if __name__ == "__main__":
    create_working_users()
    show_instructions()