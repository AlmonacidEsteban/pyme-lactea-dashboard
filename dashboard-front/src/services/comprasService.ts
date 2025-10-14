// SERVICIO PARA MÓDULO DE COMPRAS
import { API_CONFIG, getAuthHeaders } from '../config/api';

const API_BASE = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.COMPRAS}`.replace(/\/+/g, '/').replace(':/', '://');

// Tipos de datos
export interface Producto {
  id: number;
  nombre: string;
  sku: string;
  precio: number;
  stock: number;
  min_stock: number;
  unidad: string;
  avg_cost: number;
}

export interface Proveedor {
  id: number;
  nombre: string;
  identificacion: string;
  contacto: string;
  telefono: string;
  correo: string;
  direccion: string;
  confiabilidad: number;
  dias_pago: number;
  notas?: string;
  activo: boolean;
  is_demo?: boolean;
  created_at?: string;
  updated_at?: string;
  // Campos calculados
  cuentas_pendientes?: number;
  total_deuda?: number;
}

export interface OrdenCompraItem {
  id?: number;
  producto: number;
  producto_nombre?: string;
  cantidad: number;
  precio_unitario: number;
  total: number;
}

export interface OrdenCompra {
  id?: number;
  numero: string;
  proveedor: number;
  proveedor_nombre?: string;
  fecha_orden: string;
  fecha_entrega_esperada: string;
  estado: 'borrador' | 'enviada' | 'recibida' | 'cancelada';
  subtotal: number;
  impuestos: number;
  total: number;
  notas?: string;
  items: OrdenCompraItem[];
  created_at?: string;
  updated_at?: string;
}

export interface MovimientoStock {
  id: number;
  producto: number;
  tipo: 'entrada' | 'salida' | 'ajuste';
  motivo: string;
  cantidad: number;
  stock_anterior: number;
  stock_nuevo: number;
  costo_unitario?: number;
  notas?: string;
  created_at: string;
  created_by?: number;
}

export interface HistorialPrecio {
  id: number;
  producto: number;
  precio: number;
  precio_anterior?: number;
  fecha: string;
  proveedor_nombre?: string;
  orden_compra?: number;
  notas?: string;
  es_precio_atipico?: boolean;
}

export interface AlertaStock {
  id: number;
  producto: number;
  tipo: 'stock_minimo' | 'precio_atipico' | 'stock_agotado';
  prioridad: 'alta' | 'media' | 'baja';
  estado: 'activa' | 'vista' | 'resuelta' | 'descartada';
  titulo: string;
  mensaje: string;
  datos_adicionales?: any;
  resolucion_accion?: string;
  resolucion_notas?: string;
  created_at: string;
  resolved_at?: string;
}

export interface EstadisticasCompras {
  total_ordenes: number;
  monto_total: number;
  ordenes_pendientes: number;
  productos_bajo_stock: number;
  ahorro_mes: number;
  top_proveedores: Array<{
    nombre: string;
    monto: number;
    ordenes: number;
  }>;
}

export interface DashboardStats {
  total_ordenes: number;
  ordenes_borrador: number;
  ordenes_enviadas: number;
  ordenes_confirmadas: number;
  ordenes_pendientes: number;
  ordenes_completadas: number;
  total_valor: number;
  productos_bajo_stock: number;
  alertas_activas: number;
  proveedores_activos: number;
  compras_por_mes: Array<{ mes: string; total: number }>;
  top_proveedores: Array<{ proveedor__nombre: string; total: number; ordenes: number }>;
  productos_mas_comprados: Array<{ producto__nombre: string; cantidad_total: number; ordenes: number }>;
}

export interface RecepcionMercaderia {
  items: Array<{
    item_id: number;
    cantidad_recibida: number;
  }>;
  fecha_recepcion?: string;
  notas?: string;
}

export interface FiltrosCompras {
  proveedor?: number;
  estado?: string;
  prioridad?: string;
  fecha_desde?: string;
  fecha_hasta?: string;
  search?: string;
}

// Servicio principal
export const comprasService = {
  // Proveedores
  async getProveedores(): Promise<Proveedor[]> {
    const url = `${API_CONFIG.BASE_URL}/proveedores/`.replace(/\/+/g, '/').replace(':/', '://');
    const response = await fetch(url, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Error al obtener proveedores');
    const data = await response.json();
    return data.results || data;
  },

  // Órdenes de compra
  ordenes: {
    async getOrdenes(filtros?: any): Promise<OrdenCompra[]> {
      const params = new URLSearchParams(filtros);
      const url = `${API_BASE}/ordenes/?${params}`.replace(/\/+/g, '/').replace(':/', '://');
      const response = await fetch(url, {
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Error al obtener órdenes');
      const data = await response.json();
      return data.results || data;
    },

    async getOrden(id: number): Promise<OrdenCompra> {
      const url = `${API_BASE}/ordenes/${id}/`.replace(/\/+/g, '/').replace(':/', '://');
      const response = await fetch(url, {
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Error al obtener orden');
      return response.json();
    },

    async crearOrden(orden: Partial<OrdenCompra>): Promise<OrdenCompra> {
      const url = `${API_BASE}/ordenes/`.replace(/\/+/g, '/').replace(':/', '://');
      const response = await fetch(url, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(orden)
      });
      if (!response.ok) throw new Error('Error al crear orden');
      return response.json();
    },

    async actualizarOrden(id: number, orden: Partial<OrdenCompra>): Promise<OrdenCompra> {
      const url = `${API_BASE}/ordenes/${id}/`.replace(/\/+/g, '/').replace(':/', '://');
      const response = await fetch(url, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(orden)
      });
      if (!response.ok) throw new Error('Error al actualizar orden');
      return response.json();
    },

    async enviarOrden(id: number): Promise<void> {
      const url = `${API_BASE}/ordenes/${id}/enviar/`.replace(/\/+/g, '/').replace(':/', '://');
      const response = await fetch(url, {
        method: 'POST',
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Error al enviar orden');
    },

    async recibirMercaderia(id: number, items: any[]): Promise<void> {
      const url = `${API_BASE}/ordenes/${id}/recibir_mercaderia/`.replace(/\/+/g, '/').replace(':/', '://');
      const response = await fetch(url, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ items })
      });
      if (!response.ok) throw new Error('Error al recibir mercadería');
    },

    async getEstadisticasDashboard(): Promise<any> {
      const url = `${API_BASE}/ordenes/estadisticas_dashboard/`.replace(/\/+/g, '/').replace(':/', '://');
      const response = await fetch(url, {
        headers: getAuthHeaders()
      });
      if (!response.ok) {
        throw new Error(`Error al obtener estadísticas: ${response.statusText}`);
      }
      return response.json();
    },

    async exportarCSV(filtros?: any): Promise<void> {
      const params = new URLSearchParams(filtros);
      const url = `${API_BASE}/ordenes/exportar_csv/?${params}`.replace(/\/+/g, '/').replace(':/', '://');
      const response = await fetch(url, {
        headers: getAuthHeaders()
      });
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = 'ordenes_compra.csv';
      a.click();
    }
  },

  // Movimientos de stock
  movimientos: {
    async getMovimientos(filtros?: any): Promise<MovimientoStock[]> {
      const params = new URLSearchParams(filtros);
      const url = `${API_BASE}/movimientos-stock/?${params}`.replace(/\/+/g, '/').replace(':/', '://');
      const response = await fetch(url, {
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Error al obtener movimientos');
      const data = await response.json();
      return data.results || data;
    },

    async getResumenPorProducto(productoId?: number): Promise<any> {
      const url = (productoId 
        ? `${API_BASE}/movimientos-stock/resumen_por_producto/?producto=${productoId}`
        : `${API_BASE}/movimientos-stock/resumen_por_producto/`).replace(/\/+/g, '/').replace(':/', '://');
      const response = await fetch(url, {
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Error al obtener resumen');
      return response.json();
    },

    async ajusteInventario(productoId: number, nuevoStock: number, notas?: string): Promise<void> {
      const url = `${API_BASE}/movimientos-stock/ajustar_inventario/`.replace(/\/+/g, '/').replace(':/', '://');
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          producto_id: productoId,
          nuevo_stock: nuevoStock,
          notas
        })
      });
    }
  },

  // Historial de precios
  historialPrecios: {
    async getHistorial(filtros?: any): Promise<HistorialPrecio[]> {
      const params = new URLSearchParams(filtros);
      const url = `${API_BASE}/historial-precios/?${params}`.replace(/\/+/g, '/').replace(':/', '://');
      const response = await fetch(url, {
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Error al obtener historial');
      const data = await response.json();
      return data.results || data;
    },

    async compararPrecios(producto1: number, producto2: number, dias: number): Promise<any> {
      const url = `${API_BASE}/historial-precios/comparacion/`.replace(/\/+/g, '/').replace(':/', '://');
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          producto1,
          producto2,
          dias
        })
      });
      return response.json();
    },

    async getTendencia(productoId: number, dias: number): Promise<any> {
      const url = `${API_BASE}/historial-precios/tendencia/?producto=${productoId}&dias=${dias}`.replace(/\/+/g, '/').replace(':/', '://');
      const response = await fetch(url, {
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Error al obtener tendencia');
      return response.json();
    }
  },

  // Alertas de stock
  alertas: {
    async getAlertas(filtros?: any): Promise<AlertaStock[]> {
      const params = new URLSearchParams(filtros);
      const url = `${API_BASE}/alertas-stock/?${params}`.replace(/\/+/g, '/').replace(':/', '://');
      const response = await fetch(url, {
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Error al obtener alertas');
      const data = await response.json();
      return data.results || data;
    },

    async marcarVista(alertaId: number): Promise<void> {
      const url = `${API_BASE}/alertas-stock/${alertaId}/marcar_vista/`.replace(/\/+/g, '/').replace(':/', '://');
      const response = await fetch(url, {
        method: 'POST',
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Error al marcar vista');
    },

    async resolver(alertaId: number, accion: string, notas?: string): Promise<void> {
      const url = `${API_BASE}/alertas-stock/${alertaId}/resolver/`.replace(/\/+/g, '/').replace(':/', '://');
      const response = await fetch(url, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          accion,
          notas
        })
      });
      if (!response.ok) throw new Error('Error al resolver alerta');
    },

    async generarStockMinimo(): Promise<void> {
      const url = `${API_BASE}/alertas-stock/generar_stock_minimo/`.replace(/\/+/g, '/').replace(':/', '://');
      const response = await fetch(url, {
        method: 'POST',
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Error al generar alertas de stock mínimo');
    }
  },

  // Reportes y estadísticas
  reportes: {
    async getDashboardEstadisticas(filtros?: any): Promise<DashboardStats> {
      const params = new URLSearchParams(filtros);
      const url = `${API_BASE}/reportes/estadisticas_dashboard/?${params}`.replace(/\/+/g, '/').replace(':/', '://');
      const response = await fetch(url, {
        headers: getAuthHeaders()
      });
      if (!response.ok) {
        throw new Error(`Error al obtener estadísticas: ${response.statusText}`);
      }
      return response.json();
    },

    async getEstadisticas(filtros?: any): Promise<any> {
      const params = new URLSearchParams(filtros);
      const url = `${API_BASE}/reportes/estadisticas/?${params}`.replace(/\/+/g, '/').replace(':/', '://');
      const response = await fetch(url, {
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Error al obtener estadísticas');
      return response.json();
    },

    async exportarCSV(filtros?: any, tipo?: string): Promise<void> {
      const params = new URLSearchParams({ ...filtros, tipo: tipo || 'completo' });
      const url = `${API_BASE}/reportes/exportar_compras_csv/?${params}`.replace(/\/+/g, '/').replace(':/', '://');
      const response = await fetch(url, {
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Error al exportar CSV');
      
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `reporte_compras_${tipo || 'completo'}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }
};

export default comprasService;