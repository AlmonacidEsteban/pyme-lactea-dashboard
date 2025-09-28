import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { 
  Truck, 
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertTriangle,
  Star
} from "lucide-react";

export function SuppliersSection() {
  const suppliers = [
    {
      id: "PROV-001",
      name: "Lácteos San Martín",
      type: "Masa y Ricota",
      contact: {
        person: "Carlos Rodríguez",
        phone: "+54 11 4567-8901",
        email: "carlos@lacteossanmartin.com",
        address: "Av. San Martín 1234, San Martín, Buenos Aires"
      },
      paymentTerms: "15 días",
      reliability: 95,
      rating: 4.8,
      totalPurchases: "$2,450,000",
      lastOrder: "2024-01-15",
      status: "active",
      products: ["Masa para Muzzarella", "Masa para Ricota", "Cuajo", "Sal"]
    },
    {
      id: "PROV-002",
      name: "Distribuidora Norte",
      type: "Insumos Generales",
      contact: {
        person: "María González",
        phone: "+54 11 4567-8902",
        email: "maria@distribuidoranorte.com",
        address: "Ruta 9 Km 45, Pilar, Buenos Aires"
      },
      paymentTerms: "7 días",
      reliability: 88,
      rating: 4.5,
      totalPurchases: "$890,000",
      lastOrder: "2024-01-12",
      status: "active",
      products: ["Envases", "Etiquetas", "Film", "Cajas"]
    },
    {
      id: "PROV-003",
      name: "Química Industrial SA",
      type: "Aditivos",
      contact: {
        person: "Roberto Silva",
        phone: "+54 11 4567-8903",
        email: "roberto@quimicaindustrial.com",
        address: "Parque Industrial Norte, Tigre, Buenos Aires"
      },
      paymentTerms: "Contado",
      reliability: 92,
      rating: 4.6,
      totalPurchases: "$320,000",
      lastOrder: "2024-01-10",
      status: "active",
      products: ["Ácido Cítrico", "Conservantes", "Colorantes"]
    },
    {
      id: "PROV-004",
      name: "Transportes Rápidos",
      type: "Logística",
      contact: {
        person: "Juan Pérez",
        phone: "+54 11 4567-8904",
        email: "juan@transportesrapidos.com",
        address: "Av. Libertador 5678, Vicente López, Buenos Aires"
      },
      paymentTerms: "30 días",
      reliability: 85,
      rating: 4.2,
      totalPurchases: "$180,000",
      lastOrder: "2024-01-14",
      status: "active",
      products: ["Transporte Refrigerado", "Logística"]
    },
    {
      id: "PROV-005",
      name: "Lácteos del Valle",
      type: "Masa y Quesos",
      contact: {
        person: "Ana Martínez",
        phone: "+54 11 4567-8905",
        email: "ana@lacteosdelvalle.com",
        address: "Ruta 7 Km 120, Luján, Buenos Aires"
      },
      paymentTerms: "21 días",
      reliability: 78,
      rating: 3.9,
      totalPurchases: "$1,200,000",
      lastOrder: "2024-01-08",
      status: "warning",
      products: ["Masa Premium", "Quesos Duros", "Suero"]
    }
  ];

  const purchaseHistory = [
    {
      date: "2024-01-15",
      supplier: "Lácteos San Martín",
      product: "Masa para Muzzarella",
      quantity: "500 kg",
      unitPrice: "$2,800",
      total: "$1,400,000",
      status: "delivered"
    },
    {
      date: "2024-01-14",
      supplier: "Transportes Rápidos",
      product: "Transporte Refrigerado",
      quantity: "1 viaje",
      unitPrice: "$45,000",
      total: "$45,000",
      status: "completed"
    },
    {
      date: "2024-01-12",
      supplier: "Distribuidora Norte",
      product: "Envases 1kg",
      quantity: "1000 unidades",
      unitPrice: "$85",
      total: "$85,000",
      status: "delivered"
    },
    {
      date: "2024-01-10",
      supplier: "Química Industrial SA",
      product: "Ácido Cítrico",
      quantity: "25 kg",
      unitPrice: "$1,200",
      total: "$30,000",
      status: "delivered"
    },
    {
      date: "2024-01-08",
      supplier: "Lácteos del Valle",
      product: "Masa Premium",
      quantity: "200 kg",
      unitPrice: "$3,200",
      total: "$640,000",
      status: "pending"
    }
  ];

  const paymentSchedule = [
    {
      supplier: "Lácteos San Martín",
      amount: "$1,400,000",
      dueDate: "2024-01-30",
      daysLeft: 13,
      status: "pending"
    },
    {
      supplier: "Distribuidora Norte",
      amount: "$85,000",
      dueDate: "2024-01-19",
      daysLeft: 2,
      status: "urgent"
    },
    {
      supplier: "Transportes Rápidos",
      amount: "$45,000",
      dueDate: "2024-02-13",
      daysLeft: 27,
      status: "pending"
    },
    {
      supplier: "Química Industrial SA",
      amount: "$30,000",
      dueDate: "2024-01-17",
      daysLeft: 0,
      status: "overdue"
    }
  ];

  const getReliabilityColor = (reliability: number) => {
    if (reliability >= 90) return "text-green-600";
    if (reliability >= 80) return "text-yellow-600";
    return "text-red-600";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "text-green-600 bg-green-50";
      case "warning": return "text-yellow-600 bg-yellow-50";
      case "inactive": return "text-red-600 bg-red-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "text-blue-600 bg-blue-50";
      case "urgent": return "text-yellow-600 bg-yellow-50";
      case "overdue": return "text-red-600 bg-red-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Proveedores</h1>
        <p className="text-muted-foreground">Gestiona tus proveedores, condiciones de pago e historial de compras.</p>
      </div>

      {/* Suppliers Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Proveedores</p>
                <p className="text-2xl font-bold">{suppliers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Activos</p>
                <p className="text-2xl font-bold">{suppliers.filter(s => s.status === "active").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Compras Totales</p>
                <p className="text-2xl font-bold">$5.04M</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-sm text-muted-foreground">Rating Promedio</p>
                <p className="text-2xl font-bold">4.4</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Suppliers List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="w-5 h-5" />
            Lista de Proveedores
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {suppliers.map((supplier) => (
              <div key={supplier.id} className="p-4 border rounded-lg space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium">{supplier.name}</h4>
                    <p className="text-sm text-muted-foreground">{supplier.id}</p>
                    <Badge variant="outline" className="mt-1">{supplier.type}</Badge>
                  </div>
                  <div className="text-right">
                    <Badge className={getStatusColor(supplier.status)}>
                      {supplier.status === "active" ? "Activo" : 
                       supplier.status === "warning" ? "Advertencia" : "Inactivo"}
                    </Badge>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{supplier.rating}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{supplier.contact.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>{supplier.contact.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs">{supplier.contact.address}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Condiciones de pago:</p>
                    <p className="font-medium">{supplier.paymentTerms}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Confiabilidad:</p>
                    <p className={`font-medium ${getReliabilityColor(supplier.reliability)}`}>
                      {supplier.reliability}%
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total compras:</p>
                    <p className="font-medium">{supplier.totalPurchases}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Último pedido:</p>
                    <p className="font-medium">{supplier.lastOrder}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Productos:</p>
                  <div className="flex flex-wrap gap-1">
                    {supplier.products.map((product) => (
                      <Badge key={product} variant="secondary" className="text-xs">
                        {product}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-2 pt-2 border-t">
                  <button className="flex-1 px-3 py-2 text-sm border rounded hover:bg-muted transition-colors">
                    Ver Historial
                  </button>
                  <button className="flex-1 px-3 py-2 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors">
                    Nuevo Pedido
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Purchase History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Historial de Compras Recientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {purchaseHistory.map((purchase, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-sm">{purchase.supplier}</h5>
                    <Badge variant={purchase.status === "delivered" ? "default" : 
                                  purchase.status === "completed" ? "secondary" : "outline"}>
                      {purchase.status === "delivered" ? "Entregado" :
                       purchase.status === "completed" ? "Completado" : "Pendiente"}
                    </Badge>
                  </div>
                  
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Producto:</span>
                      <span className="font-medium">{purchase.product}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cantidad:</span>
                      <span>{purchase.quantity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Precio unitario:</span>
                      <span>{purchase.unitPrice}</span>
                    </div>
                    <div className="flex justify-between border-t pt-1">
                      <span className="text-muted-foreground">Total:</span>
                      <span className="font-bold">{purchase.total}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {purchase.date}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Payment Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Cronograma de Pagos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {paymentSchedule.map((payment, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-sm">{payment.supplier}</h5>
                    <Badge className={getPaymentStatusColor(payment.status)}>
                      {payment.status === "pending" ? "Pendiente" :
                       payment.status === "urgent" ? "Urgente" : "Vencido"}
                    </Badge>
                  </div>
                  
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Monto:</span>
                      <span className="font-bold">{payment.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Vencimiento:</span>
                      <span>{payment.dueDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Días restantes:</span>
                      <span className={`font-medium ${
                        payment.daysLeft <= 0 ? 'text-red-600' :
                        payment.daysLeft <= 3 ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {payment.daysLeft <= 0 ? 'Vencido' : `${payment.daysLeft} días`}
                      </span>
                    </div>
                  </div>
                  
                  {payment.status === "urgent" || payment.status === "overdue" && (
                    <button className="w-full mt-2 px-3 py-2 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors">
                      Pagar Ahora
                    </button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}