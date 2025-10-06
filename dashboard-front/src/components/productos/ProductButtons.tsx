"use client";

import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Pencil, 
  Copy, 
  Trash2, 
  PackagePlus, 
  DollarSign, 
  ArchiveRestore 
} from "lucide-react";

export type Id = string;

type Common = {
  disabled?: boolean;
  className?: string;
};

export function BtnNuevoProducto({ onClick, ...p }: Common & { onClick: () => void }) {
  return (
    <Button onClick={onClick} {...p}>
      <Plus className="mr-2 h-4 w-4" />
      Agregar Producto
    </Button>
  );
}

export function BtnEditar({ onClick, ...p }: Common & { onClick: () => void }) {
  return (
    <Button variant="outline" onClick={onClick} {...p}>
      <Pencil className="mr-2 h-4 w-4" />
      Editar
    </Button>
  );
}

export function BtnDuplicar({ onClick, ...p }: Common & { onClick: () => void }) {
  return (
    <Button variant="outline" onClick={onClick} {...p}>
      <Copy className="mr-2 h-4 w-4" />
      Duplicar
    </Button>
  );
}

export function BtnAjusteStock({ onClick, ...p }: Common & { onClick: () => void }) {
  return (
    <Button variant="secondary" onClick={onClick} {...p}>
      <PackagePlus className="mr-2 h-4 w-4" />
      Ajuste de Stock
    </Button>
  );
}

export function BtnCambiarPrecio({ onClick, ...p }: Common & { onClick: () => void }) {
  return (
    <Button variant="secondary" onClick={onClick} {...p}>
      <DollarSign className="mr-2 h-4 w-4" />
      Cambiar Precio
    </Button>
  );
}

export function BtnActivar({ onClick, ...p }: Common & { onClick: () => void }) {
  return (
    <Button variant="outline" onClick={onClick} {...p}>
      <ArchiveRestore className="mr-2 h-4 w-4" />
      Activar
    </Button>
  );
}

export function BtnEliminar({ onClick, ...p }: Common & { onClick: () => void }) {
  return (
    <Button variant="destructive" onClick={onClick} {...p}>
      <Trash2 className="mr-2 h-4 w-4" />
      Eliminar
    </Button>
  );
}