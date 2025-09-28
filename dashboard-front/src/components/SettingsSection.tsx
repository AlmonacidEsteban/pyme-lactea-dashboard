import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  Settings, 
  Users, 
  Shield, 
  Building, 
  Bell, 
  Database,
  Milk,
  Package,
  DollarSign,
  Truck,
  Factory,
  User,
  UserPlus,
  Edit,
  Trash2,
  Save,
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff
} from "lucide-react";

export function SettingsSection() {
  const [activeTab, setActiveTab] = useState("general");
  const [showPassword, setShowPassword] = useState(false);

  // Configuración general de la empresa
  const [companySettings, setCompanySettings] = useState({
    name: "Lácteos San José",
    ruc: "20123456789",
    address: "Av. Los Lácteos 123, Lima",
    phone: "+51 987 654 321",
    email: "contacto@lacteossanjose.com",
    timezone: "America/Lima",
    currency: "PEN",
    language: "es"
  });

  // Usuarios del sistema
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Carlos Mendoza",
      email: "carlos@lacteossanjose.com",
      role: "Administrador",
      permissions: ["all"],
      status: "active",
      lastLogin: "2024-01-15 09:30"
    },
    {
      id: 2,
      name: "María García",
      email: "maria@lacteossanjose.com",
      role: "Vendedor",
      permissions: ["sales", "clients", "reports"],
      status: "active",
      lastLogin: "2024-01-15 08:15"
    },
    {
      id: 3,
      name: "José Rodríguez",
      email: "jose@lacteossanjose.com",
      role: "Producción",
      permissions: ["production", "inventory", "reports"],
      status: "inactive",
      lastLogin: "2024-01-10 16:45"
    }
  ]);

  // Parámetros de negocio específicos para lácteos
  const [businessParams, setBusinessParams] = useState({
    // Producción
    dailyMilkCapacity: 1000, // litros
    productionShifts: 2,
    qualityStandards: "A",
    
    // Inventario
    minStockAlert: 50, // unidades
    maxStorageDays: 7, // días
    temperatureRange: "2-4°C",
    
    // Ventas
    defaultDiscount: 5, // porcentaje
    creditDays: 30, // días
    deliveryRadius: 50, // km
    
    // Precios
    milkPricePerLiter: 3.50,
    cheesePricePerKg: 25.00,
    yogurtPricePerUnit: 4.50,
    
    // Notificaciones
    lowStockAlert: true,
    expirationAlert: true,
    paymentReminders: true,
    productionAlerts: true
  });

  const roles = [
    { value: "admin", label: "Administrador", permissions: ["all"] },
    { value: "sales", label: "Vendedor", permissions: ["sales", "clients", "reports"] },
    { value: "production", label: "Producción", permissions: ["production", "inventory", "reports"] },
    { value: "finance", label: "Finanzas", permissions: ["finance", "reports", "clients"] }
  ];

  const permissionLabels = {
    all: "Acceso Total",
    sales: "Ventas",
    clients: "Clientes",
    production: "Producción",
    inventory: "Inventario",
    finance: "Finanzas",
    reports: "Reportes"
  };

  const handleSaveCompanySettings = () => {
    // Aquí iría la lógica para guardar la configuración
    console.log("Guardando configuración de empresa:", companySettings);
  };

  const handleSaveBusinessParams = () => {
    // Aquí iría la lógica para guardar parámetros de negocio
    console.log("Guardando parámetros de negocio:", businessParams);
  };

  const handleAddUser = () => {
    // Lógica para agregar nuevo usuario
    console.log("Agregando nuevo usuario");
  };

  const handleEditUser = (userId: number) => {
    // Lógica para editar usuario
    console.log("Editando usuario:", userId);
  };

  const handleDeleteUser = (userId: number) => {
    // Lógica para eliminar usuario
    setUsers(users.filter(user => user.id !== userId));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Configuración</h1>
          <p className="text-muted-foreground">Gestiona la configuración de tu empresa láctea</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Building className="w-4 h-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Usuarios
          </TabsTrigger>
          <TabsTrigger value="business" className="flex items-center gap-2">
            <Milk className="w-4 h-4" />
            Negocio
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notificaciones
          </TabsTrigger>
        </TabsList>

        {/* Configuración General */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                Información de la Empresa
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Nombre de la Empresa</Label>
                  <Input
                    id="companyName"
                    value={companySettings.name}
                    onChange={(e) => setCompanySettings({...companySettings, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ruc">RUC</Label>
                  <Input
                    id="ruc"
                    value={companySettings.ruc}
                    onChange={(e) => setCompanySettings({...companySettings, ruc: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Dirección</Label>
                  <Input
                    id="address"
                    value={companySettings.address}
                    onChange={(e) => setCompanySettings({...companySettings, address: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    value={companySettings.phone}
                    onChange={(e) => setCompanySettings({...companySettings, phone: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={companySettings.email}
                    onChange={(e) => setCompanySettings({...companySettings, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Zona Horaria</Label>
                  <Input
                    id="timezone"
                    value={companySettings.timezone}
                    onChange={(e) => setCompanySettings({...companySettings, timezone: e.target.value})}
                  />
                </div>
              </div>
              <Button onClick={handleSaveCompanySettings} className="w-full md:w-auto">
                <Save className="w-4 h-4 mr-2" />
                Guardar Configuración
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Gestión de Usuarios */}
        <TabsContent value="users" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Usuarios del Sistema</h3>
            <Button onClick={handleAddUser}>
              <UserPlus className="w-4 h-4 mr-2" />
              Agregar Usuario
            </Button>
          </div>

          <div className="grid gap-4">
            {users.map((user) => (
              <Card key={user.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{user.name}</h4>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                            {user.role}
                          </Badge>
                          <Badge variant={user.status === 'active' ? 'default' : 'outline'}>
                            {user.status === 'active' ? 'Activo' : 'Inactivo'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right text-sm text-muted-foreground">
                        <p>Último acceso:</p>
                        <p>{user.lastLogin}</p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => handleEditUser(user.id)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteUser(user.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <Separator className="my-3" />
                  <div>
                    <p className="text-sm font-medium mb-2">Permisos:</p>
                    <div className="flex flex-wrap gap-1">
                      {user.permissions.map((permission) => (
                        <Badge key={permission} variant="outline" className="text-xs">
                          {permissionLabels[permission as keyof typeof permissionLabels]}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Parámetros de Negocio */}
        <TabsContent value="business" className="space-y-6">
          <div className="grid gap-6">
            {/* Producción */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Factory className="w-5 h-5" />
                  Parámetros de Producción
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dailyCapacity">Capacidad Diaria (L)</Label>
                    <Input
                      id="dailyCapacity"
                      type="number"
                      value={businessParams.dailyMilkCapacity}
                      onChange={(e) => setBusinessParams({...businessParams, dailyMilkCapacity: Number(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shifts">Turnos de Producción</Label>
                    <Input
                      id="shifts"
                      type="number"
                      value={businessParams.productionShifts}
                      onChange={(e) => setBusinessParams({...businessParams, productionShifts: Number(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="temperature">Rango de Temperatura</Label>
                    <Input
                      id="temperature"
                      value={businessParams.temperatureRange}
                      onChange={(e) => setBusinessParams({...businessParams, temperatureRange: e.target.value})}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Precios */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Precios de Productos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="milkPrice">Precio Leche (S/ por L)</Label>
                    <Input
                      id="milkPrice"
                      type="number"
                      step="0.01"
                      value={businessParams.milkPricePerLiter}
                      onChange={(e) => setBusinessParams({...businessParams, milkPricePerLiter: Number(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cheesePrice">Precio Queso (S/ por Kg)</Label>
                    <Input
                      id="cheesePrice"
                      type="number"
                      step="0.01"
                      value={businessParams.cheesePricePerKg}
                      onChange={(e) => setBusinessParams({...businessParams, cheesePricePerKg: Number(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="yogurtPrice">Precio Yogurt (S/ por unidad)</Label>
                    <Input
                      id="yogurtPrice"
                      type="number"
                      step="0.01"
                      value={businessParams.yogurtPricePerUnit}
                      onChange={(e) => setBusinessParams({...businessParams, yogurtPricePerUnit: Number(e.target.value)})}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Inventario y Ventas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Inventario y Ventas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="minStock">Alerta Stock Mínimo</Label>
                    <Input
                      id="minStock"
                      type="number"
                      value={businessParams.minStockAlert}
                      onChange={(e) => setBusinessParams({...businessParams, minStockAlert: Number(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="creditDays">Días de Crédito</Label>
                    <Input
                      id="creditDays"
                      type="number"
                      value={businessParams.creditDays}
                      onChange={(e) => setBusinessParams({...businessParams, creditDays: Number(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deliveryRadius">Radio de Entrega (Km)</Label>
                    <Input
                      id="deliveryRadius"
                      type="number"
                      value={businessParams.deliveryRadius}
                      onChange={(e) => setBusinessParams({...businessParams, deliveryRadius: Number(e.target.value)})}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button onClick={handleSaveBusinessParams} className="w-full md:w-auto">
              <Save className="w-4 h-4 mr-2" />
              Guardar Parámetros
            </Button>
          </div>
        </TabsContent>

        {/* Notificaciones */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Configuración de Notificaciones
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Alertas de Stock Bajo</h4>
                    <p className="text-sm text-muted-foreground">Notificar cuando el inventario esté por debajo del mínimo</p>
                  </div>
                  <Switch
                    checked={businessParams.lowStockAlert}
                    onCheckedChange={(checked) => setBusinessParams({...businessParams, lowStockAlert: checked})}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Alertas de Vencimiento</h4>
                    <p className="text-sm text-muted-foreground">Notificar sobre productos próximos a vencer</p>
                  </div>
                  <Switch
                    checked={businessParams.expirationAlert}
                    onCheckedChange={(checked) => setBusinessParams({...businessParams, expirationAlert: checked})}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Recordatorios de Pago</h4>
                    <p className="text-sm text-muted-foreground">Recordar a clientes sobre pagos pendientes</p>
                  </div>
                  <Switch
                    checked={businessParams.paymentReminders}
                    onCheckedChange={(checked) => setBusinessParams({...businessParams, paymentReminders: checked})}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Alertas de Producción</h4>
                    <p className="text-sm text-muted-foreground">Notificar sobre problemas en la producción</p>
                  </div>
                  <Switch
                    checked={businessParams.productionAlerts}
                    onCheckedChange={(checked) => setBusinessParams({...businessParams, productionAlerts: checked})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}