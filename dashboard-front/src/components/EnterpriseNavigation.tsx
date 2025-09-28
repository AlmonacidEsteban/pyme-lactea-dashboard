import { Button } from "./ui/button";
import { 
  LayoutDashboard, 
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
  FileText
} from "lucide-react";

interface NavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function EnterpriseNavigation({ activeSection, onSectionChange }: NavigationProps) {
  const navigationItems = [
    { id: 'dashboard', label: 'Director del Panel', icon: LayoutDashboard },
    { id: 'team', label: 'Equipo', icon: Users },
    { id: 'purchases', label: 'Compras', icon: ShoppingCart },
    { id: 'production', label: 'Centro de Producción', icon: Factory },
    { id: 'products', label: 'Productos', icon: Package },
    { id: 'suppliers', label: 'Proveedores', icon: Truck },
    { id: 'sales', label: 'Ventas', icon: DollarSign },
    { id: 'finances', label: 'Finanzas', icon: BarChart3 },
    { id: 'clients', label: 'Clientes', icon: UserCheck },
    { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
    { id: 'calendar', label: 'Calendario', icon: Calendar },
    { id: 'reports', label: 'Informes', icon: FileText },
    { id: 'settings', label: 'Configuración', icon: Settings },
  ];

  return (
    <div className="w-64 bg-card border-r border-border h-full p-4">
      <div className="flex items-center gap-2 mb-8">
        <Building2 className="w-8 h-8 text-primary" />
        <h1 className="text-xl font-semibold">Mi PyME Lácteos</h1>
      </div>
      
      <nav className="space-y-2">
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
    </div>
  );
}