import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { 
  TrendingUp, 
  Users, 
  Package, 
  DollarSign,
  Calendar,
  AlertCircle,
  Factory,
  Truck,
  ShoppingCart,
  Clock
} from "lucide-react";

export function Dashboard() {
  const metrics = [
    {
      title: "Producción Diaria",
      value: "850 kg",
      change: "+5.2%",
      icon: Factory,
      trend: "up"
    },
    {
      title: "Ventas del Mes",
      value: "$45,280",
      change: "+8.7%",
      icon: DollarSign,
      trend: "up"
    },
    {
      title: "Stock Total",
      value: "2,340 kg",
      change: "-12 kg",
      icon: Package,
      trend: "down"
    },
    {
      title: "Clientes Activos",
      value: "127",
      change: "+3",
      icon: Users,
      trend: "up"
    }
  ];

  const productionData = [
    { product: "Muzzarella Cilindro 3kg", produced: "320 kg", target: "350 kg", progress: 91, brand: "Marca 1" },
    { product: "Muzzarella Plancha 10kg", produced: "280 kg", target: "300 kg", progress: 93, brand: "Marca 1" },
    { product: "Muzzarella Cilindro 1kg", produced: "150 kg", target: "200 kg", progress: 75, brand: "Marca 2" },
    { product: "Ricota Fresca", produced: "100 kg", target: "120 kg", progress: 83, brand: "Marca 1" }
  ];

  const salesByZone = [
    { zone: "Zona Norte", sales: "$12,450", clients: 45, trend: "up" },
    { zone: "Zona Sur", sales: "$8,320", clients: 32, trend: "up" },
    { zone: "Zona Centro", sales: "$15,680", clients: 38, trend: "down" },
    { zone: "Zona Este", sales: "$8,830", clients: 12, trend: "up" }
  ];

  const alerts = [
    { message: "Stock bajo: Muzzarella 1kg (Solo 45kg restantes)", type: "warning", time: "Hace 2 horas" },
    { message: "Pago pendiente: Cliente Distribuidora Norte", type: "error", time: "Hace 1 día" },
    { message: "Vencimiento próximo: Lote #234 (3 días)", type: "warning", time: "Hace 4 horas" },
    { message: "Pedido completado: Proveedor Lácteos SA", type: "success", time: "Hace 30 min" }
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Director del Panel</h1>
        <p className="text-muted-foreground">Bienvenido! Aquí tienes el resumen de tu PyME de productos lácteos.</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {metric.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className="text-xs text-muted-foreground">
                  {metric.change} from last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Producción Diaria */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Factory className="w-5 h-5" />
              Producción Diaria
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {productionData.map((item) => (
              <div key={item.product} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">{item.product}</h4>
                  <Badge variant="outline">{item.brand}</Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Progress value={item.progress} className="flex-1" />
                  <span>{item.progress}%</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {item.produced} / {item.target}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Ventas por Zona */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="w-5 h-5" />
              Ventas por Zona
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {salesByZone.map((zone) => (
              <div key={zone.zone} className="flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="text-sm font-medium">{zone.zone}</h4>
                  <p className="text-xs text-muted-foreground">{zone.clients} clientes</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{zone.sales}</span>
                  <TrendingUp className={`w-4 h-4 ${zone.trend === 'up' ? 'text-green-500' : 'text-red-500'}`} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Alertas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Alertas Importantes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {alerts.map((alert, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-start gap-2">
                  <AlertCircle className={`w-4 h-4 mt-0.5 ${
                    alert.type === 'error' ? 'text-red-500' : 
                    alert.type === 'warning' ? 'text-yellow-500' : 'text-green-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">{alert.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Stock en Tiempo Real */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Stock Actual en Tiempo Real
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium">Muzzarella Cilindro 3kg</h4>
              <p className="text-2xl font-bold text-green-600">245 kg</p>
              <p className="text-xs text-muted-foreground">Stock normal</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium">Muzzarella Plancha 10kg</h4>
              <p className="text-2xl font-bold text-green-600">180 kg</p>
              <p className="text-xs text-muted-foreground">Stock normal</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium">Muzzarella Cilindro 1kg</h4>
              <p className="text-2xl font-bold text-red-600">45 kg</p>
              <p className="text-xs text-red-600">Stock bajo</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium">Ricota Fresca</h4>
              <p className="text-2xl font-bold text-green-600">120 kg</p>
              <p className="text-xs text-muted-foreground">Stock normal</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}