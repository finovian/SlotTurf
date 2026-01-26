import React, { useState } from "react";

interface LoginViewProps {
  onSendOTP: (mobile: string) => void;
  tempMobile?: string;
}

const LoginView: React.FC<LoginViewProps> = ({ onSendOTP, tempMobile }) => {
  const [mobile, setMobile] = useState("");

  const handleMobileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobile.length === 10) onSendOTP(mobile);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 animate-in fade-in duration-500">
      <div className="w-full max-w-sm space-y-12">
        <div className="text-center space-y-4">
          <div className="w-14 h-14 bg-neutral-900 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto shadow-xl">
            T
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
              TurfFlow Pro
            </h1>
            <p className="text-neutral-500 text-sm">
              Enter your mobile number to get started.
            </p>
          </div>
        </div>

        <form onSubmit={handleMobileSubmit} className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest px-1">
              Mobile Number
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 font-semibold">
                +91
              </span>
              <input
                type="tel"
                placeholder="9876543210"
                autoFocus
                className="w-full text-black placeholder:text-[#a1a1a1] h-14 bg-neutral-50 border border-neutral-200 rounded-2xl pl-14 pr-4 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-600 outline-none transition-all font-bold tracking-widest"
                value={mobile}
                onChange={(e) =>
                  setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))
                }
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full h-14 cursor-pointer bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 transition-colors active:scale-[0.98] shadow-lg shadow-emerald-600/10 text-lg"
          >
            Get Started
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginView;
