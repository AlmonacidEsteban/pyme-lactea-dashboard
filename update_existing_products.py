#!/usr/bin/env python
import os
import sys
import django

# Configurar Django
sys.path.append('backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from productos.models import Marca, Categoria, Producto

def update_products():
    print("=== Actualizando productos existentes ===")
    
    # Obtener algunas marcas y categorías
    marca_serenisima = Marca.objects.get(nombre="La Serenísima")
    marca_sancor = Marca.objects.get(nombre="Sancor")
    
    categoria_cremoso = Categoria.objects.get(nombre="Queso Cremoso")
    categoria_plancha = Categoria.objects.get(nombre="Queso Plancha")
    categoria_light = Categoria.objects.get(nombre="Queso Light")
    categoria_muzzarella = Categoria.objects.get(nombre="Muzzarella")
    categoria_rallado = Categoria.objects.get(nombre="Queso Rallado")
    
    # Actualizar productos existentes
    productos_updates = [
        {"nombre__icontains": "Cremoso", "marca": marca_serenisima, "categoria": categoria_cremoso},
        {"nombre__icontains": "Plancha", "marca": marca_sancor, "categoria": categoria_plancha},
        {"nombre__icontains": "Light", "marca": marca_serenisima, "categoria": categoria_light},
        {"nombre__icontains": "Muzzarella", "marca": marca_sancor, "categoria": categoria_muzzarella},
        {"nombre__icontains": "Rallado", "marca": marca_serenisima, "categoria": categoria_rallado},
    ]
    
    for update_data in productos_updates:
        filter_criteria = {k: v for k, v in update_data.items() if k not in ['marca', 'categoria']}
        update_fields = {k: v for k, v in update_data.items() if k in ['marca', 'categoria']}
        
        productos = Producto.objects.filter(**filter_criteria)
        for producto in productos:
            for field, value in update_fields.items():
                setattr(producto, field, value)
            producto.save()
            print(f"Actualizado: {producto.nombre} -> Marca: {producto.marca.nombre}, Categoría: {producto.categoria.nombre}")
    
    print(f"\nResumen final:")
    productos = Producto.objects.all()
    for producto in productos:
        marca_nombre = producto.marca.nombre if producto.marca else "Sin marca"
        categoria_nombre = producto.categoria.nombre if producto.categoria else "Sin categoría"
        print(f"- {producto.nombre}: {marca_nombre} / {categoria_nombre}")

if __name__ == "__main__":
    update_products()