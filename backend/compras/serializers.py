from decimal import Decimal

from rest_framework import serializers

from productos.models import Producto
from proveedores.models import Proveedor
from .models import (
    CategoriaCompra, Compra, CompraLinea,
    OrdenCompra, OrdenCompraItem, MovimientoStock,
    HistorialPrecios, AlertaStock
)


class CategoriaCompraSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoriaCompra
        fields = ("id", "nombre", "descripcion")


class CompraLineaSerializer(serializers.ModelSerializer):
    producto = serializers.PrimaryKeyRelatedField(
        queryset=Producto.objects.all(), allow_null=True, required=False
    )
    subtotal = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    producto_nombre = serializers.CharField(source="producto.nombre", read_only=True)

    class Meta:
        model = CompraLinea
        fields = (
            "id",
            "producto",
            "producto_nombre",
            "descripcion",
            "cantidad",
            "kilaje",
            "precio_unitario",
            "total_linea",
            "subtotal",
        )

    def validate(self, attrs):
        cantidad = attrs.get("cantidad")
        kilaje = attrs.get("kilaje")
        precio = attrs.get("precio_unitario")
        total_linea = attrs.get("total_linea")
        producto = attrs.get("producto")

        def is_positive(value):
            return value is not None and value > 0

        if not any(map(is_positive, (cantidad, kilaje, total_linea))):
            raise serializers.ValidationError(
                "Debes especificar cantidad, kilaje o un total_linea para la compra."
            )

        if total_linea is None:
            if precio is None or precio <= 0:
                raise serializers.ValidationError(
                    "Si no indicas total_linea debes indicar precio_unitario positivo."
                )
        if cantidad is not None and cantidad <= 0:
            raise serializers.ValidationError("La cantidad debe ser mayor a cero si se informa.")
        if kilaje is not None and kilaje <= 0:
            raise serializers.ValidationError("El kilaje debe ser mayor a cero si se informa.")
        if total_linea is not None and total_linea <= 0:
            raise serializers.ValidationError("El total_linea debe ser mayor a cero si se informa.")
        if producto and not any(map(is_positive, (cantidad, kilaje))):
            raise serializers.ValidationError(
                "Para actualizar el stock del producto debes informar cantidad o kilaje."
            )
        return attrs


class CompraSerializer(serializers.ModelSerializer):
    proveedor_nombre = serializers.CharField(source="proveedor.nombre", read_only=True)
    categoria_nombre = serializers.CharField(source="categoria.nombre", read_only=True)
    lineas = CompraLineaSerializer(many=True)

    class Meta:
        model = Compra
        fields = (
            "id",
            "fecha",
            "numero",
            "proveedor",
            "proveedor_nombre",
            "categoria",
            "categoria_nombre",
            "total",
            "notas",
            "lineas",
        )

    def _build_lineas(self, compra: Compra, lineas_data):
        total = Decimal("0")

        # revert stock from existing lines
        for linea in compra.lineas.select_related("producto"):
            if linea.producto and linea.unidades_para_stock > 0:
                linea.producto.quitar_stock(linea.unidades_para_stock)
        compra.lineas.all().delete()

        for linea_data in lineas_data:
            linea = CompraLinea.objects.create(compra=compra, **linea_data)
            subtotal = linea.subtotal
            total += subtotal
            if linea.producto and linea.unidades_para_stock > 0:
                linea.producto.agregar_stock(linea.unidades_para_stock)
        compra.total = total
        compra.save(update_fields=["total"])
        return total

    def create(self, validated_data):
        lineas_data = validated_data.pop("lineas", [])
        compra = Compra.objects.create(**validated_data)
        total = self._build_lineas(compra, lineas_data)
        self._sync_movimiento_financiero(compra, total)
        return compra

    def update(self, instance, validated_data):
        lineas_data = validated_data.pop("lineas", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if lineas_data is not None:
            total = self._build_lineas(instance, lineas_data)
        else:
            total = instance.recalcular_total()
        self._sync_movimiento_financiero(instance, total)
        return instance

    def _sync_movimiento_financiero(self, compra: Compra, total):
        from finanzas_reportes.models import MovimientoFinanciero

        descripcion = f"Compra #{compra.numero or compra.id} - {compra.proveedor.nombre}"
        movimiento, _created = MovimientoFinanciero.objects.get_or_create(
            compra=compra,
            defaults={
                "fecha": compra.fecha,
                "tipo": MovimientoFinanciero.Tipo.EGRESO,
                "origen": MovimientoFinanciero.Origen.COMPRA,
                "monto": total,
                "descripcion": descripcion,
            },
        )
        if not _created:
            movimiento.fecha = compra.fecha
            movimiento.monto = total
            movimiento.tipo = MovimientoFinanciero.Tipo.EGRESO
            movimiento.origen = MovimientoFinanciero.Origen.COMPRA
            movimiento.descripcion = descripcion
            movimiento.save(update_fields=["fecha", "monto", "tipo", "descripcion"])


# Nuevos serializers para el módulo extendido de compras

class OrdenCompraItemSerializer(serializers.ModelSerializer):
    producto_nombre = serializers.CharField(source="producto.nombre", read_only=True)
    producto_codigo = serializers.CharField(source="producto.codigo", read_only=True)
    cantidad_pendiente = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    esta_completo = serializers.BooleanField(read_only=True)

    class Meta:
        model = OrdenCompraItem
        fields = [
            'id', 'producto', 'producto_nombre', 'producto_codigo',
            'cantidad_solicitada', 'cantidad_recibida', 'cantidad_pendiente',
            'precio_unitario', 'subtotal', 'esta_completo', 'notas'
        ]
        read_only_fields = ['subtotal']


class OrdenCompraSerializer(serializers.ModelSerializer):
    proveedor_nombre = serializers.CharField(source="proveedor.nombre", read_only=True)
    creado_por_nombre = serializers.CharField(source="creado_por.username", read_only=True)
    aprobado_por_nombre = serializers.CharField(source="aprobado_por.username", read_only=True)
    items = OrdenCompraItemSerializer(many=True, read_only=True)
    estado_display = serializers.CharField(source="get_estado_display", read_only=True)

    class Meta:
        model = OrdenCompra
        fields = [
            'id', 'numero', 'proveedor', 'proveedor_nombre',
            'fecha_creacion', 'fecha_envio', 'fecha_entrega_esperada',
            'fecha_entrega_real', 'estado', 'estado_display',
            'subtotal', 'impuestos', 'total', 'notas',
            'creado_por', 'creado_por_nombre', 'aprobado_por', 'aprobado_por_nombre',
            'items'
        ]
        read_only_fields = ['numero', 'subtotal', 'impuestos', 'total', 'creado_por']

    def create(self, validated_data):
        # Generar número de orden automáticamente
        ultimo_numero = OrdenCompra.objects.filter(
            numero__startswith='OC-'
        ).order_by('-numero').first()
        
        if ultimo_numero:
            try:
                ultimo_num = int(ultimo_numero.numero.split('-')[1])
                nuevo_numero = f"OC-{ultimo_num + 1:06d}"
            except (ValueError, IndexError):
                nuevo_numero = "OC-000001"
        else:
            nuevo_numero = "OC-000001"
        
        validated_data['numero'] = nuevo_numero
        validated_data['creado_por'] = self.context['request'].user
        
        return super().create(validated_data)


class MovimientoStockSerializer(serializers.ModelSerializer):
    producto_nombre = serializers.CharField(source="producto.nombre", read_only=True)
    producto_codigo = serializers.CharField(source="producto.codigo", read_only=True)
    usuario_nombre = serializers.CharField(source="usuario.username", read_only=True)
    tipo_display = serializers.CharField(source="get_tipo_display", read_only=True)

    class Meta:
        model = MovimientoStock
        fields = [
            'id', 'producto', 'producto_nombre', 'producto_codigo',
            'tipo', 'tipo_display', 'cantidad', 'costo_unitario',
            'fecha', 'referencia', 'orden_compra_item',
            'usuario', 'usuario_nombre', 'notas'
        ]
        read_only_fields = ['usuario', 'fecha']

    def create(self, validated_data):
        validated_data['usuario'] = self.context['request'].user
        return super().create(validated_data)


class HistorialPreciosSerializer(serializers.ModelSerializer):
    producto_nombre = serializers.CharField(source="producto.nombre", read_only=True)
    producto_codigo = serializers.CharField(source="producto.codigo", read_only=True)
    proveedor_nombre = serializers.CharField(source="proveedor.nombre", read_only=True)

    class Meta:
        model = HistorialPrecios
        fields = [
            'id', 'producto', 'producto_nombre', 'producto_codigo',
            'proveedor', 'proveedor_nombre', 'precio', 'fecha',
            'orden_compra_item', 'cantidad_comprada'
        ]
        read_only_fields = ['fecha']


class AlertaStockSerializer(serializers.ModelSerializer):
    producto_nombre = serializers.CharField(source="producto.nombre", read_only=True)
    producto_codigo = serializers.CharField(source="producto.codigo", read_only=True)
    proveedor_nombre = serializers.CharField(source="proveedor.nombre", read_only=True)
    resuelto_por_nombre = serializers.CharField(source="resuelto_por.username", read_only=True)
    tipo_display = serializers.CharField(source="get_tipo_display", read_only=True)
    estado_display = serializers.CharField(source="get_estado_display", read_only=True)

    class Meta:
        model = AlertaStock
        fields = [
            'id', 'tipo', 'tipo_display', 'producto', 'producto_nombre', 'producto_codigo',
            'proveedor', 'proveedor_nombre', 'mensaje', 'estado', 'estado_display',
            'fecha_creacion', 'fecha_resolucion', 'resuelto_por', 'resuelto_por_nombre',
            'valor_referencia'
        ]
        read_only_fields = ['fecha_creacion', 'fecha_resolucion', 'resuelto_por']


# Serializers para reportes y estadísticas
class EstadisticasComprasSerializer(serializers.Serializer):
    total_compras = serializers.IntegerField()
    monto_total = serializers.DecimalField(max_digits=12, decimal_places=2)
    promedio_por_orden = serializers.DecimalField(max_digits=12, decimal_places=2)
    ahorro_estimado = serializers.DecimalField(max_digits=12, decimal_places=2)
    ordenes_pendientes = serializers.IntegerField()
    ordenes_completadas = serializers.IntegerField()
    proveedores_activos = serializers.IntegerField()


class ResumenProveedorSerializer(serializers.Serializer):
    proveedor_id = serializers.IntegerField()
    proveedor_nombre = serializers.CharField()
    total_compras = serializers.IntegerField()
    monto_total = serializers.DecimalField(max_digits=12, decimal_places=2)
    promedio_compra = serializers.DecimalField(max_digits=12, decimal_places=2)


class ResumenCategoriaSerializer(serializers.Serializer):
    categoria_id = serializers.IntegerField()
    categoria_nombre = serializers.CharField()
    total_compras = serializers.IntegerField()
    monto_total = serializers.DecimalField(max_digits=12, decimal_places=2)