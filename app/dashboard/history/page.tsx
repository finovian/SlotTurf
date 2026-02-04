"use client";

import { useBookings, useTurfs } from "@/hooks/use-data";
import { useUIStore } from "@/lib/store";
import HistoryView from "@/views/HistoryView";



export default function HistoryPage() {
  const { selectedTurfId, setSelectedTurfId } = useUIStore();
  const { data: turfs } = useTurfs();
  const { data: bookings = [] } = useBookings();

  const isAll = selectedTurfId === 'all';
  const activeScopedBookings = bookings.filter(b => isAll ? true : b.turfId === selectedTurfId);

  return (
    <HistoryView
      bookings={activeScopedBookings}
      turfs={turfs?.ground}
      selectedTurfId={selectedTurfId}
      onSelectTurf={setSelectedTurfId}
    />
  );
}
