import React, { useState, useRef, useEffect } from "react";
import {
  Clock,
  Edit2,
  Trash2,
  MapPin,
  Plus,
  Check,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Book,
} from "lucide-react";

import { Turf, Booking } from "../types";
import { generateTimeSlots } from "../lib/helpers";

import TurfSelector from "../components/TurfSelector";
import { AvailabilitySkeleton } from "../components/Skeleton";
import DesktopSchedule from "@/components/DesktopSchedule";
import MobileSchedule from "@/components/MobileSchedule";
import { toHHMM } from "@/utils/helpers";

interface AvailabilityViewProps {
  turfs: Turf[];
  selectedTurfId: string | null;
  onSelectTurf: (id: string) => void;
  bookings: Booking[];
  onSlotClick: () => void;
  onEditBooking: (booking: Booking) => void;
  onCancelBooking: (bookingId: string) => void;
}

/* ---------------- Utils ---------------- */

const timeToMinutes = (time: string) => {
  const [t, modifier] = time.split(" ");
  let [hours, minutes] = t.split(":").map(Number);

  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;

  return hours * 60 + (minutes || 0);
};

/* ---------------- Component ---------------- */

const AvailabilityView: React.FC<AvailabilityViewProps> = ({
  turfs,
  selectedTurfId,
  onSelectTurf,
  bookings,
  onSlotClick,
  onEditBooking,
  onCancelBooking,
}) => {
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const [activeActionSlot, setActiveActionSlot] = useState<string | null>(null);
  const [selectedSlots, setSelectedSlots] = React.useState<string[]>([]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);

  const isAll = selectedTurfId === "all";
  const activeTurf = turfs?.find((t) => t.id === selectedTurfId);

  const timeSlots = activeTurf
    ? generateTimeSlots(
        toHHMM(activeTurf?.open_time),
        toHHMM(activeTurf?.close_time),
      )
    : [];

  /* ---------------- Effects ---------------- */

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  /* ---------------- Dates ---------------- */

  const nextDates = Array.from({ length: 60 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toISOString().split("T")[0];
  });

  /* ---------------- Slot Logic ---------------- */

  const getSlotStatus = (time: string) => {
    if (isAll) return null;

    const slotMinutes = timeToMinutes(time);

    return bookings.find((b) => {
      if (
        b.turfId !== selectedTurfId ||
        b.date !== selectedDate ||
        b.status !== "active"
      ) {
        return false;
      }

      const start = timeToMinutes(b.startTime);
      const end = timeToMinutes(b.endTime);

      // End time is exclusive
      return slotMinutes >= start && slotMinutes < end;
    });
  };

  const handleCancelClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onCancelBooking(id);
    setActiveActionSlot(null);
  };

  /* ---------------- Scroll ---------------- */

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;

    const scrollAmount = 300;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  if (loading) return <AvailabilitySkeleton />;

  return (
    <div className="py-4 space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-widest">
          Slots
        </h2>

        <div className="flex items-center gap-2 shrink-0">
          <div className="relative">
            <input
              type="date"
              ref={dateInputRef}
              className="cursor-pointer absolute inset-0 opacity-0 pointer-events-none"
              onChange={(e) => {
                setSelectedSlots([]);
                setSelectedDate(e.target.value);
              }}
              value={selectedDate}
            />
            <button
              onClick={() => dateInputRef.current?.showPicker()}
              className="cursor-pointer w-10 h-10 bg-white border border-neutral-200 rounded-xl flex items-center justify-center text-neutral-400 hover:text-neutral-900 shadow-sm transition-all active:scale-95"
            >
              <CalendarIcon size={20} />
            </button>
          </div>
          {turfs?.length > 0 && (
            <TurfSelector
              turfs={turfs}
              selectedTurfId={selectedTurfId}
              onSelect={onSelectTurf}
              allowAll={false}
            />
          )}
        </div>
      </div>

      {/* All Turf Placeholder */}
      {isAll ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[40px] border border-dashed border-neutral-200 px-8 text-center space-y-4">
          <div className="w-16 h-16 bg-neutral-100 text-neutral-400 rounded-3xl flex items-center justify-center">
            <MapPin size={32} />
          </div>

          <div className="space-y-1">
            <h4 className="text-xl font-bold text-neutral-900">
              Select a Location
            </h4>
            <p className="text-sm text-neutral-500 font-medium max-w-sm mx-auto">
              Please select a specific facility from the dropdown to view and
              manage its time-slots.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 pt-4">
            {turfs?.map((t) => (
              <button
                key={t.id}
                onClick={() => onSelectTurf(t.id)}
                className="cursor-pointer px-6 h-12 bg-neutral-900 text-white rounded-2xl text-xs font-bold uppercase tracking-widest active:scale-95 transition-all shadow-xl shadow-neutral-900/10"
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Date Picker */}
          <div className="relative group">
            {/* Left */}
            <button
              onClick={() => scroll("left")}
              className="cursor-pointer absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 backdrop-blur-md border border-neutral-200 rounded-full hidden lg:flex items-center justify-center text-neutral-600 shadow-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-neutral-900 hover:text-white hover:scale-110 -ml-5"
            >
              <ChevronLeft size={20} />
            </button>

            {/* Gradients */}
            <div className=" bsolute left-0 inset-y-0 w-8 bg-linear-to-r from-neutral-50 to-transparent z-5 hidden lg:block pointer-events-none" />
            <div className="absolute right-0 inset-y-0 w-8 bg-linear-to-l from-neutral-50 to-transparent z-5 hidden lg:block pointer-events-none" />

            {/* Dates */}
            <div
              ref={scrollRef}
              className="flex gap-3 overflow-x-auto pb-4 px-1 scroll-smooth snap-x snap-mandatory scrollbar-hide bg-neutral-50"
            >
              {nextDates.map((date) => {
                const d = new Date(date);
                const isSelected = selectedDate === date;
                const isToday = new Date().toISOString().split("T")[0] === date;

                return (
                  <button
                    key={date}
                    onClick={() => {
                      setSelectedSlots([]);
                      setSelectedDate(date);
                    }}
                    className={`cursor-pointer shrink-0 w-18 h-24 rounded-[28px] flex flex-col items-center justify-center transition-all border snap-center
                      ${
                        isSelected
                          ? "bg-neutral-900 border-neutral-900 text-white shadow-xl shadow-neutral-900/10"
                          : "bg-white border-neutral-100 text-neutral-500"
                      }`}
                  >
                    <span
                      className={`text-[10px] font-bold uppercase tracking-widest ${
                        isSelected
                          ? "opacity-60 text-emerald-400"
                          : "opacity-40"
                      }`}
                    >
                      {d.toLocaleDateString("en-US", { weekday: "short" })}
                    </span>

                    <span className="text-2xl font-bold mt-1 tracking-tighter">
                      {d.getDate()}
                    </span>

                    {isToday && (
                      <div
                        className={`w-1 h-1 rounded-full mt-1 ${
                          isSelected ? "bg-emerald-400" : "bg-emerald-500"
                        }`}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Right */}
            <button
              onClick={() => scroll("right")}
              className="cursor-pointer absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white/90 backdrop-blur-md border border-neutral-200 rounded-full hidden lg:flex items-center justify-center text-neutral-600 shadow-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-neutral-900 hover:text-white hover:scale-110 -mr-5"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Schedules */}
          <DesktopSchedule
            selectedDate={selectedDate}
            timeSlots={timeSlots}
            getSlotStatus={getSlotStatus}
            activeActionSlot={activeActionSlot}
            setActiveActionSlot={setActiveActionSlot}
            onSlotClick={onSlotClick}
            onEditBooking={onEditBooking}
            handleCancelClick={handleCancelClick}
            setSelectedSlots={setSelectedSlots}
            selectedSlots={selectedSlots}
          />

          <MobileSchedule
            selectedDate={selectedDate}
            timeSlots={timeSlots}
            getSlotStatus={getSlotStatus}
            activeActionSlot={activeActionSlot}
            setActiveActionSlot={setActiveActionSlot}
            onSlotClick={onSlotClick}
            onEditBooking={onEditBooking}
            handleCancelClick={handleCancelClick}
            setSelectedSlots={setSelectedSlots}
            selectedSlots={selectedSlots}
          />
        </>
      )}

      {selectedSlots.length > 0 && (
        <div className="fixed bottom-26 right-8 lg:right-10 z-100">
          <button
            onClick={onSlotClick}
            className="cursor-pointer w-fit min-w-16 h-16 bg-emerald-600 text-white rounded-3xl flex items-center justify-center shadow-[0_8px_30px_rgb(5,150,105,0.4)] hover:shadow-[0_8px_30px_rgb(5,150,105,0.6)] hover:-translate-y-1 active:scale-90 transition-all duration-300 border-2 border-white"
          >
            <Plus size={36} />
          </button>
        </div>
      )}
    </div>
  );
};

export default AvailabilityView;
