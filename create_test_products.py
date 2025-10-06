#!/usr/bin/env python
import os
import sys
import django

# Configurar Django
sys.path.append('backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from productos.models import Producto

def create_test_products():
    """Crear productos de prueba si no existen"""
    
    # Verificar productos existentes
    existing_count = Producto.objects.count()
    print(f"Productos existentes: {existing_count}")
    
    if existing_count == 0:
        print("Creando productos de prueba...")
        
        productos_prueba = [
            {
                'nombre': 'Queso Cremoso 500g',
                'sku': 'QC-500-M1',
                'descripcion': 'Queso cremoso tradicional de 500 gramos',
                'precio': 2500.00,
                'stock': 45,
                'activo': True
            },
            {
                'nombre': 'Ricota 250g',
                'sku': 'RC-250-M1',
                'descripcion': 'Ricota fresca de 250 gramos',
                'precio': 1800.00,
                'stock': 30,
                'activo': True
            },
            {
                'nombre': 'Queso en Cilindro 1kg',
                'sku': 'CI-1000-M2',
                'descripcion': 'Queso cilindro de 1 kilogramo',
                'precio': 4200.00,
                'stock': 15,
                'activo': True
            },
            {
                'nombre': 'Queso Plancha 800g',
                'sku': 'PL-800-M1',
                'descripcion': 'Queso plancha de 800 gramos',
                'precio': 3600.00,
                'stock': 8,
                'activo': True
            },
            {
                'nombre': 'Queso Cremoso Light 400g',
                'sku': 'QC-400-M2',
                'descripcion': 'Queso cremoso light de 400 gramos',
                'precio': 2200.00,
                'stock': 25,
                'activo': True
            }
        ]
        
        for producto_data in productos_prueba:
            producto = Producto.objects.create(**producto_data)
            print(f"Creado: {producto.nombre} (ID: {producto.id})")
        
        print(f"Se crearon {len(productos_prueba)} productos de prueba")
    else:
        print("Ya existen productos en la base de datos")
        
        # Mostrar productos existentes
        productos = Producto.objects.all()[:5]
        print("\nPrimeros 5 productos:")
        for producto in productos:
            print(f"- {producto.nombre} (Stock: {producto.stock}, Precio: ${producto.precio})")

if __name__ == '__main__':
    create_test_products()