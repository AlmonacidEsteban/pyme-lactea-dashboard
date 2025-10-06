import { 
  Cliente, 
  ClienteFilters, 
  ApiResponse, 
  VentaRapidaPayload,
  CobroPayload,
  WhatsAppPayload,
  WhatsAppTemplate,
  EstadoCuenta,
  ExportOptions,
  ImportResult
} from '../types/clientes';
import { API_CONFIG, getAuthHeaders } from '../config/api';

class ClientesService {
  private baseUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CLIENTES}`;

  // Listar clientes con filtros
  async list(filters?: ClienteFilters): Promise<ApiResponse<Cliente>> {
    const params = new URLSearchParams();
    
    if (filters) {
      if (filters.search) params.append('search', filters.search);
      if (filters.zona) params.append('zona', filters.zona);
      if (filters.tipo && filters.tipo !== 'Todos') params.append('tipo', filters.tipo);
      if (filters.activo && filters.activo !== 'Todos') {
        params.append('activo', filters.activo === 'Activos' ? 'true' : 'false');
      }
      if (filters.deuda_minima) params.append('deuda_minima', filters.deuda_minima.toString());
      if (filters.ultima_compra) params.append('ultima_compra', filters.ultima_compra);
    }

    const url = `${this.baseUrl}${params.toString() ? `?${params.toString()}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error al obtener clientes: ${response.statusText}`);
    }

    return response.json();
  }

  // Obtener cliente por ID
  async getById(id: number): Promise<Cliente> {
    const response = await fetch(`${this.baseUrl}${id}/`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error al obtener cliente: ${response.statusText}`);
    }

    return response.json();
  }

  // Crear cliente
  async create(data: Partial<Cliente>): Promise<Cliente> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Error al crear cliente');
    }

    return response.json();
  }

  // Actualizar cliente
  async update(id: number, data: Partial<Cliente>): Promise<Cliente> {
    const response = await fetch(`${this.baseUrl}${id}/`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Error al actualizar cliente');
    }

    return response.json();
  }

  // Eliminar cliente
  async remove(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}${id}/`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error al eliminar cliente: ${response.statusText}`);
    }
  }

  // Exportar clientes
  async export(options: ExportOptions): Promise<Blob> {
    const params = new URLSearchParams();
    params.append('formato', options.formato);
    
    if (options.campos) {
      params.append('campos', options.campos.join(','));
    }
    
    if (options.filtros) {
      Object.entries(options.filtros).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const response = await fetch(`${this.baseUrl}export/?${params.toString()}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error al exportar clientes: ${response.statusText}`);
    }

    return response.blob();
  }

  // Importar clientes
  async import(file: File): Promise<ImportResult> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${this.baseUrl}import/`, {
      method: 'POST',
      headers: {
        'Authorization': getAuthHeaders().Authorization || '',
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Error al importar clientes: ${response.statusText}`);
    }

    return response.json();
  }

  // Obtener estado de cuenta
  async getEstadoCuenta(clienteId: number): Promise<EstadoCuenta> {
    const response = await fetch(`${this.baseUrl}${clienteId}/estado-cuenta/`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error al obtener estado de cuenta: ${response.statusText}`);
    }

    return response.json();
  }

  // Enviar WhatsApp
  async sendWhatsApp(clienteId: number, template: WhatsAppTemplate, datosAdicionales?: Record<string, any>): Promise<void> {
    const payload: WhatsAppPayload = {
      cliente_id: clienteId,
      template,
      datos_adicionales: datosAdicionales,
    };

    const response = await fetch(`${this.baseUrl}${clienteId}/whatsapp/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Error al enviar WhatsApp: ${response.statusText}`);
    }
  }

  // Venta rápida
  async ventaRapida(payload: VentaRapidaPayload): Promise<void> {
    const response = await fetch(`${this.baseUrl}${payload.cliente_id}/venta-rapida/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Error al registrar venta rápida: ${response.statusText}`);
    }
  }

  // Registrar cobro
  async registrarCobro(payload: CobroPayload): Promise<void> {
    const response = await fetch(`${this.baseUrl}${payload.cliente_id}/cobro/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Error al registrar cobro: ${response.statusText}`);
    }
  }

  // Obtener comprobantes pendientes
  async getComprobantesPendientes(clienteId: number) {
    const response = await fetch(`${this.baseUrl}${clienteId}/comprobantes-pendientes/`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error al obtener comprobantes: ${response.statusText}`);
    }

    return response.json();
  }

  // Obtener productos sugeridos
  async getProductosSugeridos(clienteId?: number) {
    const url = clienteId 
      ? `${this.baseUrl}${clienteId}/productos-sugeridos/`
      : `${this.baseUrl}productos-sugeridos/`;
      
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error al obtener productos sugeridos: ${response.statusText}`);
    }

    return response.json();
  }

  // Obtener vista tree (agrupada por inicial)
  async getTree() {
    const response = await fetch(`${this.baseUrl}tree/`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error al obtener vista tree: ${response.statusText}`);
    }

    return response.json();
  }

  // Obtener perfil completo del cliente
  async getPerfil(clienteId: number) {
    const response = await fetch(`${this.baseUrl}${clienteId}/perfil/`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error al obtener perfil del cliente: ${response.statusText}`);
    }

    return response.json();
  }
}

export const clientesService = new ClientesService();