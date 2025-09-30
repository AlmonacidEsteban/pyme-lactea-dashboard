import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";
import { 
  Building2, 
  Eye, 
  EyeOff, 
  Mail, 
  Lock,
  Phone,
  User,
  ArrowLeft,
  Shield,
  CheckCircle
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../contexts/AuthContext";

interface SignUpProps {
  onBackToLogin: () => void;
}

export function SignUp({ onBackToLogin }: SignUpProps) {
  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    company_name: "",
    company_type: "",
    position: "",
    password: "",
    password_confirm: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  
  const { register, authState, clearError } = useAuth();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.username.trim()) {
      toast.error("El nombre de usuario es requerido");
      return false;
    }

    if (!formData.first_name.trim()) {
      toast.error("El nombre es requerido");
      return false;
    }

    if (!formData.last_name.trim()) {
      toast.error("El apellido es requerido");
      return false;
    }

    if (!formData.email.trim() || !formData.email.includes("@")) {
      toast.error("Por favor ingresa un email válido");
      return false;
    }

    if (formData.phone_number && formData.phone_number.length < 10) {
      toast.error("Por favor ingresa un número de teléfono válido");
      return false;
    }

    if (formData.password.length < 8) {
      toast.error("La contraseña debe tener al menos 8 caracteres");
      return false;
    }

    if (formData.password !== formData.password_confirm) {
      toast.error("Las contraseñas no coinciden");
      return false;
    }

    if (!acceptTerms) {
      toast.error("Debes aceptar los términos y condiciones");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('📝 SignUp - Iniciando proceso de registro...');
    console.log('📝 SignUp - Datos del formulario:', formData);
    
    if (!validateForm()) {
      console.log('❌ SignUp - Validación del formulario falló');
      return;
    }

    clearError();
    
    try {
      console.log('🚀 SignUp - Llamando a register...');
      await register(formData);
      
      console.log('✅ SignUp - Registro exitoso!');
      toast.success("¡Registro exitoso! Bienvenido a Mi PyME Láctea");
      
      // El registro exitoso será manejado automáticamente por el AuthContext
      // y el componente App.tsx detectará el cambio de estado de autenticación
      console.log('🔄 SignUp - Esperando redirección automática al dashboard...');
      
    } catch (error) {
      console.error('❌ SignUp - Error en registro:', error);
      
      // Mostrar error específico al usuario
      if (error instanceof Error) {
        toast.error(`Error en el registro: ${error.message}`);
      } else {
        toast.error('Error desconocido en el registro');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E12A6] via-[#1E12A6] to-[#F005CD] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
        {/* Left Side - Branding */}
        <div className="text-white space-y-8 lg:pr-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Building2 className="w-12 h-12" />
              <h1 className="text-4xl font-bold">Mi PyME Láctea</h1>
            </div>
            <p className="text-xl text-white/90">
              Únete a la plataforma líder para PyMEs de la industria láctea
            </p>
            <p className="text-white/80">
              Gestiona tu producción, ventas, inventario y finanzas desde un solo lugar. 
              Optimiza tu negocio lácteo con herramientas especializadas.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Seguridad Garantizada</h3>
                <p className="text-white/80 text-sm">Tus datos están protegidos con encriptación de nivel bancario</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Verificación Dual</h3>
                <p className="text-white/80 text-sm">Verifica tu cuenta por email o SMS para mayor seguridad</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Sign Up Form */}
        <div className="flex items-center justify-center py-4">
          <Card className="w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="space-y-1 text-center py-4">
              <CardTitle className="text-xl">Crear Cuenta</CardTitle>
              <p className="text-muted-foreground text-sm">
                Registra tu PyME láctea
              </p>
              {!import.meta.env.DEV && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-600" />
                    <span className="text-blue-800 font-medium text-sm">Modo Demo</span>
                  </div>
                  <p className="text-blue-700 text-xs mt-1">
                    Esta es una versión de demostración. Puedes registrarte con cualquier información para probar la plataforma.
                  </p>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-3 pb-4">
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="username">Nombre de Usuario</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="username"
                      type="text"
                      placeholder="Nombre de usuario único"
                      value={formData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="first_name">Nombre</Label>
                    <Input
                      id="first_name"
                      type="text"
                      placeholder="Tu nombre"
                      value={formData.first_name}
                      onChange={(e) => handleInputChange('first_name', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="last_name">Apellido</Label>
                    <Input
                      id="last_name"
                      type="text"
                      placeholder="Tu apellido"
                      value={formData.last_name}
                      onChange={(e) => handleInputChange('last_name', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="tu@email.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone_number">Teléfono (Opcional)</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="phone_number"
                      type="tel"
                      placeholder="+56 9 1234 5678"
                      value={formData.phone_number}
                      onChange={(e) => handleInputChange('phone_number', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company_name">Empresa</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="company_name"
                      type="text"
                      placeholder="Nombre de tu empresa láctea"
                      value={formData.company_name}
                      onChange={(e) => handleInputChange('company_name', e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company_type">Tipo de Empresa</Label>
                    <select
                      id="company_type"
                      value={formData.company_type}
                      onChange={(e) => handleInputChange('company_type', e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Seleccionar tipo</option>
                      <option value="dairy_farm">Granja Lechera</option>
                      <option value="dairy_processor">Procesadora Láctea</option>
                      <option value="distributor">Distribuidor</option>
                      <option value="retailer">Minorista</option>
                      <option value="other">Otro</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">Cargo (Opcional)</Label>
                    <Input
                      id="position"
                      type="text"
                      placeholder="Tu cargo en la empresa"
                      value={formData.position}
                      onChange={(e) => handleInputChange('position', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Mínimo 8 caracteres"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password_confirm">Confirmar Contraseña</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password_confirm"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Repite tu contraseña"
                      value={formData.password_confirm}
                      onChange={(e) => handleInputChange('password_confirm', e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="terms" 
                    checked={acceptTerms}
                    onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                  />
                  <Label htmlFor="terms" className="text-sm">
                    Acepto los <a href="#" className="text-[#1E12A6] hover:underline">términos y condiciones</a>
                  </Label>
                </div>

                {authState.error && (
                  <div className="text-red-500 text-sm text-center">
                    {authState.error}
                  </div>
                )}

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
                  {authState.isLoading ? "Creando cuenta..." : "Crear Cuenta"}
                </Button>
              </form>

              <div className="relative">
                <Separator className="my-4" />
                <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-sm text-muted-foreground">
                  ¿Ya tienes cuenta?
                </span>
              </div>

              <Button 
                variant="outline" 
                className="w-full"
                onClick={onBackToLogin}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}