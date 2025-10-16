#!/usr/bin/env python
"""
Script de diagnóstico para el problema de rubros
"""
import os
import sys
import django
import requests

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from clientes.models import Rubro
from clientes.serializers import RubroSerializer

def main():
    print("=== DIAGNÓSTICO COMPLETO DE RUBROS ===")
    
    # 1. Verificar rubros en la base de datos
    print("\n1. VERIFICANDO BASE DE DATOS:")
    total_rubros = Rubro.objects.count()
    rubros_activos = Rubro.objects.filter(activo=True).count()
    
    print(f"   Total rubros: {total_rubros}")
    print(f"   Rubros activos: {rubros_activos}")
    
    if total_rubros == 0:
        print("   ❌ NO HAY RUBROS EN LA BASE DE DATOS")
        print("   Creando rubros de prueba...")
        
        rubros_prueba = [
            {"nombre": "Supermercado", "descripcion": "Supermercado general"},
            {"nombre": "Kiosco", "descripcion": "Kiosco de barrio"},
            {"nombre": "Panadería", "descripcion": "Panadería y confitería"},
            {"nombre": "Carnicería", "descripcion": "Carnicería y fiambrería"},
            {"nombre": "Fábrica de Pasta", "descripcion": "Fábrica de pastas frescas"}
        ]
        
        for rubro_data in rubros_prueba:
            rubro, created = Rubro.objects.get_or_create(
                nombre=rubro_data["nombre"],
                defaults={
                    'descripcion': rubro_data["descripcion"],
                    'activo': True
                }
            )
            if created:
                print(f"   ✓ Creado: {rubro.nombre}")
            else:
                print(f"   - Ya existe: {rubro.nombre}")
    else:
        print("   ✓ HAY RUBROS EN LA BASE DE DATOS")
        for rubro in Rubro.objects.all()[:5]:
            print(f"   - {rubro.nombre} (activo: {rubro.activo})")
    
    # 2. Verificar serializer
    print("\n2. VERIFICANDO SERIALIZER:")
    try:
        rubros = Rubro.objects.filter(activo=True)
        serializer = RubroSerializer(rubros, many=True)
        data = serializer.data
        print(f"   ✓ Serializer funciona correctamente")
        print(f"   ✓ Datos serializados: {len(data)} rubros")
        if data:
            print(f"   ✓ Primer rubro: {data[0]}")
    except Exception as e:
        print(f"   ❌ Error en serializer: {e}")
    
    # 3. Probar endpoint directamente
    print("\n3. PROBANDO ENDPOINT:")
    try:
        response = requests.get('http://127.0.0.1:8000/api/clientes/rubros/', timeout=5)
        print(f"   Status Code: {response.status_code}")
        print(f"   Response: {response.text[:200]}...")
        
        if response.status_code == 200:
            print("   ✓ ENDPOINT FUNCIONA CORRECTAMENTE")
        else:
            print("   ❌ ENDPOINT DEVUELVE ERROR")
            
    except requests.exceptions.ConnectionError:
        print("   ❌ No se puede conectar al servidor")
        print("   ¿Está corriendo el servidor Django?")
    except Exception as e:
        print(f"   ❌ Error al probar endpoint: {e}")
    
    # 4. Verificar URLs
    print("\n4. VERIFICANDO CONFIGURACIÓN:")
    try:
        from django.urls import reverse
        url = reverse('cliente-list')
        print(f"   ✓ URL de clientes: {url}")
    except Exception as e:
        print(f"   ❌ Error en URLs: {e}")
    
    print("\n=== FIN DEL DIAGNÓSTICO ===")

if __name__ == '__main__':
    main()