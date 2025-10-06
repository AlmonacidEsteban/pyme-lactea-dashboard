import { API_CONFIG } from '../config/api';

export interface Marca {
  id: number;
  nombre: string;
  activo: boolean;
}

class MarcasService {
  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_CONFIG.BASE_URL}/productos/marcas${endpoint}`;
    
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

      return await response.json();
    } catch (error) {
      console.error('Error en request de marcas:', error);
      throw error;
    }
  }

  async obtenerMarcas(): Promise<Marca[]> {
    const response = await this.request('/');
    // La API devuelve un objeto con paginación, extraemos solo el array results
    return response.results || [];
  }

  async obtenerMarca(id: number): Promise<Marca> {
    return this.request(`/${id}/`);
  }

  async crearMarca(marca: Omit<Marca, 'id'>): Promise<Marca> {
    return this.request('/', {
      method: 'POST',
      body: JSON.stringify(marca),
    });
  }

  async actualizarMarca(id: number, marca: Partial<Marca>): Promise<Marca> {
    return this.request(`/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(marca),
    });
  }

  async eliminarMarca(id: number): Promise<void> {
    await this.request(`/${id}/`, {
      method: 'DELETE',
    });
  }
}

export const marcasService = new MarcasService();