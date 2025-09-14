import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Separator } from "./ui/separator";
import { 
  Building2, 
  Eye, 
  EyeOff, 
  Mail, 
  Lock,
  ArrowRight,
  Shield,
  Users,
  MessageSquare
} from "lucide-react";
import { toast } from "sonner@2.0.3";

interface SignInProps {
  onSignIn: (userData: { email: string; name: string; role: string }) => void;
}

export function SignIn({ onSignIn }: SignInProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    if (!email.includes("@")) {
      toast.error("Por favor ingresa un email válido");
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Demo users
      const demoUsers = [
        { email: "admin@empresa.com", password: "admin123", name: "Administrador", role: "Admin" },
        { email: "manager@empresa.com", password: "manager123", name: "Gerente", role: "Manager" },
        { email: "user@empresa.com", password: "user123", name: "Usuario", role: "User" },
        { email: "demo@demo.com", password: "demo", name: "Demo User", role: "Admin" }
      ];

      const user = demoUsers.find(u => u.email === email && u.password === password);
      
      if (user) {
        toast.success(`¡Bienvenido, ${user.name}!`);
        onSignIn({
          email: user.email,
          name: user.name,
          role: user.role
        });
      } else {
        toast.error("Credenciales incorrectas");
      }
      
      setIsLoading(false);
    }, 1500);
  };

  const features = [
    {
      icon: Shield,
      title: "Seguridad Empresarial",
      description: "Protección avanzada de datos"
    },
    {
      icon: Users,
      title: "Gestión de Equipos",
      description: "Administra tu equipo eficientemente"
    },
    {
      icon: MessageSquare,
      title: "WhatsApp Business",
      description: "Comunicación directa con clientes"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E12A6] via-[#1E12A6] to-[#F005CD] flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
        {/* Left Side - Branding & Features */}
        <div className="text-white space-y-8 lg:pr-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Building2 className="w-12 h-12" />
              <h1 className="text-4xl font-bold">EnterprisePro</h1>
            </div>
            <p className="text-xl text-white/90">
              La plataforma completa para gestionar tu pequeña empresa
            </p>
            <p className="text-white/80">
              Administra proyectos, equipos, finanzas y clientes desde un solo lugar. 
              Con integración de WhatsApp Business y notificaciones en tiempo real.
            </p>
          </div>

          <div className="space-y-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex items-start gap-4">
                  <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-white/80 text-sm">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <h4 className="font-semibold mb-2">Credenciales de Demo:</h4>
            <div className="space-y-1 text-sm text-white/90">
              <p><strong>Admin:</strong> demo@demo.com / demo</p>
              <p><strong>Gerente:</strong> manager@empresa.com / manager123</p>
              <p><strong>Usuario:</strong> user@empresa.com / user123</p>
            </div>
          </div>
        </div>

        {/* Right Side - Sign In Form */}
        <div className="flex items-center justify-center">
          <Card className="w-full max-w-md shadow-2xl">
            <CardHeader className="space-y-2 text-center">
              <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
              <p className="text-muted-foreground">
                Accede a tu cuenta empresarial
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="tu@empresa.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
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
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-auto p-1"
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

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="remember" 
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    />
                    <Label 
                      htmlFor="remember" 
                      className="text-sm font-normal cursor-pointer"
                    >
                      Recordarme
                    </Label>
                  </div>
                  <Button 
                    variant="link" 
                    className="text-[#F005CD] hover:text-[#F005CD]/80 p-0 h-auto font-normal"
                  >
                    ¿Olvidaste tu contraseña?
                  </Button>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-[#1E12A6] hover:bg-[#1E12A6]/90 gap-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Iniciando sesión...
                    </>
                  ) : (
                    <>
                      Iniciar Sesión
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>

              <div className="space-y-4">
                <div className="relative">
                  <Separator className="my-4" />
                  <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-sm text-muted-foreground">
                    o
                  </span>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full"
                  type="button"
                >
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continuar con Google
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                  ¿No tienes una cuenta?{" "}
                  <Button 
                    variant="link" 
                    className="text-[#F005CD] hover:text-[#F005CD]/80 p-0 h-auto font-medium"
                  >
                    Registrarse
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}