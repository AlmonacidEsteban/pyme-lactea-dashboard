// MÓDULO DE COMPRAS COMPLETO - COMPONENTE PRINCIPAL
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { 
  ShoppingCart, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Truck, 
  DollarSign,
  Package,
  FileText,
  BarChart3,
  Bell,
  Download,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Send,
  PackageCheck
} from 'lucide-react';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { comprasService, type OrdenCompra, type DashboardStats, type AlertaStock } from '../../services/comprasService';

// Componente de Dashboard
const ComprasDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarStats = async () => {
      try {
        const data = await comprasService.reportes.getDashboardEstadisticas();
        setStats(data);
      } catch (error) {
        console.error('Error cargando estadísticas:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarStats();
  }, []);

  if (loading) {
    return <div className="flex justify-center p-8">Cargando estadísticas...</div>;
  }

  if (!stats) {
    return <div className="text-center p-8 text-red-500">Error cargando estadísticas</div>;
  }

  return (
    <div className="space-y-6">
      {/* Tarjetas de estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Órdenes Totales</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_ordenes}</div>
            <p className="text-xs text-muted-foreground">
              {stats.ordenes_pendientes} pendientes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.total_valor.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Este mes: ${stats.total_gastado_mes?.toLocaleString() || 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Bajo</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{stats.productos_bajo_stock}</div>
            <p className="text-xs text-muted-foreground">
              Productos bajo mínimo
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas Activas</CardTitle>
            <Bell className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{stats.alertas_activas}</div>
            <p className="text-xs text-muted-foreground">
              Requieren atención
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de compras por mes */}
      <Card>
        <CardHeader>
          <CardTitle>Compras por Mes</CardTitle>
          <CardDescription>Evolución de las compras en los últimos 6 meses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {stats.compras_por_mes?.map((mes, index) => (
              <div key={mes.mes} className="flex items-center space-x-2">
                <div className="w-16 text-sm">{mes.mes}</div>
                <div className="flex-1">
                  <Progress 
                    value={(mes.total / Math.max(...stats.compras_por_mes.map(m => m.total))) * 100} 
                    className="h-2"
                  />
                </div>
                <div className="w-24 text-sm text-right">${mes.total.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top proveedores y productos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Proveedores</CardTitle>
            <CardDescription>Proveedores con más compras este mes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.top_proveedores?.map((proveedor, index) => (
                <div key={proveedor.proveedor__nombre} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{index + 1}</Badge>
                    <span className="text-sm">{proveedor.proveedor__nombre}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">${proveedor.total.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">{proveedor.ordenes} órdenes</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Productos Más Comprados</CardTitle>
            <CardDescription>Productos con mayor volumen este mes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.productos_mas_comprados?.map((producto, index) => (
                <div key={producto.producto__nombre} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{index + 1}</Badge>
                    <span className="text-sm">{producto.producto__nombre}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{producto.cantidad_total} unidades</div>
                    <div className="text-xs text-muted-foreground">{producto.ordenes} órdenes</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Componente de Lista de Órdenes
const OrdenesCompraLista: React.FC = () => {
  const [ordenes, setOrdenes] = useState<OrdenCompra[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    search: '',
    estado: '',
    proveedor: '',
  });

  useEffect(() => {
    cargarOrdenes();
  }, [filtros]);

  const cargarOrdenes = async () => {
    try {
      setLoading(true);
      const data = await comprasService.ordenes.getOrdenes(filtros);
      setOrdenes(data);
    } catch (error) {
      console.error('Error cargando órdenes:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEstadoBadge = (estado: string) => {
    const variants = {
      'borrador': 'secondary',
      'enviada': 'default',
      'confirmada': 'default',
      'parcial': 'destructive',
      'completa': 'default',
      'cancelada': 'destructive'
    };
    
    return <Badge variant={variants[estado] || 'secondary'}>{estado.toUpperCase()}</Badge>;
  };

  const getPrioridadBadge = (prioridad: string) => {
    const colors = {
      'baja': 'text-green-600',
      'media': 'text-yellow-600',
      'alta': 'text-orange-600',
      'urgente': 'text-red-600'
    };
    
    return <span className={`text-sm ${colors[prioridad] || 'text-gray-600'}`}>{prioridad.toUpperCase()}</span>;
  };

  return (
    <div className="space-y-6">
      {/* Filtros y acciones */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex gap-2 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar órdenes..."
              value={filtros.search}
              onChange={(e) => setFiltros(prev => ({ ...prev, search: e.target.value }))}
              className="pl-8"
            />
          </div>
          
          <Select value={filtros.estado} onValueChange={(value) => setFiltros(prev => ({ ...prev, estado: value }))}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos</SelectItem>
              <SelectItem value="borrador">Borrador</SelectItem>
              <SelectItem value="enviada">Enviada</SelectItem>
              <SelectItem value="confirmada">Confirmada</SelectItem>
              <SelectItem value="parcial">Parcial</SelectItem>
              <SelectItem value="completa">Completa</SelectItem>
              <SelectItem value="cancelada">Cancelada</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button 
            size="sm" 
            style={{ 
              backgroundColor: '#1E12A6', 
              color: '#FFFFFF',
              fontWeight: '500'
            }}
            className="hover:opacity-90"
          >
            <Plus className="h-4 w-4 mr-2" style={{ color: '#FFFFFF' }} />
            <span style={{ color: '#FFFFFF' }}>Nueva Orden</span>
          </Button>
        </div>
      </div>

      {/* Lista de órdenes */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">Cargando órdenes...</div>
        ) : ordenes.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No se encontraron órdenes</div>
        ) : (
          ordenes.map((orden) => (
            <Card key={orden.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold">OC-{orden.numero}</h3>
                      {getEstadoBadge(orden.estado)}
                      {getPrioridadBadge(orden.prioridad)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {orden.proveedor_nombre} • {new Date(orden.fecha_creacion).toLocaleDateString()}
                    </p>
                    <p className="text-sm">
                      Entrega esperada: {new Date(orden.fecha_entrega_esperada).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="text-right space-y-1">
                    <div className="text-lg font-semibold">${orden.total.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">{orden.items?.length || 0} items</div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    {orden.estado === 'borrador' && (
                      <Button variant="outline" size="sm">
                        <Send className="h-4 w-4" />
                      </Button>
                    )}
                    {(orden.estado === 'enviada' || orden.estado === 'confirmada') && (
                      <Button variant="outline" size="sm">
                        <PackageCheck className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

// Componente de Alertas
const AlertasStock: React.FC = () => {
  const [alertas, setAlertas] = useState<AlertaStock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarAlertas();
  }, []);

  const cargarAlertas = async () => {
    try {
      const data = await comprasService.alertas.getAlertasActivas();
      setAlertas(data);
    } catch (error) {
      console.error('Error cargando alertas:', error);
    } finally {
      setLoading(false);
    }
  };

  const resolverAlerta = async (id: number) => {
    try {
      await comprasService.alertas.resolverAlerta(id);
      cargarAlertas(); // Recargar alertas
    } catch (error) {
      console.error('Error resolviendo alerta:', error);
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'stock_minimo':
        return <Package className="h-4 w-4 text-orange-500" />;
      case 'precio_atipico':
        return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'proveedor_lento':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Alertas Activas</h3>
        <Button variant="outline" size="sm">
          <Bell className="h-4 w-4 mr-2" />
          Generar Alertas
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8">Cargando alertas...</div>
      ) : alertas.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">No hay alertas activas</div>
      ) : (
        <div className="space-y-3">
          {alertas.map((alerta) => (
            <Card key={alerta.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {getTipoIcon(alerta.tipo)}
                    <div>
                      <h4 className="font-medium">{alerta.titulo}</h4>
                      <p className="text-sm text-muted-foreground">{alerta.mensaje}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(alerta.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => resolverAlerta(alerta.id!)}
                  >
                    Resolver
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

// Componente principal del módulo
const ComprasModuloCompleto: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Módulo de Compras</h1>
          <p className="text-muted-foreground">
            Gestión completa de órdenes de compra, stock y proveedores
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="dashboard">
            <BarChart3 className="h-4 w-4 mr-2" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="ordenes">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Órdenes
          </TabsTrigger>
          <TabsTrigger value="stock">
            <Package className="h-4 w-4 mr-2" />
            Stock
          </TabsTrigger>
          <TabsTrigger value="precios">
            <DollarSign className="h-4 w-4 mr-2" />
            Precios
          </TabsTrigger>
          <TabsTrigger value="alertas">
            <Bell className="h-4 w-4 mr-2" />
            Alertas
          </TabsTrigger>
          <TabsTrigger value="reportes">
            <FileText className="h-4 w-4 mr-2" />
            Reportes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          <ComprasDashboard />
        </TabsContent>

        <TabsContent value="ordenes" className="space-y-4">
          <OrdenesCompraLista />
        </TabsContent>

        <TabsContent value="stock" className="space-y-4">
          <div className="text-center py-8 text-muted-foreground">
            Módulo de gestión de stock en desarrollo...
          </div>
        </TabsContent>

        <TabsContent value="precios" className="space-y-4">
          <div className="text-center py-8 text-muted-foreground">
            Módulo de historial de precios en desarrollo...
          </div>
        </TabsContent>

        <TabsContent value="alertas" className="space-y-4">
          <AlertasStock />
        </TabsContent>

        <TabsContent value="reportes" className="space-y-4">
          <div className="text-center py-8 text-muted-foreground">
            Módulo de reportes en desarrollo...
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComprasModuloCompleto;