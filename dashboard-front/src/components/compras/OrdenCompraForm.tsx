// FORMULARIO PARA CREAR/EDITAR ÓRDENES DE COMPRA
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { 
  Plus, 
  Trash2, 
  Save, 
  Send, 
  Calculator,
  Package,
  User,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { comprasService, type OrdenCompra, type OrdenCompraItem, type Proveedor, type Producto } from '../../services/comprasService';

interface OrdenCompraFormProps {
  ordenId?: number;
  ordenEditando?: OrdenCompra | null;
  onSave?: (orden: OrdenCompra) => void;
  onCancel?: () => void;
}

const OrdenCompraForm: React.FC<OrdenCompraFormProps> = ({ ordenId, ordenEditando, onSave, onCancel }) => {
  const [orden, setOrden] = useState<Partial<OrdenCompra>>({
    numero: '',
    proveedor: 0,
    estado: 'borrador',
    prioridad: 'media',
    fecha_entrega_esperada: '',
    subtotal: 0,
    impuestos: 0,
    descuento: 0,
    total: 0,
    notas: '',
    items: []
  });

  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    cargarDatos();
    if (ordenEditando) {
      // Cargar datos de la orden existente
      setOrden({
        ...ordenEditando,
        fecha_entrega_esperada: ordenEditando.fecha_entrega_esperada ? 
          new Date(ordenEditando.fecha_entrega_esperada).toISOString().split('T')[0] : ''
      });
    } else if (ordenId) {
      cargarOrden();
    } else {
      generarNumeroOrden();
    }
  }, [ordenId, ordenEditando]);

  const cargarDatos = async () => {
    try {
      // Cargar proveedores y productos desde las APIs correspondientes
      // const [proveedoresData, productosData] = await Promise.all([
      //   proveedoresService.getProveedores(),
      //   productosService.getProductos()
      // ]);
      // setProveedores(proveedoresData);
      // setProductos(productosData);
      
      // Datos mock mientras se implementan las APIs
      setProveedores([
        { id: 1, nombre: 'Proveedor A', email: 'a@test.com', telefono: '123', direccion: 'Dir A', confiabilidad: 85, dias_pago: 30, activo: true },
        { id: 2, nombre: 'Proveedor B', email: 'b@test.com', telefono: '456', direccion: 'Dir B', confiabilidad: 92, dias_pago: 15, activo: true }
      ]);
      
      setProductos([
        { id: 1, nombre: 'Producto 1', sku: 'P001', precio: 100, stock: 50, min_stock: 10, unidad: 'unidad', avg_cost: 95 },
        { id: 2, nombre: 'Producto 2', sku: 'P002', precio: 200, stock: 25, min_stock: 5, unidad: 'kg', avg_cost: 190 }
      ]);
    } catch (error) {
      console.error('Error cargando datos:', error);
    }
  };

  const cargarOrden = async () => {
    if (!ordenId) return;
    
    try {
      setLoading(true);
      const ordenData = await comprasService.ordenes.getOrden(ordenId);
      setOrden(ordenData);
    } catch (error) {
      console.error('Error cargando orden:', error);
    } finally {
      setLoading(false);
    }
  };

  const generarNumeroOrden = () => {
    const fecha = new Date();
    const numero = `${fecha.getFullYear()}${(fecha.getMonth() + 1).toString().padStart(2, '0')}${fecha.getDate().toString().padStart(2, '0')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    setOrden(prev => ({ ...prev, numero }));
  };

  const agregarItem = () => {
    const nuevoItem: OrdenCompraItem = {
      producto: 0,
      cantidad_solicitada: 1,
      cantidad_recibida: 0,
      precio_unitario: 0,
      subtotal: 0
    };
    
    setOrden(prev => ({
      ...prev,
      items: [...(prev.items || []), nuevoItem]
    }));
  };

  const actualizarItem = (index: number, campo: keyof OrdenCompraItem, valor: any) => {
    const nuevosItems = [...(orden.items || [])];
    nuevosItems[index] = { ...nuevosItems[index], [campo]: valor };
    
    // Recalcular subtotal del item
    if (campo === 'cantidad_solicitada' || campo === 'precio_unitario') {
      const item = nuevosItems[index];
      item.subtotal = item.cantidad_solicitada * item.precio_unitario;
    }
    
    // Si se cambió el producto, actualizar el precio
    if (campo === 'producto') {
      const producto = productos.find(p => p.id === valor);
      if (producto) {
        nuevosItems[index].precio_unitario = producto.precio;
        nuevosItems[index].subtotal = nuevosItems[index].cantidad_solicitada * producto.precio;
      }
    }
    
    setOrden(prev => ({ ...prev, items: nuevosItems }));
    recalcularTotales(nuevosItems);
  };

  const eliminarItem = (index: number) => {
    const nuevosItems = (orden.items || []).filter((_, i) => i !== index);
    setOrden(prev => ({ ...prev, items: nuevosItems }));
    recalcularTotales(nuevosItems);
  };

  const recalcularTotales = (items: OrdenCompraItem[]) => {
    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    const impuestos = subtotal * 0.21; // IVA 21%
    const descuento = orden.descuento || 0;
    const total = subtotal + impuestos - descuento;
    
    setOrden(prev => ({
      ...prev,
      subtotal,
      impuestos,
      total
    }));
  };

  const validarFormulario = (): boolean => {
    const nuevosErrors: Record<string, string> = {};
    
    if (!orden.proveedor) {
      nuevosErrors.proveedor = 'Debe seleccionar un proveedor';
    }
    
    if (!orden.fecha_entrega_esperada) {
      nuevosErrors.fecha_entrega_esperada = 'Debe especificar una fecha de entrega';
    }
    
    if (!orden.items || orden.items.length === 0) {
      nuevosErrors.items = 'Debe agregar al menos un item';
    }
    
    orden.items?.forEach((item, index) => {
      if (!item.producto) {
        nuevosErrors[`item_${index}_producto`] = 'Debe seleccionar un producto';
      }
      if (item.cantidad_solicitada <= 0) {
        nuevosErrors[`item_${index}_cantidad`] = 'La cantidad debe ser mayor a 0';
      }
      if (item.precio_unitario <= 0) {
        nuevosErrors[`item_${index}_precio`] = 'El precio debe ser mayor a 0';
      }
    });
    
    setErrors(nuevosErrors);
    return Object.keys(nuevosErrors).length === 0;
  };

  const guardarOrden = async (enviar: boolean = false) => {
    if (!validarFormulario()) return;
    
    try {
      setLoading(true);
      
      const ordenData = {
        ...orden,
        estado: enviar ? 'enviada' : 'borrador'
      };
      
      let ordenGuardada: OrdenCompra;
      
      if (ordenId || ordenEditando?.id) {
        const id = ordenId || ordenEditando!.id;
        ordenGuardada = await comprasService.ordenes.actualizarOrden(id, ordenData);
      } else {
        ordenGuardada = await comprasService.ordenes.crearOrden(ordenData);
      }
      
      if (enviar && ordenGuardada.id) {
        await comprasService.ordenes.enviarOrden(ordenGuardada.id);
      }
      
      onSave?.(ordenGuardada);
    } catch (error) {
      console.error('Error guardando orden:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProductoNombre = (productoId: number) => {
    const producto = productos.find(p => p.id === productoId);
    return producto ? `${producto.nombre} (${producto.sku})` : '';
  };

  const getProveedorNombre = (proveedorId: number) => {
    const proveedor = proveedores.find(p => p.id === proveedorId);
    return proveedor?.nombre || '';
  };

  if (loading && ordenId) {
    return <div className="flex justify-center p-8">Cargando orden...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Package className="h-5 w-5" />
            <span>{(ordenId || ordenEditando) ? 'Editar Orden de Compra' : 'Nueva Orden de Compra'}</span>
          </CardTitle>
          <CardDescription>
            {(ordenId || ordenEditando) ? `Modificando orden ${orden.numero}` : 'Crear una nueva orden de compra'}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Información general */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Información General</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="numero">Número de Orden</Label>
              <Input
                id="numero"
                value={orden.numero}
                onChange={(e) => setOrden(prev => ({ ...prev, numero: e.target.value }))}
                disabled={!!ordenId}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="proveedor">Proveedor *</Label>
              <Select 
                value={orden.proveedor?.toString()} 
                onValueChange={(value) => setOrden(prev => ({ ...prev, proveedor: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar proveedor" />
                </SelectTrigger>
                <SelectContent>
                  {proveedores.map(proveedor => (
                    <SelectItem key={proveedor.id} value={proveedor.id.toString()}>
                      {proveedor.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.proveedor && <p className="text-sm text-red-500">{errors.proveedor}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="prioridad">Prioridad</Label>
              <Select 
                value={orden.prioridad} 
                onValueChange={(value) => setOrden(prev => ({ ...prev, prioridad: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baja">Baja</SelectItem>
                  <SelectItem value="media">Media</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="urgente">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fecha_entrega">Fecha de Entrega Esperada *</Label>
              <Input
                id="fecha_entrega"
                type="date"
                value={orden.fecha_entrega_esperada}
                onChange={(e) => setOrden(prev => ({ ...prev, fecha_entrega_esperada: e.target.value }))}
              />
              {errors.fecha_entrega_esperada && <p className="text-sm text-red-500">{errors.fecha_entrega_esperada}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="descuento">Descuento</Label>
              <Input
                id="descuento"
                type="number"
                step="0.01"
                value={orden.descuento}
                onChange={(e) => {
                  const descuento = parseFloat(e.target.value) || 0;
                  setOrden(prev => ({ ...prev, descuento }));
                  recalcularTotales(orden.items || []);
                }}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notas">Notas</Label>
            <Textarea
              id="notas"
              value={orden.notas}
              onChange={(e) => setOrden(prev => ({ ...prev, notas: e.target.value }))}
              placeholder="Notas adicionales para la orden..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Items de la orden */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Package className="h-4 w-4" />
              <span>Items de la Orden</span>
            </CardTitle>
            <Button onClick={agregarItem} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Agregar Item
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {errors.items && <p className="text-sm text-red-500 mb-4">{errors.items}</p>}
          
          <div className="space-y-4">
            {orden.items?.map((item, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Item #{index + 1}</h4>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => eliminarItem(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>Producto *</Label>
                    <Select 
                      value={item.producto?.toString()} 
                      onValueChange={(value) => actualizarItem(index, 'producto', parseInt(value))}
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
                    {errors[`item_${index}_producto`] && (
                      <p className="text-sm text-red-500">{errors[`item_${index}_producto`]}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Cantidad *</Label>
                    <Input
                      type="number"
                      min="1"
                      value={item.cantidad_solicitada}
                      onChange={(e) => actualizarItem(index, 'cantidad_solicitada', parseInt(e.target.value) || 0)}
                    />
                    {errors[`item_${index}_cantidad`] && (
                      <p className="text-sm text-red-500">{errors[`item_${index}_cantidad`]}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Precio Unitario *</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={item.precio_unitario}
                      onChange={(e) => actualizarItem(index, 'precio_unitario', parseFloat(e.target.value) || 0)}
                    />
                    {errors[`item_${index}_precio`] && (
                      <p className="text-sm text-red-500">{errors[`item_${index}_precio`]}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Subtotal</Label>
                    <div className="flex items-center h-10 px-3 border rounded-md bg-muted">
                      ${item.subtotal.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {(!orden.items || orden.items.length === 0) && (
              <div className="text-center py-8 text-muted-foreground">
                No hay items agregados. Haga clic en "Agregar Item" para comenzar.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Totales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calculator className="h-4 w-4" />
            <span>Totales</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${orden.subtotal?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="flex justify-between">
              <span>Impuestos (21%):</span>
              <span>${orden.impuestos?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="flex justify-between">
              <span>Descuento:</span>
              <span>-${orden.descuento?.toFixed(2) || '0.00'}</span>
            </div>
            <hr />
            <div className="flex justify-between text-lg font-semibold">
              <span>Total:</span>
              <span>${orden.total?.toFixed(2) || '0.00'}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Acciones */}
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button 
          variant="outline" 
          onClick={() => guardarOrden(false)}
          disabled={loading}
        >
          <Save className="h-4 w-4 mr-2" />
          Guardar Borrador
        </Button>
        <Button 
          onClick={() => guardarOrden(true)}
          disabled={loading}
        >
          <Send className="h-4 w-4 mr-2" />
          Guardar y Enviar
        </Button>
      </div>
    </div>
  );
};

export default OrdenCompraForm;