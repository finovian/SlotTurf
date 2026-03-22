"use client";

import { useEffect } from "react";
import BookingConfirmedView from "@/views/BookingConfirmedView";
import { useRouter } from "next/navigation";
import { useUIStore } from "@/lib/store";

export default function BookingConfirmedPage() {
  const router = useRouter();
  const { editingBooking, setSelectedDate, setSelectedSlots, setEditingBooking } = useUIStore();

  const handleDone = () => {
    setSelectedDate(null);
    setSelectedSlots([]);
    setEditingBooking(null);
    router.replace("/dashboard/availability");
  };

  // If we don't have a booking in store (e.g. refresh), show a fallback or redirect
  // For now, using the store's editingBooking if available, otherwise a placeholder
  const booking = editingBooking || {
    id: "B-NEW",
    client_name: "Customer",
    client_mobile: "",
    date: "",
    start_time: "",
    end_time: "",
    hours: 1,
    amount: 0,
    status: "booked",
    turfID: "",
  };

  return <BookingConfirmedView booking={booking as any} onDone={handleDone} />;
}
