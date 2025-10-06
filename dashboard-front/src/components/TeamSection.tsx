import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { CustomModal } from "./ui/CustomModal";
// Removed AlertDialog import - using CustomModal instead
import { toast } from "sonner";
import { 
  Users, 
  Plus,
  Factory,
  Truck,
  UserCheck,
  ShoppingCart,
  Loader2
} from "lucide-react";
import { EquiposList } from './rrhh/EquiposList';
import { EquipoForm } from './rrhh/EquipoForm';
import { rrhhService } from '../services/rrhhService';
import { 
  EquipoList, 
  Equipo, 
  EquipoFilters, 
  CreateEquipoData, 
  UpdateEquipoData 
} from '../types/rrhh';

export function TeamSection() {
  const [equipos, setEquipos] = useState<EquipoList[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEquipo, setSelectedEquipo] = useState<EquipoList | null>(null);
  const [equipoToEdit, setEquipoToEdit] = useState<Equipo | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filters, setFilters] = useState<EquipoFilters>({});

  // Estadísticas de equipos
  const [stats, setStats] = useState({
    total: 0,
    activos: 0,
    produccion: 0,
    logistica: 0,
    administracion: 0,
    ventas: 0,
    otros: 0
  });

  useEffect(() => {
    loadEquipos();
  }, [filters]);

  useEffect(() => {
    calculateStats();
  }, [equipos]);

  const loadEquipos = async () => {
    try {
      setIsLoading(true);
      const response = await rrhhService.getEquipos(filters);
      setEquipos(response.results);
    } catch (error) {
      console.error('Error al cargar equipos:', error);
      toast.error('Error al cargar los equipos');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = () => {
    const newStats = {
      total: equipos.length,
      activos: equipos.filter(e => e.activo).length,
      produccion: equipos.filter(e => e.tipo === 'produccion').length,
      logistica: equipos.filter(e => e.tipo === 'logistica').length,
      administracion: equipos.filter(e => e.tipo === 'administracion').length,
      ventas: equipos.filter(e => e.tipo === 'ventas').length,
      otros: equipos.filter(e => e.tipo === 'otro').length,
    };
    setStats(newStats);
  };

  const handleCreateEquipo = () => {
    setEquipoToEdit(null);
    setIsFormOpen(true);
  };

  const handleEditEquipo = async (equipo: EquipoList) => {
    try {
      const equipoCompleto = await rrhhService.getEquipo(equipo.id);
      setEquipoToEdit(equipoCompleto);
      setIsFormOpen(true);
    } catch (error) {
      console.error('Error al cargar equipo:', error);
      toast.error('Error al cargar los datos del equipo');
    }
  };

  const handleDeleteEquipo = (equipo: EquipoList) => {
    setSelectedEquipo(equipo);
    setIsDeleteDialogOpen(true);
  };

  const handleViewEquipo = (equipo: EquipoList) => {
    // TODO: Implementar vista detallada del equipo
    toast.info('Vista detallada próximamente disponible');
  };

  const handleFormSubmit = async (data: CreateEquipoData | UpdateEquipoData) => {
    try {
      setIsSubmitting(true);
      
      if ('id' in data) {
        // Actualizar equipo existente
        await rrhhService.updateEquipo(data.id, data);
        toast.success('Equipo actualizado exitosamente');
      } else {
        // Crear nuevo equipo
        await rrhhService.createEquipo(data);
        toast.success('Equipo creado exitosamente');
      }
      
      setIsFormOpen(false);
      setEquipoToEdit(null);
      await loadEquipos();
    } catch (error) {
      console.error('Error al guardar equipo:', error);
      toast.error('Error al guardar el equipo');
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedEquipo) return;

    try {
      await rrhhService.deleteEquipo(selectedEquipo.id);
      toast.success('Equipo eliminado exitosamente');
      setIsDeleteDialogOpen(false);
      setSelectedEquipo(null);
      await loadEquipos();
    } catch (error) {
      console.error('Error al eliminar equipo:', error);
      toast.error('Error al eliminar el equipo');
    }
  };

  const departmentStats = [
    { 
      name: "Producción", 
      count: stats.produccion, 
      color: "bg-blue-100 text-blue-800", 
      icon: Factory 
    },
    { 
      name: "Logística", 
      count: stats.logistica, 
      color: "bg-green-100 text-green-800", 
      icon: Truck 
    },
    { 
      name: "Administración", 
      count: stats.administracion, 
      color: "bg-purple-100 text-purple-800", 
      icon: UserCheck 
    },
    { 
      name: "Ventas", 
      count: stats.ventas, 
      color: "bg-orange-100 text-orange-800", 
      icon: ShoppingCart 
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Gestión de Equipos</h1>
          <p className="text-muted-foreground">
            Administra los equipos de trabajo de tu empresa de manera eficiente.
          </p>
        </div>
        <Button onClick={handleCreateEquipo} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nuevo Equipo
        </Button>
      </div>

      {/* Estadísticas generales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Equipos</p>
                <p className="text-2xl font-bold">{stats.total}</p>
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
                <p className="text-2xl font-bold text-green-600">{stats.activos}</p>
              </div>
              <UserCheck className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        {departmentStats.slice(0, 2).map((dept) => {
          const IconComponent = dept.icon;
          return (
            <Card key={dept.name}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{dept.name}</p>
                    <p className="text-2xl font-bold">{dept.count}</p>
                  </div>
                  <IconComponent className="w-8 h-8 text-gray-500" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Estadísticas por departamento */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {departmentStats.map((dept) => {
          const IconComponent = dept.icon;
          return (
            <Card key={dept.name}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <IconComponent className="w-5 h-5" />
                      <h3 className="font-medium">{dept.name}</h3>
                    </div>
                    <p className="text-2xl font-bold">{dept.count}</p>
                    <p className="text-xs text-muted-foreground">
                      {dept.count === 1 ? 'equipo' : 'equipos'}
                    </p>
                  </div>
                  <div className={`w-3 h-12 rounded ${dept.color}`}></div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Lista de equipos */}
      <EquiposList
        equipos={equipos}
        isLoading={isLoading}
        onCreateEquipo={handleCreateEquipo}
        onEditEquipo={handleEditEquipo}
        onDeleteEquipo={handleDeleteEquipo}
        onViewEquipo={handleViewEquipo}
        onFiltersChange={setFilters}
      />

      {/* Modal para formulario */}
      <CustomModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={equipoToEdit ? 'Editar Equipo' : 'Crear Nuevo Equipo'}
        size="xl"
      >
        <EquipoForm
          equipo={equipoToEdit || undefined}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setIsFormOpen(false);
            setEquipoToEdit(null);
          }}
          isLoading={isSubmitting}
        />
      </CustomModal>

      {/* Modal de confirmación para eliminar */}
      <CustomModal
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        title="¿Estás seguro?"
        description={`Esta acción no se puede deshacer. Se eliminará permanentemente el equipo "${selectedEquipo?.nombre}" y se removerá la asignación de todos sus miembros.`}
      >
        <div className="flex justify-end gap-3 mt-6">
          <Button
            variant="outline"
            onClick={() => setIsDeleteDialogOpen(false)}
          >
            Cancelar
          </Button>
          <Button
            onClick={confirmDelete}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Eliminar
          </Button>
        </div>
      </CustomModal>
    </div>
  );
}