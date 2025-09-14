import { useState, useEffect } from "react";
import { SignIn } from "./components/SignIn";
import { EnterpriseNavigation } from "./components/EnterpriseNavigation";
import { Dashboard } from "./components/Dashboard";
import { TeamSection } from "./components/TeamSection";
import { ProjectsSection } from "./components/ProjectsSection";
import { FinancesSection } from "./components/FinancesSection";
import { ClientsSection } from "./components/ClientsSection";
import { CalendarSection } from "./components/CalendarSection";
import { ReportsSection } from "./components/ReportsSection";
import { WhatsAppIntegration } from "./components/WhatsAppIntegration";
import { NotificationSystem } from "./components/NotificationSystem";
import { UserProfile } from "./components/UserProfile";
import { Toaster } from "./components/ui/sonner";

interface User {
  email: string;
  name: string;
  role: string;
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadNotifications] = useState(3); // This would come from your notification state
  const [isLoading, setIsLoading] = useState(true);

  // Check for saved user session on app load
  useEffect(() => {
    const savedUser = localStorage.getItem('enterprisePro_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('enterprisePro_user');
      }
    }
    setIsLoading(false);
  }, []);

  const handleSignIn = (userData: User) => {
    setUser(userData);
    localStorage.setItem('enterprisePro_user', JSON.stringify(userData));
  };

  const handleUpdateUser = (userData: User) => {
    setUser(userData);
    localStorage.setItem('enterprisePro_user', JSON.stringify(userData));
  };

  const handleSignOut = () => {
    setUser(null);
    localStorage.removeItem('enterprisePro_user');
    setActiveSection("dashboard");
    setShowNotifications(false);
  };

  // Show loading screen briefly
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#1E12A6] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando EnterprisePro...</p>
        </div>
      </div>
    );
  }

  // Show sign in page if user is not authenticated
  if (!user) {
    return (
      <>
        <SignIn onSignIn={handleSignIn} />
        <Toaster position="top-right" />
      </>
    );
  }

  const renderActiveSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <Dashboard />;
      case "team":
        return <TeamSection />;
      case "projects":
        return <ProjectsSection />;
      case "finances":
        return <FinancesSection />;
      case "clients":
        return <ClientsSection />;
      case "calendar":
        return <CalendarSection />;
      case "reports":
        return <ReportsSection />;
      case "whatsapp":
        return <WhatsAppIntegration />;
      case "profile":
        return <UserProfile user={user} onUpdateUser={handleUpdateUser} />;
      case "settings":
        return (
          <div className="p-6">
            <h1 className="text-3xl mb-2">Settings</h1>
            <p className="text-muted-foreground">Configure your enterprise management system.</p>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-6 border rounded-lg">
                <h3 className="font-medium mb-2">General Settings</h3>
                <p className="text-sm text-muted-foreground">Company information, timezone, and preferences</p>
              </div>
              <div className="p-6 border rounded-lg">
                <h3 className="font-medium mb-2">User Management</h3>
                <p className="text-sm text-muted-foreground">Manage user accounts and permissions</p>
              </div>
              <div className="p-6 border rounded-lg">
                <h3 className="font-medium mb-2">Integrations</h3>
                <p className="text-sm text-muted-foreground">Connect with third-party services</p>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>WhatsApp Business</span>
                    <span className="text-green-600 font-medium">Connected</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Email Integration</span>
                    <span className="text-yellow-600 font-medium">Pending</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Slack</span>
                    <span className="text-muted-foreground">Not Connected</span>
                  </div>
                </div>
              </div>
              <div className="p-6 border rounded-lg">
                <h3 className="font-medium mb-2">Security</h3>
                <p className="text-sm text-muted-foreground">Security settings and access controls</p>
              </div>
              <div className="p-6 border rounded-lg">
                <h3 className="font-medium mb-2">Notifications</h3>
                <p className="text-sm text-muted-foreground">Configure email and system notifications</p>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>WhatsApp Notifications</span>
                    <span className="text-green-600 font-medium">Enabled</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Project Reminders</span>
                    <span className="text-green-600 font-medium">Enabled</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Payment Alerts</span>
                    <span className="text-green-600 font-medium">Enabled</span>
                  </div>
                </div>
              </div>
              <div className="p-6 border rounded-lg">
                <h3 className="font-medium mb-2">Billing</h3>
                <p className="text-sm text-muted-foreground">Subscription and payment settings</p>
              </div>
            </div>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <EnterpriseNavigation 
        activeSection={activeSection} 
        onSectionChange={setActiveSection}
        onNotificationClick={() => setShowNotifications(!showNotifications)}
        unreadNotifications={unreadNotifications}
        user={user}
        onSignOut={handleSignOut}
      />
      <main className="flex-1 overflow-auto">
        {renderActiveSection()}
      </main>
      
      <NotificationSystem 
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
      
      <Toaster position="top-right" />
    </div>
  );
}