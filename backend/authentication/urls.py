from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

app_name = 'authentication'

urlpatterns = [
    # Autenticación básica
    path('register/', views.UserRegistrationView.as_view(), name='register'),
    path('login/', views.UserLoginView.as_view(), name='login'),
    path('logout/', views.UserLogoutView.as_view(), name='logout'),
    
    # JWT Token endpoints
    path('token/', views.CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Perfil de usuario
    path('profile/', views.UserProfileView.as_view(), name='profile'),
    path('user-info/', views.user_info, name='user_info'),
    
    # Cambio de contraseña
    path('change-password/', views.ChangePasswordView.as_view(), name='change_password'),
    
    # Login demo
    path('demo-login/', views.demo_login, name='demo_login'),
]