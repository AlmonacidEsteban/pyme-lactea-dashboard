// Tipos para el módulo de Clientes

export type ClienteTipo = 'minorista' | 'mayorista' | 'distribuidor';

export interface Rubro {
  id: number;
  nombre: string;
  descripcion?: string;
  activo: boolean;
  fecha_creacion: string;
}

export interface Cliente {
  id: number;
  nombre: string;
  identificacion: string; // CUIT/DNI
  direccion: string;
  telefono: string;
  correo: string;
  // Campos adicionales que necesitaremos en el backend
  zona?: string;
  tipo?: ClienteTipo;
  limite_credito?: number;
  rubro?: number | null; // ID del rubro del negocio
  rubro_nombre?: string; // Nombre del rubro (solo lectura)
  activo?: boolean;
  deuda?: number;
  ultima_compra?: string;
  promedio_pedido?: number;
  fecha_creacion?: string;
  fecha_modificacion?: string;
  saldo?: number; // Calculado por el backend
}

export interface ClienteFilters {
  search?: string;
  zona?: string;
  tipo?: ClienteTipo | 'Todos';
  activo?: 'Todos' | 'Activos' | 'Inactivos';
  deuda_minima?: number;
  ultima_compra?: string;
}

// Tipos para operaciones específicas
export interface VentaRapidaItem {
  producto_id: string;
  producto_nombre: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

export interface VentaRapidaPayload {
  cliente_id: number;
  items: VentaRapidaItem[];
  metodo_pago: string;
  observaciones: string;
  total: number;
}

export interface CobroPayload {
  cliente_id: number;
  comprobantes: number[];
  monto: number;
  metodo: string;
}

export interface Comprobante {
  id: number;
  numero: string;
  pendiente: number;
}

export interface ProductoSugerido {
  id: string;
  nombre: string;
  precio: number;
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

// Tipos para exportación/importación
export interface ExportOptions {
  formato: 'excel' | 'csv';
  campos?: string[];
  filtros?: ClienteFilters;
}

export interface ImportResult {
  exitosos: number;
  errores: number;
  detalles: string[];
}

// Tipos para WhatsApp
export type WhatsAppTemplate = 'lista_precios' | 'estado_cuenta' | 'recordatorio_pago';

export interface WhatsAppPayload {
  cliente_id: number;
  template: WhatsAppTemplate;
  datos_adicionales?: Record<string, any>;
}

// Tipos para estado de cuenta
export interface EstadoCuenta {
  cliente: Cliente;
  facturas: Array<{
    id: number;
    numero: string;
    fecha: string;
    total: number;
    pendiente: number;
    estado: 'pendiente' | 'pagada' | 'vencida';
  }>;
  pagos: Array<{
    id: number;
    fecha: string;
    monto: number;
    metodo: string;
    referencia?: string;
  }>;
  resumen: {
    total_facturado: number;
    total_pagado: number;
    saldo_pendiente: number;
    facturas_vencidas: number;
  };
}