import React from "react";
import { Booking } from "../types";
// Fix: Use lib/helpers instead of deprecated utils/helpers
import { formatCurrency } from "../lib/helpers";
import { MessageCircle, CheckCircle2 } from "lucide-react";
import dayjs from "dayjs";

interface BookingConfirmedViewProps {
  booking: Booking;
  onDone: () => void;
}

const BookingConfirmedView: React.FC<BookingConfirmedViewProps> = ({
  booking,
  onDone,
}) => {
  const shareOnWhatsApp = () => {
    const formattedDate = dayjs(booking.date).format("dddd, MMM D, YYYY");
    const formatTime = (time: string) => {
      // If it's a full ISO string, format it. If it's already HH:mm, use it.
      return time.includes("T") ? dayjs(time).format("hh:mm A") : time;
    };

    const startTime = formatTime(booking.start_time);
    const endTime = formatTime(booking.end_time);

    const text = `✅ *Booking Confirmed!*

Hello *${booking.client_name}*, your booking at our turf has been successfully confirmed.

*Booking Details:*
📅 *Date:* ${formattedDate}
⏰ *Time:* ${startTime} - ${endTime}
💰 *Total Amount:* ${formatCurrency(booking.amount)}
📍 *Status:* Confirmed

We look forward to seeing you! ⚽🏆`;

    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/91${booking.client_mobile}?text=${encodedText}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 space-y-8 animate-in zoom-in-95 duration-500">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center animate-bounce">
            <CheckCircle2 size={48} />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-neutral-900">
          Booking Confirmed!
        </h1>
        <p className="text-neutral-500 max-w-xs mx-auto">
          The booking for{" "}
          <span className="text-neutral-900 font-semibold">
            {booking.client_name}
          </span>{" "}
          has been saved to your schedule.
        </p>
      </div>

      <div className="w-full max-w-xs space-y-3">
        <button
          onClick={shareOnWhatsApp}
          className="w-full h-14 bg-emerald-600 cursor-pointer text-white font-bold rounded-xl flex items-center justify-center gap-3 shadow-lg shadow-emerald-200/50 active:scale-95 transition-transform"
        >
          <MessageCircle size={20} />
          Share on WhatsApp
        </button>

        <button
          onClick={onDone}
          className="w-full cursor-pointer h-14 bg-white text-neutral-700 font-semibold rounded-xl border border-neutral-200 active:bg-neutral-50 transition-colors"
        >
          Return to Dashboard
        </button>
      </div>

      <div className="bg-neutral-100 p-4 rounded-xl border border-neutral-200 w-full max-w-xs">
        <div className="flex justify-between text-xs mb-2">
          <span className="text-neutral-500">Booking Reference</span>
          <span className="text-neutral-900 font-mono uppercase">
            {booking.id}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-neutral-500">Amount</span>
          <span className="text-neutral-900 font-bold">
            {formatCurrency(booking.amount)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmedView;
