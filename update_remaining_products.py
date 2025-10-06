#!/usr/bin/env python
import os
import sys
import django

# Configurar Django
sys.path.append('backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from productos.models import Marca, Categoria, Producto

def update_remaining_products():
    print("=== Actualizando productos restantes ===")
    
    # Obtener marcas y categorías
    marca_milkaut = Marca.objects.get(nombre="Milkaut")
    marca_veronica = Marca.objects.get(nombre="Verónica")
    
    categoria_cilindro = Categoria.objects.get(nombre="Queso Cilindro")
    categoria_ricota = Categoria.objects.get(nombre="Ricota")
    
    # Actualizar productos específicos
    try:
        producto_cilindro = Producto.objects.get(nombre__icontains="Cilindro")
        producto_cilindro.marca = marca_milkaut
        producto_cilindro.categoria = categoria_cilindro
        producto_cilindro.save()
        print(f"Actualizado: {producto_cilindro.nombre} -> Marca: {producto_cilindro.marca.nombre}, Categoría: {producto_cilindro.categoria.nombre}")
    except Producto.DoesNotExist:
        print("No se encontró producto con 'Cilindro' en el nombre")
    
    try:
        producto_ricota = Producto.objects.get(nombre__icontains="Ricota")
        producto_ricota.marca = marca_veronica
        producto_ricota.categoria = categoria_ricota
        producto_ricota.save()
        print(f"Actualizado: {producto_ricota.nombre} -> Marca: {producto_ricota.marca.nombre}, Categoría: {producto_ricota.categoria.nombre}")
    except Producto.DoesNotExist:
        print("No se encontró producto con 'Ricota' en el nombre")
    
    print(f"\nResumen final:")
    productos = Producto.objects.all()
    for producto in productos:
        marca_nombre = producto.marca.nombre if producto.marca else "Sin marca"
        categoria_nombre = producto.categoria.nombre if producto.categoria else "Sin categoría"
        print(f"- {producto.nombre}: {marca_nombre} / {categoria_nombre}")

if __name__ == "__main__":
    update_remaining_products()