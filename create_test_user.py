#!/usr/bin/env python3
"""
Script para crear un usuario de prueba específico para probar el flujo frontend
"""

import requests
import json

# Configuración
BASE_URL = "http://127.0.0.1:8000"
REGISTER_URL = f"{BASE_URL}/api/auth/register/"

def create_frontend_test_user():
    """Crea un usuario específico para probar desde el frontend"""
    
    # Datos del usuario de prueba para frontend
    test_user_data = {
        "username": "frontend_test",
        "first_name": "Frontend",
        "last_name": "Test User",
        "email": "frontend.test@lacteos.com",
        "phone": "9876543210",
        "company_name": "Lácteos Frontend Test",
        "company_type": "dairy",
        "password": "FrontendTest2024!",
        "password_confirm": "FrontendTest2024!"
    }
    
    print("🧪 Creando usuario de prueba para frontend...")
    print(f"📧 Email: {test_user_data['email']}")
    print(f"👤 Username: {test_user_data['username']}")
    print(f"🏢 Empresa: {test_user_data['company_name']}")
    print(f"🔑 Password: {test_user_data['password']}")
    
    try:
        # Realizar petición de registro
        response = requests.post(
            REGISTER_URL,
            json=test_user_data,
            headers={'Content-Type': 'application/json'}
        )
        
        print(f"\n📡 Status Code: {response.status_code}")
        
        if response.status_code == 201:
            print("✅ ¡Usuario de prueba creado exitosamente!")
            response_data = response.json()
            print(f"👤 Usuario creado: {response_data.get('user', {}).get('username')}")
            
            print("\n" + "="*50)
            print("🎯 CREDENCIALES PARA PROBAR EN EL FRONTEND:")
            print("="*50)
            print(f"📧 Email/Identificador: {test_user_data['email']}")
            print(f"🔑 Contraseña: {test_user_data['password']}")
            print("="*50)
            print("\n📝 Instrucciones:")
            print("1. Ve a http://localhost:3001")
            print("2. La página debería mostrar el formulario de registro por defecto")
            print("3. Puedes registrar un nuevo usuario o cambiar a login")
            print("4. Para login, usa las credenciales mostradas arriba")
            print("5. Después del login exitoso, deberías ser redirigido al dashboard")
            
            return True
            
        elif response.status_code == 400:
            print("❌ Error en los datos del registro:")
            error_data = response.json()
            for field, errors in error_data.items():
                print(f"  - {field}: {errors}")
            
            # Si el usuario ya existe, mostrar las credenciales
            if 'username' in error_data and 'already exists' in str(error_data['username']):
                print("\n⚠️ El usuario ya existe. Puedes usar estas credenciales:")
                print("="*50)
                print(f"📧 Email/Identificador: {test_user_data['email']}")
                print(f"🔑 Contraseña: {test_user_data['password']}")
                print("="*50)
                return True
            
            return False
            
        else:
            print(f"❌ Error inesperado: {response.status_code}")
            print(f"Respuesta: {response.text}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Error: No se puede conectar al servidor backend")
        print("   Asegúrate de que el servidor Django esté ejecutándose en http://127.0.0.1:8000")
        return False
        
    except Exception as e:
        print(f"❌ Error inesperado: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Creando usuario de prueba para frontend...")
    print("=" * 60)
    
    success = create_frontend_test_user()
    
    if success:
        print("\n🎉 ¡Usuario de prueba listo!")
        print("✅ Ahora puedes probar el flujo completo en el frontend")
    else:
        print("\n❌ No se pudo crear el usuario de prueba")
    
    print("\n" + "=" * 60)
    print("🏁 Proceso completado")