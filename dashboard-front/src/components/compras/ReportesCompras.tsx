// COMPONENTE PARA REPORTES Y ESTADÍSTICAS DE COMPRAS
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Package,
  Users,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  PieChart,
  LineChart,
  FileText,
  Target,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { comprasService } from '../../services/comprasService';

interface EstadisticasCompras {
  total_compras: number;
  total_monto: number;
  promedio_orden: number;
  ordenes_pendientes: number;
  ordenes_completadas: number;
  proveedores_activos: number;
  productos_comprados: number;
  ahorro_estimado: number;
  compras_por_mes: Array<{ mes: string; cantidad: number; monto: number }>;
  top_proveedores: Array<{ proveedor: string; monto: number; ordenes: number }>;
  top_productos: Array<{ producto: string; cantidad: number; monto: number }>;
  tendencia_precios: Array<{ producto: string; variacion: number; precio_actual: number }>;
}

const ReportesCompras: React.FC = () => {
  const [estadisticas, setEstadisticas] = useState<EstadisticasCompras | null>(null);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    fecha_desde: new Date(new Date().getFullYear(), new Date().getMonth() - 3, 1).toISOString().split('T')[0],
    fecha_hasta: new Date().toISOString().split('T')[0],
    proveedor: '',
    categoria: '',
    estado: ''
  });
  const [exportando, setExportando] = useState(false);

  useEffect(() => {
    cargarEstadisticas();
  }, [filtros]);

  const cargarEstadisticas = async () => {
    try {
      setLoading(true);
      const data = await comprasService.reportes.getEstadisticas(filtros);
      setEstadisticas(data);
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
      // Datos de ejemplo para desarrollo
      setEstadisticas({
        total_compras: 156,
        total_monto: 45678.90,
        promedio_orden: 292.81,
        ordenes_pendientes: 12,
        ordenes_completadas: 144,
        proveedores_activos: 23,
        productos_comprados: 89,
        ahorro_estimado: 3456.78,
        compras_por_mes: [
          { mes: '2024-01', cantidad: 45, monto: 12345.67 },
          { mes: '2024-02', cantidad: 52, monto: 15678.90 },
          { mes: '2024-03', cantidad: 59, monto: 17654.33 }
        ],
        top_proveedores: [
          { proveedor: 'Proveedor A', monto: 15678.90, ordenes: 34 },
          { proveedor: 'Proveedor B', monto: 12345.67, ordenes: 28 },
          { proveedor: 'Proveedor C', monto: 9876.54, ordenes: 22 }
        ],
        top_productos: [
          { producto: 'Producto 1', cantidad: 234, monto: 8765.43 },
          { producto: 'Producto 2', cantidad: 189, monto: 7654.32 },
          { producto: 'Producto 3', cantidad: 156, monto: 6543.21 }
        ],
        tendencia_precios: [
          { producto: 'Producto A', variacion: 5.2, precio_actual: 125.50 },
          { producto: 'Producto B', variacion: -2.8, precio_actual: 89.75 },
          { producto: 'Producto C', variacion: 12.1, precio_actual: 234.90 }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const exportarReporte = async (tipo: string) => {
    try {
      setExportando(true);
      await comprasService.reportes.exportarCSV(filtros, tipo);
      alert(`Reporte ${tipo} exportado correctamente`);
    } catch (error) {
      console.error('Error exportando reporte:', error);
      alert('Error exportando reporte');
    } finally {
      setExportando(false);
    }
  };

  const formatearMoneda = (monto: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(monto);
  };

  const formatearPorcentaje = (valor: number) => {
    return `${valor > 0 ? '+' : ''}${valor.toFixed(1)}%`;
  };

  const getTendenciaIcon = (variacion: number) => {
    if (variacion > 0) return <TrendingUp className="h-4 w-4 text-red-500" />;
    if (variacion < 0) return <TrendingDown className="h-4 w-4 text-green-500" />;
    return <div className="h-4 w-4" />;
  };

  const getTendenciaColor = (variacion: number) => {
    if (variacion > 0) return 'text-red-600';
    if (variacion < 0) return 'text-green-600';
    return 'text-gray-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Cargando reportes...</span>
      </div>
    );
  }

  if (!estadisticas) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">Error cargando estadísticas</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Reportes de Compras</h2>
          <p className="text-muted-foreground">
            Análisis y estadísticas del módulo de compras
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => cargarEstadisticas()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
          <Button 
            variant="outline" 
            onClick={() => exportarReporte('completo')}
            disabled={exportando}
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span>Filtros de Período</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label>Fecha Desde</Label>
              <Input
                type="date"
                value={filtros.fecha_desde}
                onChange={(e) => setFiltros(prev => ({ ...prev, fecha_desde: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Fecha Hasta</Label>
              <Input
                type="date"
                value={filtros.fecha_hasta}
                onChange={(e) => setFiltros(prev => ({ ...prev, fecha_hasta: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Proveedor</Label>
              <Input
                placeholder="Filtrar por proveedor"
                value={filtros.proveedor}
                onChange={(e) => setFiltros(prev => ({ ...prev, proveedor: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Categoría</Label>
              <Input
                placeholder="Filtrar por categoría"
                value={filtros.categoria}
                onChange={(e) => setFiltros(prev => ({ ...prev, categoria: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Estado</Label>
              <Select 
                value={filtros.estado} 
                onValueChange={(value) => setFiltros(prev => ({ ...prev, estado: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="borrador">Borrador</SelectItem>
                  <SelectItem value="enviada">Enviada</SelectItem>
                  <SelectItem value="recibida">Recibida</SelectItem>
                  <SelectItem value="cancelada">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Compras</p>
                <p className="text-2xl font-bold">{estadisticas.total_compras}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Monto Total</p>
                <p className="text-2xl font-bold">{formatearMoneda(estadisticas.total_monto)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Target className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Promedio por Orden</p>
                <p className="text-2xl font-bold">{formatearMoneda(estadisticas.promedio_orden)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ahorro Estimado</p>
                <p className="text-2xl font-bold text-green-600">{formatearMoneda(estadisticas.ahorro_estimado)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Estado de órdenes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Órdenes Pendientes</p>
                <p className="text-3xl font-bold text-orange-600">{estadisticas.ordenes_pendientes}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Órdenes Completadas</p>
                <p className="text-3xl font-bold text-green-600">{estadisticas.ordenes_completadas}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Proveedores Activos</p>
                <p className="text-3xl font-bold">{estadisticas.proveedores_activos}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs con diferentes reportes */}
      <Tabs defaultValue="tendencias" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tendencias">Tendencias</TabsTrigger>
          <TabsTrigger value="proveedores">Proveedores</TabsTrigger>
          <TabsTrigger value="productos">Productos</TabsTrigger>
          <TabsTrigger value="precios">Precios</TabsTrigger>
        </TabsList>

        <TabsContent value="tendencias" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <LineChart className="h-5 w-5" />
                <span>Tendencia de Compras por Mes</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {estadisticas.compras_por_mes.map((mes, index) => (
                  <div key={mes.mes} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{new Date(mes.mes).toLocaleDateString('es-AR', { year: 'numeric', month: 'long' })}</p>
                      <p className="text-sm text-muted-foreground">{mes.cantidad} órdenes</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatearMoneda(mes.monto)}</p>
                      <p className="text-sm text-muted-foreground">
                        Promedio: {formatearMoneda(mes.monto / mes.cantidad)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="proveedores" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Top Proveedores</span>
              </CardTitle>
              <CardDescription>Proveedores con mayor volumen de compras</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {estadisticas.top_proveedores.map((proveedor, index) => (
                  <div key={proveedor.proveedor} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline">#{index + 1}</Badge>
                      <div>
                        <p className="font-medium">{proveedor.proveedor}</p>
                        <p className="text-sm text-muted-foreground">{proveedor.ordenes} órdenes</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatearMoneda(proveedor.monto)}</p>
                      <p className="text-sm text-muted-foreground">
                        Promedio: {formatearMoneda(proveedor.monto / proveedor.ordenes)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="productos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="h-5 w-5" />
                <span>Top Productos</span>
              </CardTitle>
              <CardDescription>Productos más comprados por volumen</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {estadisticas.top_productos.map((producto, index) => (
                  <div key={producto.producto} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline">#{index + 1}</Badge>
                      <div>
                        <p className="font-medium">{producto.producto}</p>
                        <p className="text-sm text-muted-foreground">Cantidad: {producto.cantidad}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatearMoneda(producto.monto)}</p>
                      <p className="text-sm text-muted-foreground">
                        Precio promedio: {formatearMoneda(producto.monto / producto.cantidad)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="precios" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Tendencia de Precios</span>
              </CardTitle>
              <CardDescription>Variación de precios en el período seleccionado</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {estadisticas.tendencia_precios.map((item) => (
                  <div key={item.producto} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getTendenciaIcon(item.variacion)}
                      <div>
                        <p className="font-medium">{item.producto}</p>
                        <p className="text-sm text-muted-foreground">
                          Precio actual: {formatearMoneda(item.precio_actual)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${getTendenciaColor(item.variacion)}`}>
                        {formatearPorcentaje(item.variacion)}
                      </p>
                      <Badge variant={item.variacion > 5 ? 'destructive' : item.variacion < -5 ? 'default' : 'secondary'}>
                        {item.variacion > 5 ? 'ALZA' : item.variacion < -5 ? 'BAJA' : 'ESTABLE'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Acciones rápidas */}
      <Card>
        <CardHeader>
          <CardTitle>Exportar Reportes</CardTitle>
          <CardDescription>Descargar reportes detallados en formato CSV</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              onClick={() => exportarReporte('compras')}
              disabled={exportando}
              className="w-full"
            >
              <Download className="h-4 w-4 mr-2" />
              Reporte de Compras
            </Button>
            <Button 
              variant="outline" 
              onClick={() => exportarReporte('proveedores')}
              disabled={exportando}
              className="w-full"
            >
              <Download className="h-4 w-4 mr-2" />
              Reporte de Proveedores
            </Button>
            <Button 
              variant="outline" 
              onClick={() => exportarReporte('productos')}
              disabled={exportando}
              className="w-full"
            >
              <Download className="h-4 w-4 mr-2" />
              Reporte de Productos
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportesCompras;