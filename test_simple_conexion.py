#!/usr/bin/env python3
"""
Script simple para probar conectividad básica al servidor Django
"""

import requests

print("🔍 Probando conexión simple...")

try:
    # Prueba básica GET
    print("1. Probando GET básico...")
    response = requests.get("http://127.0.0.1:8000/api/clientes/rubros/")
    print(f"   Status: {response.status_code}")
    
    if response.status_code == 200:
        print("✅ Conexión exitosa!")
        
        # Ahora probamos POST
        print("\n2. Probando POST...")
        nuevo_rubro = {
            "nombre": "Test Simple",
            "descripcion": "Prueba básica"
        }
        
        post_response = requests.post(
            "http://127.0.0.1:8000/api/clientes/rubros/",
            json=nuevo_rubro
        )
        
        print(f"   POST Status: {post_response.status_code}")
        
        if post_response.status_code == 201:
            print("🎉 ¡POST FUNCIONA! Problema resuelto")
        elif post_response.status_code == 405:
            print("❌ Aún hay error 405 - servidor necesita reinicio")
        else:
            print(f"⚠️ Código inesperado: {post_response.status_code}")
            print(f"Respuesta: {post_response.text}")
    else:
        print(f"❌ Error en GET: {response.status_code}")
        
except Exception as e:
    print(f"❌ Error de conexión: {e}")
    print("🔧 Posibles soluciones:")
    print("   - Verifica que el servidor esté corriendo")
    print("   - Reinicia el servidor")
    print("   - Verifica el puerto 8000")