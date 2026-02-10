import React, { useState, useEffect, useMemo } from "react";
import { Booking, Turf } from "../types";
// Fix: Use lib/helpers instead of deprecated utils/helpers
import { formatCurrency, getRangeDates, isDateInRange } from "../lib/helpers";
import {
  TrendingUp,
  CreditCard,
  Wallet,
  Calendar,
  BarChart3,
  Download,
} from "lucide-react";
import TurfSelector from "../components/TurfSelector";
import { RevenueSkeleton } from "../components/Skeleton";
import { startOfDay } from "date-fns/fp/startOfDay";
import { endOfDay } from "date-fns";

interface RevenueViewProps {
  bookings: Booking[];
  turfs: Turf[];
  selectedTurfId: string | null;
  onSelectTurf: (id: string) => void;
}

const RevenueView: React.FC<RevenueViewProps> = ({
  bookings,
  turfs,
  selectedTurfId,
  onSelectTurf,
}) => {
  const [loading, setLoading] = useState(true);
  const [timePreset, setTimePreset] = useState("30d");
  const [customRange, setCustomRange] = useState({ start: "", end: "" });
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Only calculate revenue for active bookings (scoping handled by App.tsx)

  const { start, end } = useMemo(() => {
    if (customRange.start && customRange.end) {
      return {
        start: startOfDay(new Date(customRange.start)),
        end: endOfDay(new Date(customRange.end)),
      };
    }
    return getRangeDates(timePreset);
  }, [timePreset, customRange]);

  const filteredBookings = useMemo(() => {
    return bookings.filter(
      (b) =>
        b.status === "booked" &&
        (selectedTurfId === "all" || b.turfID === selectedTurfId) &&
        isDateInRange(b.date, start, end),
    );
  }, [bookings, start, end, selectedTurfId]);

  // Aggregate by Date for the Table
  const groupedData = useMemo(() => {
    const map = new Map<
      string,
      { date: string; count: number; revenue: number }
    >();

    filteredBookings.forEach((b) => {
      const entry = map.get(b.date) || { date: b.date, count: 0, revenue: 0 };
      entry.count += 1;
      entry.revenue += b.amount;
      map.set(b.date, entry);
    });

    return Array.from(map.values()).sort((a, b) =>
      b.date.localeCompare(a.date),
    );
  }, [filteredBookings]);

  const totalRevenue = groupedData.reduce((sum, day) => sum + day.revenue, 0);
  const totalSessions = groupedData.reduce((sum, day) => sum + day.count, 0);

  const presets = [
    { id: "7d", label: "7D" },
    { id: "30d", label: "30D" },
    { id: "3m", label: "3M" },
    { id: "6m", label: "6M" },
    { id: "1y", label: "1Y" },
  ];

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert("Statement Generated!");
    }, 1500);
  };

  if (loading) return <RevenueSkeleton />;

  return (
    // <div className="py-4 space-y-8 animate-in fade-in duration-500">
    //   <div className="flex items-center justify-between px-1">
    //     <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-widest">Revenue</h2>
    //     {turfs.length > 1 && (
    //       <TurfSelector turfs={turfs} selectedTurfId={selectedTurfId} onSelect={onSelectTurf} />
    //     )}
    //   </div>

    //   {turfs.length > 1 && (
    //     <div className="px-2">
    //       <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">
    //         Showing data for: <span className="text-emerald-600">{selectedTurfName}</span>
    //       </p>
    //     </div>
    //   )}

    //   {/* High-Level Stats */}
    //   <div className="grid grid-cols-1 gap-4">
    //     <div className="bg-neutral-900 rounded-4xl p-8 text-white shadow-xl shadow-neutral-900/10 relative overflow-hidden">
    //       <p className="text-neutral-500 text-[10px] font-bold uppercase tracking-widest mb-1 relative z-10">Total Revenue</p>
    //       <div className="flex items-end gap-2 relative z-10">
    //         <h2 className="text-4xl font-bold tracking-tight">{formatCurrency(totalRevenue)}</h2>
    //         <TrendingUp className="text-emerald-500 mb-1.5" size={24} />
    //       </div>
    //       <div className="mt-8 flex gap-8 relative z-10">
    //         <div>
    //           <p className="text-neutral-600 text-[10px] font-bold uppercase tracking-wider">Avg. Booking</p>
    //           <p className="font-bold text-lg tracking-tight">{formatCurrency(avgTicket)}</p>
    //         </div>
    //         <div>
    //           <p className="text-neutral-600 text-[10px] font-bold uppercase tracking-wider">Active Hours</p>
    //           <p className="font-bold text-lg tracking-tight">{totalHours}h</p>
    //         </div>
    //       </div>
    //       <div className="absolute bottom-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl -mb-24 -mr-12" />
    //     </div>

    //     <div className="grid grid-cols-2 gap-4">
    //       <div className="bg-white border border-neutral-100 rounded-[28px] p-5 flex flex-col gap-3 shadow-sm">
    //         <div className="p-2 bg-blue-50 text-blue-600 w-fit rounded-xl">
    //           <CreditCard size={18} />
    //         </div>
    //         <div>
    //           <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Digital Payouts</p>
    //           <p className="text-xl font-bold text-neutral-900 tracking-tight">{formatCurrency(totalRevenue)}</p>
    //         </div>
    //       </div>
    //       <div className="bg-white border border-neutral-100 rounded-[28px] p-5 flex flex-col gap-3 shadow-sm opacity-50">
    //         <div className="p-2 bg-neutral-50 text-neutral-400 w-fit rounded-xl">
    //           <Wallet size={18} />
    //         </div>
    //         <div>
    //           <p className="text-[10px] font-bold text-neutral-300 uppercase tracking-widest">Offline / Cash</p>
    //           <p className="text-xl font-bold text-neutral-900 tracking-tight">₹0</p>
    //         </div>
    //       </div>
    //     </div>
    //   </div>

    //   {/* Daily Breakdown */}
    //   <div className="space-y-4">
    //     <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] flex items-center gap-2 px-3">
    //       <Calendar size={14} /> Transaction Log
    //     </h3>
    //     <div className="bg-white rounded-4xl border border-neutral-100 shadow-sm overflow-hidden divide-y divide-neutral-50">
    //       {activeBookings.length > 0 ? (
    //          activeBookings.map(b => {
    //            const turf = turfs.find(t => t.id === b.turfId);
    //            return (
    //              <div key={b.id} className="flex justify-between items-center p-5">
    //                <div className="space-y-0.5">
    //                  <p className="font-bold text-neutral-900 text-sm">{new Date(b.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</p>
    //                  <div className="flex items-center gap-2">
    //                     <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-tight">{b.clientName}</p>
    //                     {isAll && turf && turfs.length > 1 && (
    //                       <span className="text-[7px] font-bold text-neutral-300 uppercase px-1 border border-neutral-50 rounded">
    //                         {turf.name}
    //                       </span>
    //                     )}
    //                  </div>
    //                </div>
    //                <p className="font-bold text-emerald-700 tracking-tight">{formatCurrency(b.totalAmount)}</p>
    //              </div>
    //            );
    //          })
    //       ) : (
    //         <div className="py-12 text-center">
    //           <p className="text-neutral-400 text-[10px] font-bold uppercase tracking-widest">No active transactions found</p>
    //         </div>
    //       )}
    //     </div>
    //   </div>
    // </div>

    <div className="py-6 space-y-8 animate-in fade-in duration-500 overflow-hidden">
      {/* Header & Filter System */}
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">
            Financial Hub
          </h2>
          <TurfSelector
            turfs={turfs ?? []}
            selectedTurfId={selectedTurfId}
            onSelect={onSelectTurf}
          />
        </div>

        <div className="space-y-4">
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {presets.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setTimePreset(p.id);
                  setCustomRange({ start: "", end: "" });
                }}
                className={`shrink-0 px-4 h-9 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                  timePreset === p.id && !customRange.start
                    ? "bg-neutral-900 text-white shadow-xl"
                    : "bg-white text-neutral-400 border border-neutral-100 hover:border-neutral-200 shadow-sm"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white border border-neutral-100 rounded-2xl p-3 shadow-sm">
              <label className="text-[9px] font-black text-neutral-300 uppercase tracking-widest block mb-1">
                From
              </label>
              <input
                type="date"
                className="w-full bg-transparent border-none text-[11px] font-bold text-neutral-700 outline-none p-0 h-5"
                value={customRange.start}
                onChange={(e) =>
                  setCustomRange({ ...customRange, start: e.target.value })
                }
              />
            </div>
            <div className="bg-white border border-neutral-100 rounded-2xl p-3 shadow-sm">
              <label className="text-[9px] font-black text-neutral-300 uppercase tracking-widest block mb-1">
                To
              </label>
              <input
                type="date"
                className="w-full bg-transparent border-none text-[11px] font-bold text-neutral-700 outline-none p-0 h-5"
                value={customRange.end}
                onChange={(e) =>
                  setCustomRange({ ...customRange, end: e.target.value })
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* Period Summary Card */}
      <section className="bg-neutral-900 rounded-[40px] p-6 sm:p-8 text-white relative overflow-hidden shadow-2xl shadow-neutral-900/30">
        <div className="relative z-10">
          <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.2em]">
            Net Performance
          </span>
          <div className="flex items-baseline gap-3 mt-1">
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
              {formatCurrency(totalRevenue)}
            </h2>
            <TrendingUp className="text-emerald-500 shrink-0" size={24} />
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-8 mt-10 border-t border-white/10 pt-8">
            <div className="min-w-0">
              <p className="text-neutral-500 text-[9px] font-black uppercase tracking-widest">
                Bookings
              </p>
              <p className="text-lg font-bold">{totalSessions}</p>
            </div>
            <div className="min-w-0">
              <p className="text-neutral-500 text-[9px] font-black uppercase tracking-widest truncate">
                Period End
              </p>
              <p className="text-xs sm:text-sm font-bold text-neutral-300">
                {new Date(end).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                })}
              </p>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px] -mr-32 -mt-32" />
      </section>

      {/* Tabular Statement */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] flex items-center gap-2">
            <BarChart3 size={14} /> Audit Trail
          </h3>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 text-[10px] font-bold text-emerald-600 uppercase tracking-widest hover:bg-emerald-50 px-3 py-1.5 rounded-full transition-colors"
          >
            <Download size={12} /> {isExporting ? "Exporting..." : "CSV"}
          </button>
        </div>

        <div className="bg-white rounded-[32px] border border-neutral-100 shadow-sm overflow-hidden overflow-x-auto no-scrollbar">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-neutral-50/50 border-b border-neutral-100 text-[9px] font-black text-neutral-400 uppercase tracking-widest">
                <th className="px-5 py-4 min-w-[120px]">Date</th>
                <th className="px-5 py-4 text-center">Bookings</th>
                <th className="px-5 py-4 text-right">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {groupedData.length > 0 ? (
                groupedData.map((day) => (
                  <tr
                    key={day.date}
                    className="hover:bg-neutral-50/50 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <p className="text-xs font-bold text-neutral-900">
                        {new Date(day.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          weekday: "short",
                        })}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className="text-[10px] font-bold text-neutral-500">
                        {day.count}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <p className="text-xs font-bold text-emerald-700">
                        {formatCurrency(day.revenue)}
                      </p>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Calendar size={32} className="text-neutral-100" />
                      <p className="text-neutral-400 text-[10px] font-bold uppercase tracking-widest">
                        No activity found
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
            {groupedData.length > 0 && (
              <tfoot>
                <tr className="bg-neutral-900 text-white font-bold text-xs">
                  <td className="px-5 py-5 rounded-bl-[32px]">TOTAL</td>
                  <td className="px-5 py-5 text-center text-neutral-400">
                    {totalSessions}
                  </td>
                  <td className="px-5 py-5 text-right text-emerald-400 rounded-br-[32px]">
                    {formatCurrency(totalRevenue)}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      <div className="pb-8">
        <p className="text-center text-[9px] font-bold text-neutral-300 uppercase tracking-[0.3em]">
          Financial Summary Report
        </p>
      </div>
    </div>
  );
};

export default RevenueView;
