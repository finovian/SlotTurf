'use client';

import React, { useEffect, useState } from 'react';

import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useUIStore } from '@/lib/store';

const Toast: React.FC = () => {
  const { toast, clearToast } = useUIStore();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (toast) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        // Delay clearing state to allow animation to finish
        setTimeout(clearToast, 300);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast, clearToast]);

  if (!toast && !isVisible) return null;

  const typeStyles = {
    success: 'bg-emerald-600 border-emerald-500 text-white shadow-emerald-900/20',
    error: 'bg-red-600 border-red-500 text-white shadow-red-900/20',
    info: 'bg-neutral-900 border-neutral-800 text-white shadow-neutral-900/30',
  };

  const Icon = {
    success: CheckCircle2,
    error: AlertCircle,
    info: Info,
  }[toast?.type || 'info'];

  return (
    <div className="fixed top-6 left-0 right-0 z-200 flex justify-center px-6 pointer-events-none">
      <div 
        className={`
          flex items-center gap-3 px-5 py-3.5 rounded-2xl border shadow-2xl backdrop-blur-md transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) pointer-events-auto
          ${typeStyles[toast?.type || 'info']}
          ${isVisible ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-12 opacity-0 scale-95'}
        `}
      >
        <Icon size={18} className="shrink-0" />
        <p className="text-[11px] font-bold uppercase tracking-widest whitespace-nowrap">
          {toast?.message}
        </p>
        <button 
          onClick={() => setIsVisible(false)}
          className="ml-2 p-1 -mr-1 opacity-50 hover:opacity-100 transition-opacity rounded-full active:bg-white/10"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};

export default Toast;