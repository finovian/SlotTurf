import React, { useState, useEffect, useMemo } from "react";
import { Booking, Turf } from "../types";
// Fix: Use lib/helpers instead of deprecated utils/helpers
import { formatCurrency } from "../lib/helpers";
import {
  Calendar,
  Users,
  TrendingUp,
  Clock,
  ArrowUpRight,
  CheckCircle2,
  LayoutGrid,
  MoreVertical,
  ChevronRight,
  Phone,
  Edit2,
  Trash2,
} from "lucide-react";
import { CardSkeleton } from "../components/Skeleton";
import TurfSelector from "../components/TurfSelector";
import ConfirmationModal from "@/components/Modal";

interface DashboardViewProps {
  turfs: Turf[];
  selectedTurfId: string | null;
  onSelectTurf: (id: string) => void;
  bookings: Booking[];
}

const DashboardView: React.FC<DashboardViewProps> = ({
  turfs,
  selectedTurfId,
  onSelectTurf,
  bookings,
}) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const isAll = selectedTurfId === "all";
  const activeBookings = bookings.filter(
    (b) => b.status === "active" && (isAll || b.turfId === selectedTurfId),
  );
  const today = new Date().toISOString().split("T")[0];

  const revenueTotal = activeBookings.reduce(
    (sum, b) => sum + b.totalAmount,
    0,
  );

  const selectedTurfName = isAll
    ? "All Turfs"
    : turfs.find((t) => t.id === selectedTurfId)?.name || "Ground";

  const [activeActionBooking, setActiveActionBooking] =
    useState<Booking | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const filteredBookings = useMemo(
    () =>
      bookings.filter(
        (b) => b.status === "active" && (isAll || b.turfId === selectedTurfId),
      ),
    [bookings, isAll, selectedTurfId],
  );

  const todayBookings = useMemo(
    () =>
      filteredBookings
        .filter((b) => b.date === today)
        .sort((a, b) => a.startTime.localeCompare(b.startTime)),
    [filteredBookings, today],
  );

  const upcomingBookings = useMemo(
    () =>
      filteredBookings
        .filter((b) => b.date > today)
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(0, 5),
    [filteredBookings, today],
  );

  if (loading) {
    return (
      <div className="py-6 space-y-8">
        <CardSkeleton />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-24 bg-white rounded-2xl border border-neutral-100 animate-pulse" />
          <div className="h-24 bg-white rounded-2xl border border-neutral-100 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 overflow-hidden">
      {/* SaaS Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">
            Daily Pulse
          </h2>
          <p className="text-sm text-neutral-500 font-medium">
            Managing{" "}
            <span className="text-emerald-600 font-bold">
              {selectedTurfName}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          {turfs.length > 1 && (
            <TurfSelector
              turfs={turfs}
              selectedTurfId={selectedTurfId}
              onSelect={onSelectTurf}
            />
          )}
        </div>
      </div>

      {/* Operational Highlights */}
      <section className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-4">
        <div className="col-span-1 xs:col-span-2 md:col-span-1 bg-neutral-900 rounded-[32px] p-6 text-white flex flex-col justify-between shadow-xl shadow-neutral-900/20">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
              Active Today
            </span>
            <div className="p-2 bg-white/10 rounded-xl">
              <CheckCircle2 size={16} className="text-emerald-400" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-4xl font-bold tracking-tight">
              {todayBookings.length}
            </p>
            <p className="text-[10px] text-neutral-400 font-bold uppercase mt-1">
              Confirmed Slots
            </p>
          </div>
        </div>

        <div className="bg-white border border-neutral-100 rounded-[32px] p-6 flex flex-col justify-between shadow-sm">
          <div className="flex justify-between items-start text-neutral-400">
            <span className="text-[10px] font-bold uppercase tracking-widest truncate">
              Traffic
            </span>
            <Users size={16} />
          </div>
          <div className="mt-4">
            <p className="text-3xl sm:text-4xl font-bold text-neutral-900">
              {filteredBookings.length}
            </p>
            <p className="text-[10px] text-neutral-400 font-bold uppercase mt-1">
              Pipeline
            </p>
          </div>
        </div>

        <div className="bg-white border border-neutral-100 rounded-[32px] p-6 flex flex-col justify-between shadow-sm">
          <div className="flex justify-between items-start text-neutral-400">
            <span className="text-[10px] font-bold uppercase tracking-widest truncate">
              Resources
            </span>
            <LayoutGrid size={16} />
          </div>
          <div className="mt-4">
            <p className="text-3xl sm:text-4xl font-bold text-neutral-900">
              {turfs.length}
            </p>
            <p className="text-[10px] text-neutral-400 font-bold uppercase mt-1">
              Grounds
            </p>
          </div>
        </div>
      </section>

      {/* Main Grid: Today & Upcoming */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Today's Agenda */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">
              Today's Agenda
            </h3>
            <span className="text-[10px] font-bold text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-full">
              {new Date().toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
              })}
            </span>
          </div>

          <div className="space-y-3">
            {todayBookings.length > 0 ? (
              todayBookings.map((b) => (
                <div
                  key={b.id}
                  className="bg-white p-4 sm:p-5 rounded-[28px] border border-neutral-100 flex items-center justify-between shadow-sm hover:border-emerald-200 transition-all group"
                >
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-neutral-50 rounded-2xl flex items-center justify-center text-neutral-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors shrink-0">
                      <Clock size={20} />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-neutral-900 text-sm tracking-tight truncate">
                        {b.clientName}
                      </h4>
                      <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-tight">
                        {b.startTime} – {b.endTime}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveActionBooking(b)}
                    className="w-10 h-10 rounded-xl hover:bg-neutral-50 flex items-center justify-center text-neutral-300 hover:text-neutral-900 transition-all active:scale-95 shrink-0"
                  >
                    <MoreVertical size={18} />
                  </button>
                </div>
              ))
            ) : (
              <div className="py-12 text-center bg-neutral-50/50 rounded-[40px] border border-dashed border-neutral-200">
                <p className="text-neutral-400 text-[10px] font-bold uppercase tracking-widest">
                  No sessions scheduled for today
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Upcoming */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">
              Upcoming Outlook
            </h3>
          </div>

          <div className="bg-white rounded-[32px] border border-neutral-100 shadow-sm overflow-hidden divide-y divide-neutral-50">
            {upcomingBookings.length > 0 ? (
              upcomingBookings.map((b) => (
                <div
                  key={b.id}
                  className="p-4 sm:p-5 flex items-center justify-between hover:bg-neutral-50/50 transition-all group"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="text-center w-8 sm:w-10 shrink-0">
                      <p className="text-[9px] sm:text-[10px] font-bold text-neutral-400 uppercase leading-none">
                        {new Date(b.date).toLocaleDateString("en-US", {
                          weekday: "short",
                        })}
                      </p>
                      <p className="text-base sm:text-lg font-bold text-neutral-900 mt-0.5">
                        {new Date(b.date).getDate()}
                      </p>
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-neutral-800 text-xs tracking-tight truncate">
                        {b.clientName}
                      </h4>
                      <p className="text-[9px] text-neutral-400 font-bold uppercase">
                        {b.startTime} Slot
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveActionBooking(b)}
                    className="text-neutral-300 group-hover:text-neutral-900 p-2 transition-colors shrink-0"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              ))
            ) : (
              <div className="py-12 text-center">
                <p className="text-neutral-400 text-[10px] font-bold uppercase tracking-widest">
                  No upcoming bookings
                </p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Quick Action Sheet */}
      {activeActionBooking && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm animate-in fade-in"
            onClick={() => setActiveActionBooking(null)}
          />
          <div className="relative bg-white w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-8 duration-300">
            <div className="p-8 space-y-6">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-neutral-50 text-neutral-900 rounded-[24px] flex items-center justify-center mx-auto mb-2 border border-neutral-100 shadow-sm">
                  <Calendar size={28} />
                </div>
                <h4 className="text-xl font-bold text-neutral-900 tracking-tight">
                  Booking Details
                </h4>
                <div className="flex flex-col items-center gap-1">
                  <p className="text-sm font-bold text-neutral-700">
                    {activeActionBooking.clientName}
                  </p>
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1">
                    <Phone size={10} /> +91 {activeActionBooking.mobileNumber}
                  </p>
                </div>
              </div>

              <div className="bg-neutral-50 rounded-2xl p-4 flex justify-between items-center border border-neutral-100 gap-4">
                <div className="space-y-0.5 min-w-0">
                  <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">
                    Session Time
                  </p>
                  <p className="text-xs font-bold text-neutral-900 truncate">
                    {activeActionBooking.startTime} —{" "}
                    {activeActionBooking.endTime}
                  </p>
                </div>
                <div className="text-right space-y-0.5 shrink-0">
                  <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">
                    Amount
                  </p>
                  <p className="text-xs font-bold text-emerald-700">
                    {formatCurrency(activeActionBooking.totalAmount)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={() => {
                    // onEditBooking(activeActionBooking);
                    setActiveActionBooking(null);
                  }}
                  className="w-full h-14 bg-neutral-900 text-white font-bold rounded-2xl flex items-center justify-center gap-3 active:scale-95 transition-all shadow-lg shadow-neutral-900/10"
                >
                  <Edit2 size={18} /> Edit Booking
                </button>
                <button
                  onClick={() => setShowCancelConfirm(true)}
                  className="w-full h-14 bg-white border border-red-100 text-red-600 font-bold rounded-2xl flex items-center justify-center gap-3 hover:bg-red-50 active:scale-95 transition-all"
                >
                  <Trash2 size={18} /> Cancel Slot
                </button>
                <button
                  onClick={() => setActiveActionBooking(null)}
                  className="w-full h-12 text-neutral-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-2"
                >
                  Close Manager
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation for Delete/Cancel */}
      <ConfirmationModal
        isOpen={showCancelConfirm}
        onClose={() => setShowCancelConfirm(false)}
        onConfirm={() => {
          // if (activeActionBooking) onCancelBooking(activeActionBooking.id);
          setShowCancelConfirm(false);
          setActiveActionBooking(null);
        }}
        title="Cancel Session?"
        description="Are you sure? This slot will be marked as available for other clients once cancelled."
        confirmLabel="Yes, Cancel"
        isDanger={true}
      />
    </div>
  );
};

export default DashboardView;
