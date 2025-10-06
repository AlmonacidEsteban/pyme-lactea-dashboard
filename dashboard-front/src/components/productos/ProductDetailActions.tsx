"use client";

import { 
  BtnEditar, 
  BtnDuplicar, 
  BtnAjusteStock, 
  BtnCambiarPrecio, 
  BtnActivar, 
  BtnEliminar 
} from "./ProductButtons";

interface ProductDetailActionsProps {
  productId: string;
  isActive?: boolean;
  onEdit?: () => void;
  onDuplicate?: () => void;
  onAdjustStock?: () => void;
  onChangePrice?: () => void;
  onToggleStatus?: () => void;
  onDelete?: () => void;
  className?: string;
}

export function ProductDetailActions({
  productId,
  isActive = true,
  onEdit,
  onDuplicate,
  onAdjustStock,
  onChangePrice,
  onToggleStatus,
  onDelete,
  className = ""
}: ProductDetailActionsProps) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {onEdit && (
        <BtnEditar onClick={onEdit} />
      )}
      
      {onDuplicate && (
        <BtnDuplicar onClick={onDuplicate} />
      )}
      
      {onAdjustStock && (
        <BtnAjusteStock onClick={onAdjustStock} />
      )}
      
      {onChangePrice && (
        <BtnCambiarPrecio onClick={onChangePrice} />
      )}
      
      {onToggleStatus && (
        <BtnActivar 
          onClick={onToggleStatus}
        />
      )}
      
      {onDelete && (
        <BtnEliminar onClick={onDelete} />
      )}
    </div>
  );
}