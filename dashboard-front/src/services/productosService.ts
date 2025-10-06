import { API_CONFIG } from '../config/api';

export interface Producto {
  id?: number;
  nombre: string;
  sku: string;
  descripcion?: string;
  precio: number;
  stock: number;
  activo: boolean;
  marca?: number;
  marca_nombre?: string;
  categoria?: number;
  categoria_nombre?: string;
}

export interface ProductoCreate {
  nombre: string;
  sku: string;
  descripcion?: string;
  precio: number;
  stock: number;
  marca?: number;
  categoria?: number;
  activo?: boolean;
}

export interface AjusteStock {
  cantidad: number;
  tipo: 'entrada' | 'salida';
  motivo: string;
  fecha: string;
  referencia?: string;
  notas?: string;
}

export interface CambioPrecio {
  precio: number;
  lista_precios?: string;
  moneda?: string;
  modo?: 'monto' | 'porcentaje';
  valor?: number;
  fecha_inicio?: string;
}

class ProductosService {
  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_CONFIG.BASE_URL}/productos/productos${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Error ${response.status}: ${response.statusText}`);
      }

      // Para respuestas DELETE (204 No Content) o respuestas vacías, no intentar parsear JSON
      if (response.status === 204 || response.headers.get('content-length') === '0') {
        return null;
      }

      // Verificar si hay contenido antes de parsear JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const text = await response.text();
        return text ? JSON.parse(text) : null;
      }

      return await response.json();
    } catch (error) {
      console.error('Error en la petición:', error);
      throw error;
    }
  }

  // Obtener todos los productos
  async obtenerProductos(): Promise<Producto[]> {
    const response = await this.request('/');
    // La API devuelve un objeto con paginación, extraemos el array results
    return response.results || [];
  }

  // Obtener un producto por ID
  async obtenerProducto(id: number): Promise<Producto> {
    return this.request(`/${id}/`);
  }

  // Crear un nuevo producto
  async crearProducto(producto: ProductoCreate): Promise<Producto> {
    return this.request('/', {
      method: 'POST',
      body: JSON.stringify(producto),
    });
  }

  // Actualizar un producto
  async actualizarProducto(id: number, producto: Partial<ProductoCreate>): Promise<Producto> {
    return this.request(`/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(producto),
    });
  }

  // Eliminar un producto
  async eliminarProducto(id: number): Promise<void> {
    await this.request(`/${id}/`, {
      method: 'DELETE',
    });
    // No retornamos nada ya que DELETE devuelve 204 No Content
  }

  // Agregar stock
  async agregarStock(id: number, cantidad: number): Promise<Producto> {
    return this.request(`/${id}/agregar-stock/`, {
      method: 'POST',
      body: JSON.stringify({ cantidad }),
    });
  }

  // Quitar stock
  async quitarStock(id: number, cantidad: number): Promise<Producto> {
    return this.request(`/${id}/quitar-stock/`, {
      method: 'POST',
      body: JSON.stringify({ cantidad }),
    });
  }

  // Ajustar stock (entrada o salida)
  async ajustarStock(id: number, ajuste: AjusteStock): Promise<Producto> {
    const { cantidad, tipo } = ajuste;
    
    if (tipo === 'entrada') {
      return this.agregarStock(id, cantidad);
    } else {
      return this.quitarStock(id, cantidad);
    }
  }

  // Cambiar precio
  async cambiarPrecio(id: number, cambio: CambioPrecio): Promise<Producto> {
    return this.actualizarProducto(id, { precio: cambio.precio });
  }

  // Buscar productos
  async buscarProductos(query: string): Promise<Producto[]> {
    return this.request(`/?search=${encodeURIComponent(query)}`);
  }

  // Filtrar productos por estado activo
  async filtrarProductosPorEstado(activo: boolean): Promise<Producto[]> {
    return this.request(`/?activo=${activo}`);
  }

  // Obtener productos con stock bajo (menos de 10 unidades)
  async obtenerProductosStockBajo(): Promise<Producto[]> {
    const productos = await this.obtenerProductos();
    return productos.filter(producto => producto.stock < 10);
  }
}

export const productosService = new ProductosService();