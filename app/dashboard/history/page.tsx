"use client";

import { useHistory, useTurfs } from "@/hooks/use-data";
import { useUIStore } from "@/lib/store";
import HistoryView from "@/views/HistoryView";
import { useState } from "react";

export default function HistoryPage() {
  const { selectedTurfId, setSelectedTurfId } = useUIStore();
  const { data: turfs } = useTurfs();
  
  const { data: history, isLoading } = useHistory({
    ground_id: selectedTurfId === "all" ? "" : selectedTurfId ?? "",
  });

  const bookings =
    history?.bookings?.map((b: any) => ({
      ...b,
      date: b.booking_date || b.date,
      turfID: b.edges?.ground?.id || b.turfID,
    })) ?? [];

  return (
    <HistoryView
      bookings={bookings}
      turfs={turfs?.ground ?? []}
      selectedTurfId={selectedTurfId}
      onSelectTurf={setSelectedTurfId}
    />
  );
}