// SERVICIO PARA MÓDULO DE FINANZAS
import { API_CONFIG, getAuthHeaders } from '../config/api';

const API_BASE = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.FINANZAS}`.replace(/\/+$/, '');

// Tipos de datos
export interface PagoCliente {
  id?: number;
  fecha: string;
  cliente: number;
  cliente_nombre?: string;
  monto: number;
  medio: 'EFECTIVO' | 'TRANSFERENCIA' | 'CHEQUE';
  medio_display?: string;
  observacion?: string;
}

export interface MovimientoFinanciero {
  id?: number;
  fecha: string;
  tipo: 'INGRESO' | 'EGRESO';
  origen: 'MANUAL' | 'COMPRA' | 'VENTA' | 'PAGO_EMPLEADO';
  origen_display?: string;
  monto: number;
  descripcion: string;
  compra?: number;
  compra_id?: number;
  venta?: number;
  venta_id?: number;
  referencia_extra?: string;
}

export interface GastoManual {
  fecha?: string;
  monto: number;
  descripcion: string;
  origen?: 'MANUAL' | 'COMPRA' | 'VENTA' | 'PAGO_EMPLEADO';
}

export interface ResumenFinanciero {
  total_ventas: string;
  total_pagos: string;
  pendiente_cobro: string;
}

export interface EstadisticasFinancieras {
  total_ingresos: number;
  total_gastos: number;
  ganancia_neta: number;
  margen_utilidad: number;
  cuentas_por_cobrar: number;
  cuentas_por_pagar: number;
  transacciones_recientes: MovimientoFinanciero[];
}

// Filtros
export interface FiltrosMovimientos {
  tipo?: 'INGRESO' | 'EGRESO';
  origen?: string;
  fecha__gte?: string;
  fecha__lte?: string;
  page?: number;
  page_size?: number;
}

export interface FiltrosPagos {
  cliente?: number;
  medio?: string;
  fecha?: string;
  page?: number;
  page_size?: number;
}

export const financesService = {
  // PAGOS DE CLIENTES
  async getPagos(filtros?: FiltrosPagos): Promise<{ results: PagoCliente[]; count: number }> {
    const params = new URLSearchParams();
    if (filtros) {
      Object.entries(filtros).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    
    const url = `${API_BASE}/pagos/?${params}`;
    const response = await fetch(url, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Error al obtener pagos: ${response.statusText}`);
    }
    
    return response.json();
  },

  async getPago(id: number): Promise<PagoCliente> {
    const url = `${API_BASE}/pagos/${id}/`;
    const response = await fetch(url, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Error al obtener pago: ${response.statusText}`);
    }
    
    return response.json();
  },

  async crearPago(pago: Omit<PagoCliente, 'id'>): Promise<PagoCliente> {
    const url = `${API_BASE}/pagos/`;
    const response = await fetch(url, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(pago)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Error al crear pago: ${errorData.detail || response.statusText}`);
    }
    
    return response.json();
  },

  // MOVIMIENTOS FINANCIEROS
  async getMovimientos(filtros?: FiltrosMovimientos): Promise<{ results: MovimientoFinanciero[]; count: number }> {
    const params = new URLSearchParams();
    if (filtros) {
      Object.entries(filtros).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    
    const url = `${API_BASE}/movimientos/?${params}`;
    const response = await fetch(url, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Error al obtener movimientos: ${response.statusText}`);
    }
    
    return response.json();
  },

  async getIngresos(filtros?: FiltrosMovimientos): Promise<MovimientoFinanciero[]> {
    const params = new URLSearchParams();
    if (filtros) {
      Object.entries(filtros).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    
    const url = `${API_BASE}/movimientos/ingresos/?${params}`;
    const response = await fetch(url, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Error al obtener ingresos: ${response.statusText}`);
    }
    
    return response.json();
  },

  async getGastos(filtros?: FiltrosMovimientos): Promise<MovimientoFinanciero[]> {
    const params = new URLSearchParams();
    if (filtros) {
      Object.entries(filtros).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    
    const url = `${API_BASE}/movimientos/gastos/?${params}`;
    const response = await fetch(url, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Error al obtener gastos: ${response.statusText}`);
    }
    
    return response.json();
  },

  async registrarGasto(gasto: GastoManual): Promise<MovimientoFinanciero> {
    const url = `${API_BASE}/movimientos/registrar-gasto/`;
    const response = await fetch(url, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(gasto)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Error al registrar gasto: ${errorData.detail || response.statusText}`);
    }
    
    return response.json();
  },

  async getResumenPendiente(): Promise<ResumenFinanciero> {
    const url = `${API_BASE}/movimientos/resumen/pendiente/`;
    const response = await fetch(url, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Error al obtener resumen pendiente: ${response.statusText}`);
    }
    
    return response.json();
  },

  // ESTADÍSTICAS CONSOLIDADAS
  async getEstadisticasFinancieras(): Promise<EstadisticasFinancieras> {
    try {
      // Obtener datos de múltiples endpoints
      const [ingresos, gastos, resumenPendiente, movimientosRecientes] = await Promise.all([
        this.getIngresos({ page_size: 1000 }),
        this.getGastos({ page_size: 1000 }),
        this.getResumenPendiente(),
        this.getMovimientos({ page_size: 10 })
      ]);

      // Calcular totales
      const totalIngresos = ingresos.reduce((sum, ing) => sum + parseFloat(ing.monto.toString()), 0);
      const totalGastos = gastos.reduce((sum, gasto) => sum + parseFloat(gasto.monto.toString()), 0);
      const gananciaNeta = totalIngresos - totalGastos;
      const margenUtilidad = totalIngresos > 0 ? (gananciaNeta / totalIngresos) * 100 : 0;

      return {
        total_ingresos: totalIngresos,
        total_gastos: totalGastos,
        ganancia_neta: gananciaNeta,
        margen_utilidad: margenUtilidad,
        cuentas_por_cobrar: parseFloat(resumenPendiente.pendiente_cobro),
        cuentas_por_pagar: 0, // Se puede obtener de proveedores
        transacciones_recientes: movimientosRecientes.results || []
      };
    } catch (error) {
      console.error('Error al obtener estadísticas financieras:', error);
      throw error;
    }
  },

  // ANÁLISIS Y REPORTES
  async generarAnalisisFinanciero(): Promise<string> {
    try {
      const estadisticas = await this.getEstadisticasFinancieras();
      
      const analisis = `
🧮 ANÁLISIS FINANCIERO AUTOMÁTICO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📈 RESUMEN FINANCIERO:
• Total Ingresos: $${estadisticas.total_ingresos.toLocaleString()}
• Total Gastos: $${estadisticas.total_gastos.toLocaleString()}
• Utilidad Neta: $${estadisticas.ganancia_neta.toLocaleString()}
• Margen de Utilidad: ${estadisticas.margen_utilidad.toFixed(2)}%

💰 FLUJO DE EFECTIVO:
• Cuentas por Cobrar: $${estadisticas.cuentas_por_cobrar.toLocaleString()}
• Flujo Neto: $${(estadisticas.cuentas_por_cobrar - estadisticas.cuentas_por_pagar).toLocaleString()}

🎯 RECOMENDACIONES:
${estadisticas.ganancia_neta > 0 ? '✅ Excelente rentabilidad' : '⚠️ Revisar gastos operativos'}
${estadisticas.margen_utilidad > 20 ? '✅ Margen saludable' : '📊 Optimizar márgenes'}
${estadisticas.cuentas_por_cobrar > 0 ? '💸 Gestionar cobranzas pendientes' : '✅ Sin cuentas pendientes'}

📊 TRANSACCIONES RECIENTES:
${estadisticas.transacciones_recientes.slice(0, 5).map(t => 
  `• ${t.descripcion}: $${parseFloat(t.monto.toString()).toLocaleString()} (${t.tipo})`
).join('\n')}
      `;
      
      return analisis;
    } catch (error) {
      console.error('Error al generar análisis:', error);
      return 'Error al generar el análisis financiero. Verifique la conexión con el servidor.';
    }
  },

  async exportarReporte(): Promise<void> {
    try {
      const [estadisticas, ingresos, gastos, pagos] = await Promise.all([
        this.getEstadisticasFinancieras(),
        this.getIngresos({ page_size: 1000 }),
        this.getGastos({ page_size: 1000 }),
        this.getPagos({ page_size: 1000 })
      ]);

      const reportData = {
        fecha: new Date().toLocaleDateString(),
        estadisticas: {
          total_ingresos: estadisticas.total_ingresos,
          total_gastos: estadisticas.total_gastos,
          ganancia_neta: estadisticas.ganancia_neta,
          margen_utilidad: estadisticas.margen_utilidad,
          cuentas_por_cobrar: estadisticas.cuentas_por_cobrar
        },
        ingresos: ingresos,
        gastos: gastos,
        pagos: pagos.results,
        transacciones_recientes: estadisticas.transacciones_recientes
      };
      
      const dataStr = JSON.stringify(reportData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `reporte-financiero-${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      alert('📊 ¡Reporte financiero exportado exitosamente con datos reales!');
    } catch (error) {
      console.error('Error al exportar reporte:', error);
      alert('❌ Error al exportar el reporte. Verifique la conexión con el servidor.');
    }
  }
};

export default financesService;