"use client";

import { useRouter } from "next/navigation";
import { useUIStore } from "../../../../lib/store";
import { useTurfs, useSaveBooking } from "../../../../hooks/use-data";
import AddBookingView from "../../../../views/AddBookingView";
import { Booking } from "../../../../types";

export default function AddBookingPage() {
  const router = useRouter();
  const { selectedTurfId, editingBooking } = useUIStore();
  const { data: turfs = [] } = useTurfs();
  const saveBooking = useSaveBooking();

  const turf = turfs.find((t) => t.id === selectedTurfId) || turfs[0];

  const handleAddBooking = (booking: Booking) => {
    saveBooking.mutate(booking);
  };

  const handleConfirmBooking = (booking: Booking) => {
    // In a real app, you might want to pass the booking id
    // to the confirmation page, but for now we'll just navigate.
    router.push("/confirmed");
  };

  if (!turf) {
    // Handle case where turf is not found
    return <div>Loading...</div>;
  }

  return (
    <AddBookingView
      turf={turf}
      onAdd={handleAddBooking}
      onConfirm={handleConfirmBooking}
      initialData={editingBooking}
    />
  );
}
