import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from "../ui/badge";
import { 
  Activity, 
  Users, 
  User,
  Download,
  Calendar,
  BarChart3
} from "lucide-react";
import { AuditoriaView } from './AuditoriaView';

export function AuditoriaManagement() {
  const [activeTab, setActiveTab] = useState('equipos');

  const exportarTodo = () => {
    // TODO: Implementar exportación completa
    console.log('Exportar toda la auditoría');
  };

  const generarReporte = () => {
    // TODO: Implementar generación de reportes
    console.log('Generar reporte de auditoría');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Auditoría y Historial</h1>
          <p className="text-muted-foreground">
            Revisa el historial completo de cambios en equipos y empleados del sistema.
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={generarReporte} variant="outline" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Generar Reporte
          </Button>
          <Button onClick={exportarTodo} className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Exportar Todo
          </Button>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Registros</p>
                <p className="text-2xl font-bold">1,247</p>
              </div>
              <Activity className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Hoy</p>
                <p className="text-2xl font-bold text-green-600">23</p>
              </div>
              <Calendar className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Esta Semana</p>
                <p className="text-2xl font-bold">156</p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Este Mes</p>
                <p className="text-2xl font-bold">892</p>
              </div>
              <Activity className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pestañas de auditoría */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="equipos" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Auditoría de Equipos
          </TabsTrigger>
          <TabsTrigger value="empleados" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Auditoría de Empleados
          </TabsTrigger>
        </TabsList>

        <TabsContent value="equipos" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline">Equipos</Badge>
              <span className="text-sm text-muted-foreground">
                Historial de cambios en equipos de trabajo
              </span>
            </div>
          </div>
          <AuditoriaView tipo="equipos" />
        </TabsContent>

        <TabsContent value="empleados" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline">Empleados</Badge>
              <span className="text-sm text-muted-foreground">
                Historial de cambios en empleados
              </span>
            </div>
          </div>
          <AuditoriaView tipo="empleados" />
        </TabsContent>
      </Tabs>
    </div>
  );
}