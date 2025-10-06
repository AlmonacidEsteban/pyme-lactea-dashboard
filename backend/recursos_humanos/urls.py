from rest_framework.routers import DefaultRouter

from .views import (
    EmpleadoViewSet, 
    PagoEmpleadoViewSet, 
    EquipoViewSet, 
    RolViewSet,
    AuditoriaEquipoViewSet,
    AuditoriaEmpleadoViewSet
)

router = DefaultRouter()
router.register(r"empleados", EmpleadoViewSet, basename="empleado")
router.register(r"pagos", PagoEmpleadoViewSet, basename="pago-empleado")
router.register(r"equipos", EquipoViewSet, basename="equipo")
router.register(r"roles", RolViewSet, basename="rol")
router.register(r"auditoria-equipos", AuditoriaEquipoViewSet, basename="auditoria-equipo")
router.register(r"auditoria-empleados", AuditoriaEmpleadoViewSet, basename="auditoria-empleado")

urlpatterns = router.urls