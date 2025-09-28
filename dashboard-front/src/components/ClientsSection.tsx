import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { 
  Users, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  FileText, 
  Download,
  Plus,
  Search,
  Filter,
  Star,
  Package,
  CreditCard,
  Truck
} from "lucide-react";

export function ClientsSection() {
  // Datos de clientes
  const clients = [
    {
      id: "CLI001",
      name: "Almacén Central",
      contact: "María González",
      phone: "+54 9 11 2345-6789",
      email: "maria@almacencentral.com",
      address: "Av. Rivadavia 1234, CABA",
      zone: "Capital Federal",
      category: "Mayorista",
      creditLimit: 150000,
      currentDebt: 45000,
      paymentTerms: "30 días",
      lastPurchase: "2024-01-15",
      totalPurchases: 850000,
      averageOrder: 12500,
      status: "Activo",
      rating: 5,
      preferredProducts: ["Muzzarella", "Ricotta", "Queso Cremoso"]
    },
    {
      id: "CLI002",
      name: "Supermercado San Juan",
      contact: "Carlos Rodríguez",
      phone: "+54 9 11 3456-7890",
      email: "carlos@supersanjuan.com",
      address: "San Juan 567, San Isidro",
      zone: "Zona Norte",
      category: "Minorista",
      creditLimit: 80000,
      currentDebt: 22000,
      paymentTerms: "15 días",
      lastPurchase: "2024-01-18",
      totalPurchases: 420000,
      averageOrder: 8500,
      status: "Activo",
      rating: 4,
      preferredProducts: ["Muzzarella", "Queso Cremoso"]
    },
    {
      id: "CLI003",
      name: "Distribuidora Norte",
      contact: "Ana Martínez",
      phone: "+54 9 11 4567-8901",
      email: "ana@distribuidoranorte.com",
      address: "Panamericana Km 25, Tigre",
      zone: "Zona Norte",
      category: "Distribuidor",
      creditLimit: 200000,
      currentDebt: 85000,
      paymentTerms: "45 días",
      lastPurchase: "2024-01-20",
      totalPurchases: 1200000,
      averageOrder: 18000,
      status: "Activo",
      rating: 4,
      preferredProducts: ["Muzzarella", "Ricotta", "Queso Cremoso", "Provoleta"]
    },
    {
      id: "CLI004",
      name: "Panadería La Esquina",
      contact: "Roberto Silva",
      phone: "+54 9 11 5678-9012",
      email: "roberto@laesquina.com",
      address: "Corrientes 890, CABA",
      zone: "Capital Federal",
      category: "Minorista",
      creditLimit: 30000,
      currentDebt: 8500,
      paymentTerms: "7 días",
      lastPurchase: "2024-01-19",
      totalPurchases: 180000,
      averageOrder: 3500,
      status: "Activo",
      rating: 5,
      preferredProducts: ["Muzzarella", "Ricotta"]
    },
    {
      id: "CLI005",
      name: "Restaurante El Buen Sabor",
      contact: "Laura Fernández",
      phone: "+54 9 11 6789-0123",
      email: "laura@elbuensabor.com",
      address: "Palermo 456, CABA",
      zone: "Capital Federal",
      category: "Gastronómico",
      creditLimit: 60000,
      currentDebt: 15000,
      paymentTerms: "21 días",
      lastPurchase: "2024-01-17",
      totalPurchases: 320000,
      averageOrder: 7500,
      status: "Activo",
      rating: 4,
      preferredProducts: ["Muzzarella", "Provoleta", "Queso Cremoso"]
    }
  ];

  // Resumen de clientes
  const clientsSummary = {
    totalClients: clients.length,
    activeClients: clients.filter(c => c.status === "Activo").length,
    totalDebt: clients.reduce((sum, c) => sum + c.currentDebt, 0),
    totalCreditLimit: clients.reduce((sum, c) => sum + c.creditLimit, 0),
    averageRating: clients.reduce((sum, c) => sum + c.rating, 0) / clients.length,
    totalSales: clients.reduce((sum, c) => sum + c.totalPurchases, 0)
  };

  // Cuentas por cobrar
  const accountsReceivable = [
    {
      clientId: "CLI001",
      clientName: "Almacén Central",
      invoiceNumber: "FAC-2024-001",
      amount: 25000,
      dueDate: "2024-02-15",
      daysOverdue: 0,
      status: "Pendiente"
    },
    {
      clientId: "CLI001",
      clientName: "Almacén Central",
      invoiceNumber: "FAC-2024-002",
      amount: 20000,
      dueDate: "2024-02-20",
      daysOverdue: 0,
      status: "Pendiente"
    },
    {
      clientId: "CLI002",
      clientName: "Supermercado San Juan",
      invoiceNumber: "FAC-2024-003",
      amount: 22000,
      dueDate: "2024-02-10",
      daysOverdue: 5,
      status: "Vencida"
    },
    {
      clientId: "CLI003",
      clientName: "Distribuidora Norte",
      invoiceNumber: "FAC-2024-004",
      amount: 35000,
      dueDate: "2024-02-25",
      daysOverdue: 0,
      status: "Pendiente"
    },
    {
      clientId: "CLI003",
      clientName: "Distribuidora Norte",
      invoiceNumber: "FAC-2024-005",
      amount: 50000,
      dueDate: "2024-03-05",
      daysOverdue: 0,
      status: "Pendiente"
    }
  ];

  // Historial de compras recientes
  const recentPurchases = [
    {
      date: "2024-01-20",
      clientName: "Distribuidora Norte",
      products: "Muzzarella x50kg, Ricotta x20kg",
      amount: 18000,
      paymentMethod: "Transferencia",
      status: "Entregado"
    },
    {
      date: "2024-01-19",
      clientName: "Panadería La Esquina",
      products: "Muzzarella x15kg, Ricotta x8kg",
      amount: 3500,
      paymentMethod: "Efectivo",
      status: "Entregado"
    },
    {
      date: "2024-01-18",
      clientName: "Supermercado San Juan",
      products: "Muzzarella x30kg, Queso Cremoso x15kg",
      amount: 8500,
      paymentMethod: "Cuenta Corriente",
      status: "Entregado"
    },
    {
      date: "2024-01-17",
      clientName: "Restaurante El Buen Sabor",
      products: "Muzzarella x25kg, Provoleta x10kg",
      amount: 7500,
      paymentMethod: "Cuenta Corriente",
      status: "Entregado"
    },
    {
      date: "2024-01-15",
      clientName: "Almacén Central",
      products: "Muzzarella x40kg, Ricotta x25kg, Queso Cremoso x20kg",
      amount: 12500,
      paymentMethod: "Cuenta Corriente",
      status: "Entregado"
    }
  ];

  // Análisis por zona
  const zoneAnalysis = [
    {
      zone: "Capital Federal",
      clients: 3,
      totalSales: 1350000,
      averageOrder: 7833,
      growth: 12,
      trend: "up"
    },
    {
      zone: "Zona Norte",
      clients: 2,
      totalSales: 1620000,
      averageOrder: 13250,
      growth: 8,
      trend: "up"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Activo": return "bg-green-100 text-green-800";
      case "Pendiente": return "bg-yellow-100 text-yellow-800";
      case "Vencida": return "bg-red-100 text-red-800";
      case "Entregado": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Mayorista": return "bg-blue-100 text-blue-800";
      case "Minorista": return "bg-purple-100 text-purple-800";
      case "Distribuidor": return "bg-orange-100 text-orange-800";
      case "Gastronómico": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTrendIcon = (trend: string) => {
    return trend === "up" ? <TrendingUp className="h-4 w-4 text-green-600" /> : <TrendingDown className="h-4 w-4 text-red-600" />;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Clientes</h1>
          <p className="text-gray-600">Gestión de clientes y cobranzas de Mi PyME Lácteos</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar Lista
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Cliente
          </Button>
        </div>
      </div>

      {/* Resumen de Clientes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Clientes</p>
                <p className="text-2xl font-bold">{clientsSummary.totalClients}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Clientes Activos</p>
                <p className="text-2xl font-bold">{clientsSummary.activeClients}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cuentas por Cobrar</p>
                <p className="text-2xl font-bold">{formatCurrency(clientsSummary.totalDebt)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ventas Totales</p>
                <p className="text-2xl font-bold">{formatCurrency(clientsSummary.totalSales)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Clientes */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Lista de Clientes
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Search className="h-4 w-4 mr-2" />
                Buscar
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtrar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {clients.map((client) => (
              <div key={client.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{client.name}</h3>
                      <Badge className={getCategoryColor(client.category)}>
                        {client.category}
                      </Badge>
                      <Badge className={getStatusColor(client.status)}>
                        {client.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{client.contact}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {renderStars(client.rating)}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <Phone className="h-4 w-4" />
                      {client.phone}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <Mail className="h-4 w-4" />
                      {client.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      {client.zone}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Deuda Actual</p>
                    <p className="font-semibold text-lg">{formatCurrency(client.currentDebt)}</p>
                    <p className="text-sm text-gray-600">
                      Límite: {formatCurrency(client.creditLimit)}
                    </p>
                    <Progress 
                      value={(client.currentDebt / client.creditLimit) * 100} 
                      className="mt-1"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="text-sm">
                      <p className="text-gray-600">Última Compra</p>
                      <p className="font-medium">{client.lastPurchase}</p>
                    </div>
                    <div className="text-sm">
                      <p className="text-gray-600">Promedio Pedido</p>
                      <p className="font-medium">{formatCurrency(client.averageOrder)}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t">
                  <p className="text-sm text-gray-600 mb-2">Productos Preferidos:</p>
                  <div className="flex gap-2">
                    {client.preferredProducts.map((product, index) => (
                      <Badge key={index} variant="outline">
                        {product}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cuentas por Cobrar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Cuentas por Cobrar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {accountsReceivable.map((account, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{account.clientName}</p>
                    <p className="text-sm text-gray-600">{account.invoiceNumber}</p>
                    <p className="text-sm text-gray-600">Vence: {account.dueDate}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(account.amount)}</p>
                    <Badge className={getStatusColor(account.status)}>
                      {account.status}
                    </Badge>
                    {account.daysOverdue > 0 && (
                      <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                        <AlertTriangle className="h-3 w-3" />
                        {account.daysOverdue} días vencida
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Análisis por Zona */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Análisis por Zona
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {zoneAnalysis.map((zone, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{zone.zone}</h3>
                    <div className="flex items-center gap-1">
                      {getTrendIcon(zone.trend)}
                      <span className="text-sm font-medium">{zone.growth}%</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Clientes</p>
                      <p className="font-medium">{zone.clients}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Ventas</p>
                      <p className="font-medium">{formatCurrency(zone.totalSales)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Promedio</p>
                      <p className="font-medium">{formatCurrency(zone.averageOrder)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compras Recientes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Compras Recientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Fecha</th>
                  <th className="text-left p-2">Cliente</th>
                  <th className="text-left p-2">Productos</th>
                  <th className="text-left p-2">Monto</th>
                  <th className="text-left p-2">Pago</th>
                  <th className="text-left p-2">Estado</th>
                </tr>
              </thead>
              <tbody>
                {recentPurchases.map((purchase, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        {purchase.date}
                      </div>
                    </td>
                    <td className="p-2 font-medium">{purchase.clientName}</td>
                    <td className="p-2 text-sm">{purchase.products}</td>
                    <td className="p-2 font-semibold">{formatCurrency(purchase.amount)}</td>
                    <td className="p-2">
                      <Badge variant="outline">{purchase.paymentMethod}</Badge>
                    </td>
                    <td className="p-2">
                      <Badge className={getStatusColor(purchase.status)}>
                        {purchase.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}