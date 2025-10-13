// COMPONENTE PARA GESTIÓN DE ALERTAS DE STOCK
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { 
  AlertTriangle, 
  Package, 
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Settings,
  Bell,
  TrendingUp,
  TrendingDown,
  Filter,
  Search,
  Calendar,
  User,
  FileText,
  Zap
} from 'lucide-react';
import { comprasService, type AlertaStock, type Producto } from '../../services/comprasService';

interface AlertasStockProps {
  showOnlyActive?: boolean;
}

const AlertasStock: React.FC<AlertasStockProps> = ({ showOnlyActive = false }) => {
  const [alertas, setAlertas] = useState<AlertaStock[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    tipo: '',
    estado: showOnlyActive ? 'activa' : '',
    prioridad: '',
    producto: '',
    search: ''
  });
  const [showConfigDialog, setShowConfigDialog] = useState(false);
  const [showResolverDialog, setShowResolverDialog] = useState(false);
  const [alertaSeleccionada, setAlertaSeleccionada] = useState<AlertaStock | null>(null);
  const [resolucionForm, setResolucionForm] = useState({
    accion: '',
    notas: ''
  });

  useEffect(() => {
    cargarDatos();
  }, [filtros]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [alertasData, productosData] = await Promise.all([
        comprasService.alertas.getAlertas(filtros),
        // productosService.getProductos() // Implementar cuando esté disponible
        Promise.resolve([
          { id: 1, nombre: 'Producto 1', sku: 'P001', precio: 100, stock: 50, min_stock: 10, unidad: 'unidad', avg_cost: 95 },
          { id: 2, nombre: 'Producto 2', sku: 'P002', precio: 200, stock: 25, min_stock: 5, unidad: 'kg', avg_cost: 190 }
        ])
      ]);
      
      setAlertas(alertasData);
      setProductos(productosData);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const marcarComoVista = async (alertaId: number) => {
    try {
      await comprasService.alertas.marcarVista(alertaId);
      cargarDatos();
    } catch (error) {
      console.error('Error marcando alerta como vista:', error);
    }
  };

  const resolverAlerta = async () => {
    try {
      if (!alertaSeleccionada || !resolucionForm.accion) {
        alert('Debe completar todos los campos obligatorios');
        return;
      }

      await comprasService.alertas.resolver(
        alertaSeleccionada.id,
        resolucionForm.accion,
        resolucionForm.notas
      );

      setShowResolverDialog(false);
      setAlertaSeleccionada(null);
      setResolucionForm({ accion: '', notas: '' });
      cargarDatos();
      alert('Alerta resuelta correctamente');
    } catch (error) {
      console.error('Error resolviendo alerta:', error);
      alert('Error resolviendo alerta');
    }
  };

  const generarAlertasStockMinimo = async () => {
    try {
      await comprasService.alertas.generarStockMinimo();
      cargarDatos();
      alert('Alertas de stock mínimo generadas');
    } catch (error) {
      console.error('Error generando alertas:', error);
      alert('Error generando alertas de stock mínimo');
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'stock_minimo':
        return <Package className="h-4 w-4 text-orange-500" />;
      case 'precio_atipico':
        return <DollarSign className="h-4 w-4 text-red-500" />;
      case 'stock_agotado':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTipoBadge = (tipo: string) => {
    const variants = {
      'stock_minimo': 'default',
      'precio_atipico': 'destructive',
      'stock_agotado': 'destructive'
    };
    
    const labels = {
      'stock_minimo': 'STOCK MÍNIMO',
      'precio_atipico': 'PRECIO ATÍPICO',
      'stock_agotado': 'STOCK AGOTADO'
    };
    
    return <Badge variant={variants[tipo] || 'secondary'}>{labels[tipo] || tipo.toUpperCase()}</Badge>;
  };

  const getPrioridadBadge = (prioridad: string) => {
    const variants = {
      'alta': 'destructive',
      'media': 'default',
      'baja': 'secondary'
    };
    
    return <Badge variant={variants[prioridad]}>{prioridad.toUpperCase()}</Badge>;
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'activa':
        return <Clock className="h-4 w-4 text-orange-500" />;
      case 'vista':
        return <Eye className="h-4 w-4 text-blue-500" />;
      case 'resuelta':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'descartada':
        return <XCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const getProductoNombre = (productoId: number) => {
    const producto = productos.find(p => p.id === productoId);
    return producto ? `${producto.nombre} (${producto.sku})` : `Producto ID: ${productoId}`;
  };

  const getProductoStock = (productoId: number) => {
    const producto = productos.find(p => p.id === productoId);
    return producto ? { stock: producto.stock, minStock: producto.min_stock } : null;
  };

  const formatearTiempo = (fecha: string) => {
    const ahora = new Date();
    const fechaAlerta = new Date(fecha);
    const diferencia = ahora.getTime() - fechaAlerta.getTime();
    
    const minutos = Math.floor(diferencia / (1000 * 60));
    const horas = Math.floor(diferencia / (1000 * 60 * 60));
    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    
    if (dias > 0) return `hace ${dias} día${dias > 1 ? 's' : ''}`;
    if (horas > 0) return `hace ${horas} hora${horas > 1 ? 's' : ''}`;
    if (minutos > 0) return `hace ${minutos} minuto${minutos > 1 ? 's' : ''}`;
    return 'hace un momento';
  };

  // Estadísticas rápidas
  const estadisticas = {
    total: alertas.length,
    activas: alertas.filter(a => a.estado === 'activa').length,
    stockMinimo: alertas.filter(a => a.tipo === 'stock_minimo' && a.estado === 'activa').length,
    preciosAtipicos: alertas.filter(a => a.tipo === 'precio_atipico' && a.estado === 'activa').length,
    stockAgotado: alertas.filter(a => a.tipo === 'stock_agotado' && a.estado === 'activa').length
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Alertas de Stock</h2>
          <p className="text-muted-foreground">
            Monitoreo de stock mínimo y precios atípicos
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setShowConfigDialog(true)}>
            <Settings className="h-4 w-4 mr-2" />
            Configurar
          </Button>
          <Button onClick={generarAlertasStockMinimo}>
            <Zap className="h-4 w-4 mr-2" />
            Generar Alertas
          </Button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Total</p>
                <p className="text-2xl font-bold">{estadisticas.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-sm font-medium">Activas</p>
                <p className="text-2xl font-bold text-orange-600">{estadisticas.activas}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-sm font-medium">Stock Mínimo</p>
                <p className="text-2xl font-bold text-orange-600">{estadisticas.stockMinimo}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-red-500" />
              <div>
                <p className="text-sm font-medium">Precios Atípicos</p>
                <p className="text-2xl font-bold text-red-600">{estadisticas.preciosAtipicos}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <div>
                <p className="text-sm font-medium">Stock Agotado</p>
                <p className="text-2xl font-bold text-red-600">{estadisticas.stockAgotado}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span>Filtros</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label>Buscar</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar..."
                  value={filtros.search}
                  onChange={(e) => setFiltros(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-8"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select 
                value={filtros.tipo} 
                onValueChange={(value) => setFiltros(prev => ({ ...prev, tipo: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="stock_minimo">Stock Mínimo</SelectItem>
                  <SelectItem value="precio_atipico">Precio Atípico</SelectItem>
                  <SelectItem value="stock_agotado">Stock Agotado</SelectItem>
                </SelectContent>
              </Select>
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
                  <SelectItem value="activa">Activa</SelectItem>
                  <SelectItem value="vista">Vista</SelectItem>
                  <SelectItem value="resuelta">Resuelta</SelectItem>
                  <SelectItem value="descartada">Descartada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Prioridad</Label>
              <Select 
                value={filtros.prioridad} 
                onValueChange={(value) => setFiltros(prev => ({ ...prev, prioridad: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="media">Media</SelectItem>
                  <SelectItem value="baja">Baja</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Producto</Label>
              <Select 
                value={filtros.producto} 
                onValueChange={(value) => setFiltros(prev => ({ ...prev, producto: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  {productos.map(producto => (
                    <SelectItem key={producto.id} value={producto.id.toString()}>
                      {producto.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de alertas */}
      <Card>
        <CardHeader>
          <CardTitle>Alertas</CardTitle>
          <CardDescription>
            {alertas.length} alertas encontradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Cargando alertas...</div>
          ) : alertas.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No se encontraron alertas con los filtros aplicados
            </div>
          ) : (
            <div className="space-y-4">
              {alertas.map((alerta) => {
                const stockInfo = getProductoStock(alerta.producto);
                
                return (
                  <div key={alerta.id} className={`border rounded-lg p-4 ${
                    alerta.estado === 'activa' ? 'border-orange-200 bg-orange-50' : ''
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center space-x-2">
                          {getTipoIcon(alerta.tipo)}
                          {getTipoBadge(alerta.tipo)}
                          {getPrioridadBadge(alerta.prioridad)}
                          {getEstadoIcon(alerta.estado)}
                        </div>
                        
                        <div>
                          <h4 className="font-medium">{alerta.titulo}</h4>
                          <p className="text-sm text-muted-foreground">{alerta.mensaje}</p>
                        </div>
                        
                        <div className="text-sm text-muted-foreground">
                          <div className="flex items-center space-x-4">
                            <span className="flex items-center space-x-1">
                              <Package className="h-3 w-3" />
                              <span>{getProductoNombre(alerta.producto)}</span>
                            </span>
                            {stockInfo && (
                              <span>
                                Stock: {stockInfo.stock} / Mín: {stockInfo.minStock}
                              </span>
                            )}
                            <span className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>{formatearTiempo(alerta.created_at)}</span>
                            </span>
                          </div>
                        </div>
                        
                        {alerta.datos_adicionales && (
                          <div className="text-sm text-muted-foreground">
                            <strong>Detalles:</strong> {JSON.stringify(alerta.datos_adicionales)}
                          </div>
                        )}
                        
                        {alerta.resolucion_notas && (
                          <div className="text-sm text-green-700 bg-green-50 p-2 rounded">
                            <strong>Resolución:</strong> {alerta.resolucion_notas}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex space-x-2 ml-4">
                        {alerta.estado === 'activa' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => marcarComoVista(alerta.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setAlertaSeleccionada(alerta);
                                setShowResolverDialog(true);
                              }}
                            >
                              Resolver
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog para resolver alerta */}
      <Dialog open={showResolverDialog} onOpenChange={setShowResolverDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resolver Alerta</DialogTitle>
            <DialogDescription>
              {alertaSeleccionada?.titulo}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="accion">Acción Tomada *</Label>
              <Select 
                value={resolucionForm.accion} 
                onValueChange={(value) => setResolucionForm(prev => ({ ...prev, accion: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar acción" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="orden_compra_creada">Orden de compra creada</SelectItem>
                  <SelectItem value="stock_ajustado">Stock ajustado</SelectItem>
                  <SelectItem value="precio_corregido">Precio corregido</SelectItem>
                  <SelectItem value="proveedor_contactado">Proveedor contactado</SelectItem>
                  <SelectItem value="no_requiere_accion">No requiere acción</SelectItem>
                  <SelectItem value="descartada">Descartar alerta</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notas">Notas de Resolución</Label>
              <Textarea
                id="notas"
                value={resolucionForm.notas}
                onChange={(e) => setResolucionForm(prev => ({ ...prev, notas: e.target.value }))}
                placeholder="Describir las acciones tomadas..."
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowResolverDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={resolverAlerta}>
                Resolver
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de configuración */}
      <Dialog open={showConfigDialog} onOpenChange={setShowConfigDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configuración de Alertas</DialogTitle>
            <DialogDescription>
              Configurar parámetros para la generación automática de alertas
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Funcionalidad de configuración en desarrollo...
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setShowConfigDialog(false)}>
                Cerrar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AlertasStock;