from rest_framework.routers import DefaultRouter

from .views import ProveedorViewSet, CuentaPorPagarViewSet

router = DefaultRouter()
router.register(r"proveedores", ProveedorViewSet, basename="proveedor")
router.register(r"cuentas-por-pagar", CuentaPorPagarViewSet, basename="cuenta-por-pagar")

urlpatterns = router.urls