import React, { useEffect, useState } from "react";
import { Owner } from "../types";
import { User, Store, Smartphone, Save } from "lucide-react";
import ConfirmationModal from "@/components/Modal";
import { useVerifyNum } from "@/hooks/use-data";

interface EditProfileViewProps {
  owner: Owner;
  onUpdate: (owner: Owner) => void;
  onBack: () => void;
}

const EditProfileView: React.FC<EditProfileViewProps> = ({
  owner,
  onUpdate,
  onBack,
}) => {
  const [formData, setFormData] = useState<Owner>(owner);
  const [isVerifyingMobile, setIsVerifyingMobile] = useState(false);
  const [otp, setOtp] = useState("");
  const [pendingMobile, setPendingMobile] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);

  const { mutate } = useVerifyNum();

  useEffect(() => {
    if (owner?.owner_name) {
      setFormData(owner);
    }
  }, [owner]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    if (formData?.mobile !== owner?.mobile) {
      setPendingMobile(formData.mobile);
      setShowOtpModal(true);
    } else {
      onBack();
    }
  };

  const handleVerifyOtp = () => {
    if (otp.length === 4) {
      mutate(
        {
          otp: otp,
        },
        {
          onSuccess: () => {
            setOtp("");
          },
          onError: (err) => {
            console.log("err", err);
          },
        },
      );
      onUpdate({ ...formData, mobile: pendingMobile });
      setShowOtpModal(false);
      onBack();
    }
  };

  return (
    <div className="py-4 space-y-6 animate-in fade-in duration-500">
      <form
        onSubmit={handleSave}
        className="bg-white rounded-4xl border border-neutral-100 p-6 space-y-6 shadow-sm"
      >
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest px-1">
            Owner Name
          </label>
          <div className="relative">
            <User
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
            />
            <input
              required
              className="text-black placeholder:text-[#a1a1a1] w-full h-14 bg-neutral-50 border border-neutral-200 rounded-2xl pl-12 pr-4 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-600 outline-none transition-all font-bold"
              value={formData?.owner_name}
              onChange={(e) =>
                setFormData({ ...formData, owner_name: e.target.value })
              }
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest px-1">
            Business Mobile
          </label>
          <div className="relative">
            <Smartphone
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
            />
            <input
              required
              maxLength={10}
              className="text-black placeholder:text-[#a1a1a1] w-full h-14 bg-neutral-50 border border-neutral-200 rounded-2xl pl-12 pr-4 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-600 outline-none transition-all font-bold tracking-widest"
              value={formData?.mobile}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  mobile: e.target.value.replace(/\D/g, "").slice(0, 10),
                })
              }
            />
          </div>
          {formData?.mobile !== owner?.mobile && (
            <p className="text-[9px] text-emerald-600 font-bold uppercase tracking-widest px-1 mt-2">
              Mobile update requires OTP verification
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full cursor-pointer h-14 bg-neutral-900 text-white font-bold rounded-2xl shadow-xl shadow-neutral-900/10 flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
        >
          <Save size={18} />
          Save Profile
        </button>
      </form>

      <ConfirmationModal
        isOpen={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        onConfirm={handleVerifyOtp}
        title="Verify Update"
        description={`We've sent a 4-digit code to +91 ${pendingMobile} to verify the change.`}
        confirmLabel="Verify & Update"
      >
        <div className="mt-4">
          <input
            type="tel"
            maxLength={4}
            placeholder="0000"
            className="w-full text-black placeholder:text-[#a1a1a1] h-14 bg-neutral-50 border border-neutral-200 rounded-xl text-center text-2xl font-bold tracking-[0.5em] focus:bg-white focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-600 outline-none transition-all"
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))
            }
          />
        </div>
      </ConfirmationModal>
    </div>
  );
};

export default EditProfileView;
