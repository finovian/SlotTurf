"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Turf, Booking, AppState, View } from '../types.ts';

interface StoreContextType {
  state: AppState;
  isInitialized: boolean;
  login: (mobile: string) => void;
  verifyOtp: (otp: string) => void;
  logout: () => void;
  setOnboarding: (turf: Turf) => void;
  saveBooking: (booking: Booking) => void;
  cancelBooking: (id: string) => void;
  setSelectedTurf: (id: string) => void;
  updateTurf: (turf: Turf) => void;
  deleteTurf: (id: string) => void;
  setEditingBooking: (booking: Booking | null) => void;
  setCurrentView: (view: View) => void;
}

const STORAGE_KEY = 'turfflow_pro_v5.0';

const INITIAL_STATE: AppState = {
  isLoggedIn: false,
  turfs: [],
  selectedTurfId: null,
  bookings: [],
  currentView: View.DASHBOARD,
  subscriptionActive: true
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(INITIAL_STATE);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setState(prev => ({ 
          ...prev, 
          ...parsed,
          isLoggedIn: !!parsed.isLoggedIn,
          currentView: View.DASHBOARD // Always reset to dashboard on refresh
        }));
      }
    } catch (e) {
      console.warn("Store initialization failed", e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          turfs: state.turfs,
          selectedTurfId: state.selectedTurfId,
          bookings: state.bookings,
          isLoggedIn: state.isLoggedIn
        }));
      } catch (e) {
        console.warn("Failed to save state to localStorage", e);
      }
    }
  }, [state, isInitialized]);

  const login = (mobile: string) => setState(p => ({ ...p, tempMobile: mobile }));
  const verifyOtp = (otp: string) => setState(p => ({ ...p, isLoggedIn: true }));
  const logout = () => {
    setState({ ...INITIAL_STATE, isLoggedIn: false });
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
  };
  const setOnboarding = (turf: Turf) => setState(p => ({ ...p, turfs: [turf], selectedTurfId: turf.id, currentView: View.DASHBOARD }));
  const saveBooking = (booking: Booking) => setState(p => {
    const exists = p.bookings.find(x => x.id === booking.id);
    if (exists) {
      return { ...p, bookings: p.bookings.map(x => x.id === booking.id ? booking : x) };
    }
    return { ...p, bookings: [booking, ...p.bookings] };
  });
  const cancelBooking = (id: string) => setState(p => ({
    ...p,
    bookings: p.bookings.map(b => b.id === id ? { ...b, status: 'cancelled' } : b)
  }));
  const setSelectedTurf = (id: string) => setState(p => ({ ...p, selectedTurfId: id }));
  const updateTurf = (turf: Turf) => setState(p => {
    const exists = p.turfs.find(t => t.id === turf.id);
    return { ...p, turfs: exists ? p.turfs.map(t => t.id === turf.id ? turf : t) : [...p.turfs, turf] };
  });
  const deleteTurf = (id: string) => setState(p => {
    const remaining = p.turfs.filter(t => t.id !== id);
    return { ...p, turfs: remaining, selectedTurfId: remaining[0]?.id || null };
  });
  const setEditingBooking = (booking: Booking | null) => setState(p => ({ ...p, editingBooking: booking }));
  const setCurrentView = (view: View) => setState(p => ({ ...p, currentView: view }));

  return (
    <StoreContext.Provider value={{ 
      state, isInitialized, login, verifyOtp, logout, setOnboarding, saveBooking, 
      cancelBooking, setSelectedTurf, updateTurf, deleteTurf, setEditingBooking, setCurrentView 
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
};