import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { LoadingOverlay } from "@/components/ui/LoadingOverlay";
import { Users, Plus, Edit, Trash2 } from 'lucide-react';
import { rrhhService } from '../../services/rrhhService';
import { Equipo, EquipoList, CreateEquipoData, UpdateEquipoData } from '../../types/rrhh';
import { EquipoForm } from './EquipoForm';
import { EmpleadoModal } from './EmpleadoModal';

export const EquiposSection: React.FC = () => {
  const [equipos, setEquipos] = useState<EquipoList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogState, setDialogState] = useState({
    isOpen: false,
    selectedEquipo: null as any,
    isSubmitting: false
  });
  const [empleadoModalState, setEmpleadoModalState] = useState({
    isOpen: false,
    equipoId: null as number | null
  });undefined>(undefined);

  useEffect(() => {
    loadEquipos();
  }, []);

  const loadEquipos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Cargando equipos...');
      const response = await rrhhService.getEquipos();
      console.log('Respuesta de equipos:', response);
      
      // Asegurar que tenemos un array válido
      const equiposData = Array.isArray(response.results) ? response.results : [];
      setEquipos(equiposData);
    } catch (err) {
      console.error('Error loading equipos:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar equipos');
      // En caso de error, mantener el estado actual en lugar de limpiarlo
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCreateEquipo = useCallback(() => {
    setDialogState({
      isOpen: true,
      selectedEquipo: null,
      isSubmitting: false
    });
  }, []);

  const handleEditEquipo = useCallback((equipo: any) => {
    setDialogState({
      isOpen: true,
      selectedEquipo: equipo,
      isSubmitting: false
    });
  }, []);

  const handleSubmitEquipo = useCallback(async (data: any) => {
    if (dialogState.isSubmitting) {
      return;
    }

    try {
      setDialogState(prev => ({ ...prev, isSubmitting: true }));
      setError(null);
      
      if (dialogState.selectedEquipo) {
        await rrhhService.updateEquipo(dialogState.selectedEquipo.id, data);
      } else {
        await rrhhService.createEquipo(data);
      }

      await loadEquipos();
      setDialogState({
        isOpen: false,
        selectedEquipo: null,
        isSubmitting: false
      });
    } catch (error) {
      console.error('Error al guardar equipo:', error);
      setError(error instanceof Error ? error.message : 'Error al guardar el equipo');
      setDialogState(prev => ({ ...prev, isSubmitting: false }));
    }
  }, [dialogState.selectedEquipo, dialogState.isSubmitting, loadEquipos]);

  const handleCancelForm = useCallback(() => {
    setDialogState({
      isOpen: false,
      selectedEquipo: null,
      isSubmitting: false
    });
  }, []);

  const handleDeleteEquipo = async (equipoId: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este equipo?')) {
      try {
        await rrhhService.deleteEquipo(equipoId);
        await loadEquipos(); // Recargar la lista
      } catch (err) {
        console.error('Error al eliminar equipo:', err);
        setError(err instanceof Error ? err.message : 'Error al eliminar equipo');
      }
    }
  };

  // Estado para recordar el modal principal cuando se abre el modal de empleado
  const [previousDialogState, setPreviousDialogState] = useState<typeof dialogState | null>(null);

  const handleOpenEmpleadoModal = useCallback((equipoId?: number) => {
    // Guardar el estado actual del modal principal
    setPreviousDialogState(dialogState);
    
    // Cerrar el modal principal temporalmente
    setDialogState({
      isOpen: false,
      selectedEquipo: null,
      isSubmitting: false
    });
    
    // Abrir el modal de empleado
    setEmpleadoModalState({
      isOpen: true,
      equipoId: equipoId || null
    });
  }, [dialogState]);

  const handleCloseEmpleadoModal = useCallback(() => {
    setEmpleadoModalState({
      isOpen: false,
      equipoId: null
    });
    
    // Restaurar el modal principal si estaba abierto
    if (previousDialogState && previousDialogState.isOpen) {
      setDialogState(previousDialogState);
    }
    setPreviousDialogState(null);
  }, [previousDialogState]);

  const handleEmpleadoCreated = useCallback(async () => {
    setEmpleadoModalState({
      isOpen: false,
      equipoId: null
    });
    
    // Recargar la lista de equipos para actualizar los miembros
    await loadEquipos();
    
    // Restaurar el modal principal si estaba abierto
    if (previousDialogState && previousDialogState.isOpen) {
      setDialogState(previousDialogState);
    }
    setPreviousDialogState(null);
  }, [loadEquipos, previousDialogState]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando equipos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium">Error</h3>
          <p className="text-red-600 mt-1">{error}</p>
          <Button 
            onClick={loadEquipos} 
            variant="outline" 
            size="sm" 
            className="mt-3"
          >
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Loading Overlay */}
      <LoadingOverlay 
        isVisible={dialogState.isSubmitting} 
        message="Guardando equipo..." 
      />
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Equipos</h2>
          <p className="text-gray-600 mt-1">Administra los equipos de trabajo de tu organización</p>
        </div>
        <Button onClick={handleCreateEquipo} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Equipo
        </Button>
      </div>

      {/* Stats Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Estadísticas de Equipos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{equipos.length}</div>
              <p className="text-sm text-gray-600">Total Equipos</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {equipos.filter(e => e.activo).length}
              </div>
              <p className="text-sm text-gray-600">Equipos Activos</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {equipos.reduce((total, equipo) => total + equipo.total_miembros, 0)}
              </div>
              <p className="text-sm text-gray-600">Total Miembros</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Teams List */}
      {equipos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {equipos.map((equipo) => (
            <Card key={equipo.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{equipo.nombre}</CardTitle>
                    <CardDescription className="mt-1">
                      {equipo.descripcion || 'Sin descripción'}
                    </CardDescription>
                  </div>
                  <Badge variant={equipo.activo ? "default" : "secondary"}>
                    {equipo.activo ? 'Activo' : 'Inactivo'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Miembros:</span>
                    <span className="font-medium">{equipo.total_miembros}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Líder:</span>
                    <span className="font-medium">
                      {equipo.lider ? `${equipo.lider.nombre} ${equipo.lider.apellido}` : 'Sin asignar'}
                    </span>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleEditEquipo(equipo)}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDeleteEquipo(equipo.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay equipos registrados</h3>
            <p className="text-gray-600 mb-4">Comienza creando tu primer equipo de trabajo</p>
            <Button onClick={handleCreateEquipo}>
              <Plus className="h-4 w-4 mr-2" />
              Crear Primer Equipo
            </Button>
          </CardContent>
        </Card>
      )}

        {/* Modal para crear/editar equipo */}
        <Dialog 
          open={dialogState.isOpen} 
          onOpenChange={(open) => { 
            if (!open) handleCancelForm(); 
          }} 
        > 
          <DialogContent className="max-w-2xl"> 
            <DialogHeader> 
              <DialogTitle>{dialogState.selectedEquipo ? "Editar Equipo" : "Crear Nuevo Equipo"}</DialogTitle> 
              <DialogDescription> 
                {dialogState.selectedEquipo 
                  ? "Modifica los datos del equipo seleccionado." 
                  : "Completa la información para crear un nuevo equipo de trabajo."} 
              </DialogDescription> 
            </DialogHeader> 
 
            <EquipoForm 
              key={dialogState.selectedEquipo ? `edit-${dialogState.selectedEquipo.id}` : "create"} 
              equipo={dialogState.selectedEquipo} 
              onSubmit={handleSubmitEquipo} 
              onCancel={handleCancelForm} 
              isLoading={dialogState.isSubmitting} 
              onOpenEmpleadoModal={handleOpenEmpleadoModal} 
            /> 
          </DialogContent> 
        </Dialog>

        {/* Modal para crear empleados - Separado para evitar anidación */}
        {empleadoModalState.isOpen && (
          <EmpleadoModal
            isOpen={empleadoModalState.isOpen}
            onClose={handleCloseEmpleadoModal}
            onEmpleadoCreated={handleEmpleadoCreated}
            equipoId={empleadoModalState.equipoId}
          />
        )}
      </div>
    );
  };