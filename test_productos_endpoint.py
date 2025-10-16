#!/usr/bin/env python
import requests
import json

def test_productos_sugeridos():
    """Probar el endpoint de productos sugeridos"""
    url = "http://127.0.0.1:8000/api/clientes/productos-sugeridos/"
    
    try:
        print(f"Probando endpoint: {url}")
        response = requests.get(url, timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Productos recibidos: {len(data)} elementos")
            if data:
                print("Productos:")
                for producto in data:
                    print(f"  - ID: {producto.get('id')}, Nombre: {producto.get('nombre')}, Precio: ${producto.get('precio')}")
        else:
            print(f"Error: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("Error: No se pudo conectar al servidor. ¿Está ejecutándose el backend?")
    except Exception as e:
        print(f"Error inesperado: {e}")

if __name__ == "__main__":
    test_productos_sugeridos()