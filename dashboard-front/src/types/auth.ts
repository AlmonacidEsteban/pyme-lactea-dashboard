// Tipos para autenticación
export interface LoginCredentials {
  identifier: string; // Email o username
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  company_name?: string;
  company_type?: string;
  position?: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  phone_number?: string;
  company_name?: string;
  company_type?: string;
  position?: string;
  profile_picture?: string;
  is_verified: boolean;
  date_joined: string;
  last_login?: string;
  profile?: UserProfile;
}

export interface UserProfile {
  id: number;
  user: number;
  company_address?: string;
  company_city?: string;
  company_state?: string;
  company_country?: string;
  company_postal_code?: string;
  tax_id?: string;
  website?: string;
  timezone: string;
  language: string;
  currency: string;
  email_notifications: boolean;
  sms_notifications: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  tokens: AuthTokens;
}

export interface ApiError {
  error: string;
  details?: any;
}

export interface ChangePasswordData {
  old_password: string;
  new_password: string;
  new_password_confirm: string;
}

export interface DemoLoginData {
  demo_type: 'restaurant' | 'retail' | 'services';
}

// Estados de autenticación
export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Contexto de autenticación
export interface AuthContextType {
  authState: AuthState;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  demoLogin: (demoType: DemoLoginData['demo_type']) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  changePassword: (data: ChangePasswordData) => Promise<void>;
  refreshToken: () => Promise<void>;
  clearError: () => void;
}