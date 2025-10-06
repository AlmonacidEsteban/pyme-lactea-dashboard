#!/usr/bin/env python3
"""
Script para probar el sistema de registro de usuarios
"""

import requests
import json

# Configuración
BASE_URL = "http://127.0.0.1:8000"
REGISTER_URL = f"{BASE_URL}/api/auth/register/"

def test_user_registration():
    """Prueba el registro de un nuevo usuario"""
    
    # Datos del usuario de prueba
    test_user_data = {
        "username": "usuario_prueba",
        "first_name": "Usuario",
        "last_name": "De Prueba",
        "email": "usuario.prueba@test.com",
        "phone": "1234567890",
        "company_name": "Lácteos Prueba S.A.",
        "company_type": "dairy",
        "password": "MiContraseñaSegura2024!",
        "password_confirm": "MiContraseñaSegura2024!"
    }
    
    print("🧪 Probando registro de usuario...")
    print(f"📧 Email: {test_user_data['email']}")
    print(f"🏢 Empresa: {test_user_data['company_name']}")
    
    try:
        # Realizar petición de registro
        response = requests.post(
            REGISTER_URL,
            json=test_user_data,
            headers={'Content-Type': 'application/json'}
        )
        
        print(f"\n📡 Status Code: {response.status_code}")
        
        if response.status_code == 201:
            print("✅ ¡Registro exitoso!")
            response_data = response.json()
            print(f"👤 Usuario creado: {response_data.get('user', {}).get('username')}")
            print(f"🔑 Token recibido: {'Sí' if response_data.get('access') else 'No'}")
            return True
            
        elif response.status_code == 400:
            print("❌ Error en los datos del registro:")
            error_data = response.json()
            for field, errors in error_data.items():
                print(f"  - {field}: {errors}")
            return False
            
        else:
            print(f"❌ Error inesperado: {response.status_code}")
            print(f"Respuesta: {response.text}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Error: No se puede conectar al servidor backend")
        print("   Asegúrate de que el servidor Django esté ejecutándose en http://localhost:8000")
        return False
        
    except Exception as e:
        print(f"❌ Error inesperado: {e}")
        return False

def test_login_with_new_user():
    """Prueba el login con el usuario recién registrado"""
    
    login_data = {
        "identifier": "usuario.prueba@test.com",
        "password": "MiContraseñaSegura2024!"
    }
    
    login_url = f"{BASE_URL}/api/auth/login/"
    
    print("\n🔐 Probando login con usuario registrado...")
    
    try:
        response = requests.post(
            login_url,
            json=login_data,
            headers={'Content-Type': 'application/json'}
        )
        
        print(f"📡 Status Code: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ ¡Login exitoso!")
            response_data = response.json()
            print(f"👤 Usuario: {response_data.get('user', {}).get('username')}")
            return True
        else:
            print(f"❌ Error en login: {response.status_code}")
            print(f"Respuesta: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error en login: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Iniciando pruebas del sistema de registro...")
    print("=" * 50)
    
    # Probar registro
    registration_success = test_user_registration()
    
    if registration_success:
        # Si el registro fue exitoso, probar login
        login_success = test_login_with_new_user()
        
        if login_success:
            print("\n🎉 ¡Todas las pruebas pasaron exitosamente!")
            print("✅ El sistema de registro y login está funcionando correctamente")
        else:
            print("\n⚠️ El registro funciona pero hay problemas con el login")
    else:
        print("\n❌ Hay problemas con el sistema de registro")
    
    print("\n" + "=" * 50)
    print("🏁 Pruebas completadas")