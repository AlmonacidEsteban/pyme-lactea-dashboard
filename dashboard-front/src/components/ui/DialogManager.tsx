import React from 'react';
import { CustomModal } from './CustomModal';

interface DialogManagerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export const DialogManager: React.FC<DialogManagerProps> = ({
  isOpen,
  onOpenChange,
  title,
  description,
  children,
  className
}) => {
  return (
    <CustomModal
      isOpen={isOpen}
      onClose={() => onOpenChange(false)}
      title={title}
      description={description}
      className={className}
      size="lg"
    >
      {children}
    </CustomModal>
  );
};