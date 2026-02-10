"use client";

import { SLOT_UI, SlotState } from "@/const/SlotsUI";
import { toHHMM } from "@/utils/helpers";
import { Clock } from "lucide-react";

const MobileSchedule = ({
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
      if (activeActionSlot == time) {
        setActiveActionSlot(null);
        return;
      }
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
    <div className="lg:hidden space-y-4">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-2">
          <Clock size={14} /> Schedule
        </h3>
        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
          {new Date(selectedDate).toLocaleDateString("en-IN", {
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      <div className="bg-white rounded-4xl border border-neutral-100 shadow-sm divide-y">
        {timeSlots.map((time: any, i: number) => {
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

          const isSelected = selectedSlots.includes(time);

          return (
            <div key={time}>
              <div
                className={`h-full flex flex-col justify-between p-6 border transition-all duration-300 cursor-pointer overflow-hidden ${timeSlots?.length == i + 1 && "rounded-b-4xl"} ${i == 0 && "rounded-t-4xl"}
                    ${
                      isSelected
                        ? "bg-[#0099662b] text-black border-emerald-600 shadow-xl"
                        : ui.card
                      // ? `bg-gray-300 border-neutral-100 opacity-60  `
                      // : "bg-emerald-50/10 border-emerald-100/30 hover:bg-emerald-50/30 hover:border-emerald-200"
                    }`}
                onClick={() => ui.clickable && handleSlotSelect(time)}
              >
                <div className="flex items-center gap-6">
                  <div
                    className={`w-14 text-sm font-bold ${booking ? "text-black" : "text-neutral-400"}`}
                  >
                    {time}
                  </div>

                  <div>
                    {booking ? (
                      <>
                        <p className="text-sm font-bold text-neutral-900">
                          {booking.client_name}
                        </p>
                        <p className="text-[10px] text-neutral-800 uppercase">
                          {toHHMM(booking?.end_time)} End
                        </p>
                      </>
                    ) : (
                      <p className="text-sm font-semibold text-emerald-600">
                        Available
                      </p>
                    )}
                  </div>
                  {/* <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center ${ui.iconWrap}`}
                    >
                      {ui.icon === "check" && <Check size={16} />}
                      {ui.icon === "plus" && <Plus size={16} />}
                      {ui.icon === "x" && <X size={16} />}
                    </div> */}
                </div>
              </div>

              {booking?.status === "booked" && activeActionSlot === time && (
                <div className="flex gap-2 bg-neutral-900 p-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditBooking(booking);
                    }}
                    className="flex-1 h-12 bg-neutral-800 text-white rounded-xl text-xs font-bold uppercase"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => handleCancelClick(e, booking.id)}
                    className="flex-1 h-12 bg-red-900/40 text-red-400 rounded-xl text-xs font-bold uppercase"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MobileSchedule;
