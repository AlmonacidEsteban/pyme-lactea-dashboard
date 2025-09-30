// Configuración de la API
const getBaseURL = () => {
  // En desarrollo, usar el servidor local
  if (import.meta.env.DEV) {
    return 'http://127.0.0.1:8000/api';
  }
  
  // En producción, usar el backend desplegado en Render
  return 'https://pyme-lactea-backend.onrender.com/api';
};

export const API_CONFIG = {
  BASE_URL: getBaseURL(),
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login/',
      REGISTER: '/auth/register/',
      LOGOUT: '/auth/logout/',
      REFRESH: '/auth/token/refresh/',
      PROFILE: '/auth/profile/',
      CHANGE_PASSWORD: '/auth/change-password/',
      DEMO_LOGIN: '/auth/demo-login/',
      USER_INFO: '/auth/user-info/',
    },
    CLIENTES: '/clientes/',
    PROVEEDORES: '/proveedores/',
    PRODUCTOS: '/productos/',
    VENTAS: '/ventas/',
    COMPRAS: '/compras/',
    RRHH: '/rrhh/',
    FINANZAS: '/finanzas/',
  }
};

// Headers por defecto
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

// Función para obtener headers con autenticación
export const getAuthHeaders = (token?: string) => {
  const authToken = token || localStorage.getItem('access_token');
  return {
    ...DEFAULT_HEADERS,
    ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
  };
};

// Función para construir URL completa
export const buildApiUrl = (endpoint: string) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};