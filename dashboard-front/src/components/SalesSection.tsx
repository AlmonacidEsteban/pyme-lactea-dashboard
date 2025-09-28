import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { 
  ShoppingCart, 
  Users,
  MapPin,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertTriangle,
  FileText,
  CreditCard,
  Banknote
} from "lucide-react";

export function SalesSection() {
  const salesSummary = {
    totalSales: "$3,245,800",
    monthlyGrowth: "+12.5%",
    totalOrders: 156,
    averageOrder: "$20,806",
    pendingPayments: "$485,200",
    completedPayments: "$2,760,600"
  };

  const salesByZone = [
    {
      zone: "Zona Norte",
      sales: "$1,245,800",
      orders: 45,
      clients: 28,
      growth: "+15.2%",
      trend: "up",
      avgOrder: "$27,684"
    },
    {
      zone: "Zona Sur",
      sales: "$890,400",
      orders: 38,
      clients: 22,
      growth: "+8.7%",
      trend: "up",
      avgOrder: "$23,432"
    },
    {
      zone: "Zona Centro",
      sales: "$756,200",
      orders: 42,
      clients: 31,
      growth: "+18.3%",
      trend: "up",
      avgOrder: "$18,005"
    },
    {
      zone: "Zona Oeste",
      sales: "$353,400",
      orders: 31,
      clients: 18,
      growth: "-2.1%",
      trend: "down",
      avgOrder: "$11,400"
    }
  ];

  const recentSales = [
    {
      id: "VTA-2024-0156",
      client: "Supermercado La Esquina",
      zone: "Zona Norte",
      type: "Minorista",
      products: [
        { name: "Muzzarella Cilindro 3kg", quantity: 15, price: "$4,800", total: "$72,000" },
        { name: "Ricota Fresca 1kg", quantity: 8, price: "$1,980", total: "$15,840" }
      ],
      subtotal: "$87,840",
      discount: "5%",
      discountAmount: "$4,392",
      total: "$83,448",
      paymentMethod: "Transferencia",
      paymentStatus: "Pagado",
      deliveryDate: "2024-01-18",
      invoiceNumber: "FC-001-00000156"
    },
    {
      id: "VTA-2024-0155",
      client: "Distribuidora Central",
      zone: "Zona Centro",
      type: "Distribuidor",
      products: [
        { name: "Muzzarella Plancha 10kg", quantity: 25, price: "$15,500", total: "$387,500" },
        { name: "Muzzarella Cilindro 1kg", quantity: 50, price: "$1,650", total: "$82,500" }
      ],
      subtotal: "$470,000",
      discount: "12%",
      discountAmount: "$56,400",
      total: "$413,600",
      paymentMethod: "Cuenta Corriente",
      paymentStatus: "Pendiente",
      deliveryDate: "2024-01-19",
      invoiceNumber: "FC-001-00000155"
    },
    {
      id: "VTA-2024-0154",
      client: "Almacén Don Pedro",
      zone: "Zona Sur",
      type: "Revendedor",
      products: [
        { name: "Muzzarella Cilindro 3kg", quantity: 8, price: "$4,800", total: "$38,400" },
        { name: "Queso Cremoso 500g", quantity: 12, price: "$1,450", total: "$17,400" }
      ],
      subtotal: "$55,800",
      discount: "3%",
      discountAmount: "$1,674",
      total: "$54,126",
      paymentMethod: "Efectivo",
      paymentStatus: "Pagado",
      deliveryDate: "2024-01-17",
      invoiceNumber: "FC-001-00000154"
    }
  ];

  const paymentStatus = [
    {
      client: "Distribuidora Central",
      amount: "$413,600",
      dueDate: "2024-02-02",
      daysOverdue: 0,
      status: "pending",
      invoices: ["FC-001-00000155"]
    },
    {
      client: "Supermercado Los Andes",
      amount: "$125,400",
      dueDate: "2024-01-15",
      daysOverdue: 2,
      status: "overdue",
      invoices: ["FC-001-00000148", "FC-001-00000149"]
    },
    {
      client: "Almacén San Martín",
      amount: "$67,800",
      dueDate: "2024-01-20",
      daysOverdue: 0,
      status: "pending",
      invoices: ["FC-001-00000152"]
    },
    {
      client: "Distribuidora Norte",
      amount: "$89,200",
      dueDate: "2024-01-12",
      daysOverdue: 5,
      status: "overdue",
      invoices: ["FC-001-00000145"]
    }
  ];

  const topProducts = [
    {
      product: "Muzzarella Cilindro 3kg",
      quantity: 245,
      revenue: "$1,176,000",
      margin: "68%",
      growth: "+22%"
    },
    {
      product: "Muzzarella Plancha 10kg",
      quantity: 89,
      revenue: "$1,379,500",
      margin: "68%",
      growth: "+15%"
    },
    {
      product: "Ricota Fresca 1kg",
      quantity: 156,
      revenue: "$308,880",
      margin: "72%",
      growth: "+8%"
    },
    {
      product: "Muzzarella Cilindro 1kg",
      quantity: 198,
      revenue: "$326,700",
      margin: "68%",
      growth: "+12%"
    }
  ];

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "Pagado": return "text-green-600 bg-green-50";
      case "Pendiente": return "text-yellow-600 bg-yellow-50";
      case "overdue": return "text-red-600 bg-red-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "Efectivo": return <Banknote className="w-4 h-4" />;
      case "Transferencia": return <CreditCard className="w-4 h-4" />;
      case "Cuenta Corriente": return <Clock className="w-4 h-4" />;
      default: return <DollarSign className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Ventas</h1>
        <p className="text-muted-foreground">Gestiona ventas, clientes, zonas de reparto y formas de pago.</p>
      </div>

      {/* Sales Summary */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Ventas Totales</p>
                <p className="text-2xl font-bold">{salesSummary.totalSales}</p>
                <p className="text-xs text-green-600">{salesSummary.monthlyGrowth}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Pedidos</p>
                <p className="text-2xl font-bold">{salesSummary.totalOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Pedido Promedio</p>
                <p className="text-2xl font-bold">{salesSummary.averageOrder}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Cobrado</p>
                <p className="text-2xl font-bold">{salesSummary.completedPayments}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-sm text-muted-foreground">Por Cobrar</p>
                <p className="text-2xl font-bold">{salesSummary.pendingPayments}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm text-muted-foreground">Vencido</p>
                <p className="text-2xl font-bold">$214,600</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales by Zone */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Ventas por Zona
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {salesByZone.map((zone) => (
                <div key={zone.zone} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{zone.zone}</h4>
                    <div className="flex items-center gap-1">
                      {zone.trend === "up" ? 
                        <TrendingUp className="w-4 h-4 text-green-600" /> : 
                        <TrendingDown className="w-4 h-4 text-red-600" />
                      }
                      <span className={`text-sm font-medium ${
                        zone.trend === "up" ? "text-green-600" : "text-red-600"
                      }`}>
                        {zone.growth}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Ventas:</p>
                      <p className="font-bold text-lg">{zone.sales}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Pedidos:</p>
                      <p className="font-medium">{zone.orders}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Clientes:</p>
                      <p className="font-medium">{zone.clients}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Promedio:</p>
                      <p className="font-medium">{zone.avgOrder}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Productos Más Vendidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.product} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full text-xs flex items-center justify-center">
                        {index + 1}
                      </span>
                      <h4 className="font-medium text-sm">{product.product}</h4>
                    </div>
                    <Badge variant="outline" className="text-green-600">
                      {product.growth}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Cantidad:</p>
                      <p className="font-medium">{product.quantity}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Ingresos:</p>
                      <p className="font-bold">{product.revenue}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Margen:</p>
                      <p className="font-medium text-green-600">{product.margin}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Sales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Ventas Recientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {recentSales.map((sale) => (
              <div key={sale.id} className="p-4 border rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{sale.client}</h4>
                    <p className="text-sm text-muted-foreground">{sale.id} - {sale.invoiceNumber}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{sale.zone}</Badge>
                      <Badge variant="secondary">{sale.type}</Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{sale.total}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getPaymentStatusColor(sale.paymentStatus)}`}>
                        {getPaymentMethodIcon(sale.paymentMethod)}
                        <span>{sale.paymentStatus}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h5 className="font-medium text-sm">Productos:</h5>
                  {sale.products.map((product, index) => (
                    <div key={index} className="flex items-center justify-between text-sm p-2 bg-muted rounded">
                      <span>{product.name}</span>
                      <span>{product.quantity} x {product.price} = {product.total}</span>
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm border-t pt-3">
                  <div>
                    <p className="text-muted-foreground">Subtotal:</p>
                    <p className="font-medium">{sale.subtotal}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Descuento ({sale.discount}):</p>
                    <p className="font-medium text-red-600">-{sale.discountAmount}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Forma de pago:</p>
                    <p className="font-medium">{sale.paymentMethod}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Entrega:</p>
                    <p className="font-medium">{sale.deliveryDate}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Estado de Cobranzas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paymentStatus.map((payment, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{payment.client}</h4>
                  <Badge className={getPaymentStatusColor(payment.status)}>
                    {payment.status === "pending" ? "Pendiente" : "Vencido"}
                  </Badge>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Monto:</span>
                    <span className="font-bold">{payment.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Vencimiento:</span>
                    <span>{payment.dueDate}</span>
                  </div>
                  {payment.daysOverdue > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Días vencido:</span>
                      <span className="text-red-600 font-medium">{payment.daysOverdue} días</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Facturas:</span>
                    <span className="text-xs">{payment.invoices.join(", ")}</span>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-3">
                  <button className="flex-1 px-3 py-2 text-sm border rounded hover:bg-muted transition-colors">
                    Ver Detalle
                  </button>
                  <button className="flex-1 px-3 py-2 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors">
                    Registrar Pago
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}