"use client";

import React from 'react';
import AvailabilityView from '../../../views/AvailabilityView.tsx';
import { useStore } from '../../../lib/store.tsx';
import { useRouter } from '../../../lib/navigation.ts';
import { Booking } from '../../../types.ts';

export default function AvailabilityPage() {
  const { state, setSelectedTurf, cancelBooking, setEditingBooking } = useStore();
  const router = useRouter();

  const handleEdit = (b: Booking) => {
    setEditingBooking(b);
    router.push('/add-booking');
  };

  const handleAdd = () => {
    setEditingBooking(null);
    router.push('/add-booking');
  };

  return (
    <AvailabilityView 
      turfs={state.turfs}
      selectedTurfId={state.selectedTurfId}
      onSelectTurf={setSelectedTurf}
      bookings={state.bookings}
      onSlotClick={handleAdd}
      onEditBooking={handleEdit}
      onCancelBooking={cancelBooking}
    />
  );
}