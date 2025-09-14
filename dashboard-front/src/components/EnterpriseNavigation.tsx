import { Button } from "./ui/button";
import { 
  LayoutDashboard, 
  Users, 
  FolderOpen, 
  DollarSign, 
  UserCheck, 
  Calendar, 
  BarChart3,
  Settings,
  Building2
} from "lucide-react";

interface NavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function EnterpriseNavigation({ activeSection, onSectionChange }: NavigationProps) {
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'projects', label: 'Projects', icon: FolderOpen },
    { id: 'finances', label: 'Finances', icon: DollarSign },
    { id: 'clients', label: 'Clients', icon: UserCheck },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-card border-r border-border h-full p-4">
      <div className="flex items-center gap-2 mb-8">
        <Building2 className="w-8 h-8 text-primary" />
        <h1 className="text-xl font-semibold">EnterprisePro</h1>
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