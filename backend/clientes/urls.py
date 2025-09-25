from rest_framework.routers import DefaultRouter
from .views import ClienteViewSet

router = DefaultRouter()
router.register(r"", ClienteViewSet)  # manejará /api/clientes/

urlpatterns = router.urls
