"use client";

import React from 'react';
import { StoreProvider } from "../lib/store.tsx";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="font-ubuntu bg-neutral-50 text-neutral-900 min-h-screen selection:bg-emerald-100 selection:text-emerald-900">
      <StoreProvider>
        {children}
      </StoreProvider>
    </div>
  );
}