from rest_framework.routers import DefaultRouter

from .views import ProductoViewSet, MarcaViewSet, CategoriaViewSet

router = DefaultRouter()
router.register(r"productos", ProductoViewSet, basename="producto")
router.register(r"marcas", MarcaViewSet, basename="marca")
router.register(r"categorias", CategoriaViewSet, basename="categoria")

urlpatterns = router.urls