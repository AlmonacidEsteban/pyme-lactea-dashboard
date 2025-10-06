import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from "../ui/badge";
import { 
  Users, 
  Shield, 
  Activity,
  Plus,
  BarChart3,
  Settings,
  UserCheck,
  Clock
} from "lucide-react";
import { EquiposSection } from './EquiposSection';
import { RolesManagement } from './RolesManagement';
import { AuditoriaManagement } from './AuditoriaManagement';

export function RRHHDashboard() {
  const [activeTab, setActiveTab] = useState('equipos');

  // Estadísticas simuladas - en producción vendrían del backend
  const stats = {
    totalEmpleados: 47,
    equiposActivos: 8,
    rolesDefinidos: 12,
    cambiosHoy: 5
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Recursos Humanos</h1>
            <p className="text-muted-foreground">
              Gestiona equipos, empleados, roles y permisos de tu organización.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Última actualización: hace 2 min
            </Badge>
          </div>
        </div>

        {/* Estadísticas generales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Empleados</p>
                  <p className="text-2xl font-bold">{stats.totalEmpleados}</p>
                  <p className="text-xs text-green-600">+3 este mes</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Equipos Activos</p>
                  <p className="text-2xl font-bold">{stats.equiposActivos}</p>
                  <p className="text-xs text-blue-600">2 departamentos</p>
                </div>
                <UserCheck className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Roles Definidos</p>
                  <p className="text-2xl font-bold">{stats.rolesDefinidos}</p>
                  <p className="text-xs text-purple-600">5 categorías</p>
                </div>
                <Shield className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Cambios Hoy</p>
                  <p className="text-2xl font-bold">{stats.cambiosHoy}</p>
                  <p className="text-xs text-orange-600">Ver auditoría</p>
                </div>
                <Activity className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navegación principal */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="equipos" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Gestión de Equipos
            </TabsTrigger>
            <TabsTrigger value="roles" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Roles y Permisos
            </TabsTrigger>
            <TabsTrigger value="auditoria" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Auditoría
            </TabsTrigger>
          </TabsList>

          <TabsContent value="equipos" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Gestión de Equipos</h2>
                <p className="text-sm text-muted-foreground">
                  Administra los equipos de trabajo y sus miembros
                </p>
              </div>
            </div>
            <EquiposSection />
          </TabsContent>

          <TabsContent value="roles" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Roles y Permisos</h2>
                <p className="text-sm text-muted-foreground">
                  Define roles y gestiona permisos del sistema
                </p>
              </div>
            </div>
            <RolesManagement />
          </TabsContent>

          <TabsContent value="auditoria" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Auditoría y Historial</h2>
                <p className="text-sm text-muted-foreground">
                  Revisa el historial de cambios y actividad del sistema
                </p>
              </div>
            </div>
            <AuditoriaManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}