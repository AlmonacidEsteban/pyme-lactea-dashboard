import { API_CONFIG } from '../config/api';

export interface Categoria {
  id: number;
  nombre: string;
  activo: boolean;
}

class CategoriasService {
  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_CONFIG.BASE_URL}/productos/categorias${endpoint}`;
    
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
      console.error('Error en request de categorías:', error);
      throw error;
    }
  }

  async obtenerCategorias(): Promise<Categoria[]> {
    const response = await this.request('/');
    // La API devuelve un objeto con paginación, extraemos solo el array results
    return response.results || [];
  }

  async obtenerCategoria(id: number): Promise<Categoria> {
    return this.request(`/${id}/`);
  }

  async crearCategoria(categoria: Omit<Categoria, 'id'>): Promise<Categoria> {
    return this.request('/', {
      method: 'POST',
      body: JSON.stringify(categoria),
    });
  }

  async actualizarCategoria(id: number, categoria: Partial<Categoria>): Promise<Categoria> {
    return this.request(`/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(categoria),
    });
  }

  async eliminarCategoria(id: number): Promise<void> {
    await this.request(`/${id}/`, {
      method: 'DELETE',
    });
  }
}

export const categoriasService = new CategoriasService();