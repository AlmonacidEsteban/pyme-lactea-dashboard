from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import login
from django.db import transaction
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

from .models import User, UserProfile
from .serializers import (
    UserRegistrationSerializer,
    UserLoginSerializer,
    UserSerializer,
    UserUpdateSerializer,
    UserProfileSerializer,
    ChangePasswordSerializer
)


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Serializador personalizado para JWT que incluye información del usuario
    """
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        # Agregar información personalizada al token
        token['user_id'] = user.id
        token['email'] = user.email
        token['username'] = user.username
        token['full_name'] = user.get_full_name()
        token['company_name'] = user.company_name
        
        return token


class CustomTokenObtainPairView(TokenObtainPairView):
    """
    Vista personalizada para obtener tokens JWT
    """
    serializer_class = CustomTokenObtainPairSerializer


@method_decorator(csrf_exempt, name='dispatch')
class UserRegistrationView(APIView):
    """
    Vista para registro de nuevos usuarios
    """
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        print(f"📝 REGISTRO - Datos recibidos: {request.data}")
        serializer = UserRegistrationSerializer(data=request.data)
        
        print(f"🔍 REGISTRO - Validando serializer...")
        if serializer.is_valid():
            print(f"✅ REGISTRO - Serializer válido, creando usuario...")
            try:
                with transaction.atomic():
                    user = serializer.save()
                    print(f"👤 REGISTRO - Usuario creado: {user.username} ({user.email})")
                    
                    # Generar tokens JWT
                    refresh = RefreshToken.for_user(user)
                    access_token = refresh.access_token
                    print(f"🔑 REGISTRO - Tokens generados exitosamente")
                    
                    # Serializar datos del usuario
                    user_serializer = UserSerializer(user)
                    
                    return Response({
                        'message': 'Usuario registrado exitosamente',
                        'user': user_serializer.data,
                        'tokens': {
                            'access': str(access_token),
                            'refresh': str(refresh),
                        }
                    }, status=status.HTTP_201_CREATED)
                    
            except Exception as e:
                print(f"💥 REGISTRO - Error en transacción: {str(e)}")
                return Response({
                    'error': 'Error al crear el usuario',
                    'details': str(e)
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        print(f"❌ REGISTRO - Errores de validación: {serializer.errors}")
        return Response({
            'error': 'Datos inválidos',
            'details': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name='dispatch')
class UserLoginView(APIView):
    """
    Vista para login de usuarios
    """
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        print(f"🔐 LOGIN - Datos recibidos: {request.data}")
        
        serializer = UserLoginSerializer(
            data=request.data,
            context={'request': request}
        )
        
        if serializer.is_valid():
            print("✅ LOGIN - Serializer válido")
            user = serializer.validated_data['user']
            print(f"✅ LOGIN - Usuario encontrado: {user.username} ({user.email})")
            
            # Generar tokens JWT
            refresh = RefreshToken.for_user(user)
            access_token = refresh.access_token
            
            # Actualizar último login
            login(request, user)
            
            # Serializar datos del usuario
            user_serializer = UserSerializer(user)
            
            print("✅ LOGIN - Login exitoso, enviando respuesta")
            return Response({
                'message': 'Login exitoso',
                'user': user_serializer.data,
                'tokens': {
                    'access': str(access_token),
                    'refresh': str(refresh),
                }
            }, status=status.HTTP_200_OK)
        
        print(f"❌ LOGIN - Errores de validación: {serializer.errors}")
        return Response({
            'error': 'Credenciales inválidas',
            'details': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class UserLogoutView(APIView):
    """
    Vista para logout de usuarios
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh_token')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            
            return Response({
                'message': 'Logout exitoso'
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                'error': 'Error al cerrar sesión',
                'details': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(generics.RetrieveUpdateAPIView):
    """
    Vista para ver y actualizar el perfil del usuario
    """
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user
    
    def update(self, request, *args, **kwargs):
        user = self.get_object()
        user_serializer = UserUpdateSerializer(
            user, 
            data=request.data, 
            partial=True
        )
        
        if user_serializer.is_valid():
            user_serializer.save()
            
            # Actualizar perfil si se proporcionan datos
            profile_data = request.data.get('profile', {})
            if profile_data:
                profile, created = UserProfile.objects.get_or_create(user=user)
                profile_serializer = UserProfileSerializer(
                    profile,
                    data=profile_data,
                    partial=True
                )
                if profile_serializer.is_valid():
                    profile_serializer.save()
            
            # Retornar datos actualizados
            updated_user = UserSerializer(user)
            return Response({
                'message': 'Perfil actualizado exitosamente',
                'user': updated_user.data
            }, status=status.HTTP_200_OK)
        
        return Response({
            'error': 'Datos inválidos',
            'details': user_serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class ChangePasswordView(APIView):
    """
    Vista para cambiar contraseña
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        serializer = ChangePasswordSerializer(
            data=request.data,
            context={'request': request}
        )
        
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Contraseña cambiada exitosamente'
            }, status=status.HTTP_200_OK)
        
        return Response({
            'error': 'Error al cambiar contraseña',
            'details': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def user_info(request):
    """
    Vista para obtener información del usuario autenticado
    """
    serializer = UserSerializer(request.user)
    return Response({
        'user': serializer.data
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def demo_login(request):
    """
    Vista para login con cuentas demo
    """
    demo_type = request.data.get('demo_type', 'restaurant')
    
    # Definir usuarios demo
    demo_users = {
        'restaurant': {
            'email': 'demo.restaurant@mipyme.com',
            'username': 'demo_restaurant',
            'password': 'demo123456',
            'first_name': 'Demo',
            'last_name': 'Restaurant',
            'company_name': 'Restaurante El Sabor',
            'company_type': 'Restaurante'
        },
        'retail': {
            'email': 'demo.retail@mipyme.com',
            'username': 'demo_retail',
            'password': 'demo123456',
            'first_name': 'Demo',
            'last_name': 'Retail',
            'company_name': 'Tienda La Esquina',
            'company_type': 'Comercio Minorista'
        },
        'services': {
            'email': 'demo.services@mipyme.com',
            'username': 'demo_services',
            'password': 'demo123456',
            'first_name': 'Demo',
            'last_name': 'Services',
            'company_name': 'Servicios Profesionales',
            'company_type': 'Servicios'
        }
    }
    
    if demo_type not in demo_users:
        return Response({
            'error': 'Tipo de demo inválido'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    demo_data = demo_users[demo_type]
    
    try:
        # Buscar o crear usuario demo
        user, created = User.objects.get_or_create(
            email=demo_data['email'],
            defaults={
                'username': demo_data['username'],
                'first_name': demo_data['first_name'],
                'last_name': demo_data['last_name'],
                'company_name': demo_data['company_name'],
                'company_type': demo_data['company_type'],
                'is_verified': True
            }
        )
        
        if created:
            user.set_password(demo_data['password'])
            user.save()
            UserProfile.objects.create(user=user)
        
        # Generar tokens JWT
        refresh = RefreshToken.for_user(user)
        access_token = refresh.access_token
        
        # Serializar datos del usuario
        user_serializer = UserSerializer(user)
        
        return Response({
            'message': f'Login demo exitoso - {demo_data["company_name"]}',
            'user': user_serializer.data,
            'tokens': {
                'access': str(access_token),
                'refresh': str(refresh),
            }
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'error': 'Error al crear usuario demo',
            'details': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
