import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { 
  ShoppingCart, 
  TrendingUp, 
  TrendingDown,
  Clock,
  CheckCircle,
  AlertCircle,
  Truck,
  DollarSign
} from "lucide-react";

export function PurchasesSection() {
  const suppliers = [
    {
      name: "Lácteos San Martín SA",
      product: "Masa para Muzzarella",
      lastPrice: "$850/kg",
      currentPrice: "$920/kg",
      trend: "up",
      paymentTerms: "15 días",
      reliability: 95,
      contact: "Juan Carlos - 011-4567-8901"
    },
    {
      name: "Ricota Premium SRL",
      product: "Ricota Fresca",
      lastPrice: "$1200/kg",
      currentPrice: "$1150/kg",
      trend: "down",
      paymentTerms: "7 días",
      reliability: 88,
      contact: "María Elena - 011-5678-9012"
    },
    {
      name: "Quesos del Valle",
      product: "Quesos Especiales",
      lastPrice: "$2100/kg",
      currentPrice: "$2250/kg",
      trend: "up",
      paymentTerms: "Contado",
      reliability: 92,
      contact: "Roberto Paz - 011-6789-0123"
    }
  ];

  const pendingOrders = [
    {
      id: "PO-001",
      supplier: "Lácteos San Martín SA",
      product: "Masa para Muzzarella",
      quantity: "500 kg",
      orderDate: "2024-01-15",
      expectedDate: "2024-01-20",
      status: "En tránsito",
      total: "$460,000",
      transportCost: "$15,000"
    },
    {
      id: "PO-002",
      supplier: "Ricota Premium SRL",
      product: "Ricota Fresca",
      quantity: "200 kg",
      orderDate: "2024-01-16",
      expectedDate: "2024-01-18",
      status: "Confirmado",
      total: "$230,000",
      transportCost: "$8,000"
    },
    {
      id: "PO-003",
      supplier: "Quesos del Valle",
      product: "Quesos Especiales",
      quantity: "100 kg",
      orderDate: "2024-01-17",
      expectedDate: "2024-01-17",
      status: "Entregado",
      total: "$225,000",
      transportCost: "$12,000"
    }
  ];

  const priceHistory = [
    { month: "Dic 2023", masa: 800, ricota: 1100, quesos: 2000 },
    { month: "Ene 2024", masa: 850, ricota: 1200, quesos: 2100 },
    { month: "Feb 2024", masa: 920, ricota: 1150, quesos: 2250 }
  ];

  const creditNotes = [
    {
      id: "NC-001",
      supplier: "Lácteos San Martín SA",
      type: "Nota de Crédito",
      amount: "$25,000",
      reason: "Producto defectuoso - Lote #456",
      date: "2024-01-10",
      status: "Aplicada"
    },
    {
      id: "ND-001",
      supplier: "Ricota Premium SRL",
      type: "Nota de Débito",
      amount: "$8,000",
      reason: "Costo adicional de transporte",
      date: "2024-01-12",
      status: "Pendiente"
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Gestión de Compras</h1>
        <p className="text-muted-foreground">Administra proveedores, precios históricos y control de pedidos.</p>
      </div>

      {/* Suppliers Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {suppliers.map((supplier) => (
          <Card key={supplier.name}>
            <CardHeader>
              <CardTitle className="text-lg">{supplier.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{supplier.product}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Precio Actual:</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{supplier.currentPrice}</span>
                  {supplier.trend === "up" ? (
                    <TrendingUp className="w-4 h-4 text-red-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-green-500" />
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Precio Anterior:</span>
                <span className="text-muted-foreground">{supplier.lastPrice}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Condiciones:</span>
                <Badge variant="outline">{supplier.paymentTerms}</Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Confiabilidad:</span>
                  <span className="text-sm font-medium">{supplier.reliability}%</span>
                </div>
                <Progress value={supplier.reliability} className="h-2" />
              </div>
              
              <div className="text-xs text-muted-foreground">
                <strong>Contacto:</strong> {supplier.contact}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pending Orders */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Pedidos Pendientes por Recibir
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div>
                    <h4 className="font-medium">{order.id}</h4>
                    <p className="text-sm text-muted-foreground">{order.supplier}</p>
                    <p className="text-xs text-muted-foreground">{order.product} - {order.quantity}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="hidden md:block text-right text-xs text-muted-foreground">
                    <div className="mb-1">Pedido: {order.orderDate}</div>
                    <div className="mb-1">Esperado: {order.expectedDate}</div>
                    <div className="mb-1">Total: {order.total}</div>
                    <div>Transporte: {order.transportCost}</div>
                  </div>
                  
                  <Badge variant={
                    order.status === "Entregado" ? "default" : 
                    order.status === "En tránsito" ? "secondary" : "outline"
                  }>
                    {order.status}
                  </Badge>
                  
                  {order.status === "Entregado" ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : order.status === "En tránsito" ? (
                    <Truck className="w-5 h-5 text-blue-500" />
                  ) : (
                    <Clock className="w-5 h-5 text-yellow-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Price History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Historial de Precios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {priceHistory.map((period) => (
                <div key={period.month} className="space-y-2">
                  <h4 className="font-medium">{period.month}</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Masa:</span>
                      <span className="ml-2 font-medium">${period.masa}/kg</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Ricota:</span>
                      <span className="ml-2 font-medium">${period.ricota}/kg</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Quesos:</span>
                      <span className="ml-2 font-medium">${period.quesos}/kg</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Credit/Debit Notes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Notas de Crédito/Débito
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {creditNotes.map((note) => (
                <div key={note.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{note.id}</h4>
                      <Badge variant={note.type === "Nota de Crédito" ? "default" : "destructive"}>
                        {note.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{note.supplier}</p>
                    <p className="text-xs text-muted-foreground">{note.reason}</p>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-medium text-lg">{note.amount}</div>
                    <div className="text-xs text-muted-foreground">{note.date}</div>
                    <Badge variant={note.status === "Aplicada" ? "default" : "secondary"} className="mt-1">
                      {note.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}