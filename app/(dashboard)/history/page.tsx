"use client";

import React from 'react';
import HistoryView from '../../../views/HistoryView.tsx';
import { useStore } from '../../../lib/store.tsx';

export default function HistoryPage() {
  const { state, setSelectedTurf } = useStore();
  const isAll = state.selectedTurfId === 'all';
  const scopedBookings = state.bookings.filter(b => isAll ? true : b.turfId === state.selectedTurfId);

  return (
    <HistoryView 
      bookings={scopedBookings}
      turfs={state.turfs}
      selectedTurfId={state.selectedTurfId}
      onSelectTurf={setSelectedTurf}
    />
  );
}