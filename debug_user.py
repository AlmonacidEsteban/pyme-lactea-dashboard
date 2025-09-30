#!/usr/bin/env python3
import os
import sys
import django

# Configurar Django
sys.path.append('backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth import authenticate
from authentication.models import User

def debug_user():
    print("🔍 Verificando usuario testuser8...")
    
    try:
        user = User.objects.get(username='testuser8')
        print(f"✅ Usuario encontrado:")
        print(f"   - ID: {user.id}")
        print(f"   - Username: {user.username}")
        print(f"   - Email: {user.email}")
        print(f"   - Is Active: {user.is_active}")
        print(f"   - Password Hash: {user.password[:50]}...")
        print(f"   - Has Usable Password: {user.has_usable_password()}")
        
        # Probar autenticación directa
        print(f"\n🔐 Probando autenticación directa...")
        auth_result = authenticate(username='testuser8', password='testpassword123')
        print(f"   - Resultado: {auth_result}")
        
        # Probar check_password
        print(f"\n🔒 Probando check_password...")
        check_result = user.check_password('testpassword123')
        print(f"   - Resultado: {check_result}")
        
        # Probar con email
        print(f"\n📧 Probando autenticación con email...")
        auth_email_result = authenticate(username=user.username, password='testpassword123')
        print(f"   - Resultado: {auth_email_result}")
        
    except User.DoesNotExist:
        print("❌ Usuario testuser8 no encontrado")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    debug_user()