import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Plus, Mail, Phone, MapPin, MoreHorizontal, Building } from "lucide-react";

export function ClientsSection() {
  const clients = [
    {
      name: "TechCorp Solutions",
      company: "Technology",
      email: "contact@techcorp.com",
      phone: "+1 (555) 123-4567",
      location: "San Francisco, CA",
      status: "Active",
      projects: 3,
      revenue: "$24,500",
      lastContact: "Dec 1, 2024",
      initials: "TC"
    },
    {
      name: "Design Studio Pro",
      company: "Creative Agency",
      email: "hello@designstudio.com",
      phone: "+1 (555) 234-5678",
      location: "New York, NY",
      status: "Active",
      projects: 2,
      revenue: "$18,750",
      lastContact: "Nov 28, 2024",
      initials: "DS"
    },
    {
      name: "Marketing Agency Ltd",
      company: "Marketing",
      email: "info@marketingltd.com",
      phone: "+1 (555) 345-6789",
      location: "Los Angeles, CA",
      status: "Prospect",
      projects: 0,
      revenue: "$0",
      lastContact: "Nov 25, 2024",
      initials: "MA"
    },
    {
      name: "RetailCorp Inc",
      company: "Retail",
      email: "business@retailcorp.com",
      phone: "+1 (555) 456-7890",
      location: "Chicago, IL",
      status: "Inactive",
      projects: 1,
      revenue: "$8,200",
      lastContact: "Oct 15, 2024",
      initials: "RC"
    }
  ];

  const clientMetrics = [
    { title: "Total Clients", value: "24", icon: Building },
    { title: "Active Projects", value: "12", icon: Building },
    { title: "This Month Revenue", value: "$32,450", icon: Building },
    { title: "New Prospects", value: "6", icon: Building }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "default";
      case "Prospect":
        return "secondary";
      case "Inactive":
        return "outline";
      default:
        return "secondary";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Client Management</h1>
          <p className="text-muted-foreground">Manage your clients and business relationships.</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Client
        </Button>
      </div>

      {/* Client Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {clientMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.title}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">{metric.title}</h3>
                    <p className="text-2xl font-bold mt-2">{metric.value}</p>
                  </div>
                  <Icon className="w-8 h-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Clients List */}
      <Card>
        <CardHeader>
          <CardTitle>Client Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {clients.map((client) => (
              <div key={client.name} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback>{client.initials}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h4 className="font-medium">{client.name}</h4>
                    <p className="text-sm text-muted-foreground">{client.company}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {client.email}
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {client.phone}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {client.location}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right hidden md:block">
                    <p className="text-sm font-medium">{client.revenue}</p>
                    <p className="text-xs text-muted-foreground">{client.projects} project(s)</p>
                    <p className="text-xs text-muted-foreground">Last: {client.lastContact}</p>
                  </div>
                  
                  <Badge variant={getStatusColor(client.status)}>
                    {client.status}
                  </Badge>
                  
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}