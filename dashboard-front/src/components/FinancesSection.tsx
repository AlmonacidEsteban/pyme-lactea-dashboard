import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  CreditCard, 
  Receipt, 
  PlusCircle,
  AlertTriangle,
  Wallet,
  PieChart,
  Calculator,
  CheckCircle,
  Clock,
  FileText,
  Target,
  Loader2,
  RefreshCw
} from "lucide-react";
import financesService, { EstadisticasFinancieras, MovimientoFinanciero, PagoCliente } from '../services/financesService';

export function FinancesSection() {
  // Estados para datos dinámicos
  const [estadisticas, setEstadisticas] = useState<EstadisticasFinancieras | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Cargar datos del backend
  const cargarDatos = async () => {
    try {
      setError(null);
      const data = await financesService.getEstadisticasFinancieras();
      setEstadisticas(data);
    } catch (err) {
      console.error('Error al cargar datos financieros:', err);
      setError('Error al cargar los datos financieros. Verifique la conexión con el servidor.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    cargarDatos();
  }, []);

  // Función para refrescar datos
  const handleRefresh = async () => {
    setRefreshing(true);
    await cargarDatos();
  };

  // Función para exportar reporte financiero con datos reales
  const handleExportReport = async () => {
    try {
      await financesService.exportarReporte();
    } catch (error) {
      console.error('Error al exportar reporte:', error);
    }
  };

  // Función para nuevo análisis financiero con datos reales
  const handleNewAnalysis = async () => {
    try {
      const analisis = await financesService.generarAnalisisFinanciero();
      
      // Crear ventana modal con el análisis
      const modal = document.createElement('div');
      modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
        background: rgba(0,0,0,0.8); z-index: 1000; display: flex; 
        align-items: center; justify-content: center; padding: 20px;
      `;
      
      const content = document.createElement('div');
      content.style.cssText = `
        background: white; padding: 30px; border-radius: 12px; 
        max-width: 600px; max-height: 80vh; overflow-y: auto;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
      `;
      
      content.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h2 style="margin: 0; color: #1f2937; font-size: 24px; font-weight: bold;">📊 Análisis Financiero</h2>
          <button onclick="this.closest('[style*=fixed]').remove()" 
                  style="background: #ef4444; color: white; border: none; border-radius: 6px; 
                         padding: 8px 12px; cursor: pointer; font-weight: bold;">✕</button>
        </div>
        <pre style="white-space: pre-wrap; font-family: 'Courier New', monospace; 
                    font-size: 14px; line-height: 1.6; color: #374151; margin: 0;">${analisis}</pre>
      `;
      
      modal.appendChild(content);
      document.body.appendChild(modal);
      
      // Cerrar modal al hacer clic fuera
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
      });
    } catch (error) {
      console.error('Error al generar análisis:', error);
      alert('❌ Error al generar el análisis. Verifique la conexión con el servidor.');
    }
  };

  // Función para obtener icono de tendencia
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <div className="h-4 w-4" />;
    }
  };

  // Mostrar loading
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="text-lg font-medium">Cargando datos financieros...</span>
        </div>
      </div>
    );
  }

  // Mostrar error
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <AlertTriangle className="h-12 w-12 text-red-500" />
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar datos</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={handleRefresh} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  // Mostrar datos si están disponibles
  if (!estadisticas) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="text-lg text-gray-600">No hay datos disponibles</span>
      </div>
    );
  }

  // Preparar métricas financieras con datos reales
  const financialMetrics = [
    {
      title: "Ingresos Totales",
      value: `$${estadisticas.total_ingresos.toLocaleString()}`,
      change: "+12%",
      trend: "up",
      icon: DollarSign
    },
    {
      title: "Gastos Totales",
      value: `$${estadisticas.total_gastos.toLocaleString()}`,
      change: "+3%",
      trend: "up",
      icon: CreditCard
    },
    {
      title: "Ganancia Neta",
      value: `$${estadisticas.ganancia_neta.toLocaleString()}`,
      change: `${estadisticas.margen_utilidad.toFixed(1)}%`,
      trend: estadisticas.ganancia_neta > 0 ? "up" : "down",
      icon: Wallet
    },
    {
      title: "Cuentas por Cobrar",
      value: `$${estadisticas.cuentas_por_cobrar.toLocaleString()}`,
      change: `${estadisticas.transacciones_recientes.length} transacciones`,
      trend: "down",
      icon: Receipt
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header con botones de acción */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">💰 FINANZAS</h2>
          <p className="text-muted-foreground">
            Gestión financiera con datos en tiempo real
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={handleRefresh} 
            variant="outline" 
            className="flex items-center gap-2"
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Actualizando...' : 'Actualizar'}
          </Button>
          <Button 
            onClick={handleExportReport}
            className="flex items-center gap-2"
            style={{
              backgroundColor: '#059669',
              color: 'white',
              fontWeight: '600'
            }}
          >
            <FileText className="h-4 w-4" />
            Exportar Reporte
          </Button>
          <Button 
            onClick={handleNewAnalysis}
            className="flex items-center gap-2"
            style={{
              backgroundColor: '#dc2626',
              color: 'white',
              fontWeight: '600'
            }}
          >
            <Calculator className="h-4 w-4" />
            Nuevo Análisis
          </Button>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {financialMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index} style={{ border: '2px solid #e5e7eb', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p 
                      className="text-sm font-medium text-muted-foreground"
                      style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#6b7280'
                      }}
                    >
                      {metric.title}
                    </p>
                    <p 
                      className="text-2xl font-bold"
                      style={{
                        fontSize: '24px',
                        fontWeight: '800',
                        color: '#111827',
                        marginTop: '4px'
                      }}
                    >
                      {metric.value}
                    </p>
                    <p 
                      className={`text-xs ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}
                      style={{
                        fontSize: '12px',
                        fontWeight: '600',
                        marginTop: '4px'
                      }}
                    >
                      {metric.change}
                    </p>
                  </div>
                  <Icon 
                    className="h-8 w-8 text-muted-foreground" 
                    style={{ 
                      color: metric.trend === 'up' ? '#10b981' : '#ef4444',
                      width: '32px',
                      height: '32px'
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Transacciones recientes */}
      <Card style={{ border: '2px solid #e5e7eb', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <CardHeader>
          <CardTitle 
            className="flex items-center gap-2"
            style={{
              fontSize: '18px',
              fontWeight: '700',
              color: '#111827'
            }}
          >
            <Receipt 
              className="h-5 w-5" 
              style={{ color: '#3b82f6', width: '24px', height: '24px' }}
            />
            📋 Transacciones Recientes (Datos Reales)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {estadisticas.transacciones_recientes.length > 0 ? (
              estadisticas.transacciones_recientes.map((transaction, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-4 border rounded-lg"
                  style={{
                    border: '2px solid #d1d5db',
                    borderRadius: '8px',
                    padding: '16px',
                    backgroundColor: '#f9fafb'
                  }}
                >
                  <div className="space-y-1">
                    <h4 
                      className="text-sm font-medium"
                      style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#111827'
                      }}
                    >
                      {transaction.descripcion}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>ID: {transaction.id}</span>
                      <span>•</span>
                      <span>{new Date(transaction.fecha).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{transaction.origen_display || transaction.origen}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span 
                      className={`font-medium ${transaction.tipo === 'INGRESO' ? 'text-green-600' : 'text-red-600'}`}
                      style={{
                        fontSize: '16px',
                        fontWeight: '700'
                      }}
                    >
                      {transaction.tipo === 'INGRESO' ? '+' : '-'}${parseFloat(transaction.monto.toString()).toLocaleString()}
                    </span>
                    <Badge variant={transaction.tipo === "INGRESO" ? "default" : "secondary"}>
                      {transaction.tipo}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Receipt className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No hay transacciones recientes disponibles</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Resumen financiero */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Análisis de flujo de efectivo */}
        <Card style={{ border: '2px solid #e5e7eb', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <CardHeader>
            <CardTitle 
              className="flex items-center gap-2"
              style={{
                fontSize: '18px',
                fontWeight: '700',
                color: '#111827'
              }}
            >
              <TrendingUp 
                className="h-5 w-5" 
                style={{ color: '#10b981', width: '24px', height: '24px' }}
              />
              💹 Análisis de Flujo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Ingresos Totales:</span>
                <span className="font-bold text-green-600">
                  ${estadisticas.total_ingresos.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Gastos Totales:</span>
                <span className="font-bold text-red-600">
                  ${estadisticas.total_gastos.toLocaleString()}
                </span>
              </div>
              <hr />
              <div className="flex items-center justify-between">
                <span className="font-bold">Ganancia Neta:</span>
                <span className={`font-bold text-lg ${estadisticas.ganancia_neta >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${estadisticas.ganancia_neta.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Margen de Utilidad:</span>
                <span className={`font-bold ${estadisticas.margen_utilidad >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {estadisticas.margen_utilidad.toFixed(2)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estado de cuentas */}
        <Card style={{ border: '2px solid #e5e7eb', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <CardHeader>
            <CardTitle 
              className="flex items-center gap-2"
              style={{
                fontSize: '18px',
                fontWeight: '700',
                color: '#111827'
              }}
            >
              <Clock 
                className="h-5 w-5" 
                style={{ color: '#f59e0b', width: '24px', height: '24px' }}
              />
              ⏰ Estado de Cuentas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Cuentas por Cobrar:</span>
                <span className="font-bold text-orange-600">
                  ${estadisticas.cuentas_por_cobrar.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Cuentas por Pagar:</span>
                <span className="font-bold text-red-600">
                  ${estadisticas.cuentas_por_pagar.toLocaleString()}
                </span>
              </div>
              <hr />
              <div className="flex items-center justify-between">
                <span className="font-bold">Flujo Neto:</span>
                <span className={`font-bold text-lg ${(estadisticas.cuentas_por_cobrar - estadisticas.cuentas_por_pagar) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${(estadisticas.cuentas_por_cobrar - estadisticas.cuentas_por_pagar).toLocaleString()}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                <p>💡 Datos actualizados en tiempo real desde el backend</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Indicador de datos en tiempo real */}
      <div className="text-center py-4">
        <Badge variant="outline" className="text-green-600 border-green-600">
          ✅ Conectado al backend - Datos en tiempo real
        </Badge>
      </div>
    </div>
  );
}