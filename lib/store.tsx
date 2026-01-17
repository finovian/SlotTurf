import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState, Owner, Booking } from '../types.ts';

interface UIStore extends Omit<AppState, 'currentView'> {
  setLoggedIn: (isLoggedIn: boolean) => void;
  setOwner: (owner: Owner | undefined) => void;
  setSelectedTurfId: (id: string | null) => void;
  setTempMobile: (mobile: string | undefined) => void;
  setEditingBooking: (booking: Booking | null) => void;
  reset: () => void;
}

const STORAGE_KEY = 'turfflow_ui_v6';

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      owner: undefined,
      selectedTurfId: null,
      tempMobile: undefined,
      editingBooking: null,
      subscriptionActive: true,

      setLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
      setOwner: (owner) => set({ owner }),
      setSelectedTurfId: (id) => set({ selectedTurfId: id }),
      setTempMobile: (mobile) => set({ tempMobile: mobile }),
      setEditingBooking: (booking) => set({ editingBooking: booking }),
      
      reset: () => set({
        isLoggedIn: false,
        owner: undefined,
        selectedTurfId: null,
        tempMobile: undefined,
        editingBooking: null
      }),
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn,
        owner: state.owner,
        selectedTurfId: state.selectedTurfId,
      }),
    }
  )
);