"use client";

import { useBookings, useCancelBooking, useTurfs } from "@/hooks/use-data";
import { useUIStore } from "@/lib/store";
import { Booking } from "@/types";
import AvailabilityView from "@/views/AvailabilityView";
import { useRouter } from "next/navigation";



export default function AvailabilityPage() {
  const router = useRouter();
  const { selectedTurfId, setSelectedTurfId, setEditingBooking } = useUIStore();
  const { data: turfs = [] } = useTurfs();
  console.log('turfs', turfs)
  const { data: bookings = [] } = useBookings();
  const cancelBooking = useCancelBooking();

  const handleSlotClick = () => {
    setEditingBooking(null);
    router.push("/dashboard/availability/add-booking");
  };

  const handleEditBooking = (booking: Booking) => {
    setEditingBooking(booking);
    router.push("/dashboard/availability/add-booking");
  };

  return (
    <AvailabilityView
      turfs={turfs}
      selectedTurfId={selectedTurfId}
      onSelectTurf={setSelectedTurfId}
      bookings={bookings}
      onSlotClick={handleSlotClick}
      onEditBooking={handleEditBooking}
      onCancelBooking={(id) => cancelBooking.mutate(id)}
    />
  );
}
