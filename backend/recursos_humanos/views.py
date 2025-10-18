from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction

from .models import Empleado, PagoEmpleado, Equipo, Rol, AuditoriaEquipo, AuditoriaEmpleado
from .serializers import (
    EmpleadoSerializer, PagoEmpleadoSerializer, EquipoSerializer, 
    EquipoListSerializer, RolSerializer, AuditoriaEquipoSerializer, 
    AuditoriaEmpleadoSerializer
)


class EmpleadoViewSet(viewsets.ModelViewSet):
    queryset = Empleado.objects.select_related("equipo", "rol").all()
    serializer_class = EmpleadoSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["activo", "equipo", "rol", "turno"]
    search_fields = ["nombre", "apellido", "identificacion", "puesto", "email"]
    ordering_fields = ["nombre", "apellido", "identificacion", "fecha_ingreso"]
    ordering = ["apellido", "nombre"]

    def perform_create(self, serializer):
        """Crear empleado y registrar auditoría"""
        with transaction.atomic():
            empleado = serializer.save()
            AuditoriaEmpleado.objects.create(
                empleado=empleado,
                accion='crear',
                usuario=self.request.user,
                datos_nuevos=serializer.data,
                comentario=f"Empleado creado por {self.request.user.username}"
            )

    def perform_update(self, serializer):
        """Actualizar empleado y registrar auditoría"""
        with transaction.atomic():
            datos_anteriores = EmpleadoSerializer(serializer.instance).data
            empleado = serializer.save()
            AuditoriaEmpleado.objects.create(
                empleado=empleado,
                accion='modificar',
                usuario=self.request.user,
                datos_anteriores=datos_anteriores,
                datos_nuevos=serializer.data,
                comentario=f"Empleado modificado por {self.request.user.username}"
            )

    @action(detail=True, methods=['post'])
    def cambiar_equipo(self, request, pk=None):
        """Cambiar empleado de equipo"""
        empleado = self.get_object()
        nuevo_equipo_id = request.data.get('equipo_id')
        
        if not nuevo_equipo_id:
            return Response(
                {'error': 'Se requiere equipo_id'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            nuevo_equipo = Equipo.objects.get(id=nuevo_equipo_id)
        except Equipo.DoesNotExist:
            return Response(
                {'error': 'Equipo no encontrado'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        with transaction.atomic():
            equipo_anterior = empleado.equipo
            empleado.equipo = nuevo_equipo
            empleado.save()
            
            AuditoriaEmpleado.objects.create(
                empleado=empleado,
                accion='cambiar_equipo',
                usuario=request.user,
                datos_anteriores={'equipo': equipo_anterior.id if equipo_anterior else None},
                datos_nuevos={'equipo': nuevo_equipo.id},
                comentario=f"Empleado cambiado de equipo por {request.user.username}"
            )
        
        return Response({'message': 'Equipo cambiado exitosamente'})


class PagoEmpleadoViewSet(viewsets.ModelViewSet):
    queryset = PagoEmpleado.objects.select_related("empleado", "aprobado_por").all()
    serializer_class = PagoEmpleadoSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["empleado", "fecha", "aprobado_por"]
    search_fields = ["empleado__nombre", "empleado__apellido", "concepto"]
    ordering_fields = ["fecha", "monto"]
    ordering = ["-fecha", "-id"]

    def perform_create(self, serializer):
        """Crear pago y asignar usuario que aprueba"""
        serializer.save(aprobado_por=self.request.user)


class RolViewSet(viewsets.ModelViewSet):
    queryset = Rol.objects.all()
    serializer_class = RolSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["activo"]
    search_fields = ["nombre", "descripcion"]
    ordering_fields = ["nombre"]
    ordering = ["nombre"]


class EquipoViewSet(viewsets.ModelViewSet):
    queryset = Equipo.objects.select_related("creado_por").prefetch_related("miembros").all()
    serializer_class = EquipoSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["activo", "tipo"]
    search_fields = ["nombre", "descripcion"]
    ordering_fields = ["nombre", "fecha_creacion"]
    ordering = ["nombre"]

    def get_serializer_class(self):
        """Usar serializer simplificado para listados"""
        if self.action == 'list':
            return EquipoListSerializer
        return EquipoSerializer

    def perform_create(self, serializer):
        """Crear equipo y registrar auditoría"""
        with transaction.atomic():
            # Extraer datos de líder y miembros antes de crear el equipo
            lider_id = self.request.data.get('lider_id')
            miembros_ids = self.request.data.get('miembros_ids', [])
            
            # Crear el equipo
            equipo = serializer.save(creado_por=self.request.user)
            
            # Asignar líder si se especifica
            if lider_id:
                try:
                    lider = Empleado.objects.get(id=lider_id)
                    equipo.lider = lider
                    equipo.save()
                    # Asegurar que el líder también pertenezca al equipo
                    if lider.equipo_id != equipo.id:
                        lider.equipo = equipo
                        lider.save()
                except Empleado.DoesNotExist:
                    pass
            
            # Asignar miembros si se especifican
            if miembros_ids:
                empleados = Empleado.objects.filter(id__in=miembros_ids)
                for empleado in empleados:
                    empleado.equipo = equipo
                    empleado.save()
            
            AuditoriaEquipo.objects.create(
                equipo=equipo,
                accion='crear',
                usuario=self.request.user,
                datos_nuevos=serializer.data,
                comentario=f"Equipo creado por {self.request.user.username}"
            )

    def perform_update(self, serializer):
        """Actualizar equipo y registrar auditoría"""
        with transaction.atomic():
            datos_anteriores = EquipoSerializer(serializer.instance).data
            
            # Extraer datos de líder y miembros
            lider_id = self.request.data.get('lider_id')
            miembros_ids = self.request.data.get('miembros_ids', None)
            
            # Actualizar el equipo
            equipo = serializer.save()
            
            # Actualizar líder
            if lider_id:
                try:
                    lider = Empleado.objects.get(id=lider_id)
                    equipo.lider = lider
                    # Asegurar que el líder también pertenezca al equipo
                    if lider.equipo_id != equipo.id:
                        lider.equipo = equipo
                        lider.save()
                except Empleado.DoesNotExist:
                    equipo.lider = None
            else:
                equipo.lider = None
            equipo.save()
            
            # Actualizar miembros solo si se envía miembros_ids en la solicitud
            if miembros_ids is not None:
                # Primero remover todos los miembros actuales, preservando al líder si existe
                lider_actual = equipo.lider
                qs_remover = Empleado.objects.filter(equipo=equipo)
                if lider_actual:
                    qs_remover = qs_remover.exclude(id=lider_actual.id)
                qs_remover.update(equipo=None)
                
                # Luego asignar los nuevos miembros
                if miembros_ids:
                    empleados = Empleado.objects.filter(id__in=miembros_ids)
                    for empleado in empleados:
                        empleado.equipo = equipo
                        empleado.save()
            
            AuditoriaEquipo.objects.create(
                equipo=equipo,
                accion='modificar',
                usuario=self.request.user,
                datos_anteriores=datos_anteriores,
                datos_nuevos=serializer.data,
                comentario=f"Equipo modificado por {self.request.user.username}"
            )

    @action(detail=True, methods=['get'])
    def miembros(self, request, pk=None):
        """Obtener miembros del equipo"""
        equipo = self.get_object()
        miembros = equipo.miembros.filter(activo=True)
        serializer = EmpleadoSerializer(miembros, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def agregar_miembro(self, request, pk=None):
        """Agregar miembro al equipo"""
        equipo = self.get_object()
        empleado_id = request.data.get('empleado_id')
        
        if not empleado_id:
            return Response(
                {'error': 'Se requiere empleado_id'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            empleado = Empleado.objects.get(id=empleado_id)
        except Empleado.DoesNotExist:
            return Response(
                {'error': 'Empleado no encontrado'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        with transaction.atomic():
            equipo_anterior = empleado.equipo
            empleado.equipo = equipo
            empleado.save()
            
            AuditoriaEmpleado.objects.create(
                empleado=empleado,
                accion='cambiar_equipo',
                usuario=request.user,
                datos_anteriores={'equipo': equipo_anterior.id if equipo_anterior else None},
                datos_nuevos={'equipo': equipo.id},
                comentario=f"Empleado agregado al equipo {equipo.nombre} por {request.user.username}"
            )
        
        return Response({'message': 'Miembro agregado exitosamente'})

    @action(detail=True, methods=['post'])
    def remover_miembro(self, request, pk=None):
        """Remover miembro del equipo"""
        equipo = self.get_object()
        empleado_id = request.data.get('empleado_id')
        
        if not empleado_id:
            return Response(
                {'error': 'Se requiere empleado_id'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            empleado = Empleado.objects.get(id=empleado_id, equipo=equipo)
        except Empleado.DoesNotExist:
            return Response(
                {'error': 'Empleado no encontrado en este equipo'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        with transaction.atomic():
            empleado.equipo = None
            empleado.save()
            
            AuditoriaEmpleado.objects.create(
                empleado=empleado,
                accion='cambiar_equipo',
                usuario=request.user,
                datos_anteriores={'equipo': equipo.id},
                datos_nuevos={'equipo': None},
                comentario=f"Empleado removido del equipo {equipo.nombre} por {request.user.username}"
            )
        
        return Response({'message': 'Miembro removido exitosamente'})

    @action(detail=True, methods=['get'])
    def auditoria(self, request, pk=None):
        """Obtener historial de auditoría del equipo"""
        equipo = self.get_object()
        auditoria = equipo.auditoria.all()
        serializer = AuditoriaEquipoSerializer(auditoria, many=True)
        return Response(serializer.data)


class AuditoriaEquipoViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AuditoriaEquipo.objects.select_related("equipo", "usuario").all()
    serializer_class = AuditoriaEquipoSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["equipo", "accion", "usuario"]
    search_fields = ["equipo__nombre", "usuario__username", "comentario"]
    ordering_fields = ["fecha"]
    ordering = ["-fecha"]


class AuditoriaEmpleadoViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AuditoriaEmpleado.objects.select_related("empleado", "usuario").all()
    serializer_class = AuditoriaEmpleadoSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["empleado", "accion", "usuario"]
    search_fields = ["empleado__nombre", "empleado__apellido", "usuario__username", "comentario"]
    ordering_fields = ["fecha"]
    ordering = ["-fecha"]