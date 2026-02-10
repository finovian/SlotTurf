"use client";

import { useBookings, useTurfs } from "@/hooks/use-data";
import { useUIStore } from "@/lib/store";
import RevenueView from "@/views/RevenueView";



export default function RevenuePage() {
  const { selectedTurfId, setSelectedTurfId } = useUIStore();
  const { data: turfs  } = useTurfs();
  const { data: bookings  } = useBookings();

  const isAll = selectedTurfId === 'all';
  const activeScopedBookings = bookings?.bookings?.filter(b => isAll ? true : b.turfID === selectedTurfId);

  return (
    <RevenueView
      bookings={activeScopedBookings ?? []}
      turfs={turfs?.ground ?? []}
      selectedTurfId={selectedTurfId}
      onSelectTurf={setSelectedTurfId}
    />
  );
}
