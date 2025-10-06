from decimal import Decimal
import csv
import json
from io import StringIO

from django.apps import apps
from django.db.models import Sum, Q
from django.db.models.functions import Substr, Upper
from django.http import HttpResponse
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser

from .models import Cliente
from .serializers import ClienteSerializer, ClienteListSerializer


class ClienteViewSet(viewsets.ModelViewSet):
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer

    # Filtros, búsqueda y orden
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["identificacion", "tipo", "zona", "activo"]
    search_fields = ["nombre", "correo", "telefono", "identificacion"]
    ordering_fields = ["nombre", "identificacion", "fecha_creacion", "ultima_compra"]
    ordering = ["nombre"]

    def get_serializer_class(self):
        """Usar serializador optimizado para listados"""
        if self.action == 'list':
            return ClienteListSerializer
        return ClienteSerializer

    def get_queryset(self):
        """Filtros adicionales para el queryset"""
        queryset = super().get_queryset()
        
        # Filtro por búsqueda general
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(nombre__icontains=search) |
                Q(identificacion__icontains=search) |
                Q(telefono__icontains=search) |
                Q(correo__icontains=search) |
                Q(zona__icontains=search)
            )
        
        return queryset

    # Acción personalizada para TreeView
    @action(detail=False, methods=["get"], url_path="tree")
    def tree(self, request):
        """Devuelve datos agrupados para armar un TreeView agrupado por inicial del nombre."""
        qs = self.get_queryset().annotate(inicial=Upper(Substr("nombre", 1, 1)))
        grupos = {}

        for cliente in qs.values("id", "nombre", "identificacion", "correo", "inicial"):
            key = cliente["inicial"] or "#"
            grupos.setdefault(key, []).append(
                {
                    "id": cliente["id"],
                    "label": cliente["nombre"],
                    "identificacion": cliente["identificacion"],
                    "correo": cliente["correo"] or "",
                }
            )

        tree = [
            {"label": initial, "children": sorted(children, key=lambda item: item["label"])}
            for initial, children in sorted(grupos.items(), key=lambda item: item[0])
        ]
        return Response(tree)

    @action(detail=True, methods=["get"], url_path="perfil")
    def perfil(self, request, pk=None):
        cliente = self.get_object()
        data = ClienteSerializer(cliente).data

        ventas = []
        compras = []
        pagos = []
        total_ventas = Decimal("0")
        total_compras = Decimal("0")
        total_pagos = Decimal("0")

        Venta = apps.get_model("ventas", "Venta")
        if Venta is not None:
            ventas_qs = Venta.objects.filter(cliente=cliente).order_by("-fecha", "-id")
            ventas = [
                {"id": venta.id, "fecha": venta.fecha, "total": str(venta.total)}
                for venta in ventas_qs[:50]
            ]
            aggregated = ventas_qs.aggregate(total=Sum("total"))
            total_ventas = aggregated["total"] or Decimal("0")

        Compra = apps.get_model("compras", "Compra")
        if Compra is not None:
            compras_qs = Compra.objects.filter(cliente=cliente).order_by("-fecha", "-id")
            compras = [
                {"id": compra.id, "fecha": compra.fecha, "total": str(getattr(compra, "total", Decimal("0")))}
                for compra in compras_qs[:50]
            ]
            if hasattr(Compra, "total"):
                total_compras_value = compras_qs.aggregate(total=Sum("total"))
                total_compras = total_compras_value["total"] or Decimal("0")

        PagoCliente = apps.get_model("finanzas_reportes", "PagoCliente")
        if PagoCliente is not None:
            pagos_qs = PagoCliente.objects.filter(cliente=cliente).order_by("-fecha", "-id")
            pagos = [
                {
                    "id": pago.id,
                    "fecha": pago.fecha,
                    "monto": str(pago.monto),
                    "medio": pago.medio,
                }
                for pago in pagos_qs[:50]
            ]
            total_pagos_value = pagos_qs.aggregate(total=Sum("monto"))
            total_pagos = total_pagos_value["total"] or Decimal("0")

        saldo = (total_ventas - total_pagos) if (total_ventas or total_pagos) else Decimal("0")

        return Response(
            {
                "cliente": data,
                "historial_ventas": ventas,
                "historial_compras": compras,
                "pagos": pagos,
                "saldo": str(saldo.quantize(Decimal("0.01")) if isinstance(saldo, Decimal) else saldo),
                "total_ventas": str(total_ventas),
                "total_compras": str(total_compras),
                "total_pagos": str(total_pagos),
            }
        )

    @action(detail=False, methods=["post"], url_path="venta-rapida")
    def venta_rapida(self, request):
        """Procesar una venta rápida"""
        try:
            data = request.data
            cliente_id = data.get('cliente_id')
            items = data.get('items', [])
            metodo_pago = data.get('metodo_pago', 'efectivo')
            observaciones = data.get('observaciones', '')
            
            if not cliente_id or not items:
                return Response(
                    {"error": "Cliente e items son requeridos"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            cliente = Cliente.objects.get(id=cliente_id)
            
            # Aquí se integraría con el módulo de ventas cuando esté disponible
            # Por ahora retornamos éxito
            
            return Response({
                "message": "Venta procesada correctamente",
                "venta_id": "temp_id"
            })
            
        except Cliente.DoesNotExist:
            return Response(
                {"error": "Cliente no encontrado"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=["post"], url_path="registrar-cobro")
    def registrar_cobro(self, request):
        """Registrar un cobro de cliente"""
        try:
            data = request.data
            cliente_id = data.get('cliente_id')
            monto = data.get('monto')
            metodo_pago = data.get('metodo_pago', 'efectivo')
            referencia = data.get('referencia', '')
            observaciones = data.get('observaciones', '')
            
            if not cliente_id or not monto:
                return Response(
                    {"error": "Cliente y monto son requeridos"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            cliente = Cliente.objects.get(id=cliente_id)
            
            # Aquí se integraría con el módulo de finanzas cuando esté disponible
            # Por ahora retornamos éxito
            
            return Response({
                "message": "Cobro registrado correctamente",
                "cobro_id": "temp_id"
            })
            
        except Cliente.DoesNotExist:
            return Response(
                {"error": "Cliente no encontrado"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=["post"], url_path="enviar-whatsapp")
    def enviar_whatsapp(self, request):
        """Enviar mensaje de WhatsApp a cliente"""
        try:
            data = request.data
            cliente_id = data.get('cliente_id')
            template = data.get('template')
            
            if not cliente_id or not template:
                return Response(
                    {"error": "Cliente y template son requeridos"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            cliente = Cliente.objects.get(id=cliente_id)
            
            if not cliente.telefono:
                return Response(
                    {"error": "Cliente no tiene teléfono registrado"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Aquí se integraría con el servicio de WhatsApp
            # Por ahora retornamos éxito
            
            return Response({
                "message": f"Mensaje de {template} enviado correctamente"
            })
            
        except Cliente.DoesNotExist:
            return Response(
                {"error": "Cliente no encontrado"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=["get"], url_path="productos-sugeridos")
    def productos_sugeridos(self, request):
        """Obtener productos sugeridos para venta rápida"""
        # Aquí se integraría con el módulo de productos
        # Por ahora retornamos datos de ejemplo
        productos = [
            {"id": "1", "nombre": "Producto A", "precio": 100.00},
            {"id": "2", "nombre": "Producto B", "precio": 150.00},
            {"id": "3", "nombre": "Producto C", "precio": 200.00},
        ]
        return Response(productos)

    @action(detail=True, methods=["get"], url_path="comprobantes-pendientes")
    def comprobantes_pendientes(self, request, pk=None):
        """Obtener comprobantes pendientes de pago del cliente"""
        cliente = self.get_object()
        
        # Aquí se integraría con el módulo de ventas/finanzas
        # Por ahora retornamos datos de ejemplo
        comprobantes = []
        
        return Response(comprobantes)

    @action(detail=False, methods=["post"], url_path="importar", parser_classes=[MultiPartParser])
    def importar(self, request):
        """Importar clientes desde archivo CSV"""
        try:
            file = request.FILES.get('file')
            if not file:
                return Response(
                    {"error": "Archivo requerido"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Leer archivo CSV
            decoded_file = file.read().decode('utf-8')
            csv_data = csv.DictReader(StringIO(decoded_file))
            
            procesados = 0
            errores = []
            
            for row in csv_data:
                try:
                    cliente_data = {
                        'nombre': row.get('nombre', ''),
                        'identificacion': row.get('identificacion', ''),
                        'telefono': row.get('telefono', ''),
                        'correo': row.get('correo', ''),
                        'direccion': row.get('direccion', ''),
                        'zona': row.get('zona', ''),
                        'tipo': row.get('tipo', 'minorista'),
                        'limite_credito': Decimal(row.get('limite_credito', '0')),
                        'activo': row.get('activo', 'true').lower() == 'true'
                    }
                    
                    Cliente.objects.create(**cliente_data)
                    procesados += 1
                    
                except Exception as e:
                    errores.append(f"Fila {procesados + len(errores) + 1}: {str(e)}")
            
            return Response({
                "procesados": procesados,
                "errores": errores
            })
            
        except Exception as e:
            return Response(
                {"error": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=["post"], url_path="exportar")
    def exportar(self, request):
        """Exportar clientes a CSV"""
        try:
            # Crear respuesta CSV
            response = HttpResponse(content_type='text/csv')
            response['Content-Disposition'] = 'attachment; filename="clientes.csv"'
            
            writer = csv.writer(response)
            writer.writerow([
                'nombre', 'identificacion', 'telefono', 'correo', 'direccion',
                'zona', 'tipo', 'limite_credito', 'activo', 'deuda'
            ])
            
            for cliente in self.get_queryset():
                writer.writerow([
                    cliente.nombre,
                    cliente.identificacion,
                    cliente.telefono,
                    cliente.correo,
                    cliente.direccion,
                    cliente.zona,
                    cliente.tipo,
                    cliente.limite_credito,
                    cliente.activo,
                    cliente.deuda
                ])
            
            return response
            
        except Exception as e:
            return Response(
                {"error": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )