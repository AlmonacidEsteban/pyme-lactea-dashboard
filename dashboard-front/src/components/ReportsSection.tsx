import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Calendar,
  FileText,
  PieChart,
  Users,
  DollarSign,
  Package,
  Milk,
  TrendingDown,
  Target,
  Factory,
  Truck
} from "lucide-react";

export function ReportsSection() {
  const reportMetrics = [
    {
      title: "Ventas Mensuales",
      value: "$12.850.000",
      change: "+15.3%",
      period: "vs mes anterior",
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "Producción Total",
      value: "8.450 L",
      change: "+8.7%",
      period: "vs mes anterior",
      icon: Factory,
      color: "text-blue-600"
    },
    {
      title: "Clientes Activos",
      value: "127",
      change: "+12.1%",
      period: "vs mes anterior",
      icon: Users,
      color: "text-purple-600"
    },
    {
      title: "Margen de Ganancia",
      value: "34.2%",
      change: "+2.8%",
      period: "vs mes anterior",
      icon: TrendingUp,
      color: "text-green-600"
    }
  ];

  const availableReports = [
    {
      name: "Ventas por Producto",
      description: "Análisis detallado de ventas por tipo de producto lácteo",
      type: "Ventas",
      lastGenerated: "1 Dic, 2024",
      icon: Milk,
      data: "Leche, Queso, Yogurt, Mantequilla",
      performance: "+18.5%"
    },
    {
      name: "Análisis de Producción",
      description: "Rendimiento de producción y eficiencia operativa",
      type: "Producción",
      lastGenerated: "30 Nov, 2024",
      icon: Factory,
      data: "Litros producidos, Eficiencia, Costos",
      performance: "+12.3%"
    },
    {
      name: "Comparativa Mensual",
      description: "Comparación de ventas y producción mes a mes",
      type: "Comparativo",
      lastGenerated: "28 Nov, 2024",
      icon: BarChart3,
      data: "Ventas, Producción, Márgenes",
      performance: "+8.7%"
    },
    {
      name: "Proyecciones Trimestrales",
      description: "Proyecciones de ventas y demanda para próximos meses",
      type: "Proyección",
      lastGenerated: "25 Nov, 2024",
      icon: Target,
      data: "Demanda, Ventas, Crecimiento",
      performance: "+25.4%"
    },
    {
      name: "Análisis de Clientes",
      description: "Comportamiento de compra y fidelización de clientes",
      type: "Clientes",
      lastGenerated: "22 Nov, 2024",
      icon: Users,
      data: "Frecuencia, Volumen, Retención",
      performance: "+15.2%"
    },
    {
      name: "Rentabilidad por Zona",
      description: "Análisis de rentabilidad por zona de distribución",
      type: "Distribución",
      lastGenerated: "20 Nov, 2024",
      icon: Truck,
      data: "Zonas, Costos, Márgenes",
      performance: "+9.8%"
    }
  ];

  const quickReports = [
    "Resumen Semanal de Ventas",
    "Producción Diaria",
    "Estado de Inventario",
    "Cuentas por Cobrar",
    "Análisis de Costos",
    "Proyección Mensual"
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Ventas":
        return "default";
      case "Producción":
        return "secondary";
      case "Comparativo":
        return "outline";
      case "Proyección":
        return "destructive";
      case "Clientes":
        return "default";
      case "Distribución":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const getTrendIcon = (change: string) => {
    return change.startsWith('+') ? 
      <TrendingUp className="w-4 h-4 text-green-600" /> : 
      <TrendingDown className="w-4 h-4 text-red-600" />;
  };

  const getTrendColor = (change: string) => {
    return change.startsWith('+') ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Informes</h1>
          <p className="text-muted-foreground">Análisis de ventas, producción y proyecciones de Mi PyME Lácteos</p>
        </div>
        <Button className="gap-2">
          <FileText className="w-4 h-4" />
          Informe Personalizado
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reportMetrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.title}>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${metric.color}`} />
                    <h3 className="text-sm font-medium text-muted-foreground">{metric.title}</h3>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold">{metric.value}</p>
                    {getTrendIcon(metric.change)}
                  </div>
                  <div className={`text-xs ${getTrendColor(metric.change)}`}>
                    {metric.change} {metric.period}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Available Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Informes Disponibles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableReports.map((report, index) => {
              const Icon = report.icon;
              return (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{report.name}</h4>
                        <p className="text-sm text-muted-foreground">{report.description}</p>
                      </div>
                    </div>
                    <Badge variant={getTypeColor(report.type)}>
                      {report.type}
                    </Badge>
                  </div>
                  
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>Datos: {report.data}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Generado: {report.lastGenerated}
                      </div>
                      <div className="flex items-center gap-1 text-green-600 font-medium">
                        <TrendingUp className="w-3 h-3" />
                        {report.performance}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Download className="w-3 h-3 mr-1" />
                      Generar
                    </Button>
                    <Button variant="ghost" size="sm" className="flex-1">
                      <BarChart3 className="w-3 h-3 mr-1" />
                      Ver
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informes Rápidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {quickReports.map((report, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{report}</span>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="w-3 h-3 mr-1" />
                    Generar
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Report Schedule */}
        <Card>
          <CardHeader>
            <CardTitle>Informes Programados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-muted rounded-lg">
                <h4 className="font-medium">Resumen Semanal</h4>
                <p className="text-sm text-muted-foreground">Cada lunes a las 9:00 AM</p>
                <Badge className="mt-2" variant="secondary">Activo</Badge>
              </div>
              
              <div className="p-3 bg-muted rounded-lg">
                <h4 className="font-medium">Financiero Mensual</h4>
                <p className="text-sm text-muted-foreground">1ro de cada mes</p>
                <Badge className="mt-2" variant="secondary">Activo</Badge>
              </div>
              
              <div className="p-3 bg-muted rounded-lg">
                <h4 className="font-medium">Revisión Trimestral</h4>
                <p className="text-sm text-muted-foreground">Final de cada trimestre</p>
                <Badge className="mt-2" variant="outline">Pausado</Badge>
              </div>

              <Button variant="outline" className="w-full mt-4">
                <Calendar className="w-4 h-4 mr-2" />
                Programar Nuevo Informe
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}