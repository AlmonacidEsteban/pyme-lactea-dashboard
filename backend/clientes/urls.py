from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ClienteViewSet, RubroViewSet

# /api/clientes/ -> lista y detalle de clientes
cliente_router = DefaultRouter()
cliente_router.register(r"", ClienteViewSet, basename="cliente")

# Exportamos RubroViewSet para usar en core/urls.py
# Ya no incluimos rubros aquí para evitar conflictos de enrutamiento

urlpatterns = [
    path("", include(cliente_router.urls)),            # /api/clientes/
]
