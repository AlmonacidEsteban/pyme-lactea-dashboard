import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { CustomModal } from "../ui/CustomModal";
// Removed AlertDialog import - using CustomModal instead
import { toast } from "sonner";
import { 
  Shield, 
  Users, 
  Settings,
  Eye,
  Plus,
  Loader2
} from "lucide-react";
import { RolesList } from './RolesList';
import { RolForm } from './RolForm';
import { rrhhService } from '../../services/rrhhService';
import { 
  RolList, 
  Rol, 
  RolFilters, 
  CreateRolData, 
  UpdateRolData 
} from '../../types/rrhh';

export function RolesManagement() {
  const [roles, setRoles] = useState<RolList[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRol, setSelectedRol] = useState<RolList | null>(null);
  const [rolToEdit, setRolToEdit] = useState<Rol | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filters, setFilters] = useState<RolFilters>({});

  // Estadísticas de roles
  const [stats, setStats] = useState({
    total: 0,
    activos: 0,
    inactivos: 0,
    conPermisos: 0
  });

  useEffect(() => {
    loadRoles();
  }, [filters]);

  useEffect(() => {
    calculateStats();
  }, [roles]);

  const loadRoles = async () => {
    try {
      setIsLoading(true);
      const response = await rrhhService.getRoles(filters);
      setRoles(response.results);
    } catch (error) {
      console.error('Error al cargar roles:', error);
      toast.error('Error al cargar los roles');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = () => {
    const newStats = {
      total: roles.length,
      activos: roles.filter(r => r.activo).length,
      inactivos: roles.filter(r => !r.activo).length,
      conPermisos: roles.filter(r => r.permisos && r.permisos.length > 0).length
    };
    setStats(newStats);
  };

  const handleCreateRol = () => {
    setRolToEdit(null);
    setIsFormOpen(true);
  };

  const handleEditRol = async (rol: RolList) => {
    try {
      const rolCompleto = await rrhhService.getRol(rol.id);
      setRolToEdit(rolCompleto);
      setIsFormOpen(true);
    } catch (error) {
      console.error('Error al cargar rol:', error);
      toast.error('Error al cargar los datos del rol');
    }
  };

  const handleDeleteRol = (rol: RolList) => {
    setSelectedRol(rol);
    setIsDeleteDialogOpen(true);
  };

  const handleViewRol = (rol: RolList) => {
    // TODO: Implementar vista detallada del rol
    toast.info('Vista detallada próximamente disponible');
  };

  const handleFormSubmit = async (data: CreateRolData | UpdateRolData) => {
    try {
      setIsSubmitting(true);
      
      if ('id' in data) {
        // Actualizar rol existente
        await rrhhService.updateRol(data.id, data);
        toast.success('Rol actualizado exitosamente');
      } else {
        // Crear nuevo rol
        await rrhhService.createRol(data);
        toast.success('Rol creado exitosamente');
      }
      
      setIsFormOpen(false);
      setRolToEdit(null);
      await loadRoles();
    } catch (error) {
      console.error('Error al guardar rol:', error);
      toast.error('Error al guardar el rol');
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedRol) return;

    try {
      await rrhhService.deleteRol(selectedRol.id);
      toast.success('Rol eliminado exitosamente');
      setIsDeleteDialogOpen(false);
      setSelectedRol(null);
      await loadRoles();
    } catch (error) {
      console.error('Error al eliminar rol:', error);
      toast.error('Error al eliminar el rol');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Gestión de Roles y Permisos</h1>
          <p className="text-muted-foreground">
            Administra los roles y permisos del sistema para controlar el acceso de los usuarios.
          </p>
        </div>
        <Button onClick={handleCreateRol} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nuevo Rol
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Roles</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Shield className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Roles Activos</p>
                <p className="text-2xl font-bold text-green-600">{stats.activos}</p>
              </div>
              <Users className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Roles Inactivos</p>
                <p className="text-2xl font-bold text-red-600">{stats.inactivos}</p>
              </div>
              <Eye className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Con Permisos</p>
                <p className="text-2xl font-bold">{stats.conPermisos}</p>
              </div>
              <Settings className="w-8 h-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de roles */}
      <RolesList
        roles={roles}
        isLoading={isLoading}
        onCreateRol={handleCreateRol}
        onEditRol={handleEditRol}
        onDeleteRol={handleDeleteRol}
        onViewRol={handleViewRol}
        onFiltersChange={setFilters}
      />

      {/* Modal para formulario */}
      <CustomModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={rolToEdit ? 'Editar Rol' : 'Crear Nuevo Rol'}
        description={rolToEdit ? 'Modifica los datos del rol seleccionado.' : 'Completa la información para crear un nuevo rol.'}
        size="xl"
      >
        <RolForm
          rol={rolToEdit || undefined}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setIsFormOpen(false);
            setRolToEdit(null);
          }}
          isLoading={isSubmitting}
        />
      </CustomModal>

      {/* Modal de confirmación para eliminar */}
      <CustomModal
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        title="¿Estás seguro?"
        description={`Esta acción no se puede deshacer. Se eliminará permanentemente el rol "${selectedRol?.nombre}" y se removerá de todos los empleados que lo tengan asignado.`}
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