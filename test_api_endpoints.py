#!/usr/bin/env python
import requests
import json

def test_endpoints():
    base_url = "http://localhost:8000/api/productos"
    
    endpoints = [
        f"{base_url}/marcas/",
        f"{base_url}/categorias/",
        f"{base_url}/productos/"
    ]
    
    for endpoint in endpoints:
        try:
            print(f"\nProbando endpoint: {endpoint}")
            response = requests.get(endpoint)
            print(f"Status Code: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                print(f"Datos recibidos: {len(data)} elementos")
                if data:
                    print(f"Primer elemento: {json.dumps(data[0], indent=2, ensure_ascii=False)}")
            else:
                print(f"Error: {response.text}")
                
        except Exception as e:
            print(f"Error al conectar: {e}")

if __name__ == "__main__":
    test_endpoints()