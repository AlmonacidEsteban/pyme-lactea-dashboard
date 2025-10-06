import React, { useState, useEffect } from 'react';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { Shield, Users, Settings, Eye, Edit, Trash2, Plus } from "lucide-react";
import { Rol, CreateRolData, UpdateRolData } from '../../types/rrhh';

interface RolFormProps {
  rol?: Rol;
  onSubmit: (data: CreateRolData | UpdateRolData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

// Definición de permisos disponibles
const PERMISOS_DISPONIBLES = {
  equipos: {
    label: 'Gestión de Equipos',
    icon: Users,
    permisos: [
      { key: 'equipos.ver', label: 'Ver equipos', description: 'Puede ver la lista de equipos' },
      { key: 'equipos.crear', label: 'Crear equipos', description: 'Puede crear nuevos equipos' },
      { key: 'equipos.editar', label: 'Editar equipos', description: 'Puede modificar equipos existentes' },
      { key: 'equipos.eliminar', label: 'Eliminar equipos', description: 'Puede eliminar equipos' },
      { key: 'equipos.gestionar_miembros', label: 'Gestionar miembros', description: 'Puede agregar/remover miembros de equipos' },
    ]
  },
  empleados: {
    label: 'Gestión de Empleados',
    icon: Users,
    permisos: [
      { key: 'empleados.ver', label: 'Ver empleados', description: 'Puede ver la lista de empleados' },
      { key: 'empleados.crear', label: 'Crear empleados', description: 'Puede crear nuevos empleados' },
      { key: 'empleados.editar', label: 'Editar empleados', description: 'Puede modificar datos de empleados' },
      { key: 'empleados.eliminar', label: 'Eliminar empleados', description: 'Puede eliminar empleados' },
      { key: 'empleados.cambiar_equipo', label: 'Cambiar equipo', description: 'Puede cambiar empleados de equipo' },
    ]
  },
  pagos: {
    label: 'Gestión de Pagos',
    icon: Settings,
    permisos: [
      { key: 'pagos.ver', label: 'Ver pagos', description: 'Puede ver registros de pagos' },
      { key: 'pagos.crear', label: 'Crear pagos', description: 'Puede registrar nuevos pagos' },
      { key: 'pagos.editar', label: 'Editar pagos', description: 'Puede modificar pagos existentes' },
      { key: 'pagos.aprobar', label: 'Aprobar pagos', description: 'Puede aprobar pagos de empleados' },
    ]
  },
  auditoria: {
    label: 'Auditoría y Reportes',
    icon: Eye,
    permisos: [
      { key: 'auditoria.ver_equipos', label: 'Ver auditoría de equipos', description: 'Puede ver el historial de cambios en equipos' },
      { key: 'auditoria.ver_empleados', label: 'Ver auditoría de empleados', description: 'Puede ver el historial de cambios en empleados' },
      { key: 'reportes.generar', label: 'Generar reportes', description: 'Puede generar reportes del sistema' },
    ]
  },
  sistema: {
    label: 'Administración del Sistema',
    icon: Shield,
    permisos: [
      { key: 'roles.ver', label: 'Ver roles', description: 'Puede ver la lista de roles' },
      { key: 'roles.crear', label: 'Crear roles', description: 'Puede crear nuevos roles' },
      { key: 'roles.editar', label: 'Editar roles', description: 'Puede modificar roles existentes' },
      { key: 'roles.eliminar', label: 'Eliminar roles', description: 'Puede eliminar roles' },
      { key: 'sistema.configurar', label: 'Configurar sistema', description: 'Puede modificar configuraciones del sistema' },
    ]
  }
};

export function RolForm({ rol, onSubmit, onCancel, isLoading = false }: RolFormProps) {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    permisos: [] as string[],
    activo: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (rol) {
      setFormData({
        nombre: rol.nombre,
        descripcion: rol.descripcion || '',
        permisos: rol.permisos || [],
        activo: rol.activo,
      });
    }
  }, [rol]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre del rol es requerido';
    }

    if (formData.permisos.length === 0) {
      newErrors.permisos = 'Debe seleccionar al menos un permiso';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const submitData = rol 
      ? { ...formData, id: rol.id } as UpdateRolData
      : formData as CreateRolData;

    await onSubmit(submitData);
  };

  const handlePermisoToggle = (permiso: string) => {
    setFormData(prev => ({
      ...prev,
      permisos: prev.permisos.includes(permiso)
        ? prev.permisos.filter(p => p !== permiso)
        : [...prev.permisos, permiso]
    }));
  };

  const handleCategoriaToggle = (categoria: string) => {
    const permisosCategoria = PERMISOS_DISPONIBLES[categoria as keyof typeof PERMISOS_DISPONIBLES].permisos.map(p => p.key);
    const todosSeleccionados = permisosCategoria.every(p => formData.permisos.includes(p));

    if (todosSeleccionados) {
      // Deseleccionar todos los permisos de la categoría
      setFormData(prev => ({
        ...prev,
        permisos: prev.permisos.filter(p => !permisosCategoria.includes(p))
      }));
    } else {
      // Seleccionar todos los permisos de la categoría
      setFormData(prev => ({
        ...prev,
        permisos: [...new Set([...prev.permisos, ...permisosCategoria])]
      }));
    }
  };

  const getPermisosSeleccionados = () => {
    return formData.permisos.length;
  };

  const getTotalPermisos = () => {
    return Object.values(PERMISOS_DISPONIBLES).reduce((total, categoria) => total + categoria.permisos.length, 0);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Información básica */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre del Rol *</Label>
          <Input
            id="nombre"
            value={formData.nombre}
            onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
            placeholder="Ej: Supervisor de Producción"
            className={errors.nombre ? 'border-red-500' : ''}
          />
          {errors.nombre && <p className="text-sm text-red-500">{errors.nombre}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="activo" className="flex items-center gap-2">
            Estado
            <Switch
              id="activo"
              checked={formData.activo}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, activo: checked }))}
            />
            <span className="text-sm text-muted-foreground">
              {formData.activo ? 'Activo' : 'Inactivo'}
            </span>
          </Label>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="descripcion">Descripción</Label>
        <Textarea
          id="descripcion"
          value={formData.descripcion}
          onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
          placeholder="Describe las responsabilidades y alcance de este rol..."
          rows={3}
        />
      </div>

      <Separator />

      {/* Permisos */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Permisos del Rol</h3>
            <p className="text-sm text-muted-foreground">
              Selecciona los permisos que tendrá este rol en el sistema
            </p>
          </div>
          <Badge variant="outline">
            {getPermisosSeleccionados()} de {getTotalPermisos()} permisos
          </Badge>
        </div>

        {errors.permisos && (
          <p className="text-sm text-red-500">{errors.permisos}</p>
        )}

        <div className="space-y-4">
          {Object.entries(PERMISOS_DISPONIBLES).map(([categoriaKey, categoria]) => {
            const IconComponent = categoria.icon;
            const permisosCategoria = categoria.permisos.map(p => p.key);
            const todosSeleccionados = permisosCategoria.every(p => formData.permisos.includes(p));
            const algunosSeleccionados = permisosCategoria.some(p => formData.permisos.includes(p));

            return (
              <Card key={categoriaKey}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <IconComponent className="w-5 h-5" />
                      {categoria.label}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant={todosSeleccionados ? "default" : algunosSeleccionados ? "secondary" : "outline"}>
                        {permisosCategoria.filter(p => formData.permisos.includes(p)).length}/{permisosCategoria.length}
                      </Badge>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleCategoriaToggle(categoriaKey)}
                      >
                        {todosSeleccionados ? 'Deseleccionar todo' : 'Seleccionar todo'}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {categoria.permisos.map((permiso) => (
                      <div key={permiso.key} className="flex items-start space-x-3 p-3 border rounded-lg">
                        <Switch
                          checked={formData.permisos.includes(permiso.key)}
                          onCheckedChange={() => handlePermisoToggle(permiso.key)}
                        />
                        <div className="flex-1 min-w-0">
                          <Label className="text-sm font-medium cursor-pointer">
                            {permiso.label}
                          </Label>
                          <p className="text-xs text-muted-foreground mt-1">
                            {permiso.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Guardando...' : (rol ? 'Actualizar Rol' : 'Crear Rol')}
        </Button>
      </div>
    </form>
  );
}