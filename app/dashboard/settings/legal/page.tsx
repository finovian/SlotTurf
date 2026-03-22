import { ShieldCheck } from "lucide-react";

 const LegalView: React.FC = () => {
  return (
    <div className="py-6 space-y-6 animate-in fade-in duration-300">
      <div className="bg-white rounded-4xl border border-neutral-100 overflow-hidden divide-y divide-neutral-50">
        {['Privacy Policy', 'Terms of Service', 'Refund Policy', 'Data Security'].map(label => (
          <div key={label} className="p-6 space-y-4">
            <h4 className="font-bold text-neutral-900 flex items-center gap-2">
              <ShieldCheck size={18} className="text-emerald-600" />
              {label}
            </h4>
            <div className="space-y-3 text-sm text-neutral-500 leading-relaxed font-medium">
              <p>SlotTurf Pro is committed to protecting your business data. We use industry-standard encryption to ensure your bookings and revenue information remain confidential.</p>
              <p className="text-xs">Last updated: January 2025</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LegalView;