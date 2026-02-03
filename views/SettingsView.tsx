import React from "react";
import { View } from "../types";
import {
  User,
  ChevronRight,
  MapPin,
  CreditCard,
  FileText,
  Trash2,
  Users,
  Zap,
  Clock,
} from "lucide-react";
import { useProfile } from "@/hooks/use-data";
import dayjs from "dayjs";

interface SettingsViewProps {
  onLogout: () => void;
  onNavigate: (view: View) => void;
  onDeleteAccount: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({
  onLogout,
  onNavigate,
  onDeleteAccount,
}) => {
  const { data } = useProfile();


  console.log('data', data)

  const bookingsUsed = data?.user?.edges?.bookings?.length ?? 0; // Simulating some activity
  const bookingsTotal = 50;


  const bookingsProgress = (bookingsUsed / bookingsTotal) * 100;


  const now = dayjs();

  const startDate = data?.user?.edges?.subscription?.start_date
  ? dayjs( data?.user?.edges?.subscription?.start_date)
  : null;

const endDate = data?.user?.edges?.subscription?.end_date
  ? dayjs( data?.user?.edges?.subscription?.end_date)
  : null;

// Total days
const daysTotal =
  startDate && endDate
    ? Math.max(endDate.diff(startDate, "day"), 1)
    : 0;

// Used days
const daysUsed =
  startDate
    ? Math.min(
        daysTotal,
        Math.max(now.diff(startDate, "day"), 0)
      )
    : 0;

// Progress %
const daysProgress =
  daysTotal > 0
    ? Math.min(100, Math.round((daysUsed / daysTotal) * 100))
    : 0;

  //   const endsInText =
  // endDate && now.isBefore(endDate)
  //   ? `Ends in ${endDate.from(now, true)}`
  //   : "Trial ended";


    const startLabel = startDate?.format("DD MMM YYYY");
const endLabel = endDate?.format("DD MMM YYYY");

  const clayShadow =
    "shadow-[10px_10px_20px_rgba(0,0,0,0.05),inset_-6px_-6px_12px_rgba(0,0,0,0.05),inset_6px_6px_12px_rgba(255,255,255,0.8)]";
  const darkClayShadow =
    "shadow-[10px_10px_20px_rgba(0,0,0,0.2),inset_-6px_-6px_12px_rgba(255,255,255,0.1),inset_6px_6px_12px_rgba(0,0,0,0.2)]";

  const sections = [
    {
      title: "Business & CRM",
      items: [
        {
          icon: MapPin,
          label: "Turf Profile",
          detail: "Edit name, price, timings",
          view: View.EDIT_TURF,
        },
        {
          icon: Users,
          label: "Customers & History",
          detail: "View repeat clients",
          view: View.CUSTOMERS,
        },
        {
          icon: CreditCard,
          label: "Subscription & Billing",
          detail: "Manage your plan",
          view: View.SUBSCRIPTION,
        },
      ],
    },
    {
      title: "Company",
      items: [
        {
          icon: FileText,
          label: "Legal & Privacy",
          detail: "Terms, data safety",
          view: View.LEGAL,
        },
        {
          icon: User,
          label: "Help & Support",
          detail: "Contact us",
          view: View.SUPPORT,
        },
      ],
    },
  ];

  return (
    <div className="py-4 space-y-8 animate-in fade-in duration-500">
      {/* Active Business Section */}
      <div className="space-y-3">
        <h3 className="text-[10px] font-bold text-neutral-300 uppercase tracking-[0.2em] px-3 text-left">
          Active Business
        </h3>
        <button
          onClick={() => onNavigate(View.EDIT_PROFILE)}
          className={`cursor-pointer w-full bg-white border border-neutral-100 rounded-4xl p-6 flex items-center justify-between hover:bg-neutral-50 active:bg-neutral-100 transition-all focus:outline-none ${clayShadow}`}
        >
          <div className="flex items-center gap-5 text-left">
            <div className="w-16 h-16 bg-neutral-900 rounded-3xl flex items-center justify-center text-white text-2xl font-bold shadow-xl shadow-neutral-900/10 shrink-0">
              {(data as any)?.user?.owner_name?.charAt(0)}
            </div>
            <div className="space-y-1 overflow-hidden">
              <h2 className="text-xl font-bold text-neutral-900 tracking-tight truncate">
                {(data as any)?.user?.owner_name}
              </h2>
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0" />
                  <p className="text-[10px] text-neutral-500 font-bold tracking-widest">
                    +91 {(data as any)?.user?.mobile || "9XXXXXXXXX"}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <ChevronRight size={20} className="text-neutral-300 shrink-0" />
        </button>
      </div>

      {/* Free Trial Progress Card */}


 <div className="space-y-4">
  <h3 className="text-[11px] font-black text-neutral-400 uppercase tracking-[0.2em] px-2 text-left">
    Trial Status
  </h3>

  <div className={`bg-white rounded-[48px] p-8 space-y-8 ${clayShadow}`}>
    {/* Header */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-[20px] flex items-center justify-center">
          <Zap size={20} fill="currentColor" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-neutral-900">
            Premium Trial
          </h4>
          <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">
            Two-factor Limit
          </p>
        </div>
      </div>

      <span className="text-[10px] font-black text-neutral-300 bg-neutral-50 px-3 py-1.5 rounded-full uppercase tracking-widest">
        {startLabel}
      </span>
    </div>

    <div className="grid grid-cols-1 gap-6">
      {/* Bookings */}
      <div className="space-y-3">
        <div className="flex justify-between items-end px-1">
          <div className="flex items-center gap-2">
            <Users size={14} className="text-neutral-400" />
            <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">
              Volume
            </span>
          </div>
          <span className="text-[11px] font-bold text-neutral-900">
            {bookingsUsed} / {bookingsTotal} Bookings
          </span>
        </div>

        <div className="h-3 w-full bg-neutral-50 rounded-full overflow-hidden shadow-inner p-[1px]">
          <div
            className="h-full bg-neutral-900 rounded-full transition-all duration-1000"
            style={{ width: `${bookingsProgress}%` }}
          />
        </div>
      </div>

      {/* Days */}
      <div className="space-y-3">
        <div className="flex justify-between items-end px-1">
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-neutral-400" />
            <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">
              Duration
            </span>
          </div>
          <span className="text-[11px] font-bold text-neutral-900">
            {daysUsed} / {daysTotal} Days
          </span>
        </div>

        <div className="h-3 w-full bg-neutral-50 rounded-full overflow-hidden shadow-inner p-px">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
            style={{ width: `${daysProgress}%` }}
          />
        </div>
      </div>
    </div>

    <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-widest text-center pt-2 leading-relaxed">
      Trial ends when you hit{" "}
      <span className="text-neutral-900">
        {bookingsTotal} bookings
      </span>
      <br /> or{" "}
      <span className="text-neutral-900">
        {daysTotal} days
      </span>
      , whichever comes first.
    </p>
  </div>
</div>

      {/* Settings Menu */}
      <div className={`space-y-8 pb-8`}>
        {sections.map((section) => (
          <div key={section.title} className={` space-y-3`}>
            <h3 className="text-[10px] font-bold text-neutral-300 uppercase tracking-[0.2em] px-3 text-left">
              {section?.title}
            </h3>
            <div className={`bg-white rounded-[28px]  ${clayShadow}`}>
              {section?.items?.map((item) => (
                <button
                  key={item?.label}
                  onClick={() => onNavigate(item?.view)}
                  className="cursor-pointer w-full flex items-center justify-between p-5 hover:bg-neutral-50 transition-all active:bg-neutral-100 focus:outline-none"
                >
                  <div className="flex items-center gap-4 text-left">
                    <div className="w-10 h-10 bg-neutral-50 text-neutral-600 rounded-xl flex items-center justify-center border border-neutral-100 shrink-0">
                      <item.icon size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-neutral-900">
                        {item?.label}
                      </p>
                      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-tight">
                        {item?.detail}
                      </p>
                    </div>
                  </div>
                  <ChevronRight
                    size={18}
                    className="text-neutral-300 shrink-0"
                  />
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="space-y-3 pt-4">
          <button
            onClick={onLogout}
            className={`bg-white text-neutral-900 border  border-neutral-100 w-full h-14 font-bold flex items-center  transition-colors justify-center gap-2 rounded-2xl cursor-pointer focus:outline-none  ${clayShadow}`}
          >
            Logout Session
          </button>

          <button
            onClick={onDeleteAccount}
            className={`cursor-pointer w-full h-14 bg-white text-red-600 font-bold rounded-2xl border border-neutral-100 flex items-center justify-center gap-2 active:bg-red-50 transition-colors focus:outline-none ${clayShadow}`}
          >
            <Trash2 size={18} />
            Delete Account
          </button>

          <p className="text-center text-[10px] font-bold text-neutral-300 uppercase tracking-[0.3em] pt-6 pb-2">
            SlotTurf • v2.1.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
