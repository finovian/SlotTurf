
import React from 'react';
import { Turf } from '../types';
import { ChevronDown, MapPin, LayoutGrid } from 'lucide-react';

interface TurfSelectorProps {
  turfs: Turf[];
  selectedTurfId: string | null;
  onSelect: (id: string) => void;
  allowAll?: boolean;
}

const TurfSelector: React.FC<TurfSelectorProps> = ({ turfs, selectedTurfId, onSelect, allowAll = true }) => {
  const isAllSelected = selectedTurfId === 'all';
  const selectedTurf = turfs?.find(t => t.id === selectedTurfId);
  const [isOpen, setIsOpen] = React.useState(false);

  if (!selectedTurf && !isAllSelected) return null;

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer flex items-center gap-2 px-3 py-1.5 bg-white border border-neutral-100 rounded-full shadow-sm active:scale-95 transition-all focus:outline-none"
      >
        <div className="w-5 h-5 bg-neutral-900 rounded-full flex items-center justify-center text-[10px] text-white font-bold">
          {isAllSelected ? <LayoutGrid size={10} /> : selectedTurf?.name.charAt(0)}
        </div>
        <span className="text-[11px] font-bold text-neutral-800 uppercase tracking-tight truncate max-w-30">
          {isAllSelected ? 'All Turfs' : selectedTurf?.name}
        </span>
        <ChevronDown size={14} className={`text-neutral-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-60" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-neutral-100 rounded-2xl shadow-xl z-70 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="p-2 space-y-1">
              {allowAll && (
                <button
                  onClick={() => {
                    onSelect('all');
                    setIsOpen(false);
                  }}
                  className={`cursor-pointer w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left ${
                    isAllSelected ? 'bg-emerald-50 text-emerald-700' : 'hover:bg-neutral-50 text-neutral-600'
                  }`}
                >
                  <LayoutGrid size={16} />
                  <span className="text-xs font-bold">All Turfs (Aggregated)</span>
                </button>
              )}
              
              {turfs.map(turf => (
                <button
                  key={turf.id}
                  onClick={() => {
                    onSelect(turf.id);
                    setIsOpen(false);
                  }}
                  className={`cursor-pointer w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left ${
                    turf.id === selectedTurfId ? 'bg-emerald-50 text-emerald-700' : 'hover:bg-neutral-50 text-neutral-600'
                  }`}
                >
                  <MapPin size={16} />
                  <span className="text-xs font-bold truncate">{turf.name}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TurfSelector;
