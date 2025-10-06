import { 
  Equipo, 
  EquipoList, 
  Empleado, 
  Rol, 
  PagoEmpleado,
  AuditoriaEquipo,
  AuditoriaEmpleado,
  CreateEquipoData,
  UpdateEquipoData,
  CreateEmpleadoData,
  UpdateEmpleadoData,
  CreateRolData,
  UpdateRolData,
  ApiResponse,
  ApiError,
  EquipoFilters,
  EmpleadoFilters,
  RolFilters
} from '../types/rrhh';
import { API_CONFIG, buildApiUrl, getAuthHeaders } from '../config/api';

class RRHHService {
  private baseUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.RRHH.BASE}`;

  // Métodos para Equipos
  async getEquipos(filters?: EquipoFilters): Promise<ApiResponse<EquipoList>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const url = `${this.baseUrl}/equipos/${params.toString() ? `?${params.toString()}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error al obtener equipos: ${response.statusText}`);
    }

    return response.json();
  }

  async getEquipo(id: number): Promise<Equipo> {
    const response = await fetch(`${this.baseUrl}/equipos/${id}/`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error al obtener equipo: ${response.statusText}`);
    }

    return response.json();
  }

  async createEquipo(data: CreateEquipoData): Promise<Equipo> {
    console.log('Datos a enviar:', data);
    console.log('URL:', `${this.baseUrl}/equipos/`);
    console.log('Headers:', getAuthHeaders());
    
    const response = await fetch(`${this.baseUrl}/equipos/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error response:', errorData);
      throw new Error(errorData.detail || 'Error al crear equipo');
    }

    return response.json();
  }

  async updateEquipo(id: number, data: Partial<UpdateEquipoData>): Promise<Equipo> {
    const response = await fetch(`${this.baseUrl}/equipos/${id}/`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Error al actualizar equipo');
    }

    return response.json();
  }

  async deleteEquipo(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/equipos/${id}/`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error al eliminar equipo: ${response.statusText}`);
    }
  }

  async getEquipoMiembros(id: number): Promise<Empleado[]> {
    const response = await fetch(`${this.baseUrl}/equipos/${id}/miembros/`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error al obtener miembros del equipo: ${response.statusText}`);
    }

    return response.json();
  }

  async agregarMiembroEquipo(equipoId: number, empleadoId: number): Promise<{ message: string }> {
    const response = await fetch(`${this.baseUrl}/equipos/${equipoId}/agregar_miembro/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ empleado_id: empleadoId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al agregar miembro al equipo');
    }

    return response.json();
  }

  async removerMiembroEquipo(equipoId: number, empleadoId: number): Promise<{ message: string }> {
    const response = await fetch(`${this.baseUrl}/equipos/${equipoId}/remover_miembro/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ empleado_id: empleadoId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al remover miembro del equipo');
    }

    return response.json();
  }

  // Métodos para Empleados
  async getEmpleados(filters?: EmpleadoFilters): Promise<ApiResponse<Empleado>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const url = `${this.baseUrl}/empleados/${params.toString() ? `?${params.toString()}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error al obtener empleados: ${response.statusText}`);
    }

    return response.json();
  }

  async getEmpleado(id: number): Promise<Empleado> {
    const response = await fetch(`${this.baseUrl}/empleados/${id}/`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error al obtener empleado: ${response.statusText}`);
    }

    return response.json();
  }

  async createEmpleado(data: CreateEmpleadoData): Promise<Empleado> {
    const response = await fetch(`${this.baseUrl}/empleados/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Error al crear empleado');
    }

    return response.json();
  }

  async updateEmpleado(id: number, data: Partial<UpdateEmpleadoData>): Promise<Empleado> {
    const response = await fetch(`${this.baseUrl}/empleados/${id}/`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Error al actualizar empleado');
    }

    return response.json();
  }

  async deleteEmpleado(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/empleados/${id}/`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error al eliminar empleado: ${response.statusText}`);
    }
  }

  async cambiarEquipoEmpleado(empleadoId: number, equipoId: number): Promise<{ message: string }> {
    const response = await fetch(`${this.baseUrl}/empleados/${empleadoId}/cambiar_equipo/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ equipo_id: equipoId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al cambiar equipo del empleado');
    }

    return response.json();
  }

  // Métodos para Roles
  async getRoles(filters?: RolFilters): Promise<ApiResponse<Rol>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const url = `${this.baseUrl}/roles/${params.toString() ? `?${params.toString()}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error al obtener roles: ${response.statusText}`);
    }

    return response.json();
  }

  async getRol(id: number): Promise<Rol> {
    const response = await fetch(`${this.baseUrl}/roles/${id}/`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error al obtener rol: ${response.statusText}`);
    }

    return response.json();
  }

  async createRol(data: CreateRolData): Promise<Rol> {
    const response = await fetch(`${this.baseUrl}/roles/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Error al crear rol');
    }

    return response.json();
  }

  async updateRol(id: number, data: Partial<UpdateRolData>): Promise<Rol> {
    const response = await fetch(`${this.baseUrl}/roles/${id}/`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Error al actualizar rol');
    }

    return response.json();
  }

  async deleteRol(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/roles/${id}/`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error al eliminar rol: ${response.statusText}`);
    }
  }

  // Métodos para Auditoría
  async getAuditoriaEquipos(equipoId?: number): Promise<ApiResponse<AuditoriaEquipo>> {
    const params = new URLSearchParams();
    if (equipoId) {
      params.append('equipo', equipoId.toString());
    }

    const url = `${this.baseUrl}/auditoria-equipos/${params.toString() ? `?${params.toString()}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error al obtener auditoría de equipos: ${response.statusText}`);
    }

    return response.json();
  }

  async getAuditoriaEmpleados(empleadoId?: number): Promise<ApiResponse<AuditoriaEmpleado>> {
    const params = new URLSearchParams();
    if (empleadoId) {
      params.append('empleado', empleadoId.toString());
    }

    const url = `${this.baseUrl}/auditoria-empleados/${params.toString() ? `?${params.toString()}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error al obtener auditoría de empleados: ${response.statusText}`);
    }

    return response.json();
  }
}

export const rrhhService = new RRHHService();