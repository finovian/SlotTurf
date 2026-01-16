"use client";

import React from 'react';
import DashboardView from '../../views/DashboardView.tsx';
import { useStore } from '../../lib/store.tsx';
import OnboardingView from '../../views/OnboardingView.tsx';

export default function HomePage() {
  const { state, setSelectedTurf, setOnboarding } = useStore();

  if (state.turfs.length === 0) {
    return <OnboardingView onComplete={setOnboarding} />;
  }

  return (
    <DashboardView 
      turfs={state.turfs} 
      selectedTurfId={state.selectedTurfId} 
      onSelectTurf={setSelectedTurf} 
      bookings={state.bookings} 
    />
  );
}