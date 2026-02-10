import React, { useState, useEffect } from "react";
import { Turf, View } from "../types";
import { formatCurrency } from "../lib/helpers";
import {
  Check,
  ShieldCheck,
  HelpCircle,
  Mail,
  Phone,
  Trash2,
  CreditCard,
  Plus,
  MapPin,
  ChevronRight,
  Clock,
  IndianRupee,
} from "lucide-react";
import { SubscriptionSkeleton } from "../components/Skeleton";
import { toHHMM } from "@/utils/helpers";

// --- Manage Turfs List ---
export const ManageTurfsView: React.FC<{
  turfs: Turf[];
  onAdd: () => void;
  onEdit: (turf: Turf) => void;
  onBack: () => void;
}> = ({ turfs, onAdd, onEdit, onBack }) => {
  return (
    <div className="py-4 space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
          Your Grounds ({turfs?.length})
        </h3>
        <button
          onClick={onAdd}
          className="flex cursor-pointer items-center gap-2 px-4 h-9 bg-neutral-900 text-white rounded-full text-xs font-bold uppercase tracking-widest active:scale-95 transition-all"
        >
          <Plus size={14} /> Add Ground
        </button>
      </div>

      <div className="space-y-3">
        {turfs &&
          turfs?.map((turf) => (
            <button
              key={turf.id}
              onClick={() => onEdit(turf)}
              className="w-full cursor-pointer bg-white p-5 rounded-[28px] border border-neutral-100 shadow-sm flex items-center justify-between hover:bg-neutral-50 active:scale-[0.98] transition-all text-left"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-neutral-50 text-neutral-600 rounded-2xl flex items-center justify-center border border-neutral-100">
                  <MapPin size={22} />
                </div>
                <div>
                  <h4 className="font-bold text-neutral-900">{turf.name}</h4>
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                    {toHHMM(turf.open_time)} - {toHHMM(turf.close_time)} •{" "}
                    {formatCurrency(turf.hourly_rate)}/hr
                  </p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-300">
                <ChevronRight size={18} />
              </div>
            </button>
          ))}
      </div>
    </div>
  );
};

// --- Edit Turf View ---
export const EditTurfView: React.FC<{
  turf: Turf | null;
  turfCount: number;
  onSave: (t: Turf) => void;
  onDelete: (id: string) => void;
  showConfirm : boolean;
  setShowConfirm : (data : boolean) => void
}> = ({ turf, turfCount, onSave, onDelete,showConfirm , setShowConfirm }) => {
  const initialData: Turf = turf || {
    id: Math.random().toString(36).substr(2, 9).toUpperCase(),
    name: "",
    hourly_rate: 1500,
    open_time: "06:00",
    close_time: "23:00",
    is_active: "active",
  };

  const [formData, setFormData] = useState<Turf>(initialData);



  return (
    <div className="py-6 space-y-6 animate-in fade-in duration-300">
      <div className="bg-white rounded-4xl border border-neutral-100 p-8 space-y-8">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest px-1">
              Ground Name
            </label>
            <div className="relative">
              <MapPin
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
              />
              <input
                className="text-black placeholder:text-[#a1a1a1] w-full h-14 bg-neutral-50 border border-neutral-200 rounded-2xl pl-12 pr-4 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-600 transition-all font-bold"
                placeholder="e.g. Lords Pitch 1"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest px-1">
              Hourly Rate (₹)
            </label>
            <div className="relative">
              <IndianRupee
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
              />
              <input
                type="number"
                className="text-black placeholder:text-[#a1a1a1] w-full h-14 bg-neutral-50 border border-neutral-200 rounded-2xl pl-12 pr-4 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-600 transition-all font-bold"
                value={formData.hourly_rate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    hourly_rate: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest px-1">
                Opening
              </label>
              <div className="relative">
                <Clock
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                />
                <input
                  type="time"
                  className="w-full h-14 text-black placeholder:text-[#a1a1a1] bg-neutral-50 border border-neutral-200 rounded-2xl pl-10 pr-2 font-bold"
                  value={toHHMM(formData?.open_time)}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      open_time: toHHMM(e.target.value),
                    })
                  }
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest px-1">
                Closing
              </label>
              <div className="relative">
                <Clock
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                />
                <input
                  type="time"
                  className="w-full text-black placeholder:text-[#a1a1a1] h-14 bg-neutral-50 border border-neutral-200 rounded-2xl pl-10 pr-2 font-bold"
                  value={toHHMM(formData?.close_time)}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      close_time: toHHMM(e.target.value),
                    })
                  }
                />
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => onSave(formData)}
          className="w-full cursor-pointer h-16 bg-neutral-900 text-white font-bold rounded-2xl shadow-xl shadow-neutral-900/10 active:scale-[0.98] transition-all text-lg"
        >
          {turf ? "Update Ground" : "Add Ground"}
        </button>

        {/* Delete only if count > 1 */}
        {turf && turfCount > 1 && (
          <div className="pt-4 border-t border-neutral-50">
            <button
              onClick={() => setShowConfirm(true)}
              className="w-full cursor-pointer flex items-center justify-center gap-2 text-xs font-bold text-red-500 uppercase tracking-widest hover:text-red-600 p-2"
            >
              <Trash2 size={14} />
              Remove This Ground
            </button>
          </div>
        )}
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm z-100 flex items-center justify-center p-6">
          <div className="bg-white rounded-4xl p-8 max-w-sm w-full space-y-6 animate-in zoom-in-95 duration-200">
            <div className="text-center space-y-2">
              <h4 className="text-xl font-bold text-neutral-900">
                Delete Ground?
              </h4>
              <p className="text-sm text-neutral-500 font-medium leading-relaxed">
                Existing booking history will be preserved. This will remove the
                ground from your current dashboard.
              </p>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => onDelete(formData.id)}
                className="cursor-pointer w-full h-14 bg-red-600 text-white font-bold rounded-2xl active:scale-95 transition-transform"
              >
                Confirm Removal
              </button>
              <button
                onClick={() => setShowConfirm(true)}
                className="cursor-pointer w-full h-14 bg-neutral-100 text-neutral-600 font-bold rounded-2xl"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Subscription View ---
export const SubscriptionView: React.FC = () => {
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
          className="w-full cursor-pointer h-14 bg-neutral-900 text-white font-bold rounded-2xl flex items-center justify-center gap-3 disabled:opacity-50 transition-all active:scale-[0.98]"
        >
          <CreditCard size={20} />
          {payLoading ? "Processing..." : "Extend Pro Plan"}
        </button>
      </div>
    </div>
  );
};

// --- Legal & Privacy View ---
export const LegalView: React.FC = () => {
  return (
    <div className="py-6 space-y-6 animate-in fade-in duration-300">
      <div className="bg-white rounded-4xl border border-neutral-100 overflow-hidden divide-y divide-neutral-50">
        {[
          "Privacy Policy",
          "Terms of Service",
          "Refund Policy",
          "Data Security",
        ].map((label) => (
          <div key={label} className="p-6 space-y-4">
            <h4 className="font-bold text-neutral-900 flex items-center gap-2">
              <ShieldCheck size={18} className="text-emerald-600" />
              {label}
            </h4>
            <div className="space-y-3 text-sm text-neutral-500 leading-relaxed font-medium">
              <p>
                TurfFlow Pro is committed to protecting your business data. We
                use industry-standard encryption to ensure your bookings and
                revenue information remain confidential.
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Support View ---
export const SupportView: React.FC = () => {
  return (
    <div className="py-6 space-y-8 animate-in fade-in duration-300">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-neutral-100 rounded-3xl flex items-center justify-center text-neutral-600 mx-auto mb-4">
          <HelpCircle size={32} />
        </div>
        <h2 className="text-2xl font-bold text-neutral-900 tracking-tight text-center">
          How can we help?
        </h2>
        <p className="text-neutral-500 text-sm max-w-xs mx-auto text-center font-medium">
          Business support is available Mon-Fri, 10 AM to 7 PM IST.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <a
          href="mailto:support@turfflow.pro"
          className="bg-white border border-neutral-100 rounded-[28px] p-5 flex items-center gap-4 hover:bg-neutral-50 active:scale-95 transition-all"
        >
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <Mail size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-neutral-900">Email Support</p>
            <p className="text-[10px] font-bold text-neutral-400 uppercase">
              support@turfflow.pro
            </p>
          </div>
        </a>
        <a
          href="tel:+919876543210"
          className="bg-white border border-neutral-100 rounded-[28px] p-5 flex items-center gap-4 hover:bg-neutral-50 active:scale-95 transition-all"
        >
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <Phone size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-neutral-900">Phone Support</p>
            <p className="text-[10px] font-bold text-neutral-400 uppercase">
              +91 98765 43210
            </p>
          </div>
        </a>
      </div>
    </div>
  );
};
