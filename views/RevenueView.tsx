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
  const [timePreset, setTimePreset] = useState("3m");
  const [customRange, setCustomRange] = useState({ start: "", end: "" });
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  console.log("bookings", bookings);

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
      const dateKey = b.date.split("T")[0];
      const entry = map.get(dateKey) || { date: dateKey, count: 0, revenue: 0 };
      entry.count += 1; // ← missing
      entry.revenue += b.amount; // ← missing
      map.set(dateKey, entry);
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
    { id: "all", label: "All" },
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
