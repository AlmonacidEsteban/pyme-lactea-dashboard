import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { 
  Users, 
  ShoppingCart, 
  DollarSign, 
  UserCheck, 
  Calendar, 
  BarChart3,
  Settings,
  Building2,
  Factory,
  Package,
  Truck,
  MessageCircle,
  FileText,
  LogOut,
  User
} from "lucide-react";

interface NavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  user?: any;
  onLogout?: () => void;
}

export function EnterpriseNavigation({ activeSection, onSectionChange, user, onLogout }: NavigationProps) {
  const navigationItems = [
    { id: 'team', label: 'Recursos Humanos', icon: UserCheck },
    { id: 'purchases', label: 'Compras', icon: ShoppingCart },
    { id: 'production', label: 'Centro de Producción', icon: Factory },
    { id: 'products', label: 'Productos', icon: Package },
    { id: 'suppliers', label: 'Proveedores', icon: Truck },
    { id: 'sales', label: 'Ventas', icon: DollarSign },
    { id: 'finances', label: 'Finanzas', icon: BarChart3 },
    { id: 'clients', label: 'Clientes', icon: Users },
    { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
    { id: 'calendar', label: 'Calendario', icon: Calendar },
    { id: 'reports', label: 'Informes', icon: FileText },
    { id: 'settings', label: 'Configuración', icon: Settings },
  ];

  const getUserInitials = () => {
    if (!user?.name) return "U";
    return user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase();
  };

  return (
    <div className="w-64 bg-card border-r border-border h-full p-4 flex flex-col">
      <div className="flex items-center gap-2 mb-8">
        <Building2 className="w-8 h-8 text-primary" />
        <h1 className="text-xl font-semibold">Mi PyME Lácteos</h1>
      </div>
      
      <nav className="space-y-2 flex-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant={activeSection === item.id ? "default" : "ghost"}
              className="w-full justify-start gap-3"
              onClick={() => onSectionChange(item.id)}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Button>
          );
        })}
      </nav>

      {/* User Section */}
      {user && (
        <div className="mt-auto">
          <Separator className="mb-4" />
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="text-xs">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user.company}</p>
              </div>
            </div>
            
            {onLogout && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
                onClick={onLogout}
              >
                <LogOut className="w-4 h-4" />
                Cerrar Sesión
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}