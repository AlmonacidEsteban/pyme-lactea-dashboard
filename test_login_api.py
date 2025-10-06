#!/usr/bin/env python
import requests
import json

def test_login():
    # URL del backend
    url = "http://127.0.0.1:8000/api/auth/login/"
    
    # Credenciales correctas
    credentials = {
        "identifier": "admin@mipyme.com",
        "password": "admin123"
    }
    
    print("🧪 PROBANDO LOGIN CON API DIRECTAMENTE")
    print("=" * 50)
    print(f"📍 URL: {url}")
    print(f"👤 Email: {credentials['identifier']}")
    print(f"🔑 Password: {credentials['password']}")
    print("=" * 50)
    
    try:
        # Hacer la petición POST
        response = requests.post(url, json=credentials)
        
        print(f"📊 Status Code: {response.status_code}")
        print(f"📄 Response Headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ LOGIN EXITOSO!")
            print(f"🎫 Token: {data.get('access', 'No token')[:50]}...")
            print(f"👤 Usuario: {data.get('user', {}).get('username', 'No username')}")
            print(f"📧 Email: {data.get('user', {}).get('email', 'No email')}")
            return True
        else:
            print("❌ LOGIN FALLÓ!")
            try:
                error_data = response.json()
                print(f"🚨 Error: {json.dumps(error_data, indent=2)}")
            except:
                print(f"🚨 Error text: {response.text}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ ERROR DE CONEXIÓN!")
        print("🔧 Verifica que el backend esté ejecutándose en http://127.0.0.1:8000/")
        return False
    except Exception as e:
        print(f"❌ ERROR INESPERADO: {e}")
        return False

def test_alternative_credentials():
    # URL del backend
    url = "http://127.0.0.1:8000/api/auth/login/"
    
    # Credenciales alternativas
    credentials = {
        "identifier": "estebana311@gmail.com",
        "password": "esteban123"
    }
    
    print("\n🧪 PROBANDO CON USUARIO ESTEBAN")
    print("=" * 50)
    print(f"👤 Email: {credentials['identifier']}")
    print(f"🔑 Password: {credentials['password']}")
    print("=" * 50)
    
    try:
        response = requests.post(url, json=credentials)
        
        print(f"📊 Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ LOGIN EXITOSO CON ESTEBAN!")
            print(f"👤 Usuario: {data.get('user', {}).get('username', 'No username')}")
            return True
        else:
            print("❌ LOGIN FALLÓ CON ESTEBAN!")
            try:
                error_data = response.json()
                print(f"🚨 Error: {json.dumps(error_data, indent=2)}")
            except:
                print(f"🚨 Error text: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ ERROR: {e}")
        return False

if __name__ == "__main__":
    print("🔍 DIAGNÓSTICO DE LOGIN")
    print("=" * 60)
    
    # Probar admin
    admin_success = test_login()
    
    # Probar Esteban
    esteban_success = test_alternative_credentials()
    
    print("\n📋 RESUMEN:")
    print("=" * 30)
    print(f"Admin login: {'✅ OK' if admin_success else '❌ FALLO'}")
    print(f"Esteban login: {'✅ OK' if esteban_success else '❌ FALLO'}")
    
    if not admin_success and not esteban_success:
        print("\n🚨 PROBLEMA DETECTADO:")
        print("- Ninguna credencial funciona")
        print("- Puede ser un problema del backend")
    elif admin_success or esteban_success:
        print("\n✅ AL MENOS UNA CREDENCIAL FUNCIONA:")
        print("- El backend está funcionando")
        print("- El problema puede estar en el frontend")