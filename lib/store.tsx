import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState, Owner, Booking, Turf } from '../types';
import { useBookings, useCancelBooking, useSaveBooking, useTurfs } from '@/hooks/use-data';
import { HHMMToMinutes } from './helpers';



interface Toast {
  message: string;
  type: 'success' | 'error' | 'info';
  id: number;
}
interface UIStore extends Omit<AppState, 'currentView'> {
  currentView: any;
  toast: Toast | null;
  setLoggedIn: (isLoggedIn: boolean) => void;
  setOwner: (owner: Owner | undefined) => void;
  setSelectedTurfId: (id: string | null) => void;
  setTempMobile: (mobile: string | undefined) => void;
  setEditingBooking: (booking: Booking | null) => void;
  setSelectedDate: (date: string | null) => void;
  setSelectedSlots: (slots: string[]) => void;
  setCurrentView: (view: any) => void;
  reset: () => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  clearToast: () => void;
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
      selectedDate: null,
      selectedSlots: [],
      currentView: undefined,
      subscriptionActive: true,
      toast: null,

      setLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
      setOwner: (owner) => set({ owner }),
      setSelectedTurfId: (id) => set({ selectedTurfId: id }),
      setTempMobile: (mobile) => set({ tempMobile: mobile }),
      setCurrentView: (view) => set({ currentView: view }),

      showToast: (message, type = 'success') => {
        const id = Date.now();
        set({ toast: { message, type, id } });
        // Auto-dismiss logic handled in the Toast component
      },
      clearToast: () => set({ toast: null }),

      setEditingBooking: (booking) => set({ editingBooking: booking }),
      setSelectedDate: (date) => set({ selectedDate: date }),
      setSelectedSlots: (slots) => set({ selectedSlots: slots }),
      
      reset: () => set({
        isLoggedIn: false,
        owner: undefined,
        selectedTurfId: null,
        tempMobile: undefined,
        editingBooking: null,
        selectedDate: null,
        selectedSlots: [],
        currentView: undefined
      }),
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn,
        owner: state.owner,
        selectedTurfId: state.selectedTurfId,
        currentView: state.currentView,
        selectedDate: state.selectedDate,
        selectedSlots: state.selectedSlots,
        editingBooking: state.editingBooking,
      }),
    }
  )
);

export const useStore = () => {
  const ui = useUIStore();
  const { data: turfs = [] } = useTurfs();
  const { data: bookings = [] } = useBookings();
  const saveBookingMutation = useSaveBooking();
  const cancelBookingMutation = useCancelBooking();


  return {
    state: {
      ...ui,
      turfs,
      bookings,
    },
    isInitialized: true,
    login: (mobile: string) => {
      ui.setTempMobile(mobile);
      ui.showToast(`OTP sent to +91 ${mobile}`, 'info');
    },
    logout: ui.reset,
    setSelectedTurf: ui.setSelectedTurfId,
    setEditingBooking: ui.setEditingBooking,
    setCurrentView: ui.setCurrentView,
    updateOwner: ui.setOwner,
    showToast: ui.showToast,
    saveBooking: (booking: Booking) => {
      saveBookingMutation.mutate(booking);
      ui.showToast('Booking saved successfully', 'success');
    },
    cancelBooking: (id: string) => {
      cancelBookingMutation.mutate(id);
      ui.showToast('Booking cancelled', 'info');
    },
    setOnboarding: (data: any) => {
      const newOwner = { 
        owner_name: data.name, 
        businessName: data.businessName, 
        mobile: data.mobile 
      };
      const firstTurf: Turf = {
        id: `T-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        name: data.groundName || 'Ground A',
        hourly_rate: data.hourlyPrice || 1500,
        open_time_minutes: HHMMToMinutes(data.openingTime || '06:00'),
        close_time_minutes: HHMMToMinutes(data.closingTime || '23:00'),
        is_active : 'active'
      };
      

      ui.setOwner(newOwner);
      ui.setSelectedTurfId(firstTurf.id);
      ui.setCurrentView('DASHBOARD');
      ui.showToast('Profile created successfully!', 'success');
    }
  };
};