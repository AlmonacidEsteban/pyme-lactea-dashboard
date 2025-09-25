from rest_framework.routers import DefaultRouter

from .views import CategoriaCompraViewSet, CompraViewSet

router = DefaultRouter()
router.register(r"categorias", CategoriaCompraViewSet, basename="categoria-compra")
router.register(r"", CompraViewSet, basename="compra")

urlpatterns = router.urls