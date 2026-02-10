"use client";

import { Check, Clock, Plus, X } from "lucide-react";
import { toHHMM } from "@/utils/helpers";
import { SLOT_UI, SlotState } from "@/const/SlotsUI";

const DesktopSchedule = ({
  selectedDate,
  timeSlots,
  getSlotStatus,
  activeActionSlot,
  setActiveActionSlot,
  onEditBooking,
  handleCancelClick,
  setSelectedSlots,
  selectedSlots,
}: any) => {
  const timeToMinutes = (time: string) => {
    const [t, modifier] = time.split(" ");
    let [hours, minutes] = t.split(":").map(Number);

    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    return hours * 60 + (minutes || 0);
  };

  const handleSlotSelect = (time: string) => {
    const isBooked = getSlotStatus(time);
    if (isBooked) {
      setActiveActionSlot(time);
      return;
    }

    // Toggle off
    if (selectedSlots.includes(time)) {
      setSelectedSlots([]);
      return;
    }

    // First selection
    if (selectedSlots.length === 0) {
      setSelectedSlots([time]);
      return;
    }

    // Range selection
    const start = timeToMinutes(selectedSlots[0]);
    const end = timeToMinutes(time);

    const [min, max] = start < end ? [start, end] : [end, start];

    const rangeSlots = timeSlots.filter((t: string) => {
      const minutes = timeToMinutes(t);
      return minutes >= min && minutes <= max;
    });

    // ❌ Block if any slot in range is booked
    const hasBookedSlot = rangeSlots.some((t: string) => getSlotStatus(t));

    if (hasBookedSlot) {
      setSelectedSlots([time]);
      return; // silently block
    }

    setSelectedSlots(rangeSlots);
  };
  return (
    <>
      <div className="hidden lg:block space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between px-2">
          <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
            <Clock size={16} className="text-neutral-400" />
            Schedule for{" "}
            {new Date(selectedDate).toLocaleDateString("en-IN", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </h3>
        </div>

        {/* Slots Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {timeSlots.map((time: any, i: any) => {
            const booking = getSlotStatus(time);
            const slotState = booking?.status ?? "available";
            function isSlotState(value: string): value is SlotState {
              return value in SLOT_UI;
            }

            let ui;

            if (isSlotState(slotState)) {
              ui = SLOT_UI[slotState];
            } else {
              ui = SLOT_UI.available; // fallback
            }
            console.log("object", booking);
            const isSelected = selectedSlots.includes(time);

            return (
              <div key={time} className="relative h-full ">
                {/* Slot Card */}
                <div
                  className={`h-full flex flex-col justify-between p-6 rounded-4xl border transition-all duration-300
          ${isSelected ? "bg-[#0099662b] border-emerald-600 shadow-xl" : ui.card}
          ${ui.clickable ? "cursor-pointer" : "cursor-not-allowed"}
        `}
                  onClick={() => ui.clickable && handleSlotSelect(time)}
                >
                  {/* Time + Icon */}
                  <div className="flex justify-between items-start mb-6">
                    <div className="text-lg font-bold text-neutral-900">
                      {time}
                    </div>

                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center ${ui.iconWrap}`}
                    >
                      {ui.icon === "check" && <Check size={16} />}
                      {ui.icon === "plus" && <Plus size={16} />}
                      {ui.icon === "x" && <X size={16} />}
                    </div>
                  </div>

                  {/* Booking Info */}
                  <div className="space-y-1">
                    {booking ? (
                      <>
                        <p className="text-base font-bold text-black truncate">
                          {booking?.client_name}
                        </p>
                        <p className="text-[10px] font-bold text-neutral-800 uppercase tracking-widest">
                          {toHHMM(booking?.end_time)} End
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm font-bold text-emerald-600">
                          Available
                        </p>
                        <p className="text-[10px] font-bold text-black uppercase tracking-widest">
                          Open Slot
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* Actions Overlay (only for BOOKED) */}
                {booking?.status === "booked" && activeActionSlot === time && (
                  <div className="absolute inset-0 bg-neutral-900 rounded-4xl p-4 flex flex-col justify-center gap-2 z-10">
                    <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest text-center mb-2">
                      Actions
                    </p>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditBooking(booking);
                      }}
                      className="h-18 cursor-pointer bg-neutral-800 text-white rounded-xl text-xs font-bold uppercase"
                    >
                      Edit
                    </button>

                    <button
                      onClick={(e) => handleCancelClick(e, booking?.id)}
                      className="h-18  cursor-pointer bg-red-900/40 text-red-400 rounded-xl text-xs font-bold uppercase"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveActionSlot(null);
                      }}
                      className="h-18 cursor-pointer text-neutral-500 text-xs font-bold uppercase"
                    >
                      Close
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default DesktopSchedule;
