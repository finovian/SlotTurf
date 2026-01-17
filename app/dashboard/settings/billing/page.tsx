"use client";

import { SubscriptionSkeleton } from "@/components/Skeleton";
import { Check, CreditCard } from "lucide-react";
import { useEffect, useState } from "react";

const SubscriptionView: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [payLoading, setPayLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handlePay = () => {
    setPayLoading(true);
    setTimeout(() => {
      alert("Redirecting to Razorpay...");
      setPayLoading(false);
    }, 1000);
  };

  if (loading) return <SubscriptionSkeleton />;

  return (
    <div className="py-6 space-y-6 animate-in fade-in duration-300">
      <div className="bg-neutral-900 rounded-4xl p-8 text-white space-y-6 shadow-2xl">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.2em]">
              Current Plan
            </span>
            <h2 className="text-3xl font-bold tracking-tight">Pro Annual</h2>
          </div>
          <div className="bg-emerald-500/20 text-emerald-500 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
            Active
          </div>
        </div>
        <div className="space-y-4 pt-4 border-t border-neutral-800">
          <div className="flex items-center gap-3">
            <Check size={16} className="text-emerald-500" />
            <span className="text-sm font-medium text-neutral-400">
              Unlimited Grounds
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Check size={16} className="text-emerald-500" />
            <span className="text-sm font-medium text-neutral-400">
              WhatsApp Automations
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Check size={16} className="text-emerald-500" />
            <span className="text-sm font-medium text-neutral-400">
              Advanced Admin Logic
            </span>
          </div>
        </div>
        <div className="pt-4 flex justify-between items-end">
          <div>
            <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
              Renewal Date
            </p>
            <p className="font-bold">12 Oct 2025</p>
          </div>
          <p className="text-2xl font-bold">
            ₹2,499
            <span className="text-xs text-neutral-500 font-medium">/yr</span>
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-neutral-100 p-8 space-y-6">
        <div className="space-y-2">
          <h3 className="font-bold text-neutral-900">Manage Subscription</h3>
          <p className="text-sm text-neutral-500 font-medium leading-relaxed">
            Payments are secured by Razorpay. This subscription covers all
            grounds managed under this account.
          </p>
        </div>
        <button
          onClick={handlePay}
          disabled={payLoading}
          className="w-full h-14 bg-neutral-900 text-white font-bold rounded-2xl flex items-center justify-center gap-3 disabled:opacity-50 transition-all active:scale-[0.98]"
        >
          <CreditCard size={20} />
          {payLoading ? "Processing..." : "Extend Pro Plan"}
        </button>
      </div>
    </div>
  );
};

export default SubscriptionView;
