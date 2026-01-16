"use client";

import React from 'react';
import AddBookingView from '../../../views/AddBookingView.tsx';
import { useStore } from '../../../lib/store.tsx';
import { useRouter } from '../../../lib/navigation.ts';
import { Booking } from '../../../types.ts';

export default function AddBookingPage() {
  const { state, saveBooking } = useStore();
  const router = useRouter();

  const handleConfirm = (b: Booking) => {
    sessionStorage.setItem('last_booking', JSON.stringify(b));
    router.push('/confirmed');
  };

  return (
    <AddBookingView 
      turf={state.turfs.find(t => t.id === state.selectedTurfId) || state.turfs[0]}
      onAdd={saveBooking}
      onConfirm={handleConfirm}
      initialData={state.editingBooking}
    />
  );
}