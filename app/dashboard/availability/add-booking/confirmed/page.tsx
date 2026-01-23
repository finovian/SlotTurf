"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useUIStore } from "../../../../../lib/store";
import { useBookings } from "../../../../../hooks/use-data";
import BookingConfirmedView from "../../../../../views/BookingConfirmedView";

// A simple mock booking for display purposes, as we are not passing the ID.
const mockBooking = {
  id: "B-MOCK123",
  turfId: "T-1",
  clientName: "John Doe",
  mobileNumber: "9876543210",
  date: new Date().toISOString().split("T")[0],
  startTime: "18:00",
  endTime: "19:00",
  hours: 1,
  totalAmount: 1500,
  createdAt: Date.now(),
  status: "active" as const,
};

export default function BookingConfirmedPage() {
  const router = useRouter();

  const handleDone = () => {
    router.replace("/dashboard");
  };

  return <BookingConfirmedView booking={mockBooking} onDone={handleDone} />;
}
