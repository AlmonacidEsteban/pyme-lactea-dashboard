import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Loader2 } from 'lucide-react';
import { useRubros } from '@/hooks/useRubros';
import { Rubro } from '@/types/clientes';
import { toast } from 'sonner';

interface RubroSelectorProps {
  value?: number | null;
  onChange: (value: number | null) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const RubroSelector: React.FC<RubroSelectorProps> = ({
  value,
  onChange,
  placeholder = "Seleccionar rubro...",
  disabled = false,
}) => {
  const { rubros, loading, createRubro } = useRubros();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newRubro, setNewRubro] = useState({
    nombre: '',
    descripcion: '',
  });

  const handleCreateRubro = async () => {
    if (!newRubro.nombre.trim()) {
      toast.error('El nombre del rubro es obligatorio');
      return;
    }

    try {
      setIsCreating(true);
      const createdRubro = await createRubro({
        nombre: newRubro.nombre.trim(),
        descripcion: newRubro.descripcion.trim() || undefined,
      });
      
      // Seleccionar automáticamente el nuevo rubro creado
      onChange(createdRubro.id);
      
      // Limpiar el formulario y cerrar el diálogo
      setNewRubro({ nombre: '', descripcion: '' });
      setIsDialogOpen(false);
      
      toast.success(`Rubro "${createdRubro.nombre}" creado exitosamente`);
    } catch (error) {
      toast.error('Error al crear el rubro');
    } finally {
      setIsCreating(false);
    }
  };

  const handleSelectChange = (selectedValue: string) => {
    if (selectedValue === 'add-new') {
      setIsDialogOpen(true);
    } else {
      onChange(selectedValue ? parseInt(selectedValue) : null);
    }
  };

  return (
    <>
      <Select
        value={value?.toString() || ''}
        onValueChange={handleSelectChange}
        disabled={disabled || loading}
      >
        <SelectTrigger>
          <SelectValue placeholder={loading ? "Cargando rubros..." : placeholder} />
        </SelectTrigger>
        <SelectContent>
          {rubros.map((rubro) => (
            <SelectItem key={rubro.id} value={rubro.id.toString()}>
              {rubro.nombre}
            </SelectItem>
          ))}
          <SelectItem value="add-new" className="text-blue-600 font-medium">
            <div className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Agregar nuevo rubro
            </div>
          </SelectItem>
        </SelectContent>
      </Select>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Agregar Nuevo Rubro</DialogTitle>
            <DialogDescription>
              Crea un nuevo tipo de negocio para categorizar a tus clientes.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nombre">Nombre del Rubro *</Label>
              <Input
                id="nombre"
                placeholder="Ej: Fábrica de Pasta, Supermercado, Kiosco..."
                value={newRubro.nombre}
                onChange={(e) => setNewRubro(prev => ({ ...prev, nombre: e.target.value }))}
                disabled={isCreating}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="descripcion">Descripción (opcional)</Label>
              <Textarea
                id="descripcion"
                placeholder="Descripción del tipo de negocio..."
                value={newRubro.descripcion}
                onChange={(e) => setNewRubro(prev => ({ ...prev, descripcion: e.target.value }))}
                disabled={isCreating}
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isCreating}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCreateRubro}
              disabled={isCreating || !newRubro.nombre.trim()}
            >
              {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Crear Rubro
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};