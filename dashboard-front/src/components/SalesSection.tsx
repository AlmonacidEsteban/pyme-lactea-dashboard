import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useState, useEffect } from "react";
import { VentaRapidaDialog } from "./clientes/VentaRapidaDialog";
import { Cliente, ProductoSugerido, VentaRapidaPayload } from "../types/clientes";
import { clientesService } from "../services/clientesService";
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
  Banknote,
  Plus,
  Eye,
  Receipt,
  Search,
  Filter
} from "lucide-react";

export function SalesSection() {
  const [showNewSaleDialog, setShowNewSaleDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [showSaleDetail, setShowSaleDetail] = useState(false);
  const [selectedSale, setSelectedSale] = useState<any>(null);
  const [showVentaRapida, setShowVentaRapida] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | undefined>(undefined);
  
  // Estados para filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [zoneFilter, setZoneFilter] = useState("all");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("all");
  
  // Estados para datos reales
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loadingClientes, setLoadingClientes] = useState(true);
  const [showClienteSelector, setShowClienteSelector] = useState(false);
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

  // Datos de ejemplo para clientes
  const clientesEjemplo: Cliente[] = [
    {
      id: 1,
      nombre: "Distribuidora Central",
      identificacion: "20-12345678-9",
      direccion: "Av. Principal 123",
      telefono: "+54 11 1234-5678",
      correo: "ventas@distribuidoracentral.com",
      zona: "Centro",
      tipo: "distribuidor",
      activo: true
    },
    {
      id: 2,
      nombre: "Almacén Don Pedro",
      identificacion: "20-87654321-0",
      direccion: "Calle Secundaria 456",
      telefono: "+54 11 8765-4321",
      correo: "pedidos@almacendonpedro.com",
      zona: "Sur",
      tipo: "minorista",
      activo: true
    },
    {
      id: 3,
      nombre: "Supermercado Los Andes",
      identificacion: "20-11223344-5",
      direccion: "Av. Los Andes 789",
      telefono: "+54 11 1122-3344",
      correo: "compras@superlosandes.com",
      zona: "Norte",
      tipo: "mayorista",
      activo: true
    }
  ];

  // Datos de ejemplo para productos
  const productosEjemplo: ProductoSugerido[] = [
    {
      id: "1",
      nombre: "Muzzarella Plancha 10kg",
      precio: 15500
    },
    {
      id: "2",
      nombre: "Muzzarella Cilindro 1kg",
      precio: 1650
    },
    {
      id: "3",
      nombre: "Muzzarella Cilindro 3kg",
      precio: 4800
    },
    {
      id: "4",
      nombre: "Queso Cremoso 500g",
      precio: 1450
    },
    {
      id: "5",
      nombre: "Queso Provoleta 1kg",
      precio: 2200
    },
    {
      id: "6",
      nombre: "Ricota Fresca 500g",
      precio: 980
    }
  ];

  // Función para cargar clientes
  const loadClientes = async () => {
    try {
      setLoadingClientes(true);
      const response = await clientesService.list();
      setClientes(response.results || []);
    } catch (error) {
      console.error('Error al cargar clientes:', error);
      // En caso de error, usar datos de ejemplo
      setClientes(clientesEjemplo);
    } finally {
      setLoadingClientes(false);
    }
  };

  // Cargar clientes al inicializar el componente
  useEffect(() => {
    loadClientes();
  }, []);

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

  const handleNewSale = () => {
    // Mostrar selector de clientes
    setShowClienteSelector(true);
  };

  const handleSelectCliente = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setShowClienteSelector(false);
    setShowVentaRapida(true);
  };

  const handleConfirmVenta = async (payload: VentaRapidaPayload) => {
    try {
      console.log("Procesando venta:", payload);
      // Aquí se enviaría la venta al backend
      // await ventasService.crearVenta(payload);
      
      // Simular procesamiento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert(`Venta procesada exitosamente por $${payload.total.toLocaleString()}`);
      setShowVentaRapida(false);
    } catch (error) {
      console.error("Error al procesar venta:", error);
      alert("Error al procesar la venta");
    }
  };

  // Lógica de filtrado y búsqueda
  const filteredSales = recentSales.filter(sale => {
    const matchesSearch = searchTerm === "" || 
      sale.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || sale.paymentStatus === statusFilter;
    const matchesZone = zoneFilter === "all" || sale.zone === zoneFilter;
    const matchesPaymentMethod = paymentMethodFilter === "all" || sale.paymentMethod === paymentMethodFilter;
    
    return matchesSearch && matchesStatus && matchesZone && matchesPaymentMethod;
  });

  // Obtener valores únicos para los filtros
  const uniqueZones = [...new Set(recentSales.map(sale => sale.zone))];
  const uniquePaymentMethods = [...new Set(recentSales.map(sale => sale.paymentMethod))];
  const uniqueStatuses = [...new Set(recentSales.map(sale => sale.paymentStatus))];

  const handleViewDetail = (payment: any) => {
    setSelectedPayment(payment);
    setShowSaleDetail(true);
  };

  const handleRegisterPayment = (payment: any) => {
    setSelectedPayment(payment);
    setShowPaymentDialog(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Ventas</h1>
          <p className="text-muted-foreground">Gestiona ventas, clientes, zonas de reparto y formas de pago.</p>
        </div>
        <Button 
          onClick={handleNewSale}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md border-0"
          style={{ backgroundColor: '#1E40AF', color: '#FFFFFF' }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nueva Venta
        </Button>
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
          
          {/* Filtros y búsqueda */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar por cliente, ID o factura..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  {uniqueStatuses.map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={zoneFilter} onValueChange={setZoneFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Zona" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las zonas</SelectItem>
                  {uniqueZones.map(zone => (
                    <SelectItem key={zone} value={zone}>{zone}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={paymentMethodFilter} onValueChange={setPaymentMethodFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Pago" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los métodos</SelectItem>
                  {uniquePaymentMethods.map(method => (
                    <SelectItem key={method} value={method}>{method}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {filteredSales.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Filter className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No se encontraron ventas con los filtros aplicados</p>
              </div>
            ) : (
              filteredSales.map((sale) => (
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
            ))
            )}
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
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleViewDetail(payment)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Ver Detalle
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                    style={{ backgroundColor: '#1E40AF', color: '#FFFFFF' }}
                    onClick={() => handleRegisterPayment(payment)}
                  >
                    <Receipt className="w-4 h-4 mr-1" />
                    Registrar Pago
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modal Selector de Clientes */}
      {showClienteSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div 
            className="bg-white rounded-lg p-8 w-full max-w-3xl max-h-[85vh] overflow-hidden shadow-2xl"
            style={{ 
              backgroundColor: '#ffffff',
              border: '4px solid #2563eb',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}
          >
            <div className="flex items-center justify-between mb-8 pb-6" style={{ borderBottom: '3px solid #e5e7eb' }}>
              <h2 
                className="text-3xl font-black flex items-center gap-3"
                style={{ color: '#111827', fontSize: '28px', fontWeight: '900' }}
              >
                <Users className="h-8 w-8" style={{ color: '#2563eb' }} />
                Seleccionar Cliente
              </h2>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowClienteSelector(false)}
                className="text-2xl font-black w-12 h-12 rounded-full"
                style={{ 
                  color: '#374151',
                  backgroundColor: '#f3f4f6',
                  border: '2px solid #d1d5db'
                }}
              >
                ✕
              </Button>
            </div>
            
            {loadingClientes ? (
              <div 
                className="flex items-center justify-center py-16 rounded-lg"
                style={{ backgroundColor: '#f9fafb', border: '2px solid #d1d5db' }}
              >
                <div 
                  className="h-10 w-10 animate-spin rounded-full border-4 border-t-transparent"
                  style={{ borderColor: '#2563eb', borderTopColor: 'transparent' }}
                ></div>
                <span 
                  className="ml-4 text-xl font-bold"
                  style={{ color: '#111827', fontSize: '20px', fontWeight: '700' }}
                >
                  Cargando clientes...
                </span>
              </div>
            ) : (
              <div 
                className="max-h-96 overflow-y-auto rounded-lg p-4"
                style={{ backgroundColor: '#f3f4f6', border: '2px solid #d1d5db' }}
              >
                {clientes.length === 0 ? (
                  <div 
                    className="text-center py-12"
                    style={{ color: '#374151' }}
                  >
                    <Users className="w-16 h-16 mx-auto mb-6" style={{ color: '#6b7280' }} />
                    <p style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>No hay clientes disponibles</p>
                    <p style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', marginTop: '8px' }}>Agrega clientes desde el módulo de Clientes</p>
                  </div>
                ) : (
                  clientes.map((cliente) => (
                    <div 
                      key={cliente.id} 
                      className="p-6 rounded-lg cursor-pointer transition-all duration-200 mb-4"
                      style={{ 
                        backgroundColor: '#ffffff',
                        border: '3px solid #d1d5db',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#eff6ff';
                        e.currentTarget.style.borderColor = '#3b82f6';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#ffffff';
                        e.currentTarget.style.borderColor = '#d1d5db';
                      }}
                      onClick={() => handleSelectCliente(cliente)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 
                            className="mb-2"
                            style={{ 
                              fontSize: '20px', 
                              fontWeight: '800', 
                              color: '#111827',
                              lineHeight: '1.2'
                            }}
                          >
                            👤 {cliente.nombre}
                          </h4>
                          <p 
                            className="mb-2"
                            style={{ 
                              fontSize: '16px', 
                              fontWeight: '600', 
                              color: '#374151'
                            }}
                          >
                            🆔 {cliente.identificacion}
                          </p>
                          <div className="flex items-center gap-3 mt-3">
                            <span 
                              className="px-3 py-1 rounded-full text-sm font-bold"
                              style={{ 
                                backgroundColor: '#dbeafe', 
                                color: '#1e40af',
                                border: '2px solid #3b82f6'
                              }}
                            >
                              {cliente.zona}
                            </span>
                            <span 
                              className="px-3 py-1 rounded-full text-sm font-bold"
                              style={{ 
                                backgroundColor: '#dcfce7', 
                                color: '#166534',
                                border: '2px solid #22c55e'
                              }}
                            >
                              {cliente.tipo}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p 
                            className="mb-2"
                            style={{ 
                              fontSize: '16px', 
                              fontWeight: '600', 
                              color: '#374151'
                            }}
                          >
                            📞 {cliente.telefono}
                          </p>
                          <p 
                            style={{ 
                              fontSize: '14px', 
                              fontWeight: '600', 
                              color: '#6b7280'
                            }}
                          >
                            📧 {cliente.correo}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* VentaRapidaDialog */}
      <VentaRapidaDialog
        open={showVentaRapida}
        onOpenChange={setShowVentaRapida}
        cliente={selectedCliente}
        productos={productosEjemplo}
        onConfirm={handleConfirmVenta}
      />

      {/* Modal Ver Detalle */}
      {showSaleDetail && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div 
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: '32px',
              width: '100%',
              maxWidth: '700px',
              border: '4px solid #10b981',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              margin: '20px'
            }}
          >
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '24px',
                paddingBottom: '16px',
                borderBottom: '3px solid #e5e7eb'
              }}
            >
              <h2 
                style={{
                  fontSize: '28px',
                  fontWeight: '900',
                  color: '#111827',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                💰 Detalle de Cobranza
              </h2>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowSaleDetail(false)}
                style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#6b7280',
                  backgroundColor: '#f3f4f6',
                  width: '48px',
                  height: '48px',
                  borderRadius: '8px',
                  border: '2px solid #d1d5db'
                }}
              >
                ✕
              </Button>
            </div>
            <div 
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                backgroundColor: '#f8fafc',
                padding: '24px',
                borderRadius: '12px',
                border: '2px solid #e2e8f0'
              }}
            >
              <div 
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '16px'
                }}
              >
                <div 
                  style={{
                    backgroundColor: '#ffffff',
                    padding: '16px',
                    borderRadius: '8px',
                    border: '3px solid #d1d5db',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <p 
                    style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#374151',
                      marginBottom: '8px'
                    }}
                  >
                    👤 Cliente:
                  </p>
                  <p 
                    style={{
                      fontSize: '20px',
                      fontWeight: '800',
                      color: '#111827'
                    }}
                  >
                    {selectedPayment.client}
                  </p>
                </div>
                <div 
                  style={{
                    backgroundColor: '#ffffff',
                    padding: '16px',
                    borderRadius: '8px',
                    border: '3px solid #bbf7d0',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <p 
                    style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#374151',
                      marginBottom: '8px'
                    }}
                  >
                    💰 Monto:
                  </p>
                  <p 
                    style={{
                      fontSize: '24px',
                      fontWeight: '900',
                      color: '#059669'
                    }}
                  >
                    {selectedPayment.amount}
                  </p>
                </div>
                <div 
                  style={{
                    backgroundColor: '#ffffff',
                    padding: '16px',
                    borderRadius: '8px',
                    border: '3px solid #ddd6fe',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <p 
                    style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#374151',
                      marginBottom: '8px'
                    }}
                  >
                    📅 Vencimiento:
                  </p>
                  <p 
                    style={{
                      fontSize: '18px',
                      fontWeight: '700',
                      color: '#111827'
                    }}
                  >
                    {selectedPayment.dueDate}
                  </p>
                </div>
                <div 
                  style={{
                    backgroundColor: '#ffffff',
                    padding: '16px',
                    borderRadius: '8px',
                    border: '3px solid #fed7d7',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <p 
                    style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#374151',
                      marginBottom: '8px'
                    }}
                  >
                    📊 Estado:
                  </p>
                  <div 
                    style={{
                      display: 'inline-block',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      fontSize: '16px',
                      fontWeight: '700',
                      backgroundColor: selectedPayment.status === "pending" ? '#fef3c7' : '#fee2e2',
                      color: selectedPayment.status === "pending" ? '#92400e' : '#dc2626',
                      border: selectedPayment.status === "pending" ? '2px solid #f59e0b' : '2px solid #ef4444'
                    }}
                  >
                    {selectedPayment.status === "pending" ? "⏳ Pendiente" : "❌ Vencido"}
                  </div>
                </div>
              </div>
              <div 
                style={{
                  backgroundColor: '#ffffff',
                  padding: '16px',
                  borderRadius: '8px',
                  border: '3px solid #bfdbfe',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              >
                <p 
                  style={{
                    fontSize: '16px',
                    fontWeight: '700',
                    color: '#374151',
                    marginBottom: '12px'
                  }}
                >
                  📄 Facturas:
                </p>
                <p 
                  style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#111827'
                  }}
                >
                  {selectedPayment.invoices.join(", ")}
                </p>
              </div>
              {selectedPayment.daysOverdue > 0 && (
                <div 
                  style={{
                    padding: '20px',
                    backgroundColor: '#fee2e2',
                    border: '3px solid #ef4444',
                    borderRadius: '12px',
                    textAlign: 'center'
                  }}
                >
                  <p 
                    style={{
                      color: '#dc2626',
                      fontSize: '18px',
                      fontWeight: '800'
                    }}
                  >
                    ⚠️ Vencido por {selectedPayment.daysOverdue} días
                  </p>
                </div>
              )}
            </div>
            <div 
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginTop: '24px'
              }}
            >
              <Button 
                variant="outline" 
                onClick={() => setShowSaleDetail(false)}
                style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  padding: '12px 24px',
                  border: '2px solid #d1d5db',
                  color: '#374151',
                  backgroundColor: '#ffffff'
                }}
              >
                🚪 Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Registrar Pago */}
      {showPaymentDialog && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div 
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: '32px',
              width: '100%',
              maxWidth: '600px',
              border: '4px solid #10b981',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              margin: '20px'
            }}
          >
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '24px',
                paddingBottom: '16px',
                borderBottom: '3px solid #e5e7eb'
              }}
            >
              <h2 
                style={{
                  fontSize: '28px',
                  fontWeight: '900',
                  color: '#111827',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                💳 Registrar Pago
              </h2>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowPaymentDialog(false)}
                style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#6b7280',
                  backgroundColor: '#f3f4f6',
                  width: '48px',
                  height: '48px',
                  borderRadius: '8px',
                  border: '2px solid #d1d5db'
                }}
              >
                ✕
              </Button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div 
                style={{
                  backgroundColor: '#f9fafb',
                  padding: '16px',
                  borderRadius: '8px',
                  border: '2px solid #e5e7eb'
                }}
              >
                <p 
                  style={{
                    fontSize: '16px',
                    fontWeight: '700',
                    color: '#374151',
                    marginBottom: '8px'
                  }}
                >
                  👤 Cliente:
                </p>
                <p 
                  style={{
                    fontSize: '20px',
                    fontWeight: '800',
                    color: '#111827'
                  }}
                >
                  {selectedPayment.client}
                </p>
              </div>
              <div 
                style={{
                  backgroundColor: '#f0fdf4',
                  padding: '16px',
                  borderRadius: '8px',
                  border: '2px solid #bbf7d0'
                }}
              >
                <p 
                  style={{
                    fontSize: '16px',
                    fontWeight: '700',
                    color: '#374151',
                    marginBottom: '8px'
                  }}
                >
                  💰 Monto a cobrar:
                </p>
                <p 
                  style={{
                    fontSize: '24px',
                    fontWeight: '900',
                    color: '#059669'
                  }}
                >
                  {selectedPayment.amount}
                </p>
              </div>
              <div>
                <label 
                  style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#111827',
                    display: 'block',
                    marginBottom: '8px'
                  }}
                >
                  💳 Método de pago:
                </label>
                <select 
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '3px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#111827',
                    backgroundColor: '#ffffff'
                  }}
                >
                  <option>💵 Efectivo</option>
                  <option>🏦 Transferencia</option>
                  <option>💳 Tarjeta</option>
                  <option>📄 Cheque</option>
                </select>
              </div>
              <div>
                <label 
                  style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#111827',
                    display: 'block',
                    marginBottom: '8px'
                  }}
                >
                  📝 Observaciones:
                </label>
                <textarea 
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '3px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '500',
                    color: '#111827',
                    backgroundColor: '#ffffff',
                    minHeight: '100px',
                    resize: 'vertical'
                  }}
                  rows={3}
                  placeholder="Observaciones del pago..."
                />
              </div>
            </div>
            <div 
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px',
                marginTop: '32px'
              }}
            >
              <Button 
                variant="outline" 
                onClick={() => setShowPaymentDialog(false)}
                style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  padding: '12px 24px',
                  border: '2px solid #d1d5db',
                  color: '#374151'
                }}
              >
                Cancelar
              </Button>
              <Button 
                onClick={() => {
                  // Aquí se implementará la lógica de registro de pago
                  setShowPaymentDialog(false);
                }}
                style={{
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  fontSize: '16px',
                  fontWeight: '700',
                  padding: '12px 24px',
                  border: 'none',
                  borderRadius: '8px'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#059669';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#10b981';
                }}
              >
                💾 Registrar Pago
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}