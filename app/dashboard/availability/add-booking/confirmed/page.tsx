"use client";

import BookingConfirmedView from "@/views/BookingConfirmedView";
import { useRouter } from "next/navigation";


const mockBooking = {
  id: "B-MOCK123",
  client_name: "John Doe",
  client_mobile: "9876543210",
  date: "20-11-2025",
  start_time: "18:00",
  end_time: "19:00",
  hours: 1,
  amount: 1500,
  status: "booked",
  turfID: "T-1",
} as const;
export default function BookingConfirmedPage() {
  const router = useRouter();

  const handleDone = () => {
    router.replace("/dashboard");
  };

  return <BookingConfirmedView booking={mockBooking} onDone={handleDone} />;
}
