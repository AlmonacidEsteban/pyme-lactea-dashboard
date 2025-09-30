from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from .models import User, UserProfile


class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializador para el registro de nuevos usuarios
    """
    password = serializers.CharField(
        write_only=True,
        min_length=8,
        style={'input_type': 'password'}
    )
    password_confirm = serializers.CharField(
        write_only=True,
        style={'input_type': 'password'}
    )
    
    class Meta:
        model = User
        fields = (
            'username', 'email', 'password', 'password_confirm',
            'first_name', 'last_name', 'phone_number',
            'company_name', 'company_type', 'position'
        )
        extra_kwargs = {
            'email': {'required': True},
            'first_name': {'required': True},
            'last_name': {'required': True},
        }
    
    def validate_email(self, value):
        """Validar que el email sea único"""
        print(f"📧 REGISTRO SERIALIZER - Validando email: {value}")
        if User.objects.filter(email=value).exists():
            print(f"❌ REGISTRO SERIALIZER - Email ya existe: {value}")
            raise serializers.ValidationError(
                "Ya existe un usuario con este correo electrónico."
            )
        print(f"✅ REGISTRO SERIALIZER - Email válido: {value}")
        return value
    
    def validate_username(self, value):
        """Validar que el username sea único"""
        print(f"👤 REGISTRO SERIALIZER - Validando username: {value}")
        if User.objects.filter(username=value).exists():
            print(f"❌ REGISTRO SERIALIZER - Username ya existe: {value}")
            raise serializers.ValidationError(
                "Ya existe un usuario con este nombre de usuario."
            )
        print(f"✅ REGISTRO SERIALIZER - Username válido: {value}")
        return value
    
    def validate(self, attrs):
        """Validar que las contraseñas coincidan"""
        print(f"🔍 REGISTRO SERIALIZER - Validando datos completos: {list(attrs.keys())}")
        password = attrs.get('password')
        password_confirm = attrs.pop('password_confirm', None)
        
        print(f"🔐 REGISTRO SERIALIZER - Comparando contraseñas...")
        if password != password_confirm:
            print(f"❌ REGISTRO SERIALIZER - Contraseñas no coinciden")
            raise serializers.ValidationError({
                'password_confirm': 'Las contraseñas no coinciden.'
            })
        
        # Validar la fortaleza de la contraseña
        print(f"🔒 REGISTRO SERIALIZER - Validando fortaleza de contraseña...")
        try:
            validate_password(password)
            print(f"✅ REGISTRO SERIALIZER - Contraseña válida")
        except ValidationError as e:
            print(f"❌ REGISTRO SERIALIZER - Contraseña inválida: {e.messages}")
            raise serializers.ValidationError({
                'password': list(e.messages)
            })
        
        print(f"✅ REGISTRO SERIALIZER - Validación completa exitosa")
        return attrs
    
    def create(self, validated_data):
        """Crear un nuevo usuario"""
        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        
        # Crear perfil automáticamente
        UserProfile.objects.create(user=user)
        
        return user


class UserLoginSerializer(serializers.Serializer):
    """
    Serializador para el login de usuarios
    """
    identifier = serializers.CharField()  # Email o username
    password = serializers.CharField(style={'input_type': 'password'})
    
    def validate(self, attrs):
        identifier = attrs.get('identifier')
        password = attrs.get('password')
        
        print(f"🔍 SERIALIZER - Validando: identifier='{identifier}', password={'*' * len(password) if password else 'None'}")
        
        if identifier and password:
            # Intentar autenticar con email
            user = None
            if '@' in identifier:
                print(f"📧 SERIALIZER - Intentando autenticar con email: {identifier}")
                # Como USERNAME_FIELD = 'email', usamos el email directamente
                user = authenticate(
                    request=self.context.get('request'),
                    username=identifier,  # Django usará esto como email debido a USERNAME_FIELD
                    password=password
                )
                print(f"🔐 SERIALIZER - Resultado autenticación: {user is not None}")
            else:
                print(f"👤 SERIALIZER - Intentando autenticar con username: {identifier}")
                # Para username, necesitamos obtener el email del usuario
                try:
                    user_obj = User.objects.get(username=identifier)
                    print(f"✅ SERIALIZER - Usuario encontrado por username: {user_obj.email}")
                    user = authenticate(
                        request=self.context.get('request'),
                        username=user_obj.email,  # Usar email para autenticación
                        password=password
                    )
                    print(f"🔐 SERIALIZER - Resultado autenticación: {user is not None}")
                except User.DoesNotExist:
                    print(f"❌ SERIALIZER - No existe usuario con username: {identifier}")
                    pass
            
            if not user:
                print(f"❌ SERIALIZER - Autenticación falló para: {identifier}")
                raise serializers.ValidationError(
                    'Credenciales inválidas. Verifica tu email/usuario y contraseña.'
                )
            
            if not user.is_active:
                print(f"❌ SERIALIZER - Usuario inactivo: {identifier}")
                raise serializers.ValidationError(
                    'Esta cuenta ha sido desactivada.'
                )
            
            print(f"✅ SERIALIZER - Validación exitosa para usuario: {user.username}")
            attrs['user'] = user
            return attrs
        else:
            print(f"❌ SERIALIZER - Faltan credenciales: identifier={identifier}, password={bool(password)}")
            raise serializers.ValidationError(
                'Debes proporcionar email/usuario y contraseña.'
            )


class UserProfileSerializer(serializers.ModelSerializer):
    """
    Serializador para el perfil del usuario
    """
    class Meta:
        model = UserProfile
        fields = '__all__'
        read_only_fields = ('user', 'created_at', 'updated_at')


class UserSerializer(serializers.ModelSerializer):
    """
    Serializador para mostrar información del usuario
    """
    profile = UserProfileSerializer(read_only=True)
    full_name = serializers.CharField(source='get_full_name', read_only=True)
    
    class Meta:
        model = User
        fields = (
            'id', 'username', 'email', 'first_name', 'last_name',
            'full_name', 'phone_number', 'company_name', 'company_type',
            'position', 'profile_picture', 'is_verified', 'date_joined',
            'last_login', 'profile'
        )
        read_only_fields = (
            'id', 'date_joined', 'last_login', 'is_verified'
        )


class UserUpdateSerializer(serializers.ModelSerializer):
    """
    Serializador para actualizar información del usuario
    """
    class Meta:
        model = User
        fields = (
            'first_name', 'last_name', 'phone_number',
            'company_name', 'company_type', 'position', 'profile_picture'
        )
    
    def update(self, instance, validated_data):
        """Actualizar usuario"""
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


class ChangePasswordSerializer(serializers.Serializer):
    """
    Serializador para cambiar contraseña
    """
    old_password = serializers.CharField(style={'input_type': 'password'})
    new_password = serializers.CharField(
        style={'input_type': 'password'},
        min_length=8
    )
    new_password_confirm = serializers.CharField(style={'input_type': 'password'})
    
    def validate_old_password(self, value):
        """Validar contraseña actual"""
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError('Contraseña actual incorrecta.')
        return value
    
    def validate(self, attrs):
        """Validar que las nuevas contraseñas coincidan"""
        new_password = attrs.get('new_password')
        new_password_confirm = attrs.get('new_password_confirm')
        
        if new_password != new_password_confirm:
            raise serializers.ValidationError({
                'new_password_confirm': 'Las contraseñas no coinciden.'
            })
        
        # Validar fortaleza de la nueva contraseña
        try:
            validate_password(new_password)
        except ValidationError as e:
            raise serializers.ValidationError({
                'new_password': list(e.messages)
            })
        
        return attrs
    
    def save(self):
        """Cambiar contraseña"""
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user