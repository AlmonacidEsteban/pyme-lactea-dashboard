#!/usr/bin/env python
import os
import sys
import django

# Configurar Django
sys.path.append('backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from recursos_humanos.models import Empleado, Rol

def cleanup_test_employees():
    print("Limpiando empleados de prueba...")
    
    # Lista de emails de empleados de prueba que creamos
    test_emails = [
        'juan.perez@empresa.com',
        'maria.garcia@empresa.com',
        'carlos.lopez@empresa.com',
        'ana.martinez@empresa.com',
        'luis.rodriguez@empresa.com',
        'sofia.hernandez@empresa.com',
        'diego.morales@empresa.com',
        'carmen.jimenez@empresa.com',
        'roberto.vargas@empresa.com',
        'lucia.torres@empresa.com'
    ]
    
    # Eliminar empleados de prueba
    deleted_count = 0
    for email in test_emails:
        try:
            empleado = Empleado.objects.get(email=email)
            print(f"Eliminando empleado: {empleado.nombre} {empleado.apellido}")
            empleado.delete()
            deleted_count += 1
        except Empleado.DoesNotExist:
            print(f"Empleado con email {email} no encontrado")
    
    print(f"\nEmpleados eliminados: {deleted_count}")
    
    # Mostrar empleados restantes
    empleados_restantes = Empleado.objects.filter(activo=True)
    print(f"Empleados activos restantes: {empleados_restantes.count()}")
    
    if empleados_restantes.exists():
        print("\nEmpleados restantes en la base de datos:")
        for emp in empleados_restantes:
            print(f"- {emp.nombre} {emp.apellido} ({emp.email})")
    else:
        print("\nNo hay empleados activos en la base de datos.")
        print("Ahora puedes crear tus propios empleados a través de la interfaz de la aplicación.")

if __name__ == '__main__':
    cleanup_test_employees()