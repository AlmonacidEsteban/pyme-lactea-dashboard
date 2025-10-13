// COMPONENTE PARA HISTORIAL DE PRECIOS
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Search,
  Filter,
  Download,
  Calendar,
  DollarSign,
  Package,
  AlertTriangle,
  BarChart3,
  LineChart
} from 'lucide-react';
import { comprasService, type HistorialPrecio, type Producto } from '../../services/comprasService';

interface HistorialPreciosProps {
  productoId?: number;
}

const HistorialPrecios: React.FC<HistorialPreciosProps> = ({ productoId }) => {
  const [historial, setHistorial] = useState<HistorialPrecio[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    producto: productoId?.toString() || '',
    proveedor: '',
    fecha_desde: '',
    fecha_hasta: '',
    search: ''
  });
  const [comparacion, setComparacion] = useState<{
    producto1: string;
    producto2: string;
    periodo: string;
  }>({
    producto1: '',
    producto2: '',
    periodo: '30'
  });
  const [showComparacion, setShowComparacion] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, [filtros]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [historialData, productosData] = await Promise.all([
        comprasService.historialPrecios.getHistorial(filtros),
        // productosService.getProductos() // Implementar cuando esté disponible
        Promise.resolve([
          { id: 1, nombre: 'Producto 1', sku: 'P001', precio: 100, stock: 50, min_stock: 10, unidad: 'unidad', avg_cost: 95 },
          { id: 2, nombre: 'Producto 2', sku: 'P002', precio: 200, stock: 25, min_stock: 5, unidad: 'kg', avg_cost: 190 }
        ])
      ]);
      
      setHistorial(historialData);
      setProductos(productosData);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const calcularTendencia = (precios: HistorialPrecio[]) => {
    if (precios.length < 2) return 'estable';
    
    const precioActual = precios[0]?.precio || 0;
    const precioAnterior = precios[1]?.precio || 0;
    
    if (precioActual > precioAnterior) return 'subida';
    if (precioActual < precioAnterior) return 'bajada';
    return 'estable';
  };

  const getTendenciaIcon = (tendencia: string) => {
    switch (tendencia) {
      case 'subida':
        return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'bajada':
        return <TrendingDown className="h-4 w-4 text-green-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTendenciaBadge = (tendencia: string) => {
    const variants = {
      'subida': 'destructive',
      'bajada': 'default',
      'estable': 'secondary'
    };
    
    const labels = {
      'subida': 'SUBIDA',
      'bajada': 'BAJADA',
      'estable': 'ESTABLE'
    };
    
    return <Badge variant={variants[tendencia]}>{labels[tendencia]}</Badge>;
  };

  const calcularVariacion = (precioActual: number, precioAnterior: number) => {
    if (!precioAnterior) return 0;
    return ((precioActual - precioAnterior) / precioAnterior) * 100;
  };

  const getProductoNombre = (productoId: number) => {
    const producto = productos.find(p => p.id === productoId);
    return producto ? `${producto.nombre} (${producto.sku})` : `Producto ID: ${productoId}`;
  };

  const exportarHistorial = async () => {
    try {
      // Implementar exportación cuando esté disponible la API
      alert('Funcionalidad de exportación en desarrollo');
    } catch (error) {
      console.error('Error exportando historial:', error);
    }
  };

  const realizarComparacion = async () => {
    try {
      if (!comparacion.producto1 || !comparacion.producto2) {
        alert('Debe seleccionar dos productos para comparar');
        return;
      }

      const resultado = await comprasService.historialPrecios.compararPrecios(
        parseInt(comparacion.producto1),
        parseInt(comparacion.producto2),
        parseInt(comparacion.periodo)
      );

      // Mostrar resultado de comparación
      console.log('Comparación:', resultado);
      alert('Comparación realizada. Ver consola para detalles.');
    } catch (error) {
      console.error('Error realizando comparación:', error);
      alert('Error realizando comparación de precios');
    }
  };

  // Agrupar historial por producto
  const historialPorProducto = historial.reduce((acc, item) => {
    if (!acc[item.producto]) {
      acc[item.producto] = [];
    }
    acc[item.producto].push(item);
    return acc;
  }, {} as Record<number, HistorialPrecio[]>);

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Historial de Precios</h2>
          <p className="text-muted-foreground">
            Seguimiento de precios de compra y análisis de tendencias
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setShowComparacion(!showComparacion)}>
            <BarChart3 className="h-4 w-4 mr-2" />
            Comparar
          </Button>
          <Button variant="outline" onClick={exportarHistorial}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Panel de comparación */}
      {showComparacion && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <LineChart className="h-4 w-4" />
              <span>Comparación de Precios</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Producto 1</Label>
                <Select 
                  value={comparacion.producto1} 
                  onValueChange={(value) => setComparacion(prev => ({ ...prev, producto1: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar producto" />
                  </SelectTrigger>
                  <SelectContent>
                    {productos.map(producto => (
                      <SelectItem key={producto.id} value={producto.id.toString()}>
                        {producto.nombre} ({producto.sku})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Producto 2</Label>
                <Select 
                  value={comparacion.producto2} 
                  onValueChange={(value) => setComparacion(prev => ({ ...prev, producto2: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar producto" />
                  </SelectTrigger>
                  <SelectContent>
                    {productos.map(producto => (
                      <SelectItem key={producto.id} value={producto.id.toString()}>
                        {producto.nombre} ({producto.sku})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Período (días)</Label>
                <Select 
                  value={comparacion.periodo} 
                  onValueChange={(value) => setComparacion(prev => ({ ...prev, periodo: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 días</SelectItem>
                    <SelectItem value="30">30 días</SelectItem>
                    <SelectItem value="90">90 días</SelectItem>
                    <SelectItem value="365">1 año</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end">
                <Button onClick={realizarComparacion} className="w-full">
                  Comparar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
                  placeholder="Buscar producto..."
                  value={filtros.search}
                  onChange={(e) => setFiltros(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-8"
                />
              </div>
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
                  <SelectItem value="">Todos los productos</SelectItem>
                  {productos.map(producto => (
                    <SelectItem key={producto.id} value={producto.id.toString()}>
                      {producto.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
          </div>
        </CardContent>
      </Card>

      {/* Historial por producto */}
      <div className="space-y-6">
        {loading ? (
          <Card>
            <CardContent className="text-center py-8">
              Cargando historial de precios...
            </CardContent>
          </Card>
        ) : Object.keys(historialPorProducto).length === 0 ? (
          <Card>
            <CardContent className="text-center py-8 text-muted-foreground">
              No se encontró historial de precios con los filtros aplicados
            </CardContent>
          </Card>
        ) : (
          Object.entries(historialPorProducto).map(([productoId, precios]) => {
            const tendencia = calcularTendencia(precios);
            const precioActual = precios[0]?.precio || 0;
            const precioAnterior = precios[1]?.precio || 0;
            const variacion = calcularVariacion(precioActual, precioAnterior);
            
            return (
              <Card key={productoId}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <Package className="h-5 w-5" />
                        <span>{getProductoNombre(parseInt(productoId))}</span>
                      </CardTitle>
                      <CardDescription>
                        {precios.length} registros de precio
                      </CardDescription>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="flex items-center space-x-2">
                        {getTendenciaIcon(tendencia)}
                        {getTendenciaBadge(tendencia)}
                      </div>
                      {variacion !== 0 && (
                        <div className={`text-sm ${variacion > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {variacion > 0 ? '+' : ''}{variacion.toFixed(1)}%
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {precios.slice(0, 10).map((precio, index) => (
                      <div key={precio.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">${precio.precio.toFixed(2)}</span>
                            {precio.precio_anterior && (
                              <span className="text-sm text-muted-foreground">
                                (anterior: ${precio.precio_anterior.toFixed(2)})
                              </span>
                            )}
                          </div>
                          
                          <div className="text-sm text-muted-foreground">
                            <div className="flex items-center space-x-4">
                              <span className="flex items-center space-x-1">
                                <Calendar className="h-3 w-3" />
                                <span>{new Date(precio.fecha).toLocaleDateString()}</span>
                              </span>
                              {precio.proveedor_nombre && (
                                <span>Proveedor: {precio.proveedor_nombre}</span>
                              )}
                              {precio.orden_compra && (
                                <span>OC: #{precio.orden_compra}</span>
                              )}
                            </div>
                          </div>
                          
                          {precio.notas && (
                            <p className="text-sm text-muted-foreground">
                              <strong>Notas:</strong> {precio.notas}
                            </p>
                          )}
                        </div>
                        
                        <div className="text-right space-y-1">
                          {index === 0 && (
                            <Badge variant="outline">Actual</Badge>
                          )}
                          
                          {precio.precio_anterior && (
                            <div className={`text-sm ${
                              precio.precio > precio.precio_anterior ? 'text-red-600' : 
                              precio.precio < precio.precio_anterior ? 'text-green-600' : 
                              'text-gray-600'
                            }`}>
                              {precio.precio > precio.precio_anterior ? '+' : ''}
                              {calcularVariacion(precio.precio, precio.precio_anterior).toFixed(1)}%
                            </div>
                          )}
                          
                          {precio.es_precio_atipico && (
                            <div className="flex items-center space-x-1 text-orange-600">
                              <AlertTriangle className="h-3 w-3" />
                              <span className="text-xs">Atípico</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {precios.length > 10 && (
                      <div className="text-center text-sm text-muted-foreground">
                        ... y {precios.length - 10} registros más
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default HistorialPrecios;