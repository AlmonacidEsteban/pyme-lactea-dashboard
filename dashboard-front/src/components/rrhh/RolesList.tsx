import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "../ui/dropdown-menu";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Skeleton } from "../ui/skeleton";
import { 
  Search, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  Plus,
  Shield,
  Users,
  Settings,
  Filter
} from "lucide-react";
import { RolList, RolFilters } from '../../types/rrhh';

interface RolesListProps {
  roles: RolList[];
  isLoading: boolean;
  onCreateRol: () => void;
  onEditRol: (rol: RolList) => void;
  onDeleteRol: (rol: RolList) => void;
  onViewRol: (rol: RolList) => void;
  onFiltersChange: (filters: RolFilters) => void;
}

export function RolesList({
  roles,
  isLoading,
  onCreateRol,
  onEditRol,
  onDeleteRol,
  onViewRol,
  onFiltersChange
}: RolesListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    onFiltersChange({
      search: value || undefined,
      activo: statusFilter === 'all' ? undefined : statusFilter === 'active'
    });
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    onFiltersChange({
      search: searchTerm || undefined,
      activo: value === 'all' ? undefined : value === 'active'
    });
  };

  const getPermisosCount = (permisos: string[] | undefined) => {
    return permisos?.length || 0;
  };

  const getPermisosCategories = (permisos: string[] | undefined) => {
    if (!permisos || permisos.length === 0) return [];
    
    const categories = new Set<string>();
    permisos.forEach(permiso => {
      const category = permiso.split('.')[0];
      categories.add(category);
    });
    
    return Array.from(categories);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'equipos':
      case 'empleados':
        return Users;
      case 'pagos':
        return Settings;
      case 'auditoria':
      case 'reportes':
        return Eye;
      case 'roles':
      case 'sistema':
        return Shield;
      default:
        return Settings;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'equipos':
        return 'Equipos';
      case 'empleados':
        return 'Empleados';
      case 'pagos':
        return 'Pagos';
      case 'auditoria':
        return 'Auditoría';
      case 'reportes':
        return 'Reportes';
      case 'roles':
        return 'Roles';
      case 'sistema':
        return 'Sistema';
      default:
        return category.charAt(0).toUpperCase() + category.slice(1);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-10 w-24" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-4 w-60" />
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                  </div>
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Roles del Sistema
          </CardTitle>
          <Button onClick={onCreateRol} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Nuevo Rol
          </Button>
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar roles..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="active">Activos</SelectItem>
              <SelectItem value="inactive">Inactivos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        {roles.length === 0 ? (
          <div className="text-center py-8">
            <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No hay roles</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || statusFilter !== 'all' 
                ? 'No se encontraron roles con los filtros aplicados.'
                : 'Comienza creando tu primer rol del sistema.'
              }
            </p>
            {(!searchTerm && statusFilter === 'all') && (
              <Button onClick={onCreateRol}>
                <Plus className="w-4 h-4 mr-2" />
                Crear Primer Rol
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {roles.map((rol) => {
              const permisosCount = getPermisosCount(rol.permisos);
              const categories = getPermisosCategories(rol.permisos);

              return (
                <div key={rol.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-lg">{rol.nombre}</h3>
                        <Badge variant={rol.activo ? "default" : "secondary"}>
                          {rol.activo ? 'Activo' : 'Inactivo'}
                        </Badge>
                        <Badge variant="outline">
                          {permisosCount} {permisosCount === 1 ? 'permiso' : 'permisos'}
                        </Badge>
                      </div>

                      {rol.descripcion && (
                        <p className="text-muted-foreground text-sm mb-3">
                          {rol.descripcion}
                        </p>
                      )}

                      {/* Categorías de permisos */}
                      {categories.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {categories.map((category) => {
                            const IconComponent = getCategoryIcon(category);
                            return (
                              <Badge key={category} variant="outline" className="flex items-center gap-1">
                                <IconComponent className="w-3 h-3" />
                                {getCategoryLabel(category)}
                              </Badge>
                            );
                          })}
                        </div>
                      )}

                      {/* Información adicional */}
                      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                        <span>ID: {rol.id}</span>
                        {rol.fecha_creacion && (
                          <span>
                            Creado: {new Date(rol.fecha_creacion).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Menú de acciones */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onViewRol(rol)}>
                          <Eye className="w-4 h-4 mr-2" />
                          Ver detalles
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEditRol(rol)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => onDeleteRol(rol)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}