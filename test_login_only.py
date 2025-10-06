#!/usr/bin/env python3
"""
Script para probar solo el login con usuario existente
"""

import requests
import json

# Configuración
BASE_URL = "http://127.0.0.1:8000"
LOGIN_URL = f"{BASE_URL}/api/auth/login/"

def test_login():
    """Prueba el login con usuario existente"""
    
    login_data = {
        "identifier": "usuario.prueba@test.com",
        "password": "MiContraseñaSegura2024!"
    }
    
    print("🔐 Probando login con usuario registrado...")
    print(f"📧 Email: {login_data['identifier']}")
    
    try:
        response = requests.post(
            LOGIN_URL,
            json=login_data,
            headers={'Content-Type': 'application/json'}
        )
        
        print(f"📡 Status Code: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ ¡Login exitoso!")
            response_data = response.json()
            print(f"👤 Usuario: {response_data.get('user', {}).get('username')}")
            print(f"🔑 Token recibido: {'Sí' if response_data.get('access') else 'No'}")
            return True
        else:
            print(f"❌ Error en login: {response.status_code}")
            print(f"Respuesta: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error en login: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Probando login...")
    print("=" * 40)
    
    success = test_login()
    
    if success:
        print("\n🎉 ¡Login exitoso!")
        print("✅ El sistema de autenticación está funcionando correctamente")
    else:
        print("\n❌ Hay problemas con el login")
    
    print("\n" + "=" * 40)
    print("🏁 Prueba completada")