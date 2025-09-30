import React, { useState } from "react";
import "./App.css";
import { EnterpriseNavigation } from "./components/EnterpriseNavigation";
import { Dashboard } from "./components/Dashboard";
import { TeamSection } from "./components/TeamSection";
import { PurchasesSection } from "./components/PurchasesSection";
import { ProductionCenterSection } from "./components/ProductionCenterSection";
import { ProductsSection } from "./components/ProductsSection";
import { SuppliersSection } from "./components/SuppliersSection";
import { SalesSection } from "./components/SalesSection";
import { ProjectsSection } from "./components/ProjectsSection";
import { FinancesSection } from "./components/FinancesSection";
import { ClientsSection } from "./components/ClientsSection";
import { CalendarSection } from "./components/CalendarSection";
import { ReportsSection } from "./components/ReportsSection";
import { WhatsAppSection } from "./components/WhatsAppSection";
import { SettingsSection } from "./components/SettingsSection";
import { AuthFlow } from "./components/auth/AuthFlow";
import { useAuth } from "./contexts/AuthContext";

export default function App() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const { authState, logout } = useAuth();

  // Debug: Log cuando cambia el estado de autenticación
  React.useEffect(() => {
    console.log('🏠 App - Estado de autenticación cambió:', {
      isAuthenticated: authState.isAuthenticated,
      isLoading: authState.isLoading,
      user: authState.user,
      error: authState.error
    });
  }, [authState]);

  const handleLogout = async () => {
    await logout();
    setActiveSection("dashboard");
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <Dashboard />;
      case "team":
        return <TeamSection />;
      case "purchases":
        return <PurchasesSection />;
      case "production-center":
        return <ProductionCenterSection />;
      case "products":
        return <ProductsSection />;
      case "suppliers":
        return <SuppliersSection />;
      case "sales":
        return <SalesSection />;
      case "finances":
        return <FinancesSection />;
      case "clients":
        return <ClientsSection />;
      case "whatsapp":
        return <WhatsAppSection />;
      case "calendar":
        return <CalendarSection />;
      case "reports":
        return <ReportsSection />;
      case "settings":
        return <SettingsSection />;
      default:
        return <Dashboard />;
    }
  };

  // Show loading state
  if (authState.isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#1E12A6] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando Mi PyME Láctea...</p>
        </div>
      </div>
    );
  }

  // Show authentication flow if user is not authenticated
  if (!authState.isAuthenticated) {
    return <AuthFlow />;
  }

  return (
    <div className="min-h-screen bg-background flex">
      <EnterpriseNavigation 
        activeSection={activeSection} 
        onSectionChange={setActiveSection}
        user={authState.user}
        onLogout={handleLogout}
      />
      <main className="flex-1 overflow-auto">
        {renderActiveSection()}
      </main>
    </div>
  );
}