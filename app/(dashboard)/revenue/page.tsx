"use client";

import React from 'react';
import RevenueView from '../../../views/RevenueView.tsx';
import { useStore } from '../../../lib/store.tsx';

export default function RevenuePage() {
  const { state, setSelectedTurf } = useStore();
  const isAll = state.selectedTurfId === 'all';
  const scopedBookings = state.bookings.filter(b => isAll ? true : b.turfId === state.selectedTurfId);

  return (
    <RevenueView 
      bookings={scopedBookings}
      turfs={state.turfs}
      selectedTurfId={state.selectedTurfId}
      onSelectTurf={setSelectedTurf}
    />
  );
}