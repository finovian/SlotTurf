
import React, { useState, useEffect } from 'react';
import { Turf, Booking } from '../types';
// Fix: Use lib/helpers instead of deprecated utils/helpers
import { calculateDuration, formatCurrency } from '../lib/helpers';
import { User, Phone, Calendar as CalendarIcon, Clock, Save, IndianRupee } from 'lucide-react';

interface AddBookingViewProps {
  turf: Turf;
  onAdd: (booking: Booking) => void;
  onConfirm: (booking: Booking) => void;
  initialData?: Booking | null;
}

const AddBookingView: React.FC<AddBookingViewProps> = ({ turf, onAdd, onConfirm, initialData }) => {
  const [formData, setFormData] = useState({
    clientName: initialData?.clientName || '',
    mobileNumber: initialData?.mobileNumber || '',
    date: initialData?.date || new Date().toISOString().split('T')[0],
    startTime: initialData?.startTime || '17:00',
    endTime: initialData?.endTime || '18:00',
    totalAmount: initialData?.totalAmount || turf.hourlyPrice
  });

  const [duration, setDuration] = useState(initialData?.hours || 1);
  const [manualPrice, setManualPrice] = useState(!!initialData);

  useEffect(() => {
    if (!manualPrice) {
      const hours = calculateDuration(formData.startTime, formData.endTime);
      if (hours > 0) {
        setDuration(hours);
        setFormData(prev => ({ ...prev, totalAmount: hours * turf.hourlyPrice }));
      }
    }
  }, [formData.startTime, formData.endTime, turf.hourlyPrice, manualPrice]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalBooking: Booking = {
      id: initialData?.id || `B-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      turfId: turf.id,
      clientName: formData.clientName,
      mobileNumber: formData.mobileNumber,
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      hours: duration,
      totalAmount: formData.totalAmount,
      createdAt: initialData?.createdAt || Date.now(),
      status: initialData?.status || 'active'
    };

    onAdd(finalBooking);
    onConfirm(finalBooking);
  };

  return (
    <div className="py-4 space-y-6 animate-in fade-in duration-500">
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
              <span>Rate: {formatCurrency(turf.hourlyPrice)}/hr</span>
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
