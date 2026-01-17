
import React, { useState, useEffect } from 'react';
import { Booking, Turf } from '../types';
// Fix: Use lib/helpers instead of deprecated utils/helpers
import { formatCurrency } from '../lib/helpers';
import { Calendar, Users, TrendingUp } from 'lucide-react';
import { CardSkeleton } from '../components/Skeleton';
import TurfSelector from '../components/TurfSelector';

interface DashboardViewProps {
  turfs: Turf[];
  selectedTurfId: string | null;
  onSelectTurf: (id: string) => void;
  bookings: Booking[];
}

const DashboardView: React.FC<DashboardViewProps> = ({ turfs, selectedTurfId, onSelectTurf, bookings }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const isAll = selectedTurfId === 'all';
  const activeBookings = bookings.filter(b => b.status === 'active' && (isAll || b.turfId === selectedTurfId));
  const today = new Date().toISOString().split('T')[0];
  const todayBookings = activeBookings.filter(b => b.date === today);
  const revenueTotal = activeBookings.reduce((sum, b) => sum + b.totalAmount, 0);

  const selectedTurfName = isAll ? 'All Turfs' : turfs.find(t => t.id === selectedTurfId)?.name || 'Ground';

  if (loading) {
    return (
      <div className="py-6 space-y-8">
        <CardSkeleton />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-24 bg-white rounded-2xl border border-neutral-100 animate-pulse" />
          <div className="h-24 bg-white rounded-2xl border border-neutral-100 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Top Header with Turf Selection */}
      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-widest">Home</h2>
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

      {/* Metrics Section */}
      <section className="grid grid-cols-1 gap-4">
        <div className="bg-neutral-900 p-8 rounded-[32px] shadow-xl shadow-neutral-900/10 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Total Revenue</span>
              <TrendingUp size={16} className="text-emerald-500" />
            </div>
            <p className="text-4xl font-bold tracking-tight">{formatCurrency(revenueTotal)}</p>
            <p className="text-[10px] text-neutral-500 font-bold uppercase mt-2 tracking-tight">
              {isAll ? 'Aggregated across all grounds' : 'Across all time for this ground'}
            </p>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm">
            <div className="flex items-center gap-2 text-neutral-400 mb-1">
              <Calendar size={14} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Today</span>
            </div>
            <p className="text-2xl font-bold text-neutral-900">{todayBookings.length}</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm">
            <div className="flex items-center gap-2 text-neutral-400 mb-1">
              <Users size={14} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Total Active</span>
            </div>
            <p className="text-2xl font-bold text-neutral-900">{activeBookings.length}</p>
          </div>
        </div>
      </section>

      {/* Today's Schedule */}
      <section>
        <div className="flex items-center justify-between mb-4 px-2">
          <h2 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Today's Schedule</h2>
        </div>
        
        <div className="space-y-3">
          {todayBookings.length > 0 ? (
            todayBookings.map(booking => {
              const turf = turfs.find(t => t.id === booking.turfId);
              return (
                <div key={booking.id} className="bg-white p-5 rounded-[28px] border border-neutral-100 flex items-center justify-between shadow-sm">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-neutral-900">{booking.clientName}</h3>
                      {isAll && turf && turfs.length > 1 && (
                        <span className="text-[8px] font-bold text-neutral-400 bg-neutral-50 border border-neutral-100 px-1.5 py-0.5 rounded-md uppercase tracking-tighter">
                          {turf.name}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-tight">
                      {booking.startTime} – {booking.endTime}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-emerald-700 tracking-tight">{formatCurrency(booking.totalAmount)}</p>
                    <div className="flex items-center gap-1 justify-end">
                       <div className="w-1 h-1 bg-emerald-500 rounded-full" />
                       <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-tighter">Verified</p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-16 bg-white/50 rounded-[40px] border border-dashed border-neutral-200">
              <p className="text-neutral-400 text-[10px] font-bold uppercase tracking-[0.2em]">No bookings scheduled for today</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default DashboardView;
