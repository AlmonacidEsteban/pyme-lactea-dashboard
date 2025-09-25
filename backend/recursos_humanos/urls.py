from rest_framework.routers import DefaultRouter

from .views import EmpleadoViewSet, PagoEmpleadoViewSet

router = DefaultRouter()
router.register(r"empleados", EmpleadoViewSet, basename="empleado")
router.register(r"pagos", PagoEmpleadoViewSet, basename="pago-empleado")

urlpatterns = router.urls