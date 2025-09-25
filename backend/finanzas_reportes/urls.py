from rest_framework.routers import DefaultRouter

from .views import MovimientoFinancieroViewSet, PagoClienteViewSet

router = DefaultRouter()
router.register(r"pagos", PagoClienteViewSet, basename="pago-cliente")
router.register(r"movimientos", MovimientoFinancieroViewSet, basename="movimiento-financiero")

urlpatterns = router.urls