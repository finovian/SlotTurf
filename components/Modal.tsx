
import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDanger?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDanger = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-neutral-900/60 backdrop-blur-[2px] animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-3xl p-8 max-w-xs w-full shadow-2xl animate-in zoom-in-95 duration-200 space-y-6">
        <div className="text-center space-y-2">
          <h4 className="text-xl font-bold text-neutral-900 tracking-tight">{title}</h4>
          <p className="text-sm text-neutral-500 leading-relaxed font-medium">
            {description}
          </p>
        </div>
        
        <div className="flex flex-col gap-3">
          <button 
            onClick={onConfirm}
            className={`w-full h-14 rounded-2xl font-bold text-base transition-all active:scale-[0.98] ${
              isDanger 
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/10' 
                : 'bg-neutral-900 text-white shadow-lg shadow-neutral-900/10'
            }`}
          >
            {confirmLabel}
          </button>
          <button 
            onClick={onClose}
            className="w-full h-14 bg-neutral-100 text-neutral-600 font-bold rounded-2xl text-base transition-all active:bg-neutral-200"
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
