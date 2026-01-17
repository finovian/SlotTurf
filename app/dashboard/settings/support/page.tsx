import { HelpCircle, Mail, Phone } from "lucide-react";

const SupportView: React.FC = () => {
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

export default SupportView;
