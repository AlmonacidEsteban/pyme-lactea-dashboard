import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { 
  Truck, 
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertTriangle,
  Star,
  Plus,
  Edit,
  Eye,
  Users,
  Package,
  Package2,
  FileText,
  Search
} from "lucide-react";
import { toast } from 'sonner';
import { 
  proveedoresService, 
  cuentasPorPagarService,
  Proveedor, 
  CuentaPorPagar, 
  EstadisticasProveedor,
  CronogramaPagos,
  HistorialCompra
} from '../services/proveedoresService';
import { productosService, Producto } from '../services/productosService';

export function SuppliersSection() {
  // Estados principales
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [estadisticas, setEstadisticas] = useState<EstadisticasProveedor | null>(null);
  const [cronogramaPagos, setCronogramaPagos] = useState<CronogramaPagos | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingCronograma, setLoadingCronograma] = useState(true);

  // Estados para filtros y búsqueda
  const [busqueda, setBusqueda] = useState('');
  const [filtroActivo, setFiltroActivo] = useState<boolean | undefined>(undefined);

  // Estados para formularios y modales
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarHistorial, setMostrarHistorial] = useState(false);
  const [mostrarProductos, setMostrarProductos] = useState(false);
  const [proveedorEditando, setProveedorEditando] = useState<Proveedor | null>(null);
  const [proveedorHistorial, setProveedorHistorial] = useState<Proveedor | null>(null);
  const [proveedorProductos, setProveedorProductos] = useState<Proveedor | null>(null);
  const [historialCompras, setHistorialCompras] = useState<HistorialCompra[]>([]);
  const [guardando, setGuardando] = useState(false);
  const [loadingHistorial, setLoadingHistorial] = useState(false);
  const [loadingProductos, setLoadingProductos] = useState(false);
  const [productosDisponibles, setProductosDisponibles] = useState<Producto[]>([]);
  const [productosSeleccionados, setProductosSeleccionados] = useState<number[]>([]);

  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    identificacion: '',
    contacto: '',
    telefono: '',
    correo: '',
    direccion: '',
    confiabilidad: 5,
    dias_pago: 30,
    notas: '',
    activo: true
  });

  // Cargar datos iniciales
  useEffect(() => {
    cargarDatos();
  }, []);

  // Cargar proveedores cuando cambian los filtros
  useEffect(() => {
    cargarProveedores();
  }, [busqueda, filtroActivo]);

  const cargarDatos = async () => {
    await Promise.all([
      cargarProveedores(),
      cargarEstadisticas(),
      cargarCronogramaPagos()
    ]);
  };

  const cargarProveedores = async () => {
    try {
      setLoading(true);
      const filtros = {
        search: busqueda || undefined,
        activo: filtroActivo,
        ordering: '-created_at'
      };
      
      const response = await proveedoresService.getProveedores(filtros);
      // Validar que response y response.results existan antes de asignar
      if (response && response.results && Array.isArray(response.results)) {
        setProveedores(response.results);
      } else {
        console.warn('Respuesta inválida del servicio de proveedores:', response);
        setProveedores([]); // Mantener array vacío en caso de respuesta inválida
      }
    } catch (error) {
      console.error('Error al cargar proveedores:', error);
      toast.error('Error al cargar proveedores');
      setProveedores([]); // Asegurar que proveedores sea un array vacío en caso de error
    } finally {
      setLoading(false);
    }
  };

  const cargarEstadisticas = async () => {
    try {
      setLoadingStats(true);
      const stats = await proveedoresService.getEstadisticas();
      setEstadisticas(stats);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
      toast.error('Error al cargar estadísticas');
    } finally {
      setLoadingStats(false);
    }
  };

  const cargarCronogramaPagos = async () => {
    try {
      setLoadingCronograma(true);
      const cronograma = await cuentasPorPagarService.getCronogramaPagos();
      setCronogramaPagos(cronograma);
    } catch (error) {
      console.error('Error al cargar cronograma de pagos:', error);
      toast.error('Error al cargar cronograma de pagos');
    } finally {
      setLoadingCronograma(false);
    }
  };

  const cargarHistorialProveedor = async (proveedor: Proveedor) => {
    try {
      setLoadingHistorial(true);
      setProveedorHistorial(proveedor);
      setMostrarHistorial(true);
      
      const response = await proveedoresService.getHistorialCompras(proveedor.id!);
      // Validar que response y response.results existan antes de asignar
      if (response && response.results && Array.isArray(response.results)) {
        setHistorialCompras(response.results);
      } else {
        console.warn('Respuesta inválida del servicio de historial:', response);
        setHistorialCompras([]); // Mantener array vacío en caso de respuesta inválida
      }
    } catch (error) {
      console.error('Error al cargar historial:', error);
      toast.error('Error al cargar historial de compras');
      setHistorialCompras([]); // Asegurar que historialCompras sea un array vacío en caso de error
    } finally {
      setLoadingHistorial(false);
    }
  };

  const handleNuevoProveedor = () => {
    setProveedorEditando(null);
    setFormData({
      nombre: '',
      identificacion: '',
      contacto: '',
      telefono: '',
      correo: '',
      direccion: '',
      confiabilidad: 5,
      dias_pago: 30,
      notas: '',
      activo: true
    });
    setMostrarFormulario(true);
  };

  const handleEditarProveedor = (proveedor: Proveedor) => {
    setProveedorEditando(proveedor);
    setFormData({
      nombre: proveedor.nombre,
      identificacion: proveedor.identificacion,
      contacto: proveedor.contacto,
      telefono: proveedor.telefono,
      correo: proveedor.correo,
      direccion: proveedor.direccion,
      confiabilidad: proveedor.confiabilidad,
      dias_pago: proveedor.dias_pago,
      notas: proveedor.notas || '',
      activo: proveedor.activo
    });
    setMostrarFormulario(true);
  };

  const handleGuardarProveedor = async () => {
    try {
      setGuardando(true);
      
      if (proveedorEditando) {
        await proveedoresService.actualizarProveedor(proveedorEditando.id!, formData);
        toast.success('Proveedor actualizado exitosamente');
      } else {
        await proveedoresService.crearProveedor(formData);
        toast.success('Proveedor creado exitosamente');
      }
      
      setMostrarFormulario(false);
      await cargarProveedores();
      await cargarEstadisticas();
    } catch (error) {
      console.error('Error al guardar proveedor:', error);
      toast.error('Error al guardar proveedor');
    } finally {
      setGuardando(false);
    }
  };

  const handleNuevoPedido = (proveedor: Proveedor) => {
    toast.info(`Creando nuevo pedido para ${proveedor.nombre}`);
    // Aquí se podría navegar a la sección de órdenes de compra
    // o abrir un modal para crear una nueva orden
  };

  const handleGestionarProductos = async (proveedor: Proveedor) => {
    setProveedorProductos(proveedor);
    setProductosSeleccionados(proveedor.productos_ids || []);
    setMostrarProductos(true);
    await cargarProductosDisponibles();
  };

  const cargarProductosDisponibles = async () => {
    try {
      setLoadingProductos(true);
      const productos = await productosService.obtenerProductos();
      setProductosDisponibles(productos);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      toast.error('Error al cargar productos');
    } finally {
      setLoadingProductos(false);
    }
  };

  const toggleProductoSeleccionado = (productoId: number) => {
    setProductosSeleccionados(prev => 
      prev.includes(productoId) 
        ? prev.filter(id => id !== productoId)
        : [...prev, productoId]
    );
  };

  const guardarProductosProveedor = async () => {
    if (!proveedorProductos) return;
    
    try {
      setGuardando(true);
      await proveedoresService.actualizarProveedor(proveedorProductos.id!, {
        ...proveedorProductos,
        productos_ids: productosSeleccionados
      });
      
      toast.success('Productos del proveedor actualizados exitosamente');
      setMostrarProductos(false);
      await cargarProveedores();
    } catch (error) {
      console.error('Error al actualizar productos del proveedor:', error);
      toast.error('Error al actualizar productos del proveedor');
    } finally {
      setGuardando(false);
    }
  };

  const getReliabilityColor = (reliability: number) => {
    if (reliability >= 90) return "text-green-600";
    if (reliability >= 80) return "text-yellow-600";
    return "text-red-600";
  };

  const getStatusColor = (status: boolean) => {
    return status ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50";
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "text-blue-600 bg-blue-50";
      case "urgent": return "text-yellow-600 bg-yellow-50";
      case "overdue": return "text-red-600 bg-red-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const formatearMoneda = (monto: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(monto);
  };

  if (loading && loadingStats && loadingCronograma) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando módulo de proveedores...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Proveedores</h1>
          <p className="text-gray-600">Gestiona tus proveedores, condiciones de pago e historial de compras.</p>
        </div>
        <Button 
          onClick={handleNuevoProveedor}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md border-0"
          style={{ backgroundColor: '#1E40AF', color: '#FFFFFF' }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Proveedor
        </Button>
      </div>

      {/* Estadísticas generales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Proveedores</p>
                <p className="text-2xl font-bold">
                  {loadingStats ? '...' : estadisticas?.total_proveedores || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Activos</p>
                <p className="text-2xl font-bold">
                  {loadingStats ? '...' : estadisticas?.proveedores_activos || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Deuda Total</p>
                <p className="text-2xl font-bold">
                  {loadingStats ? '...' : formatearMoneda(estadisticas?.total_deuda || 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Cuentas Vencidas</p>
                <p className="text-2xl font-bold">
                  {loadingCronograma ? '...' : cronogramaPagos?.vencidas?.length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controles de búsqueda y filtrado */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Buscar por nombre, identificación o correo..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filtroActivo?.toString() || 'todos'} onValueChange={(value) => {
              if (value === 'todos') setFiltroActivo(undefined);
              else setFiltroActivo(value === 'true');
            }}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="true">Activos</SelectItem>
                <SelectItem value="false">Inactivos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de proveedores */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Lista de Proveedores ({proveedores?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (proveedores?.length || 0) === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay proveedores</h3>
              <p className="text-gray-500 mb-4">
                {busqueda || filtroActivo !== undefined 
                  ? 'No se encontraron proveedores con los filtros aplicados'
                  : 'Comienza agregando tu primer proveedor'
                }
              </p>
              <Button 
                onClick={handleNuevoProveedor}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md border-0"
                style={{ backgroundColor: '#1E40AF', color: '#FFFFFF' }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar Proveedor
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(proveedores || []).map((proveedor) => (
                <Card key={proveedor.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-lg">{proveedor.nombre}</h4>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(proveedor.activo)}>
                          {proveedor.activo ? "Activo" : "Inactivo"}
                        </Badge>
                        {proveedor.is_demo && (
                          <Badge variant="outline" className="text-xs">Demo</Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">ID:</span>
                        <span>{proveedor.identificacion}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>{proveedor.telefono}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span className="text-xs">{proveedor.correo}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span className="text-xs">{proveedor.direccion}</span>
                      </div>
                    </div>

                    {/* Sección de Productos */}
                    {proveedor.productos && proveedor.productos.length > 0 && (
                      <div className="mt-3 p-2 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">
                            Productos ({proveedor.productos.length})
                          </span>
                        </div>
                        <div className="space-y-1 max-h-20 overflow-y-auto">
                          {proveedor.productos.slice(0, 3).map((producto) => (
                            <div key={producto.id} className="text-xs text-gray-600 flex items-center justify-between">
                              <span className="truncate">
                                {producto.nombre} {producto.sku && `(${producto.sku})`}
                              </span>
                              <span className="text-green-600 font-medium ml-2">
                                ${producto.precio}
                              </span>
                            </div>
                          ))}
                          {proveedor.productos.length > 3 && (
                            <div className="text-xs text-gray-500 italic">
                              +{proveedor.productos.length - 3} más...
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                      <div>
                        <p className="text-gray-600">Confiabilidad:</p>
                        <p className={`font-medium ${getReliabilityColor(proveedor.confiabilidad)}`}>
                          {proveedor.confiabilidad}%
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Días pago:</p>
                        <p className="font-medium">{proveedor.dias_pago} días</p>
                      </div>
                      {proveedor.total_deuda && proveedor.total_deuda > 0 && (
                        <>
                          <div>
                            <p className="text-gray-600">Deuda:</p>
                            <p className="font-medium text-red-600">
                              {formatearMoneda(proveedor.total_deuda)}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">Cuentas:</p>
                            <p className="font-medium text-red-600">
                              {proveedor.cuentas_pendientes || 0}
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                    
                    <div className="flex gap-2 mt-4 pt-3 border-t">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => cargarHistorialProveedor(proveedor)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Historial
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleGestionarProductos(proveedor)}
                        title="Gestionar productos del proveedor"
                      >
                        <Package2 className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditarProveedor(proveedor)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md border-0"
                        style={{ backgroundColor: '#1E40AF', color: '#FFFFFF' }}
                        onClick={() => handleNuevoPedido(proveedor)}
                      >
                        <Package className="w-4 h-4 mr-1" />
                        Pedido
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cronograma de pagos */}
      {cronogramaPagos && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Pagos Próximos a Vencer
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingCronograma ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
              ) : (cronogramaPagos?.proximas?.length || 0) === 0 ? (
                <p className="text-gray-500 text-center py-4">No hay pagos próximos a vencer</p>
              ) : (
                <div className="space-y-3">
                  {(cronogramaPagos?.proximas || []).slice(0, 5).map((pago) => (
                    <div key={pago.id} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-medium text-sm">{pago.proveedor_nombre}</h5>
                        <Badge className={getPaymentStatusColor(pago.estado)}>
                          {pago.estado === "pending" ? "Pendiente" :
                           pago.estado === "urgent" ? "Urgente" : "Vencido"}
                        </Badge>
                      </div>
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Monto:</span>
                          <span className="font-bold">{formatearMoneda(pago.monto)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Vencimiento:</span>
                          <span>{new Date(pago.fecha_vencimiento).toLocaleDateString()}</span>
                        </div>
                        {pago.numero_factura && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Factura:</span>
                            <span>{pago.numero_factura}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Pagos Vencidos
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingCronograma ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
              ) : (cronogramaPagos?.vencidas?.length || 0) === 0 ? (
                <p className="text-gray-500 text-center py-4">No hay pagos vencidos</p>
              ) : (
                <div className="space-y-3">
                  {(cronogramaPagos?.vencidas || []).slice(0, 5).map((pago) => (
                    <div key={pago.id} className="p-3 border rounded-lg bg-red-50">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-medium text-sm">{pago.proveedor_nombre}</h5>
                        <Badge className="text-red-600 bg-red-100">Vencido</Badge>
                      </div>
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Monto:</span>
                          <span className="font-bold text-red-600">{formatearMoneda(pago.monto)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Vencimiento:</span>
                          <span className="text-red-600">{new Date(pago.fecha_vencimiento).toLocaleDateString()}</span>
                        </div>
                        {pago.numero_factura && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Factura:</span>
                            <span>{pago.numero_factura}</span>
                          </div>
                        )}
                      </div>
                      <Button 
                        size="sm" 
                        className="w-full mt-2 bg-red-600 hover:bg-red-700"
                        onClick={() => toast.info(`Procesando pago para ${pago.proveedor_nombre}`)}
                      >
                        Pagar Ahora
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal de formulario de proveedor */}
      <Dialog open={mostrarFormulario} onOpenChange={setMostrarFormulario}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {proveedorEditando ? 'Editar Proveedor' : 'Nuevo Proveedor'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nombre">Nombre *</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                placeholder="Nombre del proveedor"
              />
            </div>
            <div>
              <Label htmlFor="identificacion">Identificación *</Label>
              <Input
                id="identificacion"
                value={formData.identificacion}
                onChange={(e) => setFormData({...formData, identificacion: e.target.value})}
                placeholder="CUIT/DNI"
              />
            </div>
            <div>
              <Label htmlFor="contacto">Persona de Contacto *</Label>
              <Input
                id="contacto"
                value={formData.contacto}
                onChange={(e) => setFormData({...formData, contacto: e.target.value})}
                placeholder="Nombre del contacto"
              />
            </div>
            <div>
              <Label htmlFor="telefono">Teléfono *</Label>
              <Input
                id="telefono"
                value={formData.telefono}
                onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                placeholder="+54 11 1234-5678"
              />
            </div>
            <div>
              <Label htmlFor="correo">Correo Electrónico *</Label>
              <Input
                id="correo"
                type="email"
                value={formData.correo}
                onChange={(e) => setFormData({...formData, correo: e.target.value})}
                placeholder="correo@proveedor.com"
              />
            </div>
            <div>
              <Label htmlFor="dias_pago">Días de Pago</Label>
              <Input
                id="dias_pago"
                type="number"
                value={formData.dias_pago}
                onChange={(e) => setFormData({...formData, dias_pago: parseInt(e.target.value) || 30})}
                placeholder="30"
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="direccion">Dirección</Label>
              <Input
                id="direccion"
                value={formData.direccion}
                onChange={(e) => setFormData({...formData, direccion: e.target.value})}
                placeholder="Dirección completa"
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="notas">Notas</Label>
              <Textarea
                id="notas"
                value={formData.notas}
                onChange={(e) => setFormData({...formData, notas: e.target.value})}
                placeholder="Notas adicionales sobre el proveedor"
                rows={3}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setMostrarFormulario(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleGuardarProveedor}
              disabled={guardando || !formData.nombre || !formData.identificacion}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md border-0"
              style={{ backgroundColor: '#1E40AF', color: '#FFFFFF' }}
            >
              {guardando ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de historial de compras */}
      <Dialog open={mostrarHistorial} onOpenChange={setMostrarHistorial}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              Historial de Compras - {proveedorHistorial?.nombre}
            </DialogTitle>
          </DialogHeader>
          <div className="max-h-96 overflow-y-auto">
            {loadingHistorial ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : !historialCompras || historialCompras.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No hay historial de compras disponible</p>
            ) : (
              <div className="space-y-3">
                {historialCompras.map((compra) => (
                  <div key={compra.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h5 className="font-medium">Orden #{compra.numero}</h5>
                        <p className="text-sm text-gray-600">{new Date(compra.fecha).toLocaleDateString()}</p>
                      </div>
                      <Badge variant="outline">{compra.estado}</Badge>
                    </div>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total:</span>
                        <span className="font-bold">{formatearMoneda(compra.total)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Items:</span>
                        <span>{compra.items_count}</span>
                      </div>
                      {compra.productos.length > 0 && (
                        <div>
                          <span className="text-gray-600">Productos:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {compra.productos.map((producto, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {producto}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de gestión de productos */}
      <Dialog open={mostrarProductos} onOpenChange={setMostrarProductos}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package2 className="w-5 h-5" />
              Gestionar Productos - {proveedorProductos?.nombre}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-sm text-gray-600">
              Selecciona los productos que vende este proveedor:
            </div>
            
            {loadingProductos ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : productosDisponibles.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No hay productos disponibles</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                {productosDisponibles.map((producto) => (
                  <div 
                    key={producto.id} 
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      productosSeleccionados.includes(producto.id!) 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => toggleProductoSeleccionado(producto.id!)}
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={productosSeleccionados.includes(producto.id!)}
                        onChange={() => toggleProductoSeleccionado(producto.id!)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm">{producto.nombre}</h4>
                          <span className="text-green-600 font-medium text-sm">
                            ${producto.precio}
                          </span>
                        </div>
                        <div className="text-xs text-gray-600 space-y-1">
                          {producto.sku && (
                            <div>SKU: {producto.sku}</div>
                          )}
                          <div className="flex items-center gap-2">
                            <span>Stock: {producto.stock}</span>
                            <span>•</span>
                            <span>{producto.marca_nombre}</span>
                            <span>•</span>
                            <span>{producto.categoria_nombre}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex justify-between items-center pt-4 border-t">
              <div className="text-sm text-gray-600">
                {productosSeleccionados.length} producto(s) seleccionado(s)
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setMostrarProductos(false)}
                  disabled={guardando}
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={guardarProductosProveedor}
                  disabled={guardando}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {guardando ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}