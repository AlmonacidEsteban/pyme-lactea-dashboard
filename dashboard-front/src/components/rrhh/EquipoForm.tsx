import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Switch } from '../ui/switch';
import { Checkbox } from '../ui/checkbox';
import { X, Users, UserCheck, UserPlus } from 'lucide-react';
import { CreateEquipoData, UpdateEquipoData, Equipo, Empleado } from '../../types/rrhh';
import { rrhhService } from '../../services/rrhhService';

interface EquipoFormProps {
  equipo?: Equipo;
  onSubmit: (data: CreateEquipoData | UpdateEquipoData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  onOpenEmpleadoModal: (equipoId?: number) => void;
}

const tiposEquipo = [
  { value: 'produccion', label: 'Producción' },
  { value: 'logistica', label: 'Logística' },
  { value: 'administracion', label: 'Administración' },
  { value: 'ventas', label: 'Ventas' },
  { value: 'calidad', label: 'Control de Calidad' },
  { value: 'mantenimiento', label: 'Mantenimiento' },
];

export function EquipoForm({ equipo, onSubmit, onCancel, isLoading = false, onOpenEmpleadoModal }: EquipoFormProps) {
  const [formData, setFormData] = useState<CreateEquipoData>({
    nombre: '',
    descripcion: '',
    tipo: 'produccion',
    activo: true,
    lider_id: null,
    miembros_ids: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [loadingEmpleados, setLoadingEmpleados] = useState(false);

  useEffect(() => {
    loadEmpleados();
  }, []);

  useEffect(() => {
    if (equipo) {
      setFormData({
        nombre: equipo.nombre || '',
        descripcion: equipo.descripcion || '',
        tipo: equipo.tipo || 'produccion',
        activo: equipo.activo !== undefined ? equipo.activo : true,
        lider_id: equipo.lider?.id || null,
        miembros_ids: equipo.miembros?.map(m => m.id) || [],
      });
    } else {
      setFormData({
        nombre: '',
        descripcion: '',
        tipo: 'produccion',
        activo: true,
        lider_id: null,
        miembros_ids: [],
      });
    }
    setErrors({});
  }, [equipo]);

  const loadEmpleados = async () => {
    try {
      setLoadingEmpleados(true);
      const response = await rrhhService.getEmpleados({ activo: true });
      setEmpleados(response.results);
    } catch (error) {
      console.error('Error al cargar empleados:', error);
    } finally {
      setLoadingEmpleados(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    } else if (formData.nombre.length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es requerida';
    } else if (formData.descripcion.length < 10) {
      newErrors.descripcion = 'La descripción debe tener al menos 10 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLoading) {
      return;
    }

    if (!validateForm()) {
      return;
    }

    const submitData = {
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      tipo: formData.tipo,
      activo: formData.activo,
      lider_id: formData.lider_id || null,
      miembros_ids: formData.miembros_ids || []
    };

    try {
      if (equipo) {
        await onSubmit({ ...submitData, id: equipo.id } as UpdateEquipoData);
      } else {
        await onSubmit(submitData);
      }
    } catch (error) {
      console.error('Error en envío del formulario:', error);
    }
  };

  const handleInputChange = (field: keyof CreateEquipoData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleMiembroToggle = (empleadoId: number) => {
    setFormData(prev => {
      const miembros_ids = prev.miembros_ids || [];
      const isSelected = miembros_ids.includes(empleadoId);
      
      if (isSelected) {
        return {
          ...prev,
          miembros_ids: miembros_ids.filter(id => id !== empleadoId)
        };
      } else {
        return {
          ...prev,
          miembros_ids: [...miembros_ids, empleadoId]
        };
      }
    });
  };



  const empleadosDisponibles = (empleados || []).filter(emp => {
    if (!emp || !emp.id) return false;
    
    // Si no hay equipo (creando nuevo), mostrar todos los empleados sin equipo o sin equipo activo
    if (!equipo) {
      return !emp.equipo || emp.equipo === null;
    }
    
    // Si estamos editando un equipo, mostrar:
    // 1. Empleados que no están en ningún equipo
    // 2. Empleados que están en el equipo actual (para poder deseleccionarlos)
    // 3. Empleados que están seleccionados en el formulario
    return !emp.equipo || 
           emp.equipo === null || 
           emp.equipo === equipo.id || 
           formData.miembros_ids?.includes(emp.id);
  });



  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {equipo ? 'Editar Equipo' : 'Crear Nuevo Equipo'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre del Equipo *</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => handleInputChange('nombre', e.target.value)}
                placeholder="Ej: Equipo de Producción"
                className={errors.nombre ? 'border-red-500' : ''}
              />
              {errors.nombre && (
                <p className="text-sm text-red-500">{errors.nombre}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo de Equipo *</Label>
              <Select
                value={formData.tipo}
                onValueChange={(value) => handleInputChange('tipo', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  {tiposEquipo.map((tipo) => (
                    <SelectItem key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción *</Label>
            <Textarea
              id="descripcion"
              value={formData.descripcion}
              onChange={(e) => handleInputChange('descripcion', e.target.value)}
              placeholder="Describe las responsabilidades y funciones del equipo..."
              rows={4}
              className={errors.descripcion ? 'border-red-500' : ''}
            />
            {errors.descripcion && (
              <p className="text-sm text-red-500">{errors.descripcion}</p>
            )}
          </div>

          {/* Selección de Líder */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <UserCheck className="w-4 h-4" />
              Líder del Equipo
            </Label>
            <Select
              value={formData.lider_id?.toString() || "none"}
              onValueChange={(value) => handleInputChange('lider_id', value === "none" ? null : parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar líder (opcional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sin líder asignado</SelectItem>
                {empleadosDisponibles
                  .filter(empleado => empleado && empleado.id && empleado.nombre && empleado.apellido)
                  .map((empleado) => (
                  <SelectItem key={empleado.id} value={empleado.id.toString()}>
                    {empleado.nombre} {empleado.apellido} - {empleado.especialidad || 'Sin especialidad'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Selección de Miembros */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Miembros del Equipo
              </Label>
              <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenEmpleadoModal(equipo?.id)}
              className="flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Agregar Empleado
            </Button>
            </div>
            {loadingEmpleados ? (
              <p className="text-sm text-gray-500">Cargando empleados...</p>
            ) : (
              <div className="max-h-48 overflow-y-auto border rounded-md p-3 space-y-2">
                {empleadosDisponibles.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-500 mb-2">No hay empleados disponibles</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onOpenEmpleadoModal(equipo?.id)}
                      className="flex items-center gap-2"
                    >
                      <UserPlus className="w-4 h-4" />
                      Crear Primer Empleado
                    </Button>
                  </div>
                ) : (
                  empleadosDisponibles
                    .filter(empleado => empleado && empleado.id && empleado.nombre && empleado.apellido)
                    .map((empleado) => (
                    <div key={empleado.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`miembro-${empleado.id}`}
                        checked={formData.miembros_ids?.includes(empleado.id) || false}
                        onCheckedChange={() => handleMiembroToggle(empleado.id)}
                      />
                      <Label 
                        htmlFor={`miembro-${empleado.id}`}
                        className="text-sm font-normal cursor-pointer flex-1"
                      >
                        {empleado.nombre} {empleado.apellido} - {empleado.especialidad || 'Sin especialidad'}
                        {empleado.equipo && empleado.equipo !== equipo?.id && empleado.equipo_nombre && (
                          <span className="text-xs text-gray-500 ml-2">
                            (Actualmente en: {empleado.equipo_nombre})
                          </span>
                        )}
                      </Label>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="activo"
              checked={formData.activo}
              onCheckedChange={(checked) => handleInputChange('activo', checked)}
            />
            <Label htmlFor="activo">Equipo activo</Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Guardando...' : `${equipo ? 'Actualizar' : 'Crear'} Equipo`}
            </Button>
          </div>
        </form>

      </CardContent>
    </Card>
  );
}