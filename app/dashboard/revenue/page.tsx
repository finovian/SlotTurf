"use client";

import { useHistory, useTurfs } from "@/hooks/use-data";
import { useUIStore } from "@/lib/store";
import RevenueView from "@/views/RevenueView";

export default function RevenuePage() {
  const { selectedTurfId, setSelectedTurfId } = useUIStore();
  const { data: turfs } = useTurfs();
  const { data: history } = useHistory({
    ground_id: selectedTurfId === "all" ? "" : (selectedTurfId ?? ""),
  });

  const bookings =
    history?.bookings?.map((b: any) => ({
      ...b,
      date: b.booking_date,
      turfID: b.edges?.ground?.id,
    })) ?? [];

  return (
    <RevenueView
      bookings={bookings}
      turfs={turfs?.ground ?? []}
      selectedTurfId={selectedTurfId}
      onSelectTurf={setSelectedTurfId}
    />
  );
}
