"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  MapPin,
  Plus,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  User,
  Phone,
  Calendar,
  Trash2,
  Edit2,
  X,
} from "lucide-react";

import { Booking } from "../types";
import { generateTimeSlots, minutesToHHMM } from "../lib/helpers";

import TurfSelector from "../components/TurfSelector";
import { AvailabilitySkeleton } from "../components/Skeleton";
import DesktopSchedule from "@/components/DesktopSchedule";
import MobileSchedule from "@/components/MobileSchedule";
import dayjs from "dayjs";
import { useBookings, useCancelBooking, useTurfs } from "@/hooks/use-data";
import { useRouter } from "next/navigation";
import { useUIStore } from "@/lib/store";
import ConfirmationModal from "@/components/Modal";

/* ---------------- Utils ---------------- */

const timeToMinutes = (time: string) => {
  const [t, modifier] = time.split(" ");
  let [hours, minutes] = t.split(":").map(Number);

  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;

  return hours * 60 + (minutes || 0);
};

/* ---------------- Component ---------------- */

const AvailabilityView = ({}) => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedSlots, setSelectedSlots] = React.useState<string[]>([]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);
  const date = dayjs(selectedDate).format("YYYY-MM-DD");
  const router = useRouter();

  const { data: turfs, isLoading: isLoadingTurfs } = useTurfs();
  const {
    selectedTurfId,
    setSelectedTurfId,
    setEditingBooking,
    setSelectedDate: setStoreSelectedDate,
    setSelectedSlots: setStoreSelectedSlots,
  } = useUIStore();
  const cancelBooking = useCancelBooking();

  useEffect(() => {
    // If we have turfs and no selectedTurfId, pick the first one
    if (turfs?.ground?.length && !selectedTurfId && !isLoadingTurfs) {
      setSelectedTurfId(turfs.ground[0].id);
    }
    // Also handle case where selectedTurfId might be invalid (e.g. from a different user session)
    if (turfs?.ground?.length && selectedTurfId && !isLoadingTurfs) {
      const exists = turfs.ground.some(t => t.id === selectedTurfId);
      if (!exists) {
        setSelectedTurfId(turfs.ground[0].id);
      }
    }
  }, [turfs?.ground, selectedTurfId, isLoadingTurfs, setSelectedTurfId]);

  const activeTurf = turfs?.ground?.find((t) => t.id === selectedTurfId);

  const {
    data: bookings,
    isLoading: isLoadingBookings,
    isError,
  } = useBookings(activeTurf?.id, date);

  const timeSlots = activeTurf
    ? generateTimeSlots(
        minutesToHHMM(bookings?.open_time_minutes ?? 0),
        minutesToHHMM(bookings?.close_time_minutes ?? 0),
      )
    : [];

  const isAll = selectedTurfId === "all";

  const onSlotClick = () => {
    setEditingBooking(null);
    setStoreSelectedDate(selectedDate);
    setStoreSelectedSlots(selectedSlots);
    router.push("/dashboard/availability/add-booking");
  };

  const onEditBooking = (booking: Booking) => {
    setEditingBooking(booking);
    setStoreSelectedDate(null);
    setStoreSelectedSlots([]);
    router.push("/dashboard/availability/add-booking");
  };

  const clayShadow =
    "shadow-[10px_10px_20px_rgba(0,0,0,0.05),inset_-6px_-6px_12px_rgba(0,0,0,0.05),inset_6px_6px_12px_rgba(255,255,255,0.8)]";

  const formatTime = (utcTime: string) =>
    dayjs.utc(utcTime).local().format("HH:mm");

  const nextDates = Array.from({ length: 60 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toISOString().split("T")[0];
  });

  const getSlotStatus = (time: string) => {
    if (isAll) return null;

    const slotMinutes = timeToMinutes(time);

    return bookings?.bookings?.find((b) => {
      if (
        b.turfID !== selectedTurfId ||
        dayjs(b.date).format("YYYY-MM-DD") !== selectedDate ||
        !["booked", "completed"].includes(b.status)
      ) {
        return false;
      }

      const start = timeToMinutes(
        dayjs.utc(b.start_time).local().format("HH:mm"),
      );

      const end = timeToMinutes(dayjs.utc(b.end_time).local().format("HH:mm"));

      return slotMinutes >= start && slotMinutes < end;
    });
  };

  const handleCancel = () => {
    if (activeBooking) {
      cancelBooking.mutate(activeBooking.id, {
        onSuccess: () => {
          setShowConfirm(false);
          setActiveBooking(null);
        },
      });
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;

    const scrollAmount = 300;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  if (isLoadingTurfs || isLoadingBookings) return <AvailabilitySkeleton />;

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
          {turfs?.ground && turfs?.ground?.length > 0 && (
            <TurfSelector
              turfs={turfs?.ground}
              selectedTurfId={selectedTurfId}
              onSelect={setSelectedTurfId}
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
            {turfs?.ground?.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTurfId(t.id)}
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
            onSlotClick={(b: Booking) => setActiveBooking(b)}
            setSelectedSlots={setSelectedSlots}
            selectedSlots={selectedSlots}
          />

          <MobileSchedule
            selectedDate={selectedDate}
            timeSlots={timeSlots}
            getSlotStatus={getSlotStatus}
            onSlotClick={(b: Booking) => setActiveBooking(b)}
            setSelectedSlots={setSelectedSlots}
            selectedSlots={selectedSlots}
          />
        </>
      )}

      {selectedSlots.length > 0 && (
        <div className="fixed bottom-24 left-4 right-4 bg-neutral-900 text-white rounded-2xl px-4 py-3 flex items-center justify-between z-40 lg:hidden text-center">
          <div className="flex-1">
            <p className="text-xs font-bold">
              {selectedSlots[0]} – {selectedSlots[selectedSlots.length - 1]}
            </p>
            <p className="text-[10px] text-neutral-400">
              {selectedSlots.length} hr · ₹
              {selectedSlots.length * (activeTurf?.hourly_rate ?? 0)}
            </p>
          </div>
          <p className="text-xs font-bold text-emerald-400">Tap + to book</p>
        </div>
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

      {/* Action Modal */}
      {activeBooking && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-neutral-900/40 backdrop-blur-md animate-in fade-in"
            onClick={() => setActiveBooking(null)}
          />
          <div
            className={`relative bg-white w-full max-w-sm rounded-[56px] overflow-hidden animate-in slide-in-from-bottom-12 duration-500 ${clayShadow}`}
          >
            <div className="p-10 space-y-8">
              <div className="text-center space-y-3">
                <div
                  className={`w-20 h-20 bg-neutral-50 text-neutral-900 rounded-[32px] flex items-center justify-center mx-auto mb-4 ${clayShadow}`}
                >
                  <Calendar size={32} />
                </div>
                <h4 className="text-2xl font-bold text-neutral-900 tracking-tight">
                  {activeBooking.client_name}
                </h4>
                <p className="text-[11px] font-black text-neutral-400 uppercase tracking-widest flex items-center justify-center gap-2">
                  <Phone size={12} className="text-emerald-500" /> +91{" "}
                  {activeBooking.client_mobile}
                </p>
                <p className="text-xs font-bold text-neutral-500">
                  {formatTime(activeBooking.start_time)} –{" "}
                  {formatTime(activeBooking.end_time)} · {activeTurf?.name}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => onEditBooking(activeBooking)}
                  className={`w-full h-16 bg-white border border-neutral-50 text-neutral-900 font-bold rounded-[24px] flex items-center justify-center gap-2 active:scale-95 transition-all ${clayShadow}`}
                >
                  <Edit2 size={18} /> Edit
                </button>
                <button
                  onClick={() => setShowConfirm(true)}
                  className={`w-full h-16 bg-white border border-red-50 text-red-600 font-bold rounded-[24px] flex items-center justify-center gap-2 active:scale-95 transition-all ${clayShadow}`}
                >
                  <Trash2 size={18} /> Cancel
                </button>
              </div>
              <button
                onClick={() => setActiveBooking(null)}
                className="w-full text-neutral-400 hover:text-neutral-600 font-bold text-[11px] uppercase tracking-[0.3em] transition-all active:scale-95"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleCancel}
        title="Cancel Session?"
        description="This slot will be released and available for new bookings."
        confirmLabel="Yes, Cancel"
        isDanger={true}
      />
    </div>
  );
};

export default AvailabilityView;
