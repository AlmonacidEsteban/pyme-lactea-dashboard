#!/usr/bin/env python
import os
import sys
import django

# Configurar Django
sys.path.append('backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from authentication.models import User

def check_users():
    users = User.objects.all()
    print(f"🔍 Usuarios encontrados: {users.count()}")
    print("=" * 50)
    
    if users.count() == 0:
        print("❌ No hay usuarios registrados en la base de datos local.")
        print("\n💡 Opciones:")
        print("1. Registrar un nuevo usuario desde el frontend")
        print("2. Crear un superusuario desde la terminal")
        return False
    
    print("✅ Usuarios existentes:")
    for i, user in enumerate(users[:10], 1):
        print(f"{i}. Usuario: {user.username}")
        print(f"   Email: {user.email}")
        print(f"   Nombre: {user.first_name} {user.last_name}")
        print(f"   Activo: {'✅' if user.is_active else '❌'}")
        print(f"   Superusuario: {'✅' if user.is_superuser else '❌'}")
        print("-" * 30)
    
    return True

if __name__ == "__main__":
    check_users()