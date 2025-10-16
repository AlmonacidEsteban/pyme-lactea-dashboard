#!/usr/bin/env python3
"""
Script simple para probar la conectividad de la API
"""
import requests
import json

def test_api_endpoints():
    base_url = "http://127.0.0.1:8000"
    
    endpoints = [
        "/api/",
        "/api/clientes/",
        "/api/clientes/rubros/"
    ]
    
    print("🔍 Probando endpoints de la API...")
    print("=" * 50)
    
    for endpoint in endpoints:
        url = base_url + endpoint
        try:
            print(f"\n📡 Probando: {url}")
            response = requests.get(url, timeout=5)
            print(f"   Status: {response.status_code}")
            
            if response.status_code == 200:
                try:
                    data = response.json()
                    print(f"   Respuesta: {json.dumps(data, indent=2)[:200]}...")
                except:
                    print(f"   Respuesta: {response.text[:200]}...")
            else:
                print(f"   Error: {response.text}")
                
        except requests.exceptions.ConnectionError:
            print(f"   ❌ Error de conexión - ¿Está corriendo el servidor?")
        except Exception as e:
            print(f"   ❌ Error: {e}")
    
    print("\n" + "=" * 50)

def test_post_rubro():
    """Prueba crear un rubro via POST"""
    url = "http://127.0.0.1:8000/api/clientes/rubros/"
    
    test_rubro = {
        "nombre": "Test Rubro",
        "descripcion": "Rubro de prueba creado via API"
    }
    
    print("\n🚀 Probando POST para crear rubro...")
    print("=" * 50)
    
    try:
        response = requests.post(url, json=test_rubro, timeout=5)
        print(f"Status: {response.status_code}")
        
        if response.status_code in [200, 201]:
            print("✅ POST exitoso!")
            print(f"Respuesta: {response.json()}")
        else:
            print(f"❌ Error en POST: {response.text}")
            
    except Exception as e:
        print(f"❌ Error en POST: {e}")

if __name__ == "__main__":
    test_api_endpoints()
    test_post_rubro()