import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { 
  Building2, 
  Mail, 
  Phone,
  ArrowLeft,
  Shield,
  Clock,
  RefreshCw
} from "lucide-react";
import { toast } from "sonner";

interface VerificationProps {
  userData: {
    email: string;
    phone: string;
    name: string;
    company: string;
    verificationMethod: 'email' | 'sms';
  };
  onVerificationComplete: (userData: any) => void;
  onBackToSignUp: () => void;
}

export function Verification({ userData, onVerificationComplete, onBackToSignUp }: VerificationProps) {
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (verificationCode.length !== 6) {
      toast.error("El código debe tener 6 dígitos");
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // For demo purposes, accept any 6-digit code
      if (verificationCode.length === 6) {
        toast.success("¡Verificación exitosa! Bienvenido a Mi PyME Láctea");
        onVerificationComplete({
          ...userData,
          isVerified: true,
          verificationCode
        });
      } else {
        toast.error("Código de verificación incorrecto");
      }
      setIsLoading(false);
    }, 2000);
  };

  const handleResendCode = async () => {
    if (!canResend) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success(`Nuevo código enviado a tu ${userData.verificationMethod === 'email' ? 'email' : 'teléfono'}`);
      setTimeLeft(300);
      setCanResend(false);
      setIsLoading(false);
    }, 1000);
  };

  const handleCodeChange = (value: string) => {
    // Only allow numbers and limit to 6 digits
    const numericValue = value.replace(/\D/g, '').slice(0, 6);
    setVerificationCode(numericValue);
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
              Verificación de Seguridad
            </p>
            <p className="text-white/80">
              Para proteger tu cuenta y datos, necesitamos verificar tu identidad. 
              Hemos enviado un código de verificación a tu {userData.verificationMethod === 'email' ? 'email' : 'teléfono'}.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Verificación Segura</h3>
                <p className="text-white/80 text-sm">
                  El código expira en {formatTime(timeLeft)} por tu seguridad
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                {userData.verificationMethod === 'email' ? (
                  <Mail className="w-6 h-6" />
                ) : (
                  <Phone className="w-6 h-6" />
                )}
              </div>
              <div>
                <h3 className="font-semibold mb-1">Código Enviado</h3>
                <p className="text-white/80 text-sm">
                  {userData.verificationMethod === 'email' 
                    ? `Revisa tu email: ${userData.email}`
                    : `Revisa tu teléfono: ${userData.phone}`
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Verification Form */}
        <div className="flex items-center justify-center">
          <Card className="w-full max-w-md shadow-2xl">
            <CardHeader className="space-y-2 text-center">
              <CardTitle className="text-2xl">Verificar Cuenta</CardTitle>
              <p className="text-muted-foreground">
                Ingresa el código de 6 dígitos
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-2">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    {userData.verificationMethod === 'email' ? (
                      <Mail className="w-4 h-4" />
                    ) : (
                      <Phone className="w-4 h-4" />
                    )}
                    <span>
                      Código enviado a: {userData.verificationMethod === 'email' 
                        ? userData.email 
                        : userData.phone
                      }
                    </span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleVerification} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="code">Código de Verificación</Label>
                  <Input
                    id="code"
                    type="text"
                    placeholder="123456"
                    value={verificationCode}
                    onChange={(e) => handleCodeChange(e.target.value)}
                    className="text-center text-2xl font-mono tracking-widest"
                    maxLength={6}
                    required
                  />
                  <p className="text-xs text-muted-foreground text-center">
                    Ingresa el código de 6 dígitos que recibiste
                  </p>
                </div>

                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>
                      {timeLeft > 0 
                        ? `El código expira en ${formatTime(timeLeft)}`
                        : "El código ha expirado"
                      }
                    </span>
                  </div>
                  
                  {canResend && (
                    <Button
                      type="button"
                      variant="link"
                      onClick={handleResendCode}
                      disabled={isLoading}
                      className="text-[#1E12A6] p-0 h-auto"
                    >
                      <RefreshCw className="w-4 h-4 mr-1" />
                      Reenviar código
                    </Button>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-[#1E12A6] hover:bg-[#1E12A6]/90"
                  disabled={isLoading || verificationCode.length !== 6}
                >
                  {isLoading ? "Verificando..." : "Verificar Cuenta"}
                </Button>
              </form>

              <div className="text-center">
                <Button 
                  variant="outline" 
                  onClick={onBackToSignUp}
                  className="w-full"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver al Registro
                </Button>
              </div>

              <div className="text-center text-xs text-muted-foreground">
                <p>¿No recibiste el código?</p>
                <p>Revisa tu carpeta de spam o intenta con el otro método de verificación.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}