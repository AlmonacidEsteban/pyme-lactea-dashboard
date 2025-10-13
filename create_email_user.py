#!/usr/bin/env python
import os
import sys
import django

# Configurar Django
sys.path.append('backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from authentication.models import User

def create_email_based_user():
    try:
        email = 'estebana311@gmail.com'
        
        # Eliminar usuario si existe
        try:
            existing_user = User.objects.get(username=email)
            existing_user.delete()
            print(f"🗑️ Usuario anterior con email {email} eliminado")
        except User.DoesNotExist:
            pass
        
        # Crear usuario usando el email como username
        user = User.objects.create_user(
            username=email,  # Usar email como username
            email=email,
            password='123456',
            first_name='Esteban',
            last_name='Almonacid'
        )
        user.is_staff = True
        user.is_superuser = True
        user.save()
        
        print("✅ USUARIO CREADO CON EMAIL COMO USERNAME")
        print("=" * 50)
        print(f"📧 Usuario (email): {email}")
        print("🔑 Contraseña: 123456")
        print("=" * 50)
        print("🌐 URL Admin: http://127.0.0.1:8000/admin/")
        print("\n💡 INSTRUCCIONES:")
        print("1. Ve al admin de Django")
        print("2. En 'Username' escribe: estebana311@gmail.com")
        print("3. En 'Password' escribe: 123456")
        print("4. Haz clic en 'Log in'")
        
    except Exception as e:
        print(f"❌ Error: {e}")

def create_simple_alternatives():
    """Crear usuarios alternativos súper simples"""
    try:
        # Usuario 1: admin simple
        try:
            User.objects.get(username='admin').delete()
        except User.DoesNotExist:
            pass
            
        admin = User.objects.create_user(
            username='admin',
            email='admin@test.com',
            password='admin'
        )
        admin.is_staff = True
        admin.is_superuser = True
        admin.save()
        
        # Usuario 2: test simple
        try:
            User.objects.get(username='test').delete()
        except User.DoesNotExist:
            pass
            
        test = User.objects.create_user(
            username='test',
            email='test@test.com',
            password='test'
        )
        test.is_staff = True
        test.is_superuser = True
        test.save()
        
        print("\n✅ USUARIOS ALTERNATIVOS CREADOS:")
        print("Opción 1 - Usuario: admin, Contraseña: admin")
        print("Opción 2 - Usuario: test, Contraseña: test")
        
    except Exception as e:
        print(f"❌ Error creando alternativos: {e}")

if __name__ == "__main__":
    print("🔧 CREANDO USUARIO CON EMAIL...")
    print()
    
    create_email_based_user()
    create_simple_alternatives()
    
    print("\n🎯 RESUMEN DE OPCIONES PARA LOGIN:")
    print("=" * 50)
    print("OPCIÓN 1 (Tu email):")
    print("  Usuario: estebana311@gmail.com")
    print("  Contraseña: 123456")
    print()
    print("OPCIÓN 2 (Simple):")
    print("  Usuario: admin")
    print("  Contraseña: admin")
    print()
    print("OPCIÓN 3 (Más simple):")
    print("  Usuario: test")
    print("  Contraseña: test")
    print("=" * 50)