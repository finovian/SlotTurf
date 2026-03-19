import React, { useState, useMemo, useEffect, useRef } from "react";
import { Booking, Turf } from "../types";
// Fix: Use lib/helpers instead of deprecated utils/helpers
import { formatCurrency } from "../lib/helpers";
import { Search, Calendar as CalendarIcon, X } from "lucide-react";
import { ListSkeleton } from "../components/Skeleton";
import TurfSelector from "../components/TurfSelector";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

interface HistoryViewProps {
  bookings: Booking[];
  turfs: Turf[];
  selectedTurfId: string | null;
  onSelectTurf: (id: string) => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({
  bookings,
  turfs,
  selectedTurfId,
  onSelectTurf,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const dateInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const isAll = selectedTurfId === "all";
  const selectedTurfName = isAll
    ? "All Turfs"
    : turfs?.find((t) => t.id === selectedTurfId)?.name || "Ground";

  const filteredAndGroupedBookings = useMemo(() => {
    // Filter by name/phone AND date (scoping already handled by props)
    const filtered = bookings.filter((b) => {
      const matchesSearch =
        b.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.client_mobile.includes(searchTerm);
      const matchesDate = selectedDate
        ? dayjs.utc(b.date).format("YYYY-MM-DD") === selectedDate
        : true;
      return matchesSearch && matchesDate;
    });

    // Sort by created time descending
    const sorted = [...filtered].sort((a, b) => {
      const t1 = new Date(`1970-01-01T${a.start_time}:00`);
      const t2 = new Date(`1970-01-01T${b.start_time}:00`);
      return t2.getTime() - t1.getTime();
    });

    // Group by date
    const groups: { [key: string]: Booking[] } = {};
    sorted.forEach((booking) => {
      const dateKey = dayjs.utc(booking.date).format("YYYY-MM-DD");
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(booking);
    });

    return Object.entries(groups).sort(
      (a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime(),
    );
  }, [bookings, searchTerm, selectedDate]);

  const formatDateHeader = (dateStr: string) => {
    const d = new Date(dateStr);
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000)
      .toISOString()
      .split("T")[0];

    if (dateStr === today) return "Today";
    if (dateStr === yesterday) return "Yesterday";

    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedDate("");
  };

  if (loading) return <ListSkeleton />;

  return (
    <div className="py-4 space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-widest">
          History
        </h2>
        {turfs?.length > 1 && (
          <TurfSelector
            turfs={turfs}
            selectedTurfId={selectedTurfId}
            onSelect={onSelectTurf}
          />
        )}
      </div>

      {turfs?.length > 1 && (
        <div className="px-2">
          <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">
            Showing results for:{" "}
            <span className="text-emerald-600">{selectedTurfName}</span>
          </p>
        </div>
      )}

      {/* Advanced Search Header */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search bookings..."
            className="text-black placeholder:text-[#a1a1a1] w-full h-14 bg-white border border-neutral-100 rounded-2xl pl-12 pr-4 outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-600 transition-all font-medium text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="relative">
          <label
            onClick={() => dateInputRef.current?.showPicker()}
            className={`h-14 w-14 flex items-center justify-center rounded-2xl border transition-all cursor-pointer active:scale-95 ${selectedDate ? "bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-600/20" : "bg-white border-neutral-100 text-neutral-400"}`}
          >
            <CalendarIcon size={20} />
            <input
              type="date"
              ref={dateInputRef}
              className="cursor-pointer absolute inset-0 opacity-0 pointer-events-none"
              onChange={(e) => setSelectedDate(e.target.value)}
              value={selectedDate}
            />
          </label>

          {selectedDate && (
            <button
              onClick={() => setSelectedDate("")}
              className="cursor-pointer absolute -top-1 -right-1 w-5 h-5 bg-neutral-900 text-white rounded-full flex items-center justify-center border-2 border-neutral-50"
            >
              <X size={10} strokeWidth={3} />
            </button>
          )}
        </div>
      </div>

      {/* History List Grouped by Date */}
      <div className="space-y-8">
        {filteredAndGroupedBookings.length > 0 ? (
          filteredAndGroupedBookings.map(([date, groupBookings]) => (
            <div key={date} className="space-y-3">
              <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] px-3">
                {formatDateHeader(date)}
              </h3>
              <div className="space-y-3">
                {groupBookings.map((booking) => {
                  const turf = turfs?.find((t) => t.id === booking.turfID);
                  return (
                    <div
                      key={booking.id}
                      className={`bg-white rounded-[28px] border border-neutral-50 p-5 shadow-sm flex justify-between items-center transition-all ${booking.status === "cancelled" ? "opacity-60 bg-neutral-50/50" : ""}`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-neutral-800 tracking-tight text-sm">
                            {booking.client_name}
                          </h4>
                          {booking.status === "cancelled" ? (
                            <span className="bg-red-50 text-red-500 px-1.5 py-0.5 rounded-lg text-[8px] font-bold uppercase tracking-wider">
                              Cancelled
                            </span>
                          ) : (
                            isAll &&
                            turf &&
                            turfs?.length > 1 && (
                              <span className="text-[8px] font-bold text-neutral-400 bg-neutral-50 border border-neutral-100 px-1.5 py-0.5 rounded-md uppercase tracking-tighter">
                                {turf.name}
                              </span>
                            )
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-neutral-400 font-bold uppercase tracking-tight">
                          <span className="text-neutral-500">
                            {/* {booking.start_time} – {booking.end_time} */}
                            {dayjs.utc(booking.start_time).local().format("h:mm A")} – {dayjs.utc(booking.end_time).local().format("h:mm A")}
                          </span>
                          <span className="w-1 h-1 bg-neutral-200 rounded-full" />
                          <span>{booking.client_mobile}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-bold tracking-tight text-sm ${booking.status === "cancelled" ? "text-neutral-400 line-through" : "text-emerald-700"}`}
                        >
                          {formatCurrency(booking.amount)}
                        </p>
                        <p className="text-[9px] font-bold text-neutral-300 uppercase tracking-tighter">
                          REF: {booking.id}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-[40px] border border-neutral-100/50 border-dashed">
            <p className="text-neutral-400 text-[10px] font-bold uppercase tracking-[0.2em]">
              No bookings found for selected filters
            </p>
            {(searchTerm || selectedDate) && (
              <button
                onClick={clearFilters}
                className="mt-4 text-xs font-bold text-emerald-600 uppercase tracking-widest border-b border-emerald-600/20 pb-0.5"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryView;
