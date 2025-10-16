#!/usr/bin/env python3
"""
Script para probar la actualización de clientes con rubro
"""
import os
import sys
import django
import requests
import json

# Configurar Django
sys.path.append('backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from clientes.models import Cliente, Rubro

def test_cliente_update():
    print("=== Test de Actualización de Cliente con Rubro ===\n")
    
    # 1. Verificar que hay rubros disponibles
    rubros = Rubro.objects.filter(activo=True)
    print(f"Rubros disponibles: {rubros.count()}")
    for rubro in rubros[:3]:
        print(f"  - {rubro.id}: {rubro.nombre}")
    
    if not rubros.exists():
        print("❌ No hay rubros disponibles")
        return
    
    # 2. Crear un cliente de prueba
    cliente_test = Cliente.objects.create(
        nombre="Cliente Test Rubro",
        identificacion="12345678901",
        telefono="123456789",
        correo="test@test.com",
        direccion="Dirección Test",
        zona="Zona Test",
        tipo="minorista",
        limite_credito=1000.00,
        rubro=None  # Sin rubro inicialmente
    )
    
    print(f"\n✅ Cliente creado: {cliente_test.id} - {cliente_test.nombre}")
    print(f"   Rubro inicial: {cliente_test.rubro}")
    
    # 3. Actualizar el cliente con un rubro
    primer_rubro = rubros.first()
    cliente_test.rubro = primer_rubro
    cliente_test.save()
    
    print(f"\n✅ Cliente actualizado con rubro: {primer_rubro.nombre}")
    
    # 4. Verificar que se guardó correctamente
    cliente_verificado = Cliente.objects.get(id=cliente_test.id)
    print(f"   Rubro verificado: {cliente_verificado.rubro}")
    print(f"   Rubro nombre: {cliente_verificado.rubro.nombre if cliente_verificado.rubro else 'None'}")
    
    # 5. Probar actualización vía API (simulando frontend)
    print(f"\n=== Probando actualización vía API ===")
    
    # Datos para actualizar
    segundo_rubro = rubros.exclude(id=primer_rubro.id).first()
    if segundo_rubro:
        update_data = {
            "nombre": "Cliente Test Rubro Actualizado",
            "rubro": segundo_rubro.id
        }
        
        print(f"Actualizando cliente {cliente_test.id} con rubro {segundo_rubro.id} ({segundo_rubro.nombre})")
        
        # Simular request PATCH
        try:
            response = requests.patch(
                f"http://127.0.0.1:8000/api/clientes/{cliente_test.id}/",
                json=update_data,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                response_data = response.json()
                print(f"✅ API Response exitosa:")
                print(f"   Nombre: {response_data.get('nombre')}")
                print(f"   Rubro ID: {response_data.get('rubro')}")
                print(f"   Rubro Nombre: {response_data.get('rubro_nombre')}")
                
                # Verificar en base de datos
                cliente_final = Cliente.objects.get(id=cliente_test.id)
                print(f"\n✅ Verificación en BD:")
                print(f"   Nombre: {cliente_final.nombre}")
                print(f"   Rubro: {cliente_final.rubro}")
                print(f"   Rubro nombre: {cliente_final.rubro.nombre if cliente_final.rubro else 'None'}")
                
            else:
                print(f"❌ Error en API: {response.status_code}")
                print(f"   Response: {response.text}")
                
        except requests.exceptions.ConnectionError:
            print("❌ No se pudo conectar al servidor. ¿Está corriendo el backend?")
    
    # 6. Limpiar
    cliente_test.delete()
    print(f"\n🧹 Cliente de prueba eliminado")

if __name__ == "__main__":
    test_cliente_update()