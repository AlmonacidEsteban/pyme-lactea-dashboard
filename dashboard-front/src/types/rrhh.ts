// Tipos para Recursos Humanos y Gestión de Equipos

export interface Rol {
  id: number;
  nombre: string;
  descripcion: string;
  activo: boolean;
  fecha_creacion: string;
  fecha_modificacion: string;
}

export interface Equipo {
  id: number;
  nombre: string;
  descripcion: string;
  tipo: 'produccion' | 'logistica' | 'administracion' | 'ventas' | 'calidad' | 'mantenimiento';
  activo: boolean;
  creado_por: number;
  creado_por_nombre: string;
  total_miembros: number;
  lider?: Empleado | null;
  miembros?: Empleado[];
  fecha_creacion: string;
  fecha_modificacion: string;
}

export interface EquipoList {
  id: number;
  nombre: string;
  descripcion: string;
  tipo: string;
  total_miembros: number;
  activo: boolean;
  fecha_creacion: string;
  creado_por_nombre: string;
  lider?: Empleado | null;
}

export interface Empleado {
  id: number;
  nombre: string;
  apellido: string;
  nombre_completo: string;
  identificacion: string;
  puesto: string;
  email: string;
  telefono: string;
  turno: 'manana' | 'tarde' | 'noche' | 'completo';
  salario_por_hora: string;
  fecha_ingreso: string;
  experiencia_anos: number;
  especialidad: string;
  activo: boolean;
  equipo: number | null;
  equipo_nombre: string | null;
  rol: number | null;
  rol_nombre: string | null;
  fecha_creacion: string;
  fecha_modificacion: string;
}

export interface PagoEmpleado {
  id: number;
  empleado: number;
  empleado_nombre: string;
  fecha: string;
  horas_trabajadas: number;
  monto: string;
  descripcion: string;
  aprobado_por: number | null;
  aprobado_por_nombre: string | null;
  fecha_creacion: string;
}

export interface AuditoriaEquipo {
  id: number;
  equipo: number;
  equipo_nombre: string;
  accion: string;
  usuario: number;
  usuario_nombre: string;
  datos_anteriores: Record<string, any> | null;
  datos_nuevos: Record<string, any> | null;
  comentario: string;
  fecha: string;
}

export interface AuditoriaEmpleado {
  id: number;
  empleado: number;
  empleado_nombre: string;
  accion: string;
  usuario: number;
  usuario_nombre: string;
  datos_anteriores: Record<string, any> | null;
  datos_nuevos: Record<string, any> | null;
  comentario: string;
  fecha: string;
}

// Tipos para formularios
export interface CreateEquipoData {
  nombre: string;
  descripcion: string;
  tipo: 'produccion' | 'logistica' | 'administracion' | 'ventas' | 'calidad' | 'mantenimiento';
  activo?: boolean;
  lider_id?: number | null;
  miembros_ids?: number[];
}

export interface UpdateEquipoData extends Partial<CreateEquipoData> {
  id: number;
}

export interface CreateEmpleadoData {
  nombre: string;
  apellido: string;
  identificacion: string;
  puesto: string;
  email: string;
  telefono: string;
  turno: 'manana' | 'tarde' | 'noche' | 'completo';
  salario_por_hora: string;
  fecha_ingreso: string;
  experiencia_anos: number;
  especialidad: string;
  equipo?: number | null;
  rol?: number | null;
  activo?: boolean;
}

export interface UpdateEmpleadoData extends Partial<CreateEmpleadoData> {
  id: number;
}

export interface CreateRolData {
  nombre: string;
  descripcion: string;
  activo?: boolean;
}

export interface UpdateRolData extends Partial<CreateRolData> {
  id: number;
}

// Tipos para respuestas de API
export interface ApiResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ApiError {
  detail?: string;
  message?: string;
  errors?: Record<string, string[]>;
}

// Tipos para filtros y búsqueda
export interface EquipoFilters {
  activo?: boolean;
  tipo?: string;
  search?: string;
  ordering?: string;
}

export interface EmpleadoFilters {
  activo?: boolean;
  equipo?: number;
  rol?: number;
  turno?: string;
  search?: string;
  ordering?: string;
}

export interface RolFilters {
  activo?: boolean;
  search?: string;
  ordering?: string;
}