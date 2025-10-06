import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Package, DollarSign, TrendingUp, AlertTriangle, CheckCircle, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { NewProductDialog } from './productos/NewProductDialog';
import { AdjustStockDialog } from './productos/AdjustStockDialog';
import { ChangePriceDialog } from './productos/ChangePriceDialog';
import { EditProductDialog } from './productos/EditProductDialog';
import { DeleteProductDialog } from './productos/DeleteProductDialog';
import { BtnEditar, BtnAjusteStock, BtnCambiarPrecio, BtnEliminar } from './productos/ProductButtons';
import { productosService, type Producto } from '../services/productosService';
import { marcasService, type Marca } from '../services/marcasService';
import { categoriasService, type Categoria } from '../services/categoriasService';

export function ProductsSection() {
  const [openNewProduct, setOpenNewProduct] = useState(false);
  const [openAdjustStock, setOpenAdjustStock] = useState(false);
  const [openChangePrice, setOpenChangePrice] = useState(false);
  const [openEditProduct, setOpenEditProduct] = useState(false);
  const [openDeleteProduct, setOpenDeleteProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null);
  const [loading, setLoading] = useState(false);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loadingProductos, setLoadingProductos] = useState(true);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loadingMarcas, setLoadingMarcas] = useState(true);
  const [loadingCategorias, setLoadingCategorias] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos al montar el componente
  useEffect(() => {
    cargarProductos();
    cargarMarcas();
    cargarCategorias();
  }, []);

  const cargarProductos = async () => {
    try {
      setLoadingProductos(true);
      setError(null);
      const productosData = await productosService.obtenerProductos();
      setProductos(productosData);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      setError('Error al cargar los productos. Verifica la conexión con el servidor.');
      toast.error('Error al cargar los productos');
      setProductos([]); // Asegurar que hay un array vacío
    } finally {
      setLoadingProductos(false);
    }
  };

  const cargarMarcas = async () => {
    try {
      setLoadingMarcas(true);
      const marcasData = await marcasService.obtenerMarcas();
      setMarcas(marcasData);
    } catch (error) {
      console.error('Error al cargar marcas:', error);
      toast.error('Error al cargar las marcas');
      setMarcas([]); // Asegurar que hay un array vacío
    } finally {
      setLoadingMarcas(false);
    }
  };

  const cargarCategorias = async () => {
    try {
      setLoadingCategorias(true);
      const categoriasData = await categoriasService.obtenerCategorias();
      setCategorias(categoriasData);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
      toast.error('Error al cargar las categorías');
      setCategorias([]); // Asegurar que hay un array vacío
    } finally {
      setLoadingCategorias(false);
    }
  };

  const listasPrecios = ["mayorista", "minorista", "distribuidor"];

  const generarSku = (data: any) => {
    // Extraer valores de forma robusta
    const marca = String(data.marca_id ?? "").toUpperCase();
    const categoria = String(data.categoria_id ?? "").toUpperCase();
    const peso = data.peso_neto ? `${data.peso_neto}` : "";
    const unidad = String(data.unidad_medida ?? "").toUpperCase();
    const sal = data.con_sal ? "CS" : "SS";
    
    // Validar que tenemos los datos mínimos
    if (!marca || !categoria || !peso || !unidad) return "";
    
    // Generar códigos abreviados
    const marcaCode = marca.substring(0, 3);
    const catCode = categoria.substring(0, 3);
    
    return `${marcaCode}-${catCode}-${peso}${unidad}-${sal}`;
  };

  const crearProducto = async (data: any) => {
    try {
      setLoading(true);
      await productosService.crearProducto({
        nombre: data.nombre,
        sku: data.sku,
        descripcion: data.descripcion,
        precio: parseFloat(data.precio_lista || data.precio),
        stock: parseInt(data.stock_inicial || data.stock),
        marca: data.marca_id,
        categoria: data.categoria_id,
        activo: data.estado === 'activo'
      });
      toast.success('Producto creado exitosamente');
      await cargarProductos();
      setOpenNewProduct(false);
    } catch (error) {
      console.error('Error al crear producto:', error);
      toast.error('Error al crear el producto');
    } finally {
      setLoading(false);
    }
  };

  const ajustarStock = async (data: any) => {
    if (!selectedProduct) return;
    
    try {
      setLoading(true);
      await productosService.ajustarStock(selectedProduct.id, {
        cantidad: parseFloat(data.cantidad),
        tipo: data.tipo,
        motivo: data.motivo
      });
      toast.success('Stock ajustado exitosamente');
      await cargarProductos();
      setOpenAdjustStock(false);
    } catch (error) {
      console.error('Error al ajustar stock:', error);
      toast.error('Error al ajustar el stock');
    } finally {
      setLoading(false);
    }
  };

  const cambiarPrecio = async (data: any) => {
    if (!selectedProduct) return;
    
    try {
      setLoading(true);
      await productosService.cambiarPrecio(selectedProduct.id, {
        nuevo_precio: parseFloat(data.precio),
        lista_precio: data.lista,
        motivo: data.motivo
      });
      toast.success('Precio actualizado exitosamente');
      await cargarProductos();
      setOpenChangePrice(false);
    } catch (error) {
      console.error('Error al cambiar precio:', error);
      toast.error('Error al cambiar el precio');
    } finally {
      setLoading(false);
    }
  };

  const handleAjusteStock = (producto: Producto) => {
    setSelectedProduct(producto);
    setOpenAdjustStock(true);
  };

  const handleCambiarPrecio = (producto: Producto) => {
    setSelectedProduct(producto);
    setOpenChangePrice(true);
  };

  const handleEditarProducto = (producto: Producto) => {
    setSelectedProduct(producto);
    setOpenEditProduct(true);
  };

  const handleEliminarProducto = (producto: Producto) => {
    setSelectedProduct(producto);
    setOpenDeleteProduct(true);
  };

  const editarProducto = async (data: any) => {
    if (!selectedProduct) return;
    
    try {
      setLoading(true);
      await productosService.actualizarProducto(selectedProduct.id!, {
        nombre: data.nombre,
        sku: data.sku,
        descripcion: data.descripcion,
        precio: data.precio,
        stock: data.stock,
        activo: data.activo
      });
      toast.success('Producto actualizado exitosamente');
      await cargarProductos();
      setOpenEditProduct(false);
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      toast.error('Error al actualizar el producto');
    } finally {
      setLoading(false);
    }
  };

  const eliminarProducto = async () => {
    if (!selectedProduct) return;
    
    try {
      setLoading(true);
      await productosService.eliminarProducto(selectedProduct.id!);
      toast.success('Producto eliminado exitosamente');
      await cargarProductos();
      setOpenDeleteProduct(false);
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      toast.error('Error al eliminar el producto');
    } finally {
      setLoading(false);
    }
  };

  // Función para agrupar productos por marca
  const agruparProductosPorMarca = (productos: Producto[]) => {
    const grupos: { [key: string]: Producto[] } = {};
    
    productos.forEach(producto => {
      const marcaNombre = producto.marca_nombre || 'Sin Marca';
      if (!grupos[marcaNombre]) {
        grupos[marcaNombre] = [];
      }
      grupos[marcaNombre].push(producto);
    });
    
    return grupos;
  };

  // Funciones auxiliares para el estado del stock
  const getStockStatus = (stock: number, minStock: number) => {
    if (stock <= minStock * 0.5) return "critical";
    if (stock <= minStock) return "low";
    return "normal";
  };

  // Funciones para calcular estadísticas basadas en datos reales
  const getStockSummary = () => {
    // Validar que productos sea un array antes de usar métodos de array
    if (!Array.isArray(productos)) {
      return {
        totalProducts: 0,
        totalValue: '$0',
        lowStock: 0,
        criticalStock: 0,
        normalStock: 0
      };
    }

    const totalProducts = productos.length;
    const totalValue = productos.reduce((sum, p) => sum + (p.precio * p.stock), 0);
    const lowStock = productos.filter(p => getStockStatus(p.stock, 20) === "low").length;
    const criticalStock = productos.filter(p => getStockStatus(p.stock, 20) === "critical").length;
    const normalStock = productos.filter(p => getStockStatus(p.stock, 20) === "normal").length;
    
    return {
      totalProducts,
      totalValue: `$${totalValue.toLocaleString()}`,
      lowStock,
      criticalStock,
      normalStock
    };
  };

  const getCategoryStats = () => {
    return [];
  };

  const getBrandComparison = () => {
    return [];
  };

  const stockSummary = getStockSummary();
  const categoryStats = getCategoryStats();
  const brandComparison = getBrandComparison();

  const getStockStatusColor = (status: string) => {
    switch (status) {
      case "critical": return "text-red-600 bg-red-50";
      case "low": return "text-yellow-600 bg-yellow-50";
      case "normal": return "text-green-600 bg-green-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const getStockStatusIcon = (status: string) => {
    switch (status) {
      case "critical": return <AlertTriangle className="w-4 h-4" />;
      case "low": return <AlertTriangle className="w-4 h-4" />;
      case "normal": return <CheckCircle className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  // Mostrar estado de error si existe
  if (error) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl mb-2">Catálogo de Productos</h1>
          <p className="text-muted-foreground">Gestiona tu inventario, precios y stock de productos lácteos.</p>
        </div>
        <Card>
          <CardContent className="p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Error de Conexión</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => {
              setError(null);
              cargarProductos();
              cargarMarcas();
              cargarCategorias();
            }}>
              Reintentar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Mostrar estado de carga inicial
  if (loadingProductos && loadingMarcas && loadingCategorias) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl mb-2">Catálogo de Productos</h1>
          <p className="text-muted-foreground">Gestiona tu inventario, precios y stock de productos lácteos.</p>
        </div>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando datos...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Catálogo de Productos</h1>
        <p className="text-muted-foreground">Gestiona tu inventario, precios y stock de productos lácteos.</p>
      </div>

      {/* Stock Summary */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Productos</p>
                <p className="text-2xl font-bold">{stockSummary.totalProducts}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Valor Total</p>
                <p className="text-2xl font-bold">{stockSummary.totalValue}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Stock Normal</p>
                <p className="text-2xl font-bold">{stockSummary.normalStock}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-sm text-muted-foreground">Stock Bajo</p>
                <p className="text-2xl font-bold">{stockSummary.lowStock}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm text-muted-foreground">Stock Crítico</p>
                <p className="text-2xl font-bold">{stockSummary.criticalStock}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setOpenNewProduct(true)}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Plus className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Package className="w-4 h-4" />
                  <span className="font-medium">Nuevo Producto</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">Agregar producto al catálogo</p>
                <button className="w-full px-3 py-2 text-sm bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 transition-colors">
                  Crear Producto
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Package className="w-4 h-4" />
                  <span className="font-medium">Ajustar Stock</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">Gestionar inventario</p>
                <button className="w-full px-3 py-2 text-sm bg-green-100 text-green-800 rounded-md hover:bg-green-200 transition-colors">
                  Ver Stock Crítico ({stockSummary.criticalStock + stockSummary.lowStock})
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4" />
                  <span className="font-medium">Actualizar Precios</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">Modificar lista de precios</p>
                <button className="w-full px-3 py-2 text-sm bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 transition-colors">
                  Gestionar Precios
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Products Catalog */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Catálogo Completo
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingProductos ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">Cargando productos...</p>
              </div>
            </div>
          ) : productos.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No hay productos registrados</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(agruparProductosPorMarca(productos)).map(([marcaNombre, productosDeMarc]) => (
                <div key={marcaNombre} className="space-y-4">
                  {/* Header de la marca */}
                  <div className="flex items-center gap-3 pb-2 border-b">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                      <h3 className="text-lg font-semibold text-foreground">{marcaNombre}</h3>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {productosDeMarc.length} producto{productosDeMarc.length !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                  
                  {/* Grid de productos de esta marca */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                    {productosDeMarc.map((producto) => {
                      const minStock = 10;
                      const stockStatus = getStockStatus(producto.stock, minStock);
                      
                      return (
                        <div key={producto.id} className="p-4 border rounded-lg space-y-3 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium text-sm">{producto.nombre}</h4>
                              <p className="text-xs text-muted-foreground">{producto.sku}</p>
                            </div>
                            <Badge 
                              variant={producto.activo ? "default" : "secondary"} 
                              className="text-xs"
                            >
                              {producto.activo ? "Activo" : "Inactivo"}
                            </Badge>
                          </div>
                          
                          {producto.descripcion && (
                            <p className="text-xs text-muted-foreground">{producto.descripcion}</p>
                          )}
                          
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Precio:</span>
                              <span className="font-medium">${producto.precio.toLocaleString()}</span>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Stock actual:</span>
                              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getStockStatusColor(stockStatus)}`}>
                                {getStockStatusIcon(stockStatus)}
                                <span className="font-medium">{producto.stock}</span>
                              </div>
                            </div>
                            
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span>Mínimo: {minStock}</span>
                                <span>{Math.round((producto.stock / (minStock * 2)) * 100)}%</span>
                              </div>
                              <Progress 
                                value={Math.min((producto.stock / (minStock * 2)) * 100, 100)} 
                                className="h-2"
                              />
                            </div>
                          </div>
                          
                          <div className="flex gap-2 flex-wrap pt-2 border-t">
                            <BtnEditar 
                              onClick={() => handleEditarProducto(producto)}
                              className="flex-1 min-w-0"
                            />
                            <BtnAjusteStock 
                              onClick={() => handleAjusteStock(producto)}
                              className="flex-1 min-w-0"
                            />
                            <BtnCambiarPrecio 
                              onClick={() => handleCambiarPrecio(producto)}
                              className="flex-1 min-w-0"
                            />
                            <BtnEliminar 
                              onClick={() => handleEliminarProducto(producto)}
                              className="flex-1 min-w-0"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modales */}
      <NewProductDialog
        open={openNewProduct}
        onOpenChange={setOpenNewProduct}
        marcas={marcas}
        categorias={categorias}
        listasPrecios={listasPrecios}
        defaultLista="mayorista"
        generarSku={generarSku}
        onSubmit={crearProducto}
        loading={loading}
      />

      <AdjustStockDialog
        open={openAdjustStock}
        onOpenChange={setOpenAdjustStock}
        product={selectedProduct}
        onSubmit={ajustarStock}
        loading={loading}
      />

      <ChangePriceDialog
        open={openChangePrice}
        onOpenChange={setOpenChangePrice}
        product={selectedProduct}
        listasPrecios={listasPrecios}
        onSubmit={cambiarPrecio}
        loading={loading}
      />

      <EditProductDialog
        open={openEditProduct}
        onOpenChange={setOpenEditProduct}
        product={selectedProduct}
        onSubmit={editarProducto}
        loading={loading}
      />

      <DeleteProductDialog
        open={openDeleteProduct}
        onOpenChange={setOpenDeleteProduct}
        product={selectedProduct}
        onConfirm={eliminarProducto}
        loading={loading}
      />
    </div>
  );
}