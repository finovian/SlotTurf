
import React, { useState, useRef, useEffect } from 'react';
import { Turf, Booking } from '../types';
// Fix: Use lib/helpers instead of deprecated utils/helpers
import { generateTimeSlots } from '../lib/helpers';
import { ChevronRight, Clock, Edit2, Trash2, MapPin } from 'lucide-react';
import TurfSelector from '../components/TurfSelector';
import { AvailabilitySkeleton } from '../components/Skeleton';

interface AvailabilityViewProps {
  turfs: Turf[];
  selectedTurfId: string | null;
  onSelectTurf: (id: string) => void;
  bookings: Booking[];
  onSlotClick: () => void;
  onEditBooking: (booking: Booking) => void;
  onCancelBooking: (bookingId: string) => void;
}

const AvailabilityView: React.FC<AvailabilityViewProps> = ({ 
  turfs,
  selectedTurfId,
  onSelectTurf,
  bookings, 
  onSlotClick, 
  onEditBooking, 
  onCancelBooking 
}) => {
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const isAll = selectedTurfId === 'all';
  const activeTurf = turfs.find(t => t.id === selectedTurfId);
  const timeSlots = activeTurf ? generateTimeSlots(activeTurf.openingTime, activeTurf.closingTime) : [];
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeActionSlot, setActiveActionSlot] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const nextDates = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toISOString().split('T')[0];
  });

  const getSlotStatus = (time: string) => {
    if (isAll) return null;
    return bookings.find(b => b.turfId === selectedTurfId && b.date === selectedDate && b.startTime === time && b.status === 'active');
  };

  const handleCancelClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onCancelBooking(id);
    setActiveActionSlot(null);
  };

  if (loading) return <AvailabilitySkeleton />;

  return (
    <div className="py-4 space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-widest">Availability</h2>
        {turfs.length > 1 && (
          <TurfSelector turfs={turfs} selectedTurfId={selectedTurfId} onSelect={onSelectTurf} allowAll={false} />
        )}
      </div>

      {isAll ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[40px] border border-dashed border-neutral-200 px-8 text-center space-y-4">
          <div className="w-16 h-16 bg-neutral-100 text-neutral-400 rounded-3xl flex items-center justify-center">
             <MapPin size={32} />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-neutral-900">Select a Ground</h4>
            <p className="text-xs text-neutral-500 font-medium leading-relaxed">Availability view is specific to individual grounds. Please select a ground from the menu above to view its schedule.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            {turfs.map(t => (
              <button 
                key={t.id}
                onClick={() => onSelectTurf(t.id)}
                className="px-4 h-10 bg-neutral-900 text-white rounded-full text-[10px] font-bold uppercase tracking-widest active:scale-95 transition-all"
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Horizontal Date Picker */}
          <div 
            ref={scrollRef}
            className="flex gap-3 overflow-x-auto scrollbar-hide scrollbar-hide pb-4 px-1 scroll-smooth snap-x snap-mandatory"
          >
            {nextDates.map(date => {
              const d = new Date(date);
              const isSelected = selectedDate === date;
              const isToday = new Date().toISOString().split('T')[0] === date;
              
              return (
                <button
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className={`shrink-0 w-18 h-24 rounded-[28px] flex flex-col items-center justify-center transition-all border snap-center focus:outline-none ${
                    isSelected 
                      ? 'bg-neutral-900 border-neutral-900 text-white shadow-xl shadow-neutral-900/10' 
                      : 'bg-white border-neutral-100 text-neutral-500'
                  }`}
                >
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${isSelected ? 'opacity-60' : 'opacity-40'}`}>
                    {d.toLocaleDateString('en-US', { weekday: 'short' })}
                  </span>
                  <span className="text-2xl font-bold mt-1 tracking-tighter">
                    {d.getDate()}
                  </span>
                  {isToday && (
                    <div className={`w-1 h-1 rounded-full mt-1 ${isSelected ? 'bg-emerald-400' : 'bg-emerald-500'}`} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Slots List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                <Clock size={14} /> Schedule
              </h3>
              <p className="text-[10px] font-bold text-neutral-300 uppercase tracking-widest">
                {new Date(selectedDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
              </p>
            </div>

            <div className="bg-white rounded-4xl border border-neutral-100 shadow-sm overflow-hidden divide-y divide-neutral-50">
              {timeSlots.map(time => {
                const booking = getSlotStatus(time);
                const isActionActive = activeActionSlot === time;

                return (
                  <div key={time} className="relative">
                    <div 
                      className={`flex items-center justify-between p-5 transition-colors ${booking ? 'bg-neutral-50/20' : 'hover:bg-neutral-50 cursor-pointer active:bg-neutral-100'}`}
                      onClick={() => {
                        if (booking) {
                          setActiveActionSlot(isActionActive ? null : time);
                        } else {
                          onSlotClick();
                        }
                      }}
                    >
                      <div className="flex items-center gap-6">
                        <div className="w-14 text-sm font-bold text-neutral-400">{time}</div>
                        <div className="h-10 w-px bg-neutral-100" />
                        <div>
                          {booking ? (
                            <div className="space-y-0.5">
                              <p className="text-sm font-bold text-neutral-900">{booking.clientName}</p>
                              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-tighter">Verified until {booking.endTime}</p>
                            </div>
                          ) : (
                            <p className="text-sm font-semibold text-emerald-600 tracking-tight">Tap to book</p>
                          )}
                        </div>
                      </div>
                      
                      {booking ? (
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isActionActive ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-400'}`}>
                          <ChevronRight size={16} className={`transition-transform duration-200 ${isActionActive ? 'rotate-90' : ''}`} />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-300">
                          <ChevronRight size={18} />
                        </div>
                      )}
                    </div>

                    {/* Slot Actions Panel */}
                    {booking && isActionActive && (
                      <div className="flex bg-neutral-900 p-2 gap-2 animate-in slide-in-from-top-1 duration-200">
                        <button 
                          onClick={(e) => { e.stopPropagation(); onEditBooking(booking); }}
                          className="flex-1 h-12 bg-neutral-800 text-white rounded-xl flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest active:bg-neutral-700 transition-colors"
                        >
                          <Edit2 size={14} /> Edit
                        </button>
                        <button 
                          onClick={(e) => handleCancelClick(e, booking.id)}
                          className="flex-1 h-12 bg-red-900/40 text-red-400 rounded-xl flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest active:bg-red-900/60 transition-colors"
                        >
                          <Trash2 size={14} /> Cancel
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AvailabilityView;
