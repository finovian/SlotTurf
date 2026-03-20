"use client";

import { SLOT_UI, SlotState } from "@/const/SlotsUI";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
import { Clock } from "lucide-react";

const MobileSchedule = ({
  selectedDate,
  timeSlots,
  getSlotStatus,
  onSlotClick,
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
      onSlotClick(isBooked);
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

      <div className="bg-white rounded-4xl border border-neutral-100 shadow-sm divide-y overflow-hidden">
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
            <div
              key={time}
              className={`flex flex-col justify-between p-6 transition-all duration-300 cursor-pointer overflow-hidden
                    ${
                      isSelected
                        ? "bg-[#0099662b] text-black border-emerald-600"
                        : ui.card
                    }`}
              onClick={() => handleSlotSelect(time)}
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
                      <p className="text-[10px] text-neutral-500 uppercase">
                        Until{" "}
                        {dayjs.utc(booking.end_time).local().format("h:mm A")}
                      </p>
                    </>
                  ) : (
                    <p className="text-sm font-semibold text-emerald-600">
                      Available
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MobileSchedule;
