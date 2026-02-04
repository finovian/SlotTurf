"use client";

import { useBookings, useTurfs } from "@/hooks/use-data";
import { useUIStore } from "@/lib/store";
import DashboardView from "@/views/DashboardView";



export default function DashboardPage() {
  const { selectedTurfId, setSelectedTurfId } = useUIStore();
  const { data: turfs, isLoading: loadingTurfs } = useTurfs();
  const { data: bookings = [], isLoading: loadingBookings } = useBookings();

  return (
    <DashboardView
      turfs={turfs?.ground}
      selectedTurfId={selectedTurfId}
      onSelectTurf={setSelectedTurfId}
      bookings={bookings}
    />
  );
}
