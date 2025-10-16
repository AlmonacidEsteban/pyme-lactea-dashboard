#!/usr/bin/env python
"""
Script para crear rubros iniciales en el sistema.
Ejecutar con: python manage.py shell < create_rubros_iniciales.py
"""

import os
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from clientes.models import Rubro

# Rubros iniciales
rubros_iniciales = [
    {
        'nombre': 'Supermercado',
        'descripcion': 'Cadenas de supermercados y autoservicios'
    },
    {
        'nombre': 'Kiosco',
        'descripcion': 'Kioscos y pequeños comercios de barrio'
    },
    {
        'nombre': 'Fábrica de Pasta',
        'descripcion': 'Fábricas y productores de pasta fresca'
    },
    {
        'nombre': 'Mayorista',
        'descripcion': 'Distribuidores y comercios mayoristas'
    },
    {
        'nombre': 'Restaurante',
        'descripcion': 'Restaurantes, bares y servicios gastronómicos'
    },
    {
        'nombre': 'Panadería',
        'descripcion': 'Panaderías y confiterías'
    },
    {
        'nombre': 'Almacén',
        'descripcion': 'Almacenes de barrio y despensas'
    },
    {
        'nombre': 'Distribuidora',
        'descripcion': 'Empresas distribuidoras de alimentos'
    }
]

print("Creando rubros iniciales...")

for rubro_data in rubros_iniciales:
    rubro, created = Rubro.objects.get_or_create(
        nombre=rubro_data['nombre'],
        defaults={'descripcion': rubro_data['descripcion']}
    )
    
    if created:
        print(f"✓ Creado: {rubro.nombre}")
    else:
        print(f"- Ya existe: {rubro.nombre}")

print(f"\nTotal de rubros en el sistema: {Rubro.objects.count()}")
print("¡Rubros iniciales creados exitosamente!")