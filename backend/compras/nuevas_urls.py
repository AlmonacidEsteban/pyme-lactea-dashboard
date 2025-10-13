# NUEVAS URLS PARA EL MÓDULO DE COMPRAS EXTENDIDO
from rest_framework.routers import DefaultRouter
from django.urls import path, include

# Importar las nuevas vistas (cuando se integren)
# from .nuevas_views import (
#     OrdenCompraViewSet, MovimientoStockViewSet, HistorialPreciosViewSet,
#     AlertaStockViewSet, ComprasReportesViewSet
# )

# Router para las nuevas APIs
router = DefaultRouter()

# Registrar los nuevos ViewSets
# router.register(r'ordenes', OrdenCompraViewSet, basename='orden-compra')
# router.register(r'movimientos-stock', MovimientoStockViewSet, basename='movimiento-stock')
# router.register(r'historial-precios', HistorialPreciosViewSet, basename='historial-precios')
# router.register(r'alertas', AlertaStockViewSet, basename='alerta-stock')
# router.register(r'reportes', ComprasReportesViewSet, basename='compras-reportes')

# URLs adicionales para funcionalidades específicas
urlpatterns = [
    # Incluir las rutas del router
    path('api/v1/', include(router.urls)),
    
    # URLs personalizadas adicionales si son necesarias
    # path('api/v1/ordenes/<int:orden_id>/pdf/', views.generar_pdf_orden, name='orden-pdf'),
    # path('api/v1/stock/alertas/configurar/', views.configurar_alertas_stock, name='configurar-alertas'),
    # path('api/v1/reportes/dashboard/', views.dashboard_compras, name='dashboard-compras'),
]

# Comentario: Estas URLs se integrarán en el urls.py principal cuando los modelos estén listos
# Para integrar, agregar en compras/urls.py:
# from django.urls import path, include
# from .nuevas_urls import urlpatterns as nuevas_urls
# 
# urlpatterns = router.urls + [
#     path('v2/', include(nuevas_urls)),
# ]