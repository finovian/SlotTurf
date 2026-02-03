"use client";

import { useBookings, useCancelBooking, useTurfs } from "@/hooks/use-data";
import { useUIStore } from "@/lib/store";
import { Booking } from "@/types";
import AvailabilityView from "@/views/AvailabilityView";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AvailabilityPage() {
  const router = useRouter();
  const { selectedTurfId, setSelectedTurfId, setEditingBooking } = useUIStore();
  const { data: turfs } = useTurfs();
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

  useEffect(() => {
    if (turfs?.ground?.length <= 1) {
      setSelectedTurfId(turfs.ground?.[0]?.id);
    }
  }, [turfs?.ground?.length]);

  return (
    <AvailabilityView
      turfs={turfs?.ground}
      selectedTurfId={selectedTurfId ?? turfs?.ground?.[0]?.id }
      onSelectTurf={setSelectedTurfId}
      bookings={bookings}
      onSlotClick={handleSlotClick}
      onEditBooking={handleEditBooking}
      onCancelBooking={(id) => cancelBooking.mutate(id)}
    />
  );
}
