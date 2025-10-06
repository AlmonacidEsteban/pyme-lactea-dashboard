#!/usr/bin/env python
import os
import sys
import django

# Configurar Django
sys.path.append('backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from productos.models import Marca, Categoria, Producto

def test_models():
    print("=== Probando modelos ===")
    
    # Probar marcas
    print(f"\nMarcas en la base de datos: {Marca.objects.count()}")
    marcas = Marca.objects.all()[:3]
    for marca in marcas:
        print(f"- {marca.id}: {marca.nombre} (activo: {marca.activo})")
    
    # Probar categorías
    print(f"\nCategorías en la base de datos: {Categoria.objects.count()}")
    categorias = Categoria.objects.all()[:3]
    for categoria in categorias:
        print(f"- {categoria.id}: {categoria.nombre} (activo: {categoria.activo})")
    
    # Probar productos
    print(f"\nProductos en la base de datos: {Producto.objects.count()}")
    productos = Producto.objects.all()[:3]
    for producto in productos:
        print(f"- {producto.id}: {producto.nombre} (marca: {producto.marca}, categoría: {producto.categoria})")

if __name__ == "__main__":
    test_models()