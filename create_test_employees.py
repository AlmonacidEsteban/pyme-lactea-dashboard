#!/usr/bin/env python
import os
import sys
import django

# Configurar Django
sys.path.append('backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from recursos_humanos.models import Empleado, Rol

def create_test_employees():
    print("Verificando empleados existentes...")
    empleados_count = Empleado.objects.filter(activo=True).count()
    print(f"Empleados activos encontrados: {empleados_count}")
    
    print("Creando/verificando empleados de prueba...")
    
    # Crear o obtener roles
    rol_desarrollador, _ = Rol.objects.get_or_create(
        nombre="Desarrollador",
        defaults={'descripcion': 'Desarrollador de software'}
    )
    
    rol_analista, _ = Rol.objects.get_or_create(
        nombre="Analista",
        defaults={'descripcion': 'Analista de sistemas'}
    )
    
    rol_gerente, _ = Rol.objects.get_or_create(
        nombre="Gerente",
        defaults={'descripcion': 'Gerente de proyecto'}
    )
        
    # Crear empleados de prueba
    empleados_data = [
        {
            'nombre': 'Juan',
            'apellido': 'Pérez',
            'identificacion': '12345678',
            'email': 'juan.perez@empresa.com',
            'telefono': '123456789',
            'puesto': 'Desarrollador Frontend',
            'especialidad': 'Frontend',
            'rol': rol_desarrollador,
            'activo': True
        },
        {
            'nombre': 'María',
            'apellido': 'García',
            'identificacion': '87654321',
            'email': 'maria.garcia@empresa.com',
            'telefono': '987654321',
            'puesto': 'Desarrollador Backend',
            'especialidad': 'Backend',
            'rol': rol_desarrollador,
            'activo': True
        },
        {
            'nombre': 'Carlos',
            'apellido': 'López',
            'identificacion': '45678912',
            'email': 'carlos.lopez@empresa.com',
            'telefono': '456789123',
            'puesto': 'Analista de Sistemas',
            'especialidad': 'Análisis de Sistemas',
            'rol': rol_analista,
            'activo': True
        },
        {
            'nombre': 'Ana',
            'apellido': 'Martínez',
            'identificacion': '78912345',
            'email': 'ana.martinez@empresa.com',
            'telefono': '789123456',
            'puesto': 'Gerente de Proyecto',
            'especialidad': 'Gestión de Proyectos',
            'rol': rol_gerente,
            'activo': True
        },
        {
            'nombre': 'Luis',
            'apellido': 'Rodríguez',
            'identificacion': '32165498',
            'email': 'luis.rodriguez@empresa.com',
            'telefono': '321654987',
            'puesto': 'Ingeniero DevOps',
            'especialidad': 'DevOps',
            'rol': rol_desarrollador,
            'activo': True
        },
        {
            'nombre': 'Sofia',
            'apellido': 'Hernández',
            'identificacion': '65498732',
            'email': 'sofia.hernandez@empresa.com',
            'telefono': '654987321',
            'puesto': 'Diseñadora UX/UI',
            'especialidad': 'Diseño UX/UI',
            'rol': rol_desarrollador,
            'activo': True
        },
        {
            'nombre': 'Diego',
            'apellido': 'Morales',
            'identificacion': '98765432',
            'email': 'diego.morales@empresa.com',
            'telefono': '987654321',
            'puesto': 'Tester QA',
            'especialidad': 'Testing',
            'rol': rol_analista,
            'activo': True
        },
        {
            'nombre': 'Carmen',
            'apellido': 'Jiménez',
            'identificacion': '14725836',
            'email': 'carmen.jimenez@empresa.com',
            'telefono': '147258369',
            'puesto': 'Scrum Master',
            'especialidad': 'Metodologías Ágiles',
            'rol': rol_gerente,
            'activo': True
        },
        {
            'nombre': 'Roberto',
            'apellido': 'Vargas',
            'identificacion': '36925814',
            'email': 'roberto.vargas@empresa.com',
            'telefono': '369258147',
            'puesto': 'Arquitecto de Software',
            'especialidad': 'Arquitectura de Software',
            'rol': rol_desarrollador,
            'activo': True
        },
        {
            'nombre': 'Lucía',
            'apellido': 'Torres',
            'identificacion': '75395148',
            'email': 'lucia.torres@empresa.com',
            'telefono': '753951486',
            'puesto': 'Product Owner',
            'especialidad': 'Gestión de Producto',
            'rol': rol_gerente,
            'activo': True
        }
    ]
    
    for emp_data in empleados_data:
        empleado, created = Empleado.objects.get_or_create(
            email=emp_data['email'],
            defaults=emp_data
        )
        if created:
            print(f"Empleado creado: {empleado.nombre} {empleado.apellido}")
        else:
            print(f"Empleado ya existe: {empleado.nombre} {empleado.apellido}")
    
    # Mostrar empleados activos
    print("\nEmpleados activos en la base de datos:")
    empleados = Empleado.objects.filter(activo=True)
    for emp in empleados:
        print(f"- {emp.nombre} {emp.apellido} ({emp.especialidad}) - {emp.rol.nombre if emp.rol else 'Sin rol'}")
    
    print(f"\nTotal de empleados activos: {empleados.count()}")

if __name__ == '__main__':
    create_test_employees()