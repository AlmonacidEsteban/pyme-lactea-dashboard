#!/usr/bin/env python3
"""
Script para verificar que la corrección de POST en rubros funcione.
Ejecutar DESPUÉS de reiniciar el servidor backend.
"""

import requests
import json
import time

def verificar_servidor():
    """Verificar que el servidor esté ejecutándose"""
    try:
        response = requests.get("http://127.0.0.1:8000/api/clientes/rubros/", timeout=5)
        return response.status_code == 200
    except:
        return False

def test_post_rubro():
    """Probar la creación de un rubro"""
    print("🧪 Probando POST /api/clientes/rubros/")
    
    nuevo_rubro = {
        "nombre": "Rubro Test POST",
        "descripcion": "Prueba de corrección POST"
    }
    
    try:
        response = requests.post(
            "http://127.0.0.1:8000/api/clientes/rubros/",
            json=nuevo_rubro,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 201:
            print("✅ ¡ÉXITO! El POST ahora funciona correctamente")
            rubro_creado = response.json()
            print(f"📋 Rubro creado: {rubro_creado.get('nombre')}")
            print(f"🆔 ID: {rubro_creado.get('id')}")
            return True
        elif response.status_code == 405:
            print("❌ ERROR: Aún recibiendo 'Method Not Allowed'")
            print("🔄 Asegúrate de haber reiniciado el servidor backend")
            return False
        else:
            print(f"⚠️  Código inesperado: {response.status_code}")
            print(f"Respuesta: {response.text}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ ERROR: No se puede conectar al servidor")
        print("🚀 Asegúrate de que el servidor esté ejecutándose en puerto 8000")
        return False
    except Exception as e:
        print(f"❌ ERROR inesperado: {e}")
        return False

def main():
    print("=" * 60)
    print("🔍 VERIFICACIÓN DE CORRECCIÓN RUBROS POST")
    print("=" * 60)
    print()
    
    print("1️⃣ Verificando que el servidor esté ejecutándose...")
    if not verificar_servidor():
        print("❌ El servidor no está ejecutándose o no responde")
        print("🚀 Ejecuta: restart_backend_rubros.bat")
        print("   O manualmente: cd backend && python manage.py runserver 8000")
        return
    
    print("✅ Servidor detectado en puerto 8000")
    print()
    
    print("2️⃣ Probando la funcionalidad POST...")
    exito = test_post_rubro()
    
    print()
    print("=" * 60)
    if exito:
        print("🎉 CORRECCIÓN EXITOSA")
        print("✅ El error 'Method POST not allowed' ha sido resuelto")
        print("✅ Ahora puedes crear rubros desde el frontend")
    else:
        print("🔄 ACCIÓN REQUERIDA")
        print("1. Reinicia el servidor backend")
        print("2. Ejecuta este script nuevamente")
    print("=" * 60)

if __name__ == "__main__":
    main()