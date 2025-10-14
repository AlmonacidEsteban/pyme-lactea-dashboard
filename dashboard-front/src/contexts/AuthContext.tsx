import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { 
  AuthState, 
  AuthContextType, 
  LoginCredentials, 
  RegisterData, 
  ChangePasswordData,
  User 
} from '../types/auth';
import { authService } from '../services/authService';

// Estado inicial
const initialState: AuthState = {
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Tipos de acciones
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; tokens: any } }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_LOADING'; payload: boolean };

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  console.log('🔄 AuthReducer - Acción:', action.type, action);
  
  switch (action.type) {
    case 'AUTH_START':
      const startState = {
        ...state,
        isLoading: true,
        error: null,
      };
      console.log('🔄 AUTH_START - Nuevo estado:', startState);
      return startState;
    case 'AUTH_SUCCESS':
      const successState = {
        ...state,
        user: action.payload.user,
        tokens: action.payload.tokens,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
      console.log('✅ AUTH_SUCCESS - Nuevo estado:', successState);
      return successState;
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        tokens: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'AUTH_LOGOUT':
      return {
        ...state,
        user: null,
        tokens: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
};

// Crear contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider del contexto
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, dispatch] = useReducer(authReducer, initialState);

  // Verificar autenticación al cargar la aplicación
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('🔄 AuthContext - Inicializando autenticación...');
        console.log('🔄 AuthContext - isAuthenticated():', authService.isAuthenticated());
        console.log('🔄 AuthContext - access_token:', authService.getAccessToken());
        
        if (authService.isAuthenticated()) {
          console.log('✅ AuthContext - Usuario autenticado, obteniendo información...');
          const user = await authService.getUserInfo();
          console.log('✅ AuthContext - Información de usuario obtenida:', user);
          
          const tokens = {
            access: authService.getAccessToken(),
            refresh: authService.getRefreshToken(),
          };
          
          console.log('✅ AuthContext - Tokens obtenidos:', tokens);
          
          dispatch({ 
            type: 'AUTH_SUCCESS', 
            payload: { user, tokens } 
          });
          
          console.log('✅ AuthContext - Estado de autenticación actualizado exitosamente');
        } else {
          console.log('❌ AuthContext - Usuario no autenticado');
          
          // En modo producción (demo), hacer auto-login
          const isProduction = import.meta.env.VITE_APP_ENV === 'production' || import.meta.env.PROD;
          if (isProduction) {
            console.log('🎯 AuthContext - Modo demo detectado, realizando auto-login...');
            try {
              const response = await authService.login({
                identifier: 'demo@example.com',
                password: 'demo123'
              });
              
              console.log('✅ AuthContext - Auto-login exitoso:', response);
              
              dispatch({ 
                type: 'AUTH_SUCCESS', 
                payload: { 
                  user: response.user, 
                  tokens: response.tokens 
                } 
              });
            } catch (autoLoginError) {
              console.error('❌ AuthContext - Error en auto-login:', autoLoginError);
              dispatch({ type: 'SET_LOADING', payload: false });
            }
          } else {
            console.log('❌ AuthContext - Modo desarrollo, estableciendo loading=false');
            dispatch({ type: 'SET_LOADING', payload: false });
          }
        }
      } catch (error) {
        console.error('❌ AuthContext - Error al inicializar autenticación:', error);
        console.error('❌ AuthContext - Detalles del error:', {
          message: error instanceof Error ? error.message : 'Error desconocido',
          stack: error instanceof Error ? error.stack : undefined
        });
        
        // Limpiar tokens si hay error
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        
        dispatch({ type: 'AUTH_FAILURE', payload: 'Error al verificar autenticación' });
      }
    };

    initializeAuth();
  }, []);

  // Función de login
  const login = async (credentials: LoginCredentials) => {
    try {
      console.log('🔐 AuthContext - Iniciando login...', credentials);
      dispatch({ type: 'AUTH_START' });
      
      const response = await authService.login(credentials);
      console.log('✅ AuthContext - Login exitoso:', response);
      console.log('✅ AuthContext - Usuario recibido:', response.user);
      console.log('✅ AuthContext - Tokens recibidos:', response.tokens);
      
      dispatch({ 
        type: 'AUTH_SUCCESS', 
        payload: { 
          user: response.user, 
          tokens: response.tokens 
        } 
      });
      
      console.log('🎯 AuthContext - Estado de autenticación actualizado exitosamente');
      console.log('🎯 AuthContext - Verificando localStorage...');
      console.log('🎯 AuthContext - access_token en localStorage:', localStorage.getItem('access_token'));
      console.log('🎯 AuthContext - refresh_token en localStorage:', localStorage.getItem('refresh_token'));
    } catch (error) {
      console.error('❌ AuthContext - Error en login:', error);
      console.error('❌ AuthContext - Detalles del error:', {
        message: error instanceof Error ? error.message : 'Error desconocido',
        stack: error instanceof Error ? error.stack : undefined
      });
      const errorMessage = error instanceof Error ? error.message : 'Error en el login';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  // Función de registro
  const register = async (data: RegisterData) => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      const response = await authService.register(data);
      
      dispatch({ 
        type: 'AUTH_SUCCESS', 
        payload: { 
          user: response.user, 
          tokens: response.tokens 
        } 
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error en el registro';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  // Función de login demo
  const demoLogin = async (demoType: 'restaurant' | 'retail' | 'services') => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      const response = await authService.demoLogin(demoType);
      
      dispatch({ 
        type: 'AUTH_SUCCESS', 
        payload: { 
          user: response.user, 
          tokens: response.tokens 
        } 
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error en login demo';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  // Función de logout
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      dispatch({ type: 'AUTH_LOGOUT' });
    }
  };

  // Función para actualizar perfil
  const updateProfile = async (data: Partial<User>) => {
    try {
      const updatedUser = await authService.updateProfile(data);
      dispatch({ type: 'UPDATE_USER', payload: updatedUser });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar perfil';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  // Función para cambiar contraseña
  const changePassword = async (data: ChangePasswordData) => {
    try {
      await authService.changePassword(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al cambiar contraseña';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  // Función para refrescar token
  const refreshToken = async () => {
    try {
      await authService.refreshToken();
    } catch (error) {
      console.error('Error al refrescar token:', error);
      dispatch({ type: 'AUTH_LOGOUT' });
      throw error;
    }
  };

  // Función para limpiar errores
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: AuthContextType = {
    authState,
    login,
    register,
    logout,
    demoLogin,
    updateProfile,
    changePassword,
    refreshToken,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export default AuthContext;