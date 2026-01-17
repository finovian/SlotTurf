import React, { useState } from 'react';
import { Owner, Turf } from '../types';
import { User, Store, MapPin, Clock, IndianRupee } from 'lucide-react';

interface OnboardingData extends Owner {
  groundName: string;
  openingTime: string;
  closingTime: string;
  hourlyPrice: number;
}

interface ProfileSetupViewProps {
  onComplete: (data: OnboardingData) => void;
  mobile: string;
}

const ProfileSetupView: React.FC<ProfileSetupViewProps> = ({ onComplete, mobile }) => {
  const [identity, setIdentity] = useState('');
  const [formData, setFormData] = useState({
    groundName: 'Ground A',
    openingTime: '06:00',
    closingTime: '23:00',
    hourlyPrice: 1500
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (identity && formData.groundName) {
      onComplete({
        name: identity, // Mapping the single field to both for data consistency
        businessName: identity,
        mobile: mobile,
        ...formData
      });
    }
  };

  return (
    <div className="min-h-screen bg-white p-6 pb-12 flex flex-col items-center animate-in fade-in duration-700">
      <div className="w-full max-w-sm space-y-10 mt-8">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-[24px] flex items-center justify-center mx-auto shadow-sm">
            <Store size={32} />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Setup Your Business</h1>
            <p className="text-neutral-500 text-xs font-medium">Almost there! Tell us your business or owner name.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Unified Identity Section */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold text-neutral-300 uppercase tracking-[0.2em] px-1">Identity</h3>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest px-1">Business or Owner Name</label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  required
                  className="w-full h-14 bg-neutral-50 border border-neutral-200 rounded-2xl pl-12 pr-4 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-600 outline-none transition-all font-bold"
                  placeholder="e.g. Master Cricket Arena"
                  value={identity}
                  onChange={e => setIdentity(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Default Ground Section */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold text-neutral-300 uppercase tracking-[0.2em] px-1">First Ground Setup</h3>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest px-1">Ground Name</label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    required
                    className="w-full h-14 bg-neutral-50 border border-neutral-200 rounded-2xl pl-12 pr-4 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-600 transition-all font-bold"
                    placeholder="e.g. Ground A"
                    value={formData.groundName}
                    onChange={e => setFormData({ ...formData, groundName: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest px-1">Hourly Rate (₹)</label>
                <div className="relative">
                  <IndianRupee size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    required
                    type="number"
                    className="w-full h-14 bg-neutral-50 border border-neutral-200 rounded-2xl pl-12 pr-4 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-600 outline-none transition-all font-bold"
                    value={formData.hourlyPrice}
                    onChange={e => setFormData({ ...formData, hourlyPrice: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest px-1">Opening</label>
                  <div className="relative">
                    <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="time"
                      className="w-full h-14 bg-neutral-50 border border-neutral-200 rounded-2xl pl-10 pr-2 font-bold"
                      value={formData.openingTime}
                      onChange={e => setFormData({ ...formData, openingTime: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest px-1">Closing</label>
                  <div className="relative">
                    <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="time"
                      className="w-full h-14 bg-neutral-50 border border-neutral-200 rounded-2xl pl-10 pr-2 font-bold"
                      value={formData.closingTime}
                      onChange={e => setFormData({ ...formData, closingTime: e.target.value })}
                    />
                  </div>
                </div>
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

export default ProfileSetupView;