import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Card, CardContent } from '../ui/card';
import { X, User, Mail, Phone, Clock, DollarSign, Calendar, Award, Briefcase } from 'lucide-react';
import { CreateEmpleadoData, Rol } from '../../types/rrhh';
import { rrhhService } from '../../services/rrhhService';

interface EmpleadoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEmpleadoCreated: (empleado: any) => void;
  equipoId?: number;
}

const turnos = [
  { value: 'manana', label: 'Mañana (6:00 - 14:00)' },
  { value: 'tarde', label: 'Tarde (14:00 - 22:00)' },
  { value: 'noche', label: 'Noche (22:00 - 6:00)' },
  { value: 'completo', label: 'Tiempo Completo (8:00 - 17:00)' },
];

export function EmpleadoModal({ isOpen, onClose, onEmpleadoCreated, equipoId }: EmpleadoModalProps) {
  const [formData, setFormData] = useState<CreateEmpleadoData>({
    nombre: '',
    apellido: '',
    identificacion: '',
    puesto: '',
    email: '',
    telefono: '',
    turno: 'completo',
    salario_por_hora: '',
    fecha_ingreso: new Date().toISOString().split('T')[0],
    experiencia_anos: 0,
    especialidad: '',
    equipo: equipoId || null,
    rol: null,
    activo: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadRoles();
      // Reset form when modal opens
      setFormData({
        nombre: '',
        apellido: '',
        identificacion: '',
        puesto: '',
        email: '',
        telefono: '',
        turno: 'completo',
        salario_por_hora: '',
        fecha_ingreso: new Date().toISOString().split('T')[0],
        experiencia_anos: 0,
        especialidad: '',
        equipo: equipoId || null,
        rol: null,
        activo: true,
      });
      setErrors({});
    }
  }, [isOpen, equipoId]);

  const loadRoles = async () => {
    try {
      setLoadingRoles(true);
      const response = await rrhhService.getRoles({ activo: true });
      setRoles(response.results);
    } catch (error) {
      console.error('Error al cargar roles:', error);
    } finally {
      setLoadingRoles(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    } else if (formData.nombre.length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!formData.apellido.trim()) {
      newErrors.apellido = 'El apellido es requerido';
    } else if (formData.apellido.length < 2) {
      newErrors.apellido = 'El apellido debe tener al menos 2 caracteres';
    }

    if (!formData.identificacion.trim()) {
      newErrors.identificacion = 'La identificación es requerida';
    } else if (formData.identificacion.length < 5) {
      newErrors.identificacion = 'La identificación debe tener al menos 5 caracteres';
    }

    if (!formData.puesto.trim()) {
      newErrors.puesto = 'El puesto es requerido';
    } else if (formData.puesto.length < 2) {
      newErrors.puesto = 'El puesto debe tener al menos 2 caracteres';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es requerido';
    } else if (!/^\+?[\d\s\-\(\)]{8,}$/.test(formData.telefono)) {
      newErrors.telefono = 'El teléfono no es válido';
    }

    if (!formData.salario_por_hora || parseFloat(formData.salario_por_hora) <= 0) {
      newErrors.salario_por_hora = 'El salario debe ser mayor a 0';
    }

    if (!formData.especialidad.trim()) {
      newErrors.especialidad = 'La especialidad es requerida';
    }

    if (formData.experiencia_anos < 0) {
      newErrors.experiencia_anos = 'La experiencia no puede ser negativa';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || isLoading) {
      return;
    }

    try {
      setIsLoading(true);
      const empleado = await rrhhService.createEmpleado(formData);
      onEmpleadoCreated(empleado);
      onClose();
    } catch (error: any) {
      console.error('Error al crear empleado:', error);
      setErrors({ general: error.message || 'Error al crear empleado' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof CreateEmpleadoData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Empleado</DialogTitle>
          <DialogDescription>
            Complete la información del nuevo empleado para agregarlo al equipo.
          </DialogDescription>
        </DialogHeader>
        <form id="empleado-form" onSubmit={handleSubmit} className="space-y-6">
          {errors.general && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{errors.general}</p>
            </div>
          )}

          {/* Información Personal */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <User className="w-4 h-4" />
                Información Personal
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre *</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => handleInputChange('nombre', e.target.value)}
                    placeholder="Ej: Juan"
                    className={errors.nombre ? 'border-red-500' : ''}
                  />
                  {errors.nombre && (
                    <p className="text-sm text-red-500">{errors.nombre}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apellido">Apellido *</Label>
                  <Input
                    id="apellido"
                    value={formData.apellido}
                    onChange={(e) => handleInputChange('apellido', e.target.value)}
                    placeholder="Ej: Pérez"
                    className={errors.apellido ? 'border-red-500' : ''}
                  />
                  {errors.apellido && (
                    <p className="text-sm text-red-500">{errors.apellido}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="identificacion">Identificación *</Label>
                  <Input
                    id="identificacion"
                    value={formData.identificacion}
                    onChange={(e) => handleInputChange('identificacion', e.target.value)}
                    placeholder="Ej: 12345678"
                    className={errors.identificacion ? 'border-red-500' : ''}
                  />
                  {errors.identificacion && (
                    <p className="text-sm text-red-500">{errors.identificacion}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="puesto" className="flex items-center gap-1">
                    <Briefcase className="w-3 h-3" />
                    Puesto *
                  </Label>
                  <Input
                    id="puesto"
                    value={formData.puesto}
                    onChange={(e) => handleInputChange('puesto', e.target.value)}
                    placeholder="Ej: Desarrollador, Analista, Gerente"
                    className={errors.puesto ? 'border-red-500' : ''}
                  />
                  {errors.puesto && (
                    <p className="text-sm text-red-500">{errors.puesto}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="juan.perez@empresa.com"
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefono" className="flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    Teléfono *
                  </Label>
                  <Input
                    id="telefono"
                    value={formData.telefono}
                    onChange={(e) => handleInputChange('telefono', e.target.value)}
                    placeholder="+1234567890"
                    className={errors.telefono ? 'border-red-500' : ''}
                  />
                  {errors.telefono && (
                    <p className="text-sm text-red-500">{errors.telefono}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información Laboral */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Información Laboral
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="turno" className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Turno *
                  </Label>
                  <Select
                    value={formData.turno}
                    onValueChange={(value) => handleInputChange('turno', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar turno" />
                    </SelectTrigger>
                    <SelectContent>
                      {turnos.map((turno) => (
                        <SelectItem key={turno.value} value={turno.value}>
                          {turno.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="salario_por_hora" className="flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    Salario por Hora *
                  </Label>
                  <Input
                    id="salario_por_hora"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.salario_por_hora}
                    onChange={(e) => handleInputChange('salario_por_hora', e.target.value)}
                    placeholder="15.50"
                    className={errors.salario_por_hora ? 'border-red-500' : ''}
                  />
                  {errors.salario_por_hora && (
                    <p className="text-sm text-red-500">{errors.salario_por_hora}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fecha_ingreso" className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Fecha de Ingreso *
                  </Label>
                  <Input
                    id="fecha_ingreso"
                    type="date"
                    value={formData.fecha_ingreso}
                    onChange={(e) => handleInputChange('fecha_ingreso', e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experiencia_anos">Años de Experiencia</Label>
                  <Input
                    id="experiencia_anos"
                    type="number"
                    min="0"
                    max="50"
                    value={formData.experiencia_anos}
                    onChange={(e) => handleInputChange('experiencia_anos', parseInt(e.target.value) || 0)}
                    placeholder="0"
                    className={errors.experiencia_anos ? 'border-red-500' : ''}
                  />
                  {errors.experiencia_anos && (
                    <p className="text-sm text-red-500">{errors.experiencia_anos}</p>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="especialidad" className="flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    Especialidad *
                  </Label>
                  <Input
                    id="especialidad"
                    value={formData.especialidad}
                    onChange={(e) => handleInputChange('especialidad', e.target.value)}
                    placeholder="Ej: Operador de Máquinas, Supervisor de Calidad, etc."
                    className={errors.especialidad ? 'border-red-500' : ''}
                  />
                  {errors.especialidad && (
                    <p className="text-sm text-red-500">{errors.especialidad}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rol">Rol (Opcional)</Label>
                  <Select
                    value={formData.rol?.toString() || "none"}
                    onValueChange={(value) => handleInputChange('rol', value === "none" ? null : parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar rol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Sin rol asignado</SelectItem>
                      {loadingRoles ? (
                        <SelectItem value="loading" disabled>Cargando roles...</SelectItem>
                      ) : (
                        roles.map((rol) => (
                          <SelectItem key={rol.id} value={rol.id.toString()}>
                            {rol.nombre}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

        </form>
        
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700"
            form="empleado-form"
          >
            {isLoading ? 'Guardando...' : 'Guardar Empleado'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}