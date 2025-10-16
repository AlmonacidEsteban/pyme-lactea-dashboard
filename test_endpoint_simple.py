#!/usr/bin/env python
"""
Script simple para probar el endpoint productos-sugeridos
"""
import requests
import json

def test_endpoint():
    url = "http://127.0.0.1:8000/api/clientes/productos-sugeridos/"
    
    print("🧪 Probando endpoint productos-sugeridos...")
    print(f"📍 URL: {url}")
    
    try:
        # Probar sin autenticación
        print("\n1️⃣ Probando sin autenticación...")
        response = requests.get(url, timeout=10)
        print(f"   Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Éxito! Productos encontrados: {len(data)}")
            if data:
                print(f"   📦 Primer producto: {data[0].get('nombre', 'N/A')}")
                print(f"   💰 Precio: ${data[0].get('precio', 'N/A')}")
        else:
            print(f"   ❌ Error: {response.status_code}")
            print(f"   📝 Respuesta: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("   ❌ Error de conexión: El servidor no está ejecutándose")
        print("   💡 Sugerencia: Ejecuta 'python manage.py runserver 8000' en el directorio backend")
    except requests.exceptions.Timeout:
        print("   ⏰ Timeout: El servidor no responde")
    except Exception as e:
        print(f"   ❌ Error inesperado: {e}")

if __name__ == "__main__":
    test_endpoint()