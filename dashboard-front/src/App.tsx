import { useState } from "react";
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

export default function App() {
  const [activeSection, setActiveSection] = useState("dashboard");

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

  return (
    <div className="min-h-screen bg-background flex">
      <EnterpriseNavigation 
        activeSection={activeSection} 
        onSectionChange={setActiveSection}
      />
      <main className="flex-1 overflow-auto">
        {renderActiveSection()}
      </main>
    </div>
  );
}