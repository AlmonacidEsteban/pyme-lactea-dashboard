"use client";

import { AlertTriangle, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface Producto {
  id?: number;
  nombre: string;
  sku: string;
  descripcion?: string;
  precio: number;
  stock: number;
  activo: boolean;
}

interface DeleteProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Producto | null;
  onConfirm: () => Promise<void>;
  loading?: boolean;
}

export function DeleteProductDialog({
  open,
  onOpenChange,
  product,
  onConfirm,
  loading = false,
}: DeleteProductDialogProps) {
  const handleConfirm = async () => {
    try {
      await onConfirm();
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    }
  };

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            Eliminar Producto
          </DialogTitle>
          <DialogDescription>
            Esta acción no se puede deshacer. El producto será eliminado permanentemente del sistema.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium text-red-900">{product.nombre}</h4>
                <p className="text-sm text-red-700">SKU: {product.sku}</p>
              </div>
              <Badge 
                variant={product.activo ? "default" : "secondary"} 
                className="text-xs"
              >
                {product.activo ? "Activo" : "Inactivo"}
              </Badge>
            </div>
            
            {product.descripcion && (
              <p className="text-sm text-red-700">{product.descripcion}</p>
            )}
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-red-600 font-medium">Precio:</span>
                <span className="text-red-900 ml-1">${product.precio.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-red-600 font-medium">Stock:</span>
                <span className="text-red-900 ml-1">{product.stock} unidades</span>
              </div>
            </div>
          </div>

          {product.stock > 0 && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">Advertencia</span>
              </div>
              <p className="text-sm text-yellow-700 mt-1">
                Este producto tiene stock disponible ({product.stock} unidades). 
                Al eliminarlo, también se perderá el registro del inventario.
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button 
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Eliminar Producto
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}