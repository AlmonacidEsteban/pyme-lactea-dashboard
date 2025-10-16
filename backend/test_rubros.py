#!/usr/bin/env python
"""
Script simple para verificar y crear rubros de prueba
"""
import os
import sys
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from clientes.models import Rubro

def main():
    print("=== VERIFICACIÓN DE RUBROS ===")
    
    # Verificar rubros existentes
    rubros_existentes = Rubro.objects.all()
    print(f"Rubros en la base de datos: {rubros_existentes.count()}")
    
    for rubro in rubros_existentes:
        print(f"- {rubro.nombre} (activo: {rubro.activo})")
    
    # Si no hay rubros, crear algunos de prueba
    if rubros_existentes.count() == 0:
        print("\nCreando rubros de prueba...")
        rubros_prueba = [
            "Supermercado",
            "Kiosco", 
            "Fábrica de Pasta",
            "Panadería",
            "Carnicería"
        ]
        
        for nombre in rubros_prueba:
            rubro, created = Rubro.objects.get_or_create(
                nombre=nombre,
                defaults={'descripcion': f'Rubro de {nombre}', 'activo': True}
            )
            if created:
                print(f"✓ Creado: {nombre}")
            else:
                print(f"- Ya existe: {nombre}")
    
    print(f"\nTotal de rubros activos: {Rubro.objects.filter(activo=True).count()}")
    print("=== FIN ===")

if __name__ == '__main__':
    main()