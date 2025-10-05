import { 
  LoginCredentials, 
  RegisterData, 
  AuthResponse, 
  User, 
  ChangePasswordData,
  DemoLoginData,
  ApiError 
} from '../types/auth';
import { API_CONFIG, buildApiUrl, getAuthHeaders, DEFAULT_HEADERS } from '../config/api';

class AuthService {
  // Usar variable de entorno para determinar si estamos en producción
  private isProduction = import.meta.env.VITE_APP_ENV === 'production' || import.meta.env.PROD;

  // Método para simular respuesta de autenticación en modo demo
  private createDemoAuthResponse(userData: Partial<User>): AuthResponse {
    const demoUser: User = {
      id: Math.floor(Math.random() * 1000),
      username: userData.username || 'demo_user',
      email: userData.email || 'demo@example.com',
      first_name: userData.first_name || 'Demo',
      last_name: userData.last_name || 'User',
      full_name: `${userData.first_name || 'Demo'} ${userData.last_name || 'User'}`,
      phone_number: '',
      company_name: 'Empresa Demo',
      company_type: 'Láctea',
      position: 'Administrador',
      profile_picture: null,
      is_verified: true,
      date_joined: new Date().toISOString(),
      last_login: new Date().toISOString(),
      profile: {
        id: 1,
        company_address: '',
        company_city: '',
        company_state: '',
        company_country: '',
        company_postal_code: '',
        tax_id: '',
        website: '',
        timezone: 'America/Lima',
        language: 'es',
        currency: 'PEN',
        email_notifications: true,
        sms_notifications: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user: 1
      }
    };

    const demoTokens = {
      access: 'demo_access_token_' + Date.now(),
      refresh: 'demo_refresh_token_' + Date.now()
    };

    return {
      message: 'Autenticación exitosa (Modo Demo)',
      user: demoUser,
      tokens: demoTokens
    };
  }
  // Login de usuario
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // En producción, usar modo demo
    if (this.isProduction) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const demoResponse = this.createDemoAuthResponse({
            username: credentials.identifier,
            email: credentials.identifier.includes('@') ? credentials.identifier : 'demo@example.com'
          });
          
          // Guardar tokens en localStorage
          localStorage.setItem('access_token', demoResponse.tokens.access);
          localStorage.setItem('refresh_token', demoResponse.tokens.refresh);
          
          resolve(demoResponse);
        }, 1000); // Simular delay de red
      });
    }

    try {
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.LOGIN), {
        method: 'POST',
        headers: DEFAULT_HEADERS,
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error en el login');
      }

      // Guardar tokens en localStorage
      if (data.tokens) {
        localStorage.setItem('access_token', data.tokens.access);
        localStorage.setItem('refresh_token', data.tokens.refresh);
      }

      return data;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  }

  // Registro de usuario
  async register(userData: RegisterData): Promise<AuthResponse> {
    // En producción, usar modo demo
    if (this.isProduction) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const demoResponse = this.createDemoAuthResponse({
            username: userData.username,
            email: userData.email,
            first_name: userData.first_name,
            last_name: userData.last_name
          });
          
          // Guardar tokens en localStorage
          localStorage.setItem('access_token', demoResponse.tokens.access);
          localStorage.setItem('refresh_token', demoResponse.tokens.refresh);
          
          resolve(demoResponse);
        }, 1500); // Simular delay de red un poco más largo para registro
      });
    }

    try {
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.REGISTER), {
        method: 'POST',
        headers: DEFAULT_HEADERS,
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error en el registro');
      }

      // Guardar tokens en localStorage
      if (data.tokens) {
        localStorage.setItem('access_token', data.tokens.access);
        localStorage.setItem('refresh_token', data.tokens.refresh);
      }

      return data;
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  }

  // Login demo
  async demoLogin(demoType: DemoLoginData['demo_type']): Promise<AuthResponse> {
    try {
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.DEMO_LOGIN), {
        method: 'POST',
        headers: DEFAULT_HEADERS,
        body: JSON.stringify({ demo_type: demoType }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error en login demo');
      }

      // Guardar tokens en localStorage
      if (data.tokens) {
        localStorage.setItem('access_token', data.tokens.access);
        localStorage.setItem('refresh_token', data.tokens.refresh);
      }

      return data;
    } catch (error) {
      console.error('Error en login demo:', error);
      throw error;
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      
      if (refreshToken) {
        await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.LOGOUT), {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({ refresh_token: refreshToken }),
        });
      }
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      // Limpiar tokens del localStorage
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  }

  // Obtener información del usuario
  async getUserInfo(): Promise<User> {
    try {
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.USER_INFO), {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al obtener información del usuario');
      }

      return data.user;
    } catch (error) {
      console.error('Error al obtener información del usuario:', error);
      throw error;
    }
  }

  // Actualizar perfil
  async updateProfile(profileData: Partial<User>): Promise<User> {
    try {
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.PROFILE), {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al actualizar perfil');
      }

      return data.user;
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      throw error;
    }
  }

  // Cambiar contraseña
  async changePassword(passwordData: ChangePasswordData): Promise<void> {
    try {
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.CHANGE_PASSWORD), {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(passwordData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al cambiar contraseña');
      }
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      throw error;
    }
  }

  // Refrescar token
  async refreshToken(): Promise<string> {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      
      if (!refreshToken) {
        throw new Error('No hay token de refresco disponible');
      }

      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.REFRESH), {
        method: 'POST',
        headers: DEFAULT_HEADERS,
        body: JSON.stringify({ refresh: refreshToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al refrescar token');
      }

      // Actualizar token de acceso
      localStorage.setItem('access_token', data.access);
      
      return data.access;
    } catch (error) {
      console.error('Error al refrescar token:', error);
      // Si falla el refresh, limpiar tokens
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      throw error;
    }
  }

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    const token = localStorage.getItem('access_token');
    return !!token;
  }

  // Obtener token de acceso
  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  // Obtener token de refresco
  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  // Interceptor para manejar errores de autenticación
  async makeAuthenticatedRequest(url: string, options: RequestInit = {}): Promise<Response> {
    let response = await fetch(url, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...options.headers,
      },
    });

    // Si el token expiró, intentar refrescarlo
    if (response.status === 401) {
      try {
        await this.refreshToken();
        
        // Reintentar la petición con el nuevo token
        response = await fetch(url, {
          ...options,
          headers: {
            ...getAuthHeaders(),
            ...options.headers,
          },
        });
      } catch (error) {
        // Si falla el refresh, redirigir al login
        this.logout();
        window.location.href = '/login';
        throw new Error('Sesión expirada');
      }
    }

    return response;
  }
}

// Exportar instancia singleton
export const authService = new AuthService();
export default authService;