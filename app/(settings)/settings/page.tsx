"use client";

import React, { useState } from 'react';
import SettingsView from '../../../views/SettingsView.tsx';
import { useStore } from '../../../lib/store.tsx';
import { useRouter } from '../../../lib/navigation.ts';
import { View } from '../../../types.ts';
import ConfirmationModal from '../../../components/Modal.tsx';

export default function SettingsPage() {
  const { state, logout } = useStore();
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState<'logout' | 'delete' | null>(null);

  const navigate = (view: View) => {
    const map: Partial<Record<View, string>> = {
      [View.EDIT_TURF]: '/settings/edit-turf',
      [View.CUSTOMERS]: '/settings/customers',
      [View.SUBSCRIPTION]: '/billing',
      [View.LEGAL]: '/legal',
      [View.SUPPORT]: '/support',
    };
    const path = map[view];
    if (path) router.push(path);
  };

  return (
    <>
      <SettingsView 
        turf={state.turfs.find(t => t.id === state.selectedTurfId) || state.turfs[0]}
        onLogout={() => setShowConfirm('logout')}
        onNavigate={navigate}
        onDeleteAccount={() => setShowConfirm('delete')}
      />
      <ConfirmationModal 
        isOpen={!!showConfirm}
        onClose={() => setShowConfirm(null)}
        onConfirm={() => {
          if (showConfirm === 'logout' || showConfirm === 'delete') logout();
          setShowConfirm(null);
        }}
        title={showConfirm === 'logout' ? 'Logout?' : 'Delete Account?'}
        description={showConfirm === 'logout' ? 'You will be signed out.' : 'This will erase all data.'}
        confirmLabel={showConfirm === 'logout' ? 'Logout' : 'Delete All'}
        isDanger={showConfirm === 'delete'}
      />
    </>
  );
}