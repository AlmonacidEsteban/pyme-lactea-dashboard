import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  Users, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Factory, 
  Truck, 
  UserCheck, 
  ShoppingCart,
  MoreHorizontal,
  Eye
} from 'lucide-react';
import { EquipoList, EquipoFilters } from '../../types/rrhh';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';

interface EquiposListProps {
  equipos: EquipoList[];
  isLoading?: boolean;
  onCreateEquipo: () => void;
  onEditEquipo: (equipo: EquipoList) => void;
  onDeleteEquipo: (equipo: EquipoList) => void;
  onViewEquipo: (equipo: EquipoList) => void;
  onFiltersChange: (filters: EquipoFilters) => void;
}

const tiposEquipo = [
  { value: '', label: 'Todos los tipos' },
  { value: 'produccion', label: 'Producción', icon: Factory, color: 'bg-blue-100 text-blue-800' },
  { value: 'logistica', label: 'Logística', icon: Truck, color: 'bg-green-100 text-green-800' },
  { value: 'administracion', label: 'Administración', icon: UserCheck, color: 'bg-purple-100 text-purple-800' },
  { value: 'ventas', label: 'Ventas', icon: ShoppingCart, color: 'bg-orange-100 text-orange-800' },
  { value: 'otro', label: 'Otro', icon: Users, color: 'bg-gray-100 text-gray-800' },
];

const getEquipoIcon = (tipo: string) => {
  const tipoInfo = tiposEquipo.find(t => t.value === tipo);
  return tipoInfo?.icon || Users;
};

const getEquipoColor = (tipo: string) => {
  const tipoInfo = tiposEquipo.find(t => t.value === tipo);
  return tipoInfo?.color || 'bg-gray-100 text-gray-800';
};

export function EquiposList({ 
  equipos, 
  isLoading = false, 
  onCreateEquipo, 
  onEditEquipo, 
  onDeleteEquipo, 
  onViewEquipo,
  onFiltersChange 
}: EquiposListProps) {
  const [filters, setFilters] = useState<EquipoFilters>({
    search: '',
    tipo: '',
    activo: undefined,
    ordering: 'nombre'
  });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onFiltersChange(filters);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [filters, onFiltersChange]);

  const handleFilterChange = (key: keyof EquipoFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const getTipoLabel = (tipo: string) => {
    const tipoInfo = tiposEquipo.find(t => t.value === tipo);
    return tipoInfo?.label || tipo;
  };

  return (
    <div className="space-y-6">
      {/* Header con filtros */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestión de Equipos</h2>
          <p className="text-muted-foreground">Administra los equipos de trabajo de tu empresa</p>
        </div>
        <Button onClick={onCreateEquipo} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nuevo Equipo
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar equipos..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-10"
              />
            </div>

            <Select
              value={filters.tipo || ''}
              onValueChange={(value) => handleFilterChange('tipo', value || undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tipo de equipo" />
              </SelectTrigger>
              <SelectContent>
                {tiposEquipo.map((tipo) => (
                  <SelectItem key={tipo.value} value={tipo.value}>
                    {tipo.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.activo === undefined ? 'all' : filters.activo.toString()}
              onValueChange={(value) => handleFilterChange('activo', value === 'all' ? undefined : value === 'true')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="true">Activos</SelectItem>
                <SelectItem value="false">Inactivos</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.ordering || 'nombre'}
              onValueChange={(value) => handleFilterChange('ordering', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nombre">Nombre A-Z</SelectItem>
                <SelectItem value="-nombre">Nombre Z-A</SelectItem>
                <SelectItem value="fecha_creacion">Más antiguos</SelectItem>
                <SelectItem value="-fecha_creacion">Más recientes</SelectItem>
                <SelectItem value="total_miembros">Menos miembros</SelectItem>
                <SelectItem value="-total_miembros">Más miembros</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de equipos */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : equipos.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay equipos</h3>
            <p className="text-gray-500 mb-4">
              {filters.search || filters.tipo || filters.activo !== undefined
                ? 'No se encontraron equipos con los filtros aplicados.'
                : 'Comienza creando tu primer equipo de trabajo.'}
            </p>
            <Button onClick={onCreateEquipo}>
              <Plus className="w-4 h-4 mr-2" />
              Crear Primer Equipo
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {equipos.map((equipo) => {
            const IconComponent = getEquipoIcon(equipo.tipo);
            const colorClass = getEquipoColor(equipo.tipo);
            
            return (
              <Card key={equipo.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${colorClass}`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{equipo.nombre}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {getTipoLabel(equipo.tipo)}
                        </p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onViewEquipo(equipo)}>
                          <Eye className="w-4 h-4 mr-2" />
                          Ver detalles
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEditEquipo(equipo)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => onDeleteEquipo(equipo)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Miembros:</span>
                      <Badge variant="secondary">
                        {equipo.total_miembros} {equipo.total_miembros === 1 ? 'persona' : 'personas'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Estado:</span>
                      <Badge variant={equipo.activo ? "default" : "secondary"}>
                        {equipo.activo ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}