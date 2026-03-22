
import React, { useState } from 'react';
import { Turf } from '../types';
import { CheckCircle2 } from 'lucide-react';

interface OnboardingViewProps {
  onComplete: (turf: any) => void;
}

const OnboardingView: React.FC<OnboardingViewProps> = ({ onComplete }) => {
  const [formData, setFormData] = useState({
    id: 'initial',
    name: '',
    hourly_rate: 1500,
    open_time: '06:00',
    close_time: '23:00',
    is_active: 'active'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name) onComplete(formData);
  };

  return (
    <div className="min-h-screen bg-white p-8 flex flex-col items-center justify-center animate-in fade-in duration-700">
      <div className="w-full max-w-sm space-y-12">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-4xl flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 size={40} />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Welcome to SlotTurf</h1>
            <p className="text-neutral-500 text-sm font-medium">Create your first ground profile to begin managing bookings.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest px-1">Ground Name</label>
              <input
                required
                className="w-full h-14 bg-neutral-50 border border-neutral-200 rounded-2xl px-4 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-600 outline-none transition-all font-bold"
                placeholder="e.g. Lords Pitch A"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest px-1">Hourly Rate (₹)</label>
              <input
                required
                type="number"
                className="w-full h-14 bg-neutral-50 border border-neutral-200 rounded-2xl px-4 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-600 outline-none transition-all font-bold"
                placeholder="1500"
                value={formData.hourly_rate}
                onChange={e => setFormData({...formData, hourly_rate: Number(e.target.value)})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest px-1">Opening</label>
                <input
                  required
                  type="time"
                  className="w-full h-14 bg-neutral-50 border border-neutral-200 rounded-2xl px-4 font-bold"
                  value={formData.open_time}
                  onChange={e => setFormData({...formData, open_time: e.target.value})}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest px-1">Closing</label>
                <input
                  required
                  type="time"
                  className="w-full h-14 bg-neutral-50 border border-neutral-200 rounded-2xl px-4 font-bold"
                  value={formData.close_time}
                  onChange={e => setFormData({...formData, close_time: e.target.value})}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full h-16 bg-neutral-900 text-white font-bold rounded-2xl shadow-xl shadow-neutral-900/10 active:scale-[0.98] transition-all text-lg"
          >
            Launch Ground
          </button>
        </form>
      </div>
    </div>
  );
};

export default OnboardingView;
