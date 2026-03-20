import React, { useState, useEffect, useMemo } from 'react';
import { Turf, Booking } from '../types';
// Fix: Use lib/helpers instead of deprecated utils/helpers
import { calculateDuration, formatCurrency, HHMMToMinutes, minutesToHHMM } from '../lib/helpers';
import { User, Phone, Calendar as CalendarIcon, Clock, Save, IndianRupee, ArrowLeft } from 'lucide-react';
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useUIStore } from '@/lib/store';
import { useRouter } from 'next/navigation';

dayjs.extend(utc);

interface AddBookingViewProps {
  turf: Turf;
  onAdd: (booking: Booking) => void;
  onConfirm: (booking: Booking) => void;
  initialData?: Booking | null;
}

const AddBookingView: React.FC<AddBookingViewProps> = ({ turf, onAdd, onConfirm, initialData }) => {
  const router = useRouter();
  const { selectedDate: storeDate, selectedSlots } = useUIStore();

  const parsedSlots = useMemo(() => {
    if (!selectedSlots || selectedSlots.length === 0) return null;

    // Helper to parse "05:00 PM" or "17:00" to minutes
    const timeToMin = (t: string) => {
      if (t.includes(' ')) {
        const [time, modifier] = t.split(' ');
        let [h, m] = time.split(':').map(Number);
        if (modifier === 'PM' && h !== 12) h += 12;
        if (modifier === 'AM' && h === 12) h = 0;
        return h * 60 + (m || 0);
      }
      return HHMMToMinutes(t);
    };

    const sortedMins = selectedSlots.map(timeToMin).sort((a, b) => a - b);
    const startMin = sortedMins[0];
    const endMin = sortedMins[sortedMins.length - 1] + 60; // Assume 1hr slots

    return {
      start: minutesToHHMM(startMin),
      end: minutesToHHMM(endMin)
    };
  }, [selectedSlots]);

  const [formData, setFormData] = useState({
    clientName: initialData?.client_name || '',
    mobileNumber: initialData?.client_mobile || '',
    date: initialData?.date 
      ? dayjs(initialData.date).format('YYYY-MM-DD') 
      : (storeDate || new Date().toISOString().split('T')[0]),
    startTime: initialData?.start_time 
      ? dayjs.utc(initialData.start_time).local().format('HH:mm') 
      : (parsedSlots?.start || '17:00'),
    endTime: initialData?.end_time 
      ? dayjs.utc(initialData.end_time).local().format('HH:mm') 
      : (parsedSlots?.end || '18:00'),
    totalAmount: initialData?.amount || 0
  });

  const [duration, setDuration] = useState(initialData?.hours || 1);
  const [manualPrice, setManualPrice] = useState(!!initialData);

  useEffect(() => {
    if (!manualPrice) {
      const hours = calculateDuration(formData.startTime, formData.endTime);
      if (hours > 0) {
        setDuration(hours);
        setFormData(prev => ({ ...prev, totalAmount: hours * (turf?.hourly_rate || 0) }));
      }
    } else {
       const hours = calculateDuration(formData.startTime, formData.endTime);
       setDuration(hours);
    }
  }, [formData.startTime, formData.endTime, turf?.hourly_rate, manualPrice]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalBooking: Booking = {
      id: initialData?.id || `B-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      turfID: turf?.id,
      client_name: formData.clientName,
      client_mobile: (formData.mobileNumber),
      date: formData.date,
      start_time: formData.startTime,
      end_time: formData.endTime,
      hours: duration,
      amount: formData.totalAmount,
      status: initialData?.status || 'booked'
    };

    onAdd(finalBooking);
  };

  return (
    <div className="py-4 space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center gap-4 px-1">
        <button 
          onClick={() => router.back()}
          className="w-10 h-10 bg-white border border-neutral-200 rounded-xl flex items-center justify-center text-neutral-400 hover:text-neutral-900 transition-all active:scale-95"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-widest">
            {initialData ? 'Edit Booking' : 'New Booking'}
          </h2>
          <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-tight">
            {turf?.name}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-4xl border border-neutral-100 p-6 space-y-6 shadow-sm">
          {/* Client Details */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest px-1">Client Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                <input
                  required
                  className="placeholder:text-[#a1a1a1] text-black w-full h-14 bg-neutral-50 border border-neutral-200 rounded-2xl pl-12 pr-4 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-600 transition-all font-bold"
                  placeholder="e.g. John Doe"
                  value={formData.clientName}
                  onChange={e => setFormData({...formData, clientName: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest px-1">Mobile Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                <input
                  required
                  type="tel"
                  maxLength={10}
                  className="placeholder:text-[#a1a1a1] text-black w-full h-14 bg-neutral-50 border border-neutral-200 rounded-2xl pl-12 pr-4 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-600 transition-all font-bold tracking-widest"
                  placeholder="9876543210"
                  value={formData.mobileNumber}
                  onChange={e => setFormData({...formData, mobileNumber: e.target.value.replace(/\D/g, '').slice(0, 10)})}
                />
              </div>
            </div>
          </div>

          <div className="h-px bg-neutral-50 w-full" />

          {/* Time & Date */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest px-1">Booking Date</label>
              <div className="relative">
                <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                <input
                  required
                  type="date"
                  className="placeholder:text-[#a1a1a1] text-black w-full h-14 bg-neutral-50 border border-neutral-200 rounded-2xl pl-12 pr-4 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-600 transition-all font-bold"
                  value={formData.date}
                  onChange={e => setFormData({...formData, date: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest px-1">Start Time</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
                  <input
                    required
                    type="time"
                    className="placeholder:text-[#a1a1a1] text-black w-full h-12 bg-neutral-50 border border-neutral-200 rounded-xl pl-10 pr-2 font-bold text-sm"
                    value={formData.startTime}
                    onChange={e => setFormData({...formData, startTime: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest px-1">End Time</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
                  <input
                    required
                    type="time"
                    className="placeholder:text-[#a1a1a1] text-black w-full h-12 bg-neutral-50 border border-neutral-200 rounded-xl pl-10 pr-2 font-bold text-sm"
                    value={formData.endTime}
                    onChange={e => setFormData({...formData, endTime: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="h-px bg-neutral-50 w-full" />

          {/* Pricing */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Pricing</label>
              <button 
                type="button"
                onClick={() => setManualPrice(!manualPrice)}
                className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded ${manualPrice ? 'bg-emerald-100 text-emerald-700' : 'bg-neutral-100 text-neutral-500'}`}
              >
                {manualPrice ? 'Manual Overridden' : 'Auto Calculate'}
              </button>
            </div>

            <div className="relative">
              <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
              <input
                type="number"
                className="placeholder:text-[#a1a1a1] text-black w-full h-14 bg-neutral-50 border border-neutral-200 rounded-2xl pl-12 pr-4 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-600 transition-all font-bold text-lg"
                value={formData.totalAmount}
                onChange={e => {
                  setManualPrice(true);
                  setFormData({...formData, totalAmount: parseInt(e.target.value) || 0});
                }}
              />
            </div>

            <div className="flex items-center justify-between px-2 py-2 bg-neutral-50 rounded-xl text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
              <span>Duration: {duration} hrs</span>
              <span>Rate: {formatCurrency(turf?.hourly_rate || 0)}/hr</span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full h-16 bg-neutral-900 text-white cursor-pointer font-bold rounded-2xl shadow-xl shadow-neutral-900/10 flex items-center justify-center gap-3 active:scale-[0.98] transition-all text-lg"
        >
          <Save size={20} />
          {initialData ? 'Update Booking' : 'Confirm & Save'}
        </button>
      </form>
    </div>
  );
};

export default AddBookingView;
