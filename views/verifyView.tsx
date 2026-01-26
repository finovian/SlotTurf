import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface LoginViewProps {
  onVerifyOTP: (otp: string) => void;
  tempMobile?: string;
}

const verifyView: React.FC<LoginViewProps> = ({
  onVerifyOTP,
  tempMobile,
}) => {
  const [otp, setOtp] = useState("");
  const router = useRouter();

  const handleOTPSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length === 4) onVerifyOTP(otp);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 animate-in slide-in-from-right duration-300">
      <div className="w-full max-w-sm space-y-10">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Verify OTP
          </h1>
          <p className="text-neutral-500 text-sm">
            Sent to{" "}
            <span className="text-neutral-900 font-semibold">
              +91 {tempMobile}
            </span>
          </p>
        </div>

        <form onSubmit={handleOTPSubmit} className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest px-1 text-center block w-full">
              Verification Code
            </label>
            <input
              type="tel"
              maxLength={4}
              placeholder="0000"
              autoFocus
              className="w-full text-black placeholder:text-[#a1a1a1] h-16 bg-neutral-50 border border-neutral-200 rounded-2xl text-center text-3xl font-bold tracking-[0.5em] focus:bg-white focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-600 outline-none transition-all"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))
              }
              required
            />
          </div>

          <button
            type="submit"
            className="w-full cursor-pointer h-14 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 transition-colors active:scale-[0.98] shadow-lg shadow-emerald-600/10 text-lg"
          >
            Verify & Login
          </button>

          <button
            type="button"
            onClick={router.back}
            className="w-full cursor-pointer text-center text-xs font-bold text-neutral-400 uppercase tracking-widest hover:text-neutral-600"
          >
            Change Mobile Number
          </button>
        </form>
      </div>
    </div>
  );
};

export default verifyView;
