"use client";

import { useRouter } from "next/navigation";
import { useUIStore } from "../../../../lib/store";
import {
  useTurfs,
  useCreateBooking,
  useSaveBooking,
} from "../../../../hooks/use-data";
import AddBookingView from "../../../../views/AddBookingView";
import { Booking } from "../../../../types";

export default function AddBookingPage() {
  const router = useRouter();
  const { selectedTurfId, editingBooking } = useUIStore();
  const { data: turfs } = useTurfs();
  const saveBooking = useCreateBooking();
  const editBooking = useSaveBooking();

  const turf =
    turfs?.ground?.find((t) => t.id === selectedTurfId) || turfs?.ground?.[0];

  const handleAddBooking = (booking: Booking) => {
    console.log('editingBooking', editingBooking)
    if (editingBooking) {
      editBooking.mutate(booking, {
        onSuccess: () => {
          router.push("/dashboard/availability/add-booking/confirmed");
        }
      });
    } else {
      saveBooking.mutate(booking, {
        onSuccess: () => {
          router.push("/dashboard/availability/add-booking/confirmed");
        }
      });
    }
  };

  const handleConfirmBooking = (booking: Booking) => {
    // In a real app, you might want to pass the booking id
    // to the confirmation page, but for now we'll just navigate.
    router.push("/dashboard/availability/add-booking/confirmed");
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
