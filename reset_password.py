#!/usr/bin/env python
import os
import sys
import django

# Configurar Django
sys.path.append('backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from authentication.models import User

def reset_admin_password():
    try:
        # Buscar el usuario admin
        admin_user = User.objects.get(username='admin')
        
        # Nueva contraseña simple
        new_password = 'admin123'
        
        # Cambiar la contraseña
        admin_user.set_password(new_password)
        admin_user.save()
        
        print("✅ CONTRASEÑA RESETEADA EXITOSAMENTE")
        print("=" * 50)
        print(f"👤 Usuario: admin")
        print(f"🔑 Nueva contraseña: {new_password}")
        print(f"📧 Email: {admin_user.email}")
        print("=" * 50)
        print("🌐 Ahora puedes hacer login en: http://localhost:3001")
        
        return True
        
    except User.DoesNotExist:
        print("❌ Usuario 'admin' no encontrado")
        return False
    except Exception as e:
        print(f"❌ Error al resetear contraseña: {e}")
        return False

def reset_esteban_password():
    try:
        # Buscar el usuario Esteban
        esteban_user = User.objects.get(username='Esteban')
        
        # Nueva contraseña simple
        new_password = 'esteban123'
        
        # Cambiar la contraseña
        esteban_user.set_password(new_password)
        esteban_user.save()
        
        print("✅ CONTRASEÑA DE ESTEBAN RESETEADA")
        print("=" * 50)
        print(f"👤 Usuario: Esteban")
        print(f"🔑 Nueva contraseña: {new_password}")
        print(f"📧 Email: {esteban_user.email}")
        print("=" * 50)
        
        return True
        
    except User.DoesNotExist:
        print("❌ Usuario 'Esteban' no encontrado")
        return False
    except Exception as e:
        print(f"❌ Error al resetear contraseña de Esteban: {e}")
        return False

if __name__ == "__main__":
    print("🔧 RESETEANDO CONTRASEÑAS...")
    print()
    
    # Resetear admin
    reset_admin_password()
    print()
    
    # Resetear Esteban
    reset_esteban_password()
    
    print("\n💡 INSTRUCCIONES:")
    print("1. Ve a http://localhost:3001")
    print("2. Usa cualquiera de las credenciales de arriba")
    print("3. ¡Disfruta tu dashboard!")