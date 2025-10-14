// SERVICIO PARA MÓDULO DE PROVEEDORES
import { API_CONFIG, getAuthHeaders } from '../config/api';

const API_BASE = `${API_CONFIG.BASE_URL}/proveedores/proveedores`.replace(/\/+/g, '/').replace(':/', '://');

// Tipos de datos
export interface Proveedor {
  id?: number;
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

export interface CuentaPorPagar {
  id?: number;
  proveedor: number;
  proveedor_nombre?: string;
  monto: number;
  fecha_vencimiento: string;
  estado: 'pending' | 'urgent' | 'overdue' | 'paid';
  descripcion?: string;
  numero_factura?: string;
  orden_compra?: number;
  is_demo?: boolean;
  created_at?: string;
  updated_at?: string;
  // Campos calculados
  dias_restantes?: number;
  estado_calculado?: string;
}

export interface HistorialCompra {
  id: number;
  numero: string;
  fecha: string;
  total: number;
  estado: string;
  items_count: number;
  productos: string[];
}

export interface EstadisticasProveedor {
  total_proveedores: number;
  proveedores_activos: number;
  total_deuda: number;
  cuentas_vencidas: number;
  cuentas_por_vencer: number;
  promedio_confiabilidad: number;
  top_proveedores: Array<{
    nombre: string;
    total_compras: number;
    confiabilidad: number;
  }>;
}

export interface CronogramaPagos {
  vencidas: CuentaPorPagar[];
  proximas: CuentaPorPagar[];
  futuras: CuentaPorPagar[];
  total_vencidas: number;
  total_proximas: number;
  total_futuras: number;
}

export interface FiltrosProveedores {
  search?: string;
  activo?: boolean;
  confiabilidad_min?: number;
  confiabilidad_max?: number;
  ordering?: string;
}

export interface FiltrosCuentas {
  proveedor?: number;
  estado?: string;
  fecha_desde?: string;
  fecha_hasta?: string;
  search?: string;
  ordering?: string;
}

// Servicio principal
export const proveedoresService = {
  // CRUD de Proveedores
  async getProveedores(filtros?: FiltrosProveedores): Promise<{ results: Proveedor[]; count: number }> {
    const params = new URLSearchParams();
    if (filtros) {
      Object.entries(filtros).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    
    const url = `${API_BASE}/?${params}`;
    const response = await fetch(url, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Error al obtener proveedores: ${response.statusText}`);
    }
    
    return response.json();
  },

  async getProveedor(id: number): Promise<Proveedor> {
    const url = `${API_BASE}/${id}/`;
    const response = await fetch(url, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Error al obtener proveedor: ${response.statusText}`);
    }
    
    return response.json();
  },

  async crearProveedor(proveedor: Omit<Proveedor, 'id' | 'created_at' | 'updated_at'>): Promise<Proveedor> {
    const url = `${API_BASE}/`;
    const response = await fetch(url, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(proveedor)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Error al crear proveedor: ${errorData.detail || response.statusText}`);
    }
    
    return response.json();
  },

  async actualizarProveedor(id: number, proveedor: Partial<Proveedor>): Promise<Proveedor> {
    const url = `${API_BASE}/${id}/`;
    const response = await fetch(url, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(proveedor)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Error al actualizar proveedor: ${errorData.detail || response.statusText}`);
    }
    
    return response.json();
  },

  async eliminarProveedor(id: number): Promise<void> {
    const url = `${API_BASE}/${id}/`;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Error al eliminar proveedor: ${response.statusText}`);
    }
  },

  // Estadísticas de proveedores
  async getEstadisticas(): Promise<EstadisticasProveedor> {
    const url = `${API_BASE}/estadisticas/`;
    const response = await fetch(url, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Error al obtener estadísticas: ${response.statusText}`);
    }
    
    return response.json();
  },

  // Historial de compras por proveedor
  async getHistorialCompras(proveedorId: number, filtros?: any): Promise<{ results: HistorialCompra[]; count: number }> {
    const params = new URLSearchParams();
    if (filtros) {
      Object.entries(filtros).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    
    const url = `${API_BASE}/${proveedorId}/historial_compras/?${params}`;
    const response = await fetch(url, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Error al obtener historial de compras: ${response.statusText}`);
    }
    
    return response.json();
  }
};

// Servicio para Cuentas por Pagar
export const cuentasPorPagarService = {
  async getCuentas(filtros?: FiltrosCuentas): Promise<{ results: CuentaPorPagar[]; count: number }> {
    const params = new URLSearchParams();
    if (filtros) {
      Object.entries(filtros).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    
    const url = `${API_CONFIG.BASE_URL}/proveedores/cuentas-por-pagar/?${params}`.replace(/\/+/g, '/').replace(':/', '://');
    const response = await fetch(url, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Error al obtener cuentas por pagar: ${response.statusText}`);
    }
    
    return response.json();
  },

  async getCuenta(id: number): Promise<CuentaPorPagar> {
    const url = `${API_CONFIG.BASE_URL}/proveedores/cuentas-por-pagar/${id}/`.replace(/\/+/g, '/').replace(':/', '://');
    const response = await fetch(url, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Error al obtener cuenta por pagar: ${response.statusText}`);
    }
    
    return response.json();
  },

  async crearCuenta(cuenta: Omit<CuentaPorPagar, 'id' | 'created_at' | 'updated_at'>): Promise<CuentaPorPagar> {
    const url = `${API_CONFIG.BASE_URL}/proveedores/cuentas-por-pagar/`.replace(/\/+/g, '/').replace(':/', '://');
    const response = await fetch(url, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(cuenta)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Error al crear cuenta por pagar: ${errorData.detail || response.statusText}`);
    }
    
    return response.json();
  },

  async actualizarCuenta(id: number, cuenta: Partial<CuentaPorPagar>): Promise<CuentaPorPagar> {
    const url = `${API_CONFIG.BASE_URL}/proveedores/cuentas-por-pagar/${id}/`.replace(/\/+/g, '/').replace(':/', '://');
    const response = await fetch(url, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(cuenta)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Error al actualizar cuenta por pagar: ${errorData.detail || response.statusText}`);
    }
    
    return response.json();
  },

  async eliminarCuenta(id: number): Promise<void> {
    const url = `${API_CONFIG.BASE_URL}/proveedores/cuentas-por-pagar/${id}/`.replace(/\/+/g, '/').replace(':/', '://');
    const response = await fetch(url, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Error al eliminar cuenta por pagar: ${response.statusText}`);
    }
  },

  // Cronograma de pagos
  async getCronogramaPagos(): Promise<CronogramaPagos> {
    const url = `${API_CONFIG.BASE_URL}/proveedores/cuentas-por-pagar/cronograma_pagos/`.replace(/\/+/g, '/').replace(':/', '://');
    const response = await fetch(url, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Error al obtener cronograma de pagos: ${response.statusText}`);
    }
    
    return response.json();
  },

  // Marcar cuenta como pagada
  async marcarComoPagada(id: number, notas?: string): Promise<CuentaPorPagar> {
    const url = `${API_CONFIG.BASE_URL}/proveedores/cuentas-por-pagar/${id}/marcar_pagada/`.replace(/\/+/g, '/').replace(':/', '://');
    const response = await fetch(url, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ notas })
    });
    
    if (!response.ok) {
      throw new Error(`Error al marcar cuenta como pagada: ${response.statusText}`);
    }
    
    return response.json();
  },

  // Resumen por proveedor
  async getResumenPorProveedor(proveedorId?: number): Promise<any> {
    const url = proveedorId 
      ? `${API_CONFIG.BASE_URL}/proveedores/cuentas-por-pagar/resumen_por_proveedor/?proveedor=${proveedorId}`.replace(/\/+/g, '/').replace(':/', '://')
      : `${API_CONFIG.BASE_URL}/proveedores/cuentas-por-pagar/resumen_por_proveedor/`.replace(/\/+/g, '/').replace(':/', '://');
    
    const response = await fetch(url, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Error al obtener resumen por proveedor: ${response.statusText}`);
    }
    
    return response.json();
  }
};

export default { proveedoresService, cuentasPorPagarService };