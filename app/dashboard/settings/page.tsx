"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUIStore } from '@/lib/store';
import { useTurfs } from '@/hooks/use-data';
import { View } from '@/types';
import SettingsView from '@/views/SettingsView';


export default function SettingsPage() {
  const router = useRouter();
  const { owner, reset } = useUIStore();
  const { data: turfs = [] } = useTurfs();

  const handleLogout = () => {
    reset();
    router.replace('/login');
  };

  const handleDelete = () => {
    // In a real app, this would be a more complex flow.
    reset();
    router.replace('/login');
  }

  const handleNavigate = (view: View) => {
    const viewToHref: { [key in View]?: string } = {
      [View.EDIT_PROFILE]: '/dashboard/settings/profile',
      [View.EDIT_TURF]: '/dashboard/settings/turfs',
      [View.CUSTOMERS]: '/dashboard/settings/customers',
      [View.SUBSCRIPTION]: '#',
      [View.LEGAL]: '#',
      [View.SUPPORT]: '#',
    };
    const href = viewToHref[view];
    if (href) {
      router.push(href);
    }
  };

  return (
    <SettingsView
      owner={owner}
      turf={turfs[0]} // Pass a default turf
      onLogout={handleLogout}
      onNavigate={handleNavigate}
      onDeleteAccount={handleDelete}
    />
  );
}
