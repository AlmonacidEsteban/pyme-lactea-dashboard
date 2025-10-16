#!/usr/bin/env python3
"""
Script para probar las rutas del backend después del análisis de enrutado.
Ejecutar después de iniciar el servidor con: python manage.py runserver 8000
"""

import requests
import json

def test_endpoint(url, description):
    """Prueba un endpoint y muestra el resultado"""
    print(f"\n🔍 Probando: {description}")
    print(f"URL: {url}")
    
    try:
        response = requests.get(url, timeout=5)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ ÉXITO")
            try:
                data = response.json()
                print(f"Datos recibidos: {len(data) if isinstance(data, list) else 'objeto'} elementos")
                if isinstance(data, list) and len(data) > 0:
                    print(f"Primer elemento: {json.dumps(data[0], indent=2, ensure_ascii=False)}")
                elif isinstance(data, dict):
                    print(f"Respuesta: {json.dumps(data, indent=2, ensure_ascii=False)}")
            except:
                print(f"Respuesta (texto): {response.text[:200]}...")
        else:
            print(f"❌ ERROR: {response.status_code}")
            print(f"Respuesta: {response.text[:200]}...")
            
    except requests.exceptions.ConnectionError:
        print("❌ ERROR: No se puede conectar al servidor")
        print("   ¿Está ejecutándose el servidor en el puerto 8000?")
    except requests.exceptions.Timeout:
        print("❌ ERROR: Timeout - el servidor no responde")
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")

def main():
    print("=" * 60)
    print("🧪 PRUEBA DE RUTAS DEL BACKEND - VERSIÓN CORREGIDA")
    print("=" * 60)
    
    base_url = "http://127.0.0.1:8000"
    
    # Probar endpoint raíz
    test_endpoint(f"{base_url}/", "Página principal")
    
    # Probar endpoints de clientes
    test_endpoint(f"{base_url}/api/clientes/", "Lista de clientes")
    test_endpoint(f"{base_url}/api/clientes/rubros/", "Lista de rubros")
    
    # Probar productos sugeridos - ruta global (sin autenticación)
    test_endpoint(f"{base_url}/api/clientes/productos-sugeridos/", "Productos sugeridos globales (sin auth)")
    
    # Probar productos sugeridos - ruta de detalle (requiere ID de cliente)
    test_endpoint(f"{base_url}/api/clientes/1/productos-sugeridos/", "Productos sugeridos para cliente ID=1")
    
    print("\n" + "=" * 60)
    print("📋 RESUMEN DE CORRECCIONES APLICADAS:")
    print("✅ Frontend: getProductosSugeridos ahora exige clienteId")
    print("✅ Frontend: Eliminado fallback sin autenticación")
    print("✅ Backend: Agregada acción detail=True para productos-sugeridos")
    print("✅ Backend: Mantenida acción detail=False para compatibilidad")
    print("\n📊 RESULTADOS ESPERADOS:")
    print("- Ruta global (/productos-sugeridos/): Debe funcionar sin auth")
    print("- Ruta detalle (/1/productos-sugeridos/): Debe funcionar sin auth")
    print("- Rubros (/rubros/): Debe funcionar")
    print("- Si alguna falla: Verificar que el servidor esté ejecutándose")
    print("=" * 60)

if __name__ == "__main__":
    main()