from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.utils import timezone
from decimal import Decimal

from .models import OrdenCompraItem, MovimientoStock, AlertaStock


@receiver(pre_save, sender=OrdenCompraItem)
def calcular_total_linea(sender, instance, **kwargs):
    """Calcula automáticamente el total de la línea"""
    if instance.cantidad and instance.precio_unitario:
        instance.total_linea = instance.cantidad * instance.precio_unitario


@receiver(post_save, sender=OrdenCompraItem)
def actualizar_total_orden(sender, instance, **kwargs):
    """Actualiza el total de la orden cuando se modifica un item"""
    orden = instance.orden_compra
    orden.calcular_totales()
    orden.save(update_fields=['subtotal', 'impuestos', 'total'])


@receiver(post_save, sender=MovimientoStock)
def actualizar_stock_producto(sender, instance, created, **kwargs):
    """Actualiza el stock del producto cuando hay un movimiento"""
    if created:
        producto = instance.producto
        
        if instance.tipo == 'entrada':
            # Sumar al stock
            if hasattr(producto, 'stock'):
                producto.stock = (producto.stock or 0) + instance.cantidad
        elif instance.tipo == 'salida':
            # Restar del stock
            if hasattr(producto, 'stock'):
                producto.stock = max(0, (producto.stock or 0) - instance.cantidad)
        elif instance.tipo == 'ajuste':
            # Establecer el stock al valor especificado
            if hasattr(producto, 'stock'):
                producto.stock = instance.cantidad
        
        # Guardar el producto si tiene campo stock
        if hasattr(producto, 'stock'):
            producto.save(update_fields=['stock'])
            
            # Verificar si necesita alerta de stock mínimo
            if hasattr(producto, 'stock_minimo') and producto.stock_minimo:
                if producto.stock <= producto.stock_minimo:
                    # Verificar si ya existe una alerta activa
                    alerta_existente = AlertaStock.objects.filter(
                        producto=producto,
                        tipo='stock_minimo',
                        estado='activa'
                    ).exists()
                    
                    if not alerta_existente:
                        AlertaStock.objects.create(
                            tipo='stock_minimo',
                            producto=producto,
                            mensaje=f'Stock bajo: {producto.stock} unidades (mínimo: {producto.stock_minimo})',
                            valor_referencia=producto.stock
                        )


@receiver(post_save, sender=MovimientoStock)
def actualizar_costo_promedio(sender, instance, created, **kwargs):
    """Actualiza el costo promedio del producto cuando hay una entrada"""
    if created and instance.tipo == 'entrada' and instance.costo_unitario:
        producto = instance.producto
        
        # Solo actualizar si el producto tiene campo costo_promedio
        if hasattr(producto, 'costo_promedio'):
            # Obtener movimientos de entrada anteriores
            movimientos_entrada = MovimientoStock.objects.filter(
                producto=producto,
                tipo='entrada',
                costo_unitario__isnull=False
            ).order_by('fecha')
            
            # Calcular costo promedio móvil
            cantidad_total = Decimal('0')
            costo_total = Decimal('0')
            
            for mov in movimientos_entrada:
                cantidad_total += mov.cantidad
                costo_total += mov.cantidad * mov.costo_unitario
            
            if cantidad_total > 0:
                nuevo_costo_promedio = costo_total / cantidad_total
                producto.costo_promedio = nuevo_costo_promedio
                producto.save(update_fields=['costo_promedio'])


# Señal para generar alertas de precios atípicos
@receiver(post_save, sender='compras.HistorialPrecios')
def verificar_precio_atipico(sender, instance, created, **kwargs):
    """Verifica si el precio es atípico comparado con el historial"""
    if created:
        from django.db.models import Avg, StdDev
        from datetime import timedelta
        
        # Obtener precios de los últimos 90 días para el mismo producto
        fecha_limite = timezone.now().date() - timedelta(days=90)
        
        precios_historicos = sender.objects.filter(
            producto=instance.producto,
            fecha__date__gte=fecha_limite
        ).exclude(id=instance.id)
        
        if precios_historicos.count() >= 3:  # Necesitamos al menos 3 precios para comparar
            stats = precios_historicos.aggregate(
                promedio=Avg('precio'),
                desviacion=StdDev('precio')
            )
            
            promedio = stats['promedio']
            desviacion = stats['desviacion']
            
            if promedio and desviacion:
                # Considerar atípico si está fuera de 2 desviaciones estándar
                limite_superior = promedio + (2 * desviacion)
                limite_inferior = promedio - (2 * desviacion)
                
                if instance.precio > limite_superior or instance.precio < limite_inferior:
                    # Verificar si ya existe una alerta similar reciente
                    alerta_existente = AlertaStock.objects.filter(
                        producto=instance.producto,
                        tipo='precio_atipico',
                        estado__in=['activa', 'vista'],
                        fecha_creacion__date=timezone.now().date()
                    ).exists()
                    
                    if not alerta_existente:
                        variacion = ((instance.precio - promedio) / promedio) * 100
                        
                        AlertaStock.objects.create(
                            tipo='precio_atipico',
                            producto=instance.producto,
                            proveedor=instance.proveedor,
                            mensaje=f'Precio atípico: ${instance.precio} (promedio: ${promedio:.2f}, variación: {variacion:+.1f}%)',
                            valor_referencia=instance.precio
                        )