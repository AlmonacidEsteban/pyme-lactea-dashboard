import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { 
  LayoutDashboard, 
  Users, 
  FolderOpen, 
  DollarSign, 
  UserCheck, 
  Calendar, 
  BarChart3,
  Settings,
  Building2,
  MessageSquare,
  Bell,
  LogOut,
  User
} from "lucide-react";

interface User {
  email: string;
  name: string;
  role: string;
}

interface NavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onNotificationClick: () => void;
  unreadNotifications: number;
  user: User;
  onSignOut: () => void;
}

export function EnterpriseNavigation({ activeSection, onSectionChange, onNotificationClick, unreadNotifications, user, onSignOut }: NavigationProps) {
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'projects', label: 'Projects', icon: FolderOpen },
    { id: 'finances', label: 'Finances', icon: DollarSign },
    { id: 'clients', label: 'Clients', icon: UserCheck },
    { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-card border-r border-border h-full p-4 flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Building2 className="w-8 h-8 text-primary" />
          <h1 className="text-xl font-semibold">EnterprisePro</h1>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onNotificationClick}
          className="relative p-2"
        >
          <Bell className="w-5 h-5" />
          {unreadNotifications > 0 && (
            <Badge 
              variant="default" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-[#F005CD] hover:bg-[#F005CD]/90 text-xs"
            >
              {unreadNotifications > 9 ? '9+' : unreadNotifications}
            </Badge>
          )}
        </Button>
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

      {/* User Profile Section */}
      <div className="mt-auto space-y-4">
        <Separator />
        
        <div className="flex items-center gap-3 p-2">
          <Avatar>
            <AvatarFallback className="bg-[#1E12A6] text-white">
              {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            <Badge variant="outline" className="text-xs mt-1">
              {user.role}
            </Badge>
          </div>
        </div>

        <div className="space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2"
            onClick={() => onSectionChange('profile')}
          >
            <User className="w-4 h-4" />
            Mi Perfil
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-red-600 hover:text-red-600 hover:bg-red-50"
            onClick={onSignOut}
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </div>
  );
}