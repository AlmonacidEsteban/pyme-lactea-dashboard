import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
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
  Calendar,
  User,
  Activity,
  Clock,
  Filter,
  Download,
  Eye,
  Users,
  Settings
} from "lucide-react";
import { rrhhService } from '../../services/rrhhService';
import { 
  AuditoriaEquipo, 
  AuditoriaEmpleado,
  AuditoriaEquipoFilters,
  AuditoriaEmpleadoFilters
} from '../../types/rrhh';

interface AuditoriaViewProps {
  tipo: 'equipos' | 'empleados';
}

export function AuditoriaView({ tipo }: AuditoriaViewProps) {
  const [auditorias, setAuditorias] = useState<(AuditoriaEquipo | AuditoriaEmpleado)[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [accionFilter, setAccionFilter] = useState<string>('all');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');

  useEffect(() => {
    loadAuditorias();
  }, [tipo, searchTerm, accionFilter, fechaDesde, fechaHasta]);

  const loadAuditorias = async () => {
    try {
      setIsLoading(true);
      
      const filters = {
        search: searchTerm || undefined,
        accion: accionFilter === 'all' ? undefined : accionFilter,
        fecha_desde: fechaDesde || undefined,
        fecha_hasta: fechaHasta || undefined,
      };

      let response;
      if (tipo === 'equipos') {
        response = await rrhhService.getAuditoriaEquipos(filters as AuditoriaEquipoFilters);
      } else {
        response = await rrhhService.getAuditoriaEmpleados(filters as AuditoriaEmpleadoFilters);
      }
      
      setAuditorias(response.results);
    } catch (error) {
      console.error('Error al cargar auditorías:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getAccionColor = (accion: string) => {
    switch (accion.toLowerCase()) {
      case 'crear':
      case 'creado':
        return 'bg-green-100 text-green-800';
      case 'actualizar':
      case 'actualizado':
      case 'modificar':
      case 'modificado':
        return 'bg-blue-100 text-blue-800';
      case 'eliminar':
      case 'eliminado':
        return 'bg-red-100 text-red-800';
      case 'cambio_equipo':
        return 'bg-purple-100 text-purple-800';
      case 'agregar_miembro':
        return 'bg-cyan-100 text-cyan-800';
      case 'remover_miembro':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAccionIcon = (accion: string) => {
    switch (accion.toLowerCase()) {
      case 'crear':
      case 'creado':
        return '+';
      case 'actualizar':
      case 'actualizado':
      case 'modificar':
      case 'modificado':
        return '✏️';
      case 'eliminar':
      case 'eliminado':
        return '🗑️';
      case 'cambio_equipo':
        return '🔄';
      case 'agregar_miembro':
        return '👥+';
      case 'remover_miembro':
        return '👥-';
      default:
        return '📝';
    }
  };

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const exportarAuditoria = () => {
    // TODO: Implementar exportación de auditoría
    console.log('Exportar auditoría');
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-6 w-16" />
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
            {tipo === 'equipos' ? <Users className="w-5 h-5" /> : <User className="w-5 h-5" />}
            Auditoría de {tipo === 'equipos' ? 'Equipos' : 'Empleados'}
          </CardTitle>
          <Button onClick={exportarAuditoria} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>

        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar en auditoría..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={accionFilter} onValueChange={setAccionFilter}>
            <SelectTrigger>
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Acción" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las acciones</SelectItem>
              <SelectItem value="crear">Crear</SelectItem>
              <SelectItem value="actualizar">Actualizar</SelectItem>
              <SelectItem value="eliminar">Eliminar</SelectItem>
              {tipo === 'equipos' && (
                <>
                  <SelectItem value="agregar_miembro">Agregar miembro</SelectItem>
                  <SelectItem value="remover_miembro">Remover miembro</SelectItem>
                </>
              )}
              {tipo === 'empleados' && (
                <SelectItem value="cambio_equipo">Cambio de equipo</SelectItem>
              )}
            </SelectContent>
          </Select>

          <Input
            type="date"
            placeholder="Fecha desde"
            value={fechaDesde}
            onChange={(e) => setFechaDesde(e.target.value)}
          />

          <Input
            type="date"
            placeholder="Fecha hasta"
            value={fechaHasta}
            onChange={(e) => setFechaHasta(e.target.value)}
          />
        </div>
      </CardHeader>

      <CardContent>
        {auditorias.length === 0 ? (
          <div className="text-center py-8">
            <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No hay registros de auditoría</h3>
            <p className="text-muted-foreground">
              {searchTerm || accionFilter !== 'all' || fechaDesde || fechaHasta
                ? 'No se encontraron registros con los filtros aplicados.'
                : `No hay registros de auditoría para ${tipo}.`
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {auditorias.map((auditoria) => (
              <div key={auditoria.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge className={getAccionColor(auditoria.accion)}>
                        <span className="mr-1">{getAccionIcon(auditoria.accion)}</span>
                        {auditoria.accion}
                      </Badge>
                      
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {formatFecha(auditoria.fecha)}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="font-medium">
                        {tipo === 'equipos' 
                          ? `Equipo: ${(auditoria as AuditoriaEquipo).equipo_nombre || 'N/A'}`
                          : `Empleado: ${(auditoria as AuditoriaEmpleado).empleado_nombre || 'N/A'}`
                        }
                      </p>
                      
                      {auditoria.descripcion && (
                        <p className="text-sm text-muted-foreground">
                          {auditoria.descripcion}
                        </p>
                      )}

                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <User className="w-3 h-3" />
                        Realizado por: {auditoria.usuario_nombre || 'Sistema'}
                      </div>
                    </div>

                    {/* Detalles adicionales */}
                    {auditoria.detalles && (
                      <div className="mt-3 p-3 bg-muted/50 rounded text-xs">
                        <strong>Detalles:</strong>
                        <pre className="mt-1 whitespace-pre-wrap font-mono">
                          {typeof auditoria.detalles === 'string' 
                            ? auditoria.detalles 
                            : JSON.stringify(auditoria.detalles, null, 2)
                          }
                        </pre>
                      </div>
                    )}
                  </div>

                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}