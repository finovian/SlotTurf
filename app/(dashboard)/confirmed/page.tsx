"use client";

import React, { useEffect, useState } from 'react';
import BookingConfirmedView from '../../../views/BookingConfirmedView.tsx';
import { useRouter } from '../../../lib/navigation.ts';
import { Booking } from '../../../types.ts';

export default function ConfirmedPage() {
  const router = useRouter();
  const [booking, setBooking] = useState<Booking | null>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem('last_booking');
    if (saved) {
      setBooking(JSON.parse(saved));
    } else {
      router.replace('/');
    }
  }, []);

  if (!booking) return null;

  return <BookingConfirmedView booking={booking} onDone={() => router.push('/')} />;
}