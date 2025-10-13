from rest_framework.routers import DefaultRouter

from .views import (
    CategoriaCompraViewSet, 
    CompraViewSet,
    OrdenCompraViewSet,
    MovimientoStockViewSet,
    HistorialPreciosViewSet,
    AlertaStockViewSet,
    ComprasReportesViewSet
)

router = DefaultRouter()
router.register(r"categorias", CategoriaCompraViewSet, basename="categoria-compra")
router.register(r"ordenes", OrdenCompraViewSet, basename="orden-compra")
router.register(r"movimientos-stock", MovimientoStockViewSet, basename="movimiento-stock")
router.register(r"historial-precios", HistorialPreciosViewSet, basename="historial-precios")
router.register(r"alertas-stock", AlertaStockViewSet, basename="alerta-stock")
router.register(r"reportes", ComprasReportesViewSet, basename="compras-reportes")
router.register(r"", CompraViewSet, basename="compra")

urlpatterns = router.urls