import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Switch } from "./ui/switch";
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  MapPin,
  Shield,
  Settings,
  Bell,
  Save,
  Edit3,
  Camera
} from "lucide-react";
import { toast } from "sonner@2.0.3";

interface User {
  email: string;
  name: string;
  role: string;
}

interface UserProfileProps {
  user: User;
  onUpdateUser: (userData: User) => void;
}

export function UserProfile({ user, onUpdateUser }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: "+1 (555) 123-4567",
    company: "Mi Empresa S.A.",
    position: user.role,
    location: "Ciudad de México, México"
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    whatsappNotifications: true,
    projectReminders: true,
    paymentAlerts: true,
    weeklyReports: false
  });

  const handleSave = () => {
    // Update user data
    const updatedUser = {
      ...user,
      name: formData.name,
      email: formData.email
    };
    
    onUpdateUser(updatedUser);
    setIsEditing(false);
    toast.success("Perfil actualizado correctamente");
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      email: user.email,
      phone: "+1 (555) 123-4567",
      company: "Mi Empresa S.A.",
      position: user.role,
      location: "Ciudad de México, México"
    });
    setIsEditing(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Mi Perfil</h1>
          <p className="text-muted-foreground">Administra tu información personal y preferencias de cuenta.</p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                Cancelar
              </Button>
              <Button onClick={handleSave} className="bg-[#1E12A6] hover:bg-[#1E12A6]/90">
                <Save className="w-4 h-4 mr-2" />
                Guardar Cambios
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} className="bg-[#F005CD] hover:bg-[#F005CD]/90">
              <Edit3 className="w-4 h-4 mr-2" />
              Editar Perfil
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información Personal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar className="w-20 h-20">
                    <AvatarFallback className="bg-[#1E12A6] text-white text-2xl">
                      {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute -bottom-2 -right-2 h-8 w-8 p-0 rounded-full"
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-semibold">{user.name}</h3>
                  <p className="text-muted-foreground">{user.email}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="bg-[#F005CD] hover:bg-[#F005CD]/90">
                      {user.role}
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                      <Shield className="w-3 h-3" />
                      Verificado
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre Completo</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      disabled={!isEditing}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      disabled={!isEditing}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      disabled={!isEditing}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Empresa</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                      disabled={!isEditing}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position">Cargo</Label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="position"
                      value={formData.position}
                      onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                      disabled={!isEditing}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Ubicación</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      disabled={!isEditing}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Preferencias de Notificación
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Notificaciones por Email</h4>
                  <p className="text-sm text-muted-foreground">Recibe actualizaciones importantes por email</p>
                </div>
                <Switch
                  checked={notifications.emailNotifications}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, emailNotifications: checked }))
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Notificaciones WhatsApp</h4>
                  <p className="text-sm text-muted-foreground">Alertas sobre mensajes de WhatsApp Business</p>
                </div>
                <Switch
                  checked={notifications.whatsappNotifications}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, whatsappNotifications: checked }))
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Recordatorios de Proyectos</h4>
                  <p className="text-sm text-muted-foreground">Notificaciones sobre plazos y entregas</p>
                </div>
                <Switch
                  checked={notifications.projectReminders}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, projectReminders: checked }))
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Alertas de Pagos</h4>
                  <p className="text-sm text-muted-foreground">Notificaciones sobre pagos y facturas</p>
                </div>
                <Switch
                  checked={notifications.paymentAlerts}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, paymentAlerts: checked }))
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Reportes Semanales</h4>
                  <p className="text-sm text-muted-foreground">Resumen semanal de actividades</p>
                </div>
                <Switch
                  checked={notifications.weeklyReports}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, weeklyReports: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Estadísticas Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Proyectos Activos</span>
                  <Badge variant="default" className="bg-[#1E12A6] hover:bg-[#1E12A6]/90">8</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Mensajes WhatsApp</span>
                  <Badge variant="default" className="bg-[#F005CD] hover:bg-[#F005CD]/90">127</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Clientes Activos</span>
                  <Badge variant="outline">15</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Tareas Pendientes</span>
                  <Badge variant="secondary">23</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actividad Reciente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <p className="font-medium">Último acceso</p>
                <p className="text-muted-foreground">Hace 5 minutos</p>
              </div>
              <div className="text-sm">
                <p className="font-medium">Proyecto actualizado</p>
                <p className="text-muted-foreground">Website Redesign - Hace 2 horas</p>
              </div>
              <div className="text-sm">
                <p className="font-medium">Mensaje enviado</p>
                <p className="text-muted-foreground">WhatsApp a TechCorp - Hace 3 horas</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Configuración de Cuenta
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                Cambiar Contraseña
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Configurar 2FA
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Exportar Datos
              </Button>
              <Separator />
              <Button variant="destructive" className="w-full justify-start">
                Eliminar Cuenta
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}