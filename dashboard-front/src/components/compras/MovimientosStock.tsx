// COMPONENTE PARA GESTIÓN DE MOVIMIENTOS DE STOCK
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
  Package, 
  TrendingUp, 
  TrendingDown, 
  RotateCcw,
  Search,
  Filter,
  Download,
  Plus,
  Edit,
  Calendar,
  User,
  FileText,
  AlertTriangle
} from 'lucide-react';
import { comprasService, type MovimientoStock, type Producto } from '../../services/comprasService';

interface MovimientosStockProps {
  productoId?: number;
}

const MovimientosStock: React.FC<MovimientosStockProps> = ({ productoId }) => {
  const [movimientos, setMovimientos] = useState<MovimientoStock[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    producto: productoId?.toString() || '',
    tipo: '',
    motivo: '',
    fecha_desde: '',
    fecha_hasta: '',
    search: ''
  });
  const [showAjusteDialog, setShowAjusteDialog] = useState(false);
  const [ajusteForm, setAjusteForm] = useState({
    producto_id: '',
    nuevo_stock: '',
    notas: ''
  });

  useEffect(() => {
    cargarDatos();
  }, [filtros]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [movimientosData, productosData] = await Promise.all([
        comprasService.movimientos.getMovimientos(filtros),
        // productosService.getProductos() // Implementar cuando esté disponible
        Promise.resolve([
          { id: 1, nombre: 'Producto 1', sku: 'P001', precio: 100, stock: 50, min_stock: 10, unidad: 'unidad', avg_cost: 95 },
          { id: 2, nombre: 'Producto 2', sku: 'P002', precio: 200, stock: 25, min_stock: 5, unidad: 'kg', avg_cost: 190 }
        ])
      ]);
      
      setMovimientos(movimientosData);
      setProductos(productosData);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const realizarAjuste = async () => {
    try {
      if (!ajusteForm.producto_id || !ajusteForm.nuevo_stock) {
        alert('Debe completar todos los campos obligatorios');
        return;
      }

      await comprasService.movimientos.ajusteInventario(
        parseInt(ajusteForm.producto_id),
        parseFloat(ajusteForm.nuevo_stock),
        ajusteForm.notas
      );

      setShowAjusteDialog(false);
      setAjusteForm({ producto_id: '', nuevo_stock: '', notas: '' });
      cargarDatos();
      alert('Ajuste de inventario realizado correctamente');
    } catch (error) {
      console.error('Error realizando ajuste:', error);
      alert('Error realizando ajuste de inventario');
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'entrada':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'salida':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      case 'ajuste':
        return <RotateCcw className="h-4 w-4 text-blue-500" />;
      default:
        return <Package className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTipoBadge = (tipo: string) => {
    const variants = {
      'entrada': 'default',
      'salida': 'destructive',
      'ajuste': 'secondary'
    };
    
    return <Badge variant={variants[tipo] || 'secondary'}>{tipo.toUpperCase()}</Badge>;
  };

  const getMotivoDescription = (motivo: string) => {
    const descripciones = {
      'compra': 'Compra a proveedor',
      'venta': 'Venta a cliente',
      'ajuste_inventario': 'Ajuste de inventario',
      'devolucion_cliente': 'Devolución de cliente',
      'devolucion_proveedor': 'Devolución a proveedor',
      'merma': 'Merma/Pérdida',
      'transferencia': 'Transferencia entre almacenes'
    };
    
    return descripciones[motivo] || motivo;
  };

  const getProductoNombre = (productoId: number) => {
    const producto = productos.find(p => p.id === productoId);
    return producto ? `${producto.nombre} (${producto.sku})` : `Producto ID: ${productoId}`;
  };

  const exportarMovimientos = async () => {
    try {
      // Implementar exportación cuando esté disponible la API
      alert('Funcionalidad de exportación en desarrollo');
    } catch (error) {
      console.error('Error exportando movimientos:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Movimientos de Stock</h2>
          <p className="text-muted-foreground">
            Historial completo de entradas, salidas y ajustes de inventario
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={exportarMovimientos}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Dialog open={showAjusteDialog} onOpenChange={setShowAjusteDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Ajuste de Inventario
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajuste de Inventario</DialogTitle>
                <DialogDescription>
                  Realizar un ajuste manual del stock de un producto
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="producto">Producto *</Label>
                  <Select 
                    value={ajusteForm.producto_id} 
                    onValueChange={(value) => setAjusteForm(prev => ({ ...prev, producto_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar producto" />
                    </SelectTrigger>
                    <SelectContent>
                      {productos.map(producto => (
                        <SelectItem key={producto.id} value={producto.id.toString()}>
                          {producto.nombre} ({producto.sku}) - Stock actual: {producto.stock}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="nuevo_stock">Nuevo Stock *</Label>
                  <Input
                    id="nuevo_stock"
                    type="number"
                    min="0"
                    step="0.01"
                    value={ajusteForm.nuevo_stock}
                    onChange={(e) => setAjusteForm(prev => ({ ...prev, nuevo_stock: e.target.value }))}
                    placeholder="Cantidad nueva de stock"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notas">Motivo del Ajuste</Label>
                  <Textarea
                    id="notas"
                    value={ajusteForm.notas}
                    onChange={(e) => setAjusteForm(prev => ({ ...prev, notas: e.target.value }))}
                    placeholder="Explicar el motivo del ajuste..."
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowAjusteDialog(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={realizarAjuste}>
                    Realizar Ajuste
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
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
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
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
                  <SelectItem value="entrada">Entrada</SelectItem>
                  <SelectItem value="salida">Salida</SelectItem>
                  <SelectItem value="ajuste">Ajuste</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Motivo</Label>
              <Select 
                value={filtros.motivo} 
                onValueChange={(value) => setFiltros(prev => ({ ...prev, motivo: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="compra">Compra</SelectItem>
                  <SelectItem value="venta">Venta</SelectItem>
                  <SelectItem value="ajuste_inventario">Ajuste</SelectItem>
                  <SelectItem value="devolucion_cliente">Devolución Cliente</SelectItem>
                  <SelectItem value="devolucion_proveedor">Devolución Proveedor</SelectItem>
                  <SelectItem value="merma">Merma</SelectItem>
                </SelectContent>
              </Select>
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

      {/* Lista de movimientos */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Movimientos</CardTitle>
          <CardDescription>
            {movimientos.length} movimientos encontrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Cargando movimientos...</div>
          ) : movimientos.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No se encontraron movimientos con los filtros aplicados
            </div>
          ) : (
            <div className="space-y-4">
              {movimientos.map((movimiento) => (
                <div key={movimiento.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        {getTipoIcon(movimiento.tipo)}
                        {getTipoBadge(movimiento.tipo)}
                        <span className="font-medium">
                          {getProductoNombre(movimiento.producto)}
                        </span>
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center space-x-1">
                            <FileText className="h-3 w-3" />
                            <span>{getMotivoDescription(movimiento.motivo)}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(movimiento.created_at).toLocaleString()}</span>
                          </span>
                          {movimiento.created_by && (
                            <span className="flex items-center space-x-1">
                              <User className="h-3 w-3" />
                              <span>Usuario ID: {movimiento.created_by}</span>
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {movimiento.notas && (
                        <p className="text-sm text-muted-foreground">
                          <strong>Notas:</strong> {movimiento.notas}
                        </p>
                      )}
                    </div>
                    
                    <div className="text-right space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">Cantidad:</span>
                        <span className={`font-medium ${
                          movimiento.tipo === 'entrada' ? 'text-green-600' : 
                          movimiento.tipo === 'salida' ? 'text-red-600' : 
                          'text-blue-600'
                        }`}>
                          {movimiento.tipo === 'entrada' ? '+' : movimiento.tipo === 'salida' ? '-' : ''}
                          {movimiento.cantidad}
                        </span>
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        Stock: {movimiento.stock_anterior} → {movimiento.stock_nuevo}
                      </div>
                      
                      {movimiento.costo_unitario && (
                        <div className="text-sm text-muted-foreground">
                          Costo: ${movimiento.costo_unitario.toFixed(2)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MovimientosStock;