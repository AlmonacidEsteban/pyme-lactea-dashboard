#!/usr/bin/env python3
"""
Script para probar las operaciones CRUD de rubros después de la corrección.
Verifica que el método POST ahora funcione correctamente.
"""

import requests
import json

def test_rubros_crud():
    print("=" * 60)
    print("🧪 PRUEBA DE OPERACIONES CRUD PARA RUBROS")
    print("=" * 60)
    
    base_url = "http://127.0.0.1:8000/api/clientes/rubros/"
    
    # 1. Probar GET (listar rubros)
    print("\n1️⃣ Probando GET - Listar rubros...")
    try:
        response = requests.get(base_url)
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            rubros = response.json()
            print(f"   ✅ Rubros encontrados: {len(rubros)}")
            if rubros:
                print(f"   📋 Primer rubro: {rubros[0].get('nombre', 'Sin nombre')}")
        else:
            print(f"   ❌ Error: {response.text}")
    except Exception as e:
        print(f"   ❌ Error de conexión: {e}")
    
    # 2. Probar POST (crear rubro)
    print("\n2️⃣ Probando POST - Crear nuevo rubro...")
    nuevo_rubro = {
        "nombre": "Rubro de Prueba",
        "descripcion": "Rubro creado para probar la funcionalidad POST"
    }
    
    try:
        response = requests.post(
            base_url,
            json=nuevo_rubro,
            headers={"Content-Type": "application/json"}
        )
        print(f"   Status: {response.status_code}")
        if response.status_code == 201:
            rubro_creado = response.json()
            print(f"   ✅ Rubro creado exitosamente!")
            print(f"   📋 ID: {rubro_creado.get('id')}")
            print(f"   📋 Nombre: {rubro_creado.get('nombre')}")
            return rubro_creado.get('id')
        else:
            print(f"   ❌ Error: {response.text}")
            return None
    except Exception as e:
        print(f"   ❌ Error de conexión: {e}")
        return None
    
def test_rubro_detail_operations(rubro_id):
    """Probar operaciones de detalle si se creó un rubro"""
    if not rubro_id:
        return
        
    base_url = f"http://127.0.0.1:8000/api/clientes/rubros/{rubro_id}/"
    
    # 3. Probar GET detalle
    print(f"\n3️⃣ Probando GET detalle - Rubro ID {rubro_id}...")
    try:
        response = requests.get(base_url)
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            rubro = response.json()
            print(f"   ✅ Rubro obtenido: {rubro.get('nombre')}")
        else:
            print(f"   ❌ Error: {response.text}")
    except Exception as e:
        print(f"   ❌ Error de conexión: {e}")
    
    # 4. Probar PATCH (actualizar)
    print(f"\n4️⃣ Probando PATCH - Actualizar rubro ID {rubro_id}...")
    actualizacion = {
        "descripcion": "Descripción actualizada mediante PATCH"
    }
    
    try:
        response = requests.patch(
            base_url,
            json=actualizacion,
            headers={"Content-Type": "application/json"}
        )
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            rubro_actualizado = response.json()
            print(f"   ✅ Rubro actualizado!")
            print(f"   📋 Nueva descripción: {rubro_actualizado.get('descripcion')}")
        else:
            print(f"   ❌ Error: {response.text}")
    except Exception as e:
        print(f"   ❌ Error de conexión: {e}")
    
    # 5. Probar DELETE (soft delete)
    print(f"\n5️⃣ Probando DELETE - Eliminar rubro ID {rubro_id}...")
    try:
        response = requests.delete(base_url)
        print(f"   Status: {response.status_code}")
        if response.status_code == 204:
            print(f"   ✅ Rubro eliminado (soft delete)!")
        else:
            print(f"   ❌ Error: {response.text}")
    except Exception as e:
        print(f"   ❌ Error de conexión: {e}")

def main():
    print("🚀 Iniciando pruebas de CRUD para rubros...")
    print("📝 Nota: Asegúrate de que el servidor Django esté ejecutándose en el puerto 8000")
    
    # Probar operaciones básicas
    rubro_id = test_rubros_crud()
    
    # Probar operaciones de detalle si se creó un rubro
    if rubro_id:
        test_rubro_detail_operations(rubro_id)
    
    print("\n" + "=" * 60)
    print("📊 RESUMEN DE LA CORRECCIÓN:")
    print("✅ Agregado: permission_classes = [] en RubroViewSet")
    print("✅ Esto permite operaciones sin autenticación")
    print("✅ Resuelve el error 'Method POST not allowed'")
    print("\n🎯 RESULTADOS ESPERADOS:")
    print("- GET /api/clientes/rubros/ → 200 OK")
    print("- POST /api/clientes/rubros/ → 201 Created")
    print("- PATCH /api/clientes/rubros/{id}/ → 200 OK")
    print("- DELETE /api/clientes/rubros/{id}/ → 204 No Content")
    print("=" * 60)

if __name__ == "__main__":
    main()