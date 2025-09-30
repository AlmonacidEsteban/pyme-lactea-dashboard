import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { Separator } from '../ui/separator';
import { useAuth } from '../../contexts/AuthContext';

interface LoginProps {
  onSwitchToSignUp: () => void;
}

export default function Login({ onSwitchToSignUp }: LoginProps) {
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const { login, demoLogin, authState, clearError } = useAuth();

  // Limpiar errores cuando el componente se monta
  React.useEffect(() => {
    clearError();
  }, []); // Dependencias vacías para ejecutar solo al montar

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!identifier || !password) {
      console.log('❌ Login: Faltan credenciales');
      return;
    }

    try {
      console.log('🔐 Login: Iniciando proceso de login...', { identifier });
      
      await login({
        identifier,
        password,
      });

      console.log('✅ Login: Proceso completado exitosamente');
      console.log('🎯 Login: Estado actual de auth:', authState);
      
      // El login exitoso será manejado automáticamente por el AuthContext
      // y el componente App.tsx detectará el cambio de estado de autenticación
      // No necesitamos navigate() aquí porque no estamos usando rutas de React Router
    } catch (error) {
      // El error ya se maneja en el contexto
      console.error('❌ Login: Error en el proceso:', error);
    }
  };

  const handleDemoLogin = async (type: 'restaurant' | 'retail' | 'services') => {
    clearError();
    
    try {
      console.log('🎯 Demo Login: Iniciando login demo...', type);
      await demoLogin(type);
      console.log('✅ Demo Login: Completado exitosamente');
      
      // La redirección será manejada automáticamente por AuthContext y App.tsx
      // cuando el estado de autenticación cambie a true
    } catch (error) {
      console.error('❌ Demo Login: Error en el proceso:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto mb-4 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-2xl text-white">🥛</span>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Mi Pyme Láctea
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Gestiona tu negocio lácteo de manera eficiente
            </p>
            {!import.meta.env.DEV && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                <div className="flex items-center gap-2">
                  <span className="text-blue-600">🎯</span>
                  <span className="text-blue-800 font-medium text-sm">Modo Demo</span>
                </div>
                <p className="text-blue-700 text-xs mt-1">
                  Puedes iniciar sesión con cualquier credencial para probar la plataforma.
                </p>
              </div>
            )}
          </CardHeader>

          <CardContent className="space-y-6">
            {authState.error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                {authState.error}
              </div>
            )}

            <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setLoginMethod('email')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  loginMethod === 'email'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                📧 Email
              </button>
              <button
                type="button"
                onClick={() => setLoginMethod('phone')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  loginMethod === 'phone'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                📱 Teléfono
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="identifier">
                  {loginMethod === 'email' ? 'Correo electrónico' : 'Número de teléfono'}
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    {loginMethod === 'email' ? '📧' : '📱'}
                  </span>
                  <Input
                    id="identifier"
                    type={loginMethod === 'email' ? 'email' : 'tel'}
                    placeholder={
                      loginMethod === 'email'
                        ? 'tu@email.com'
                        : '+1234567890'
                    }
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    🔒
                  </span>
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Tu contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  />
                  <Label htmlFor="remember" className="text-sm text-gray-600">
                    Recordarme
                  </Label>
                </div>
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              <Button 
                type="submit" 
                className="w-full font-semibold border-2 border-black"
                style={{
                  backgroundColor: '#000000 !important',
                  color: '#FFFFFF !important',
                  border: '2px solid #000000'
                }}
                disabled={authState.isLoading}
              >
                {authState.isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Iniciando sesión...
                  </>
                ) : (
                  <>🔐 Iniciar Sesión</>
                )}
              </Button>
            </form>

            <Separator />

            <div className="space-y-3">
              <p className="text-sm text-gray-600 text-center">
                Cuentas de demostración:
              </p>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleDemoLogin('restaurant')}
                  className="text-xs"
                  disabled={authState.isLoading}
                >
                  🍽️ Restaurante
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleDemoLogin('retail')}
                  className="text-xs"
                  disabled={authState.isLoading}
                >
                  🛍️ Retail
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleDemoLogin('services')}
                  className="text-xs"
                  disabled={authState.isLoading}
                >
                  🔧 Servicios
                </Button>
              </div>
            </div>

            <Separator />

            <div className="text-center">
              <p className="text-sm text-gray-600">
                ¿No tienes una cuenta?{' '}
                <button
                  onClick={onSwitchToSignUp}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Regístrate aquí
                </button>
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">
                ✨ Características principales:
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>✓ Gestión completa de inventario</li>
                <li>✓ Control de ventas y finanzas</li>
                <li>✓ Reportes detallados</li>
                <li>✓ Gestión de clientes y proveedores</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}