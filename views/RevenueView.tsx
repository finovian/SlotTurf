
import React, { useState, useEffect } from 'react';
import { Booking, Turf } from '../types';
// Fix: Use lib/helpers instead of deprecated utils/helpers
import { formatCurrency } from '../lib/helpers';
import { TrendingUp, CreditCard, Wallet, Calendar } from 'lucide-react';
import TurfSelector from '../components/TurfSelector';
import { RevenueSkeleton } from '../components/Skeleton';

interface RevenueViewProps {
  bookings: Booking[];
  turfs: Turf[];
  selectedTurfId: string | null;
  onSelectTurf: (id: string) => void;
}

const RevenueView: React.FC<RevenueViewProps> = ({ bookings, turfs, selectedTurfId, onSelectTurf }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Only calculate revenue for active bookings (scoping handled by App.tsx)
  const activeBookings = bookings.filter(b => b.status === 'active');
  
  const totalRevenue = activeBookings.reduce((sum, b) => sum + b.totalAmount, 0);
  const totalHours = activeBookings.reduce((sum, b) => sum + b.hours, 0);
  const avgTicket = totalRevenue / (activeBookings.length || 1);

  const isAll = selectedTurfId === 'all';
  const selectedTurfName = isAll ? 'All Turfs' : turfs.find(t => t.id === selectedTurfId)?.name || 'Ground';

  if (loading) return <RevenueSkeleton />;

  return (
    <div className="py-4 space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-widest">Revenue</h2>
        {turfs.length > 1 && (
          <TurfSelector turfs={turfs} selectedTurfId={selectedTurfId} onSelect={onSelectTurf} />
        )}
      </div>

      {turfs.length > 1 && (
        <div className="px-2">
          <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">
            Showing data for: <span className="text-emerald-600">{selectedTurfName}</span>
          </p>
        </div>
      )}

      {/* High-Level Stats */}
      <div className="grid grid-cols-1 gap-4">
        <div className="bg-neutral-900 rounded-[32px] p-8 text-white shadow-xl shadow-neutral-900/10 relative overflow-hidden">
          <p className="text-neutral-500 text-[10px] font-bold uppercase tracking-widest mb-1 relative z-10">Total Revenue</p>
          <div className="flex items-end gap-2 relative z-10">
            <h2 className="text-4xl font-bold tracking-tight">{formatCurrency(totalRevenue)}</h2>
            <TrendingUp className="text-emerald-500 mb-1.5" size={24} />
          </div>
          <div className="mt-8 flex gap-8 relative z-10">
            <div>
              <p className="text-neutral-600 text-[10px] font-bold uppercase tracking-wider">Avg. Booking</p>
              <p className="font-bold text-lg tracking-tight">{formatCurrency(avgTicket)}</p>
            </div>
            <div>
              <p className="text-neutral-600 text-[10px] font-bold uppercase tracking-wider">Active Hours</p>
              <p className="font-bold text-lg tracking-tight">{totalHours}h</p>
            </div>
          </div>
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl -mb-24 -mr-12" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white border border-neutral-100 rounded-[28px] p-5 flex flex-col gap-3 shadow-sm">
            <div className="p-2 bg-blue-50 text-blue-600 w-fit rounded-xl">
              <CreditCard size={18} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Digital Payouts</p>
              <p className="text-xl font-bold text-neutral-900 tracking-tight">{formatCurrency(totalRevenue)}</p>
            </div>
          </div>
          <div className="bg-white border border-neutral-100 rounded-[28px] p-5 flex flex-col gap-3 shadow-sm opacity-50">
            <div className="p-2 bg-neutral-50 text-neutral-400 w-fit rounded-xl">
              <Wallet size={18} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-neutral-300 uppercase tracking-widest">Offline / Cash</p>
              <p className="text-xl font-bold text-neutral-900 tracking-tight">₹0</p>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Breakdown */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] flex items-center gap-2 px-3">
          <Calendar size={14} /> Transaction Log
        </h3>
        <div className="bg-white rounded-[32px] border border-neutral-100 shadow-sm overflow-hidden divide-y divide-neutral-50">
          {activeBookings.length > 0 ? (
             activeBookings.map(b => {
               const turf = turfs.find(t => t.id === b.turfId);
               return (
                 <div key={b.id} className="flex justify-between items-center p-5">
                   <div className="space-y-0.5">
                     <p className="font-bold text-neutral-900 text-sm">{new Date(b.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</p>
                     <div className="flex items-center gap-2">
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-tight">{b.clientName}</p>
                        {isAll && turf && turfs.length > 1 && (
                          <span className="text-[7px] font-bold text-neutral-300 uppercase px-1 border border-neutral-50 rounded">
                            {turf.name}
                          </span>
                        )}
                     </div>
                   </div>
                   <p className="font-bold text-emerald-700 tracking-tight">{formatCurrency(b.totalAmount)}</p>
                 </div>
               );
             })
          ) : (
            <div className="py-12 text-center">
              <p className="text-neutral-400 text-[10px] font-bold uppercase tracking-widest">No active transactions found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RevenueView;
