import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState, Owner, Booking } from '../types';
import { useBookings, useCancelBooking, useSaveBooking, useSaveTurf, useTurfs } from '@/hooks/use-data';


interface Toast {
  message: string;
  type: 'success' | 'error' | 'info';
  id: number;
}
interface UIStore extends Omit<AppState, 'currentView'> {
  toast: Toast | null;
  setLoggedIn: (isLoggedIn: boolean) => void;
  setOwner: (owner: Owner | undefined) => void;
  setSelectedTurfId: (id: string | null) => void;
  setTempMobile: (mobile: string | undefined) => void;
  setEditingBooking: (booking: Booking | null) => void;
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
      subscriptionActive: true,
      toast: null,

      setLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
      setOwner: (owner) => set({ owner }),
      setSelectedTurfId: (id) => set({ selectedTurfId: id }),
      setTempMobile: (mobile) => set({ tempMobile: mobile }),

      showToast: (message, type = 'success') => {
        const id = Date.now();
        set({ toast: { message, type, id } });
        // Auto-dismiss logic handled in the Toast component
      },
      clearToast: () => set({ toast: null }),

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

export const useStore = () => {
  const ui = useUIStore();
  const { data: turfs = [] } = useTurfs();
  const { data: bookings = [] } = useBookings();
  const saveBookingMutation = useSaveBooking();
  const cancelBookingMutation = useCancelBooking();
  const saveTurfMutation = useSaveTurf();

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
    verifyOtp: (otp: string) => {
      ui.setLoggedIn(true);
      ui.showToast('Login successful', 'success');
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
        name: data.name, 
        businessName: data.businessName, 
        mobile: data.mobile 
      };
      const firstTurf: Turf = {
        id: `T-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        name: data.groundName || 'Ground A',
        type: 'Cricket',
        hourlyPrice: data.hourlyPrice || 1500,
        openingTime: data.openingTime || '06:00',
        closingTime: data.closingTime || '23:00',
        status: 'active'
      };
      
      saveTurfMutation.mutate(firstTurf);
      ui.setOwner(newOwner);
      ui.setSelectedTurfId(firstTurf.id);
      ui.setCurrentView(View.DASHBOARD);
      ui.showToast('Profile created successfully!', 'success');
    }
  };
};