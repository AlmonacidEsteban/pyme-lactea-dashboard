#!/usr/bin/env python
import os
import sys
import django

# Configurar Django
sys.path.append('backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from productos.models import Marca, Categoria

def crear_marcas_categorias():
    # Crear marcas de prueba
    marcas_data = [
        "La Serenísima",
        "Sancor",
        "Milkaut", 
        "Verónica",
        "Ilolay",
        "Tregar",
        "Mastellone",
        "Williner"
    ]
    
    # Crear categorías de prueba
    categorias_data = [
        "Queso Cremoso",
        "Queso Plancha", 
        "Queso Cilindro",
        "Ricota",
        "Muzzarella",
        "Queso Rallado",
        "Queso Light",
        "Queso Saborizado"
    ]
    
    print("Creando marcas...")
    for nombre_marca in marcas_data:
        marca, created = Marca.objects.get_or_create(
            nombre=nombre_marca,
            defaults={'activo': True}
        )
        if created:
            print(f"Creada marca: {marca.nombre} (ID: {marca.id})")
        else:
            print(f"Marca ya existe: {marca.nombre} (ID: {marca.id})")
    
    print("\nCreando categorías...")
    for nombre_categoria in categorias_data:
        categoria, created = Categoria.objects.get_or_create(
            nombre=nombre_categoria,
            defaults={'activo': True}
        )
        if created:
            print(f"Creada categoría: {categoria.nombre} (ID: {categoria.id})")
        else:
            print(f"Categoría ya existe: {categoria.nombre} (ID: {categoria.id})")
    
    print(f"\nResumen:")
    print(f"Total marcas: {Marca.objects.count()}")
    print(f"Total categorías: {Categoria.objects.count()}")

if __name__ == "__main__":
    crear_marcas_categorias()