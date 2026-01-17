import { Booking, Turf, Owner } from '../types.ts';

const DELAY = 600;

// LocalStorage Persistence for Mocks
const getLocal = <T>(key: string, def: T): T => {
  const val = localStorage.getItem(`turfflow_api_${key}`);
  return val ? JSON.parse(val) : def;
};

const setLocal = <T>(key: string, val: T): void => {
  localStorage.setItem(`turfflow_api_${key}`, JSON.stringify(val));
};

export const api = {
  fetchTurfs: async (): Promise<Turf[]> => {
    await new Promise(r => setTimeout(r, DELAY));
    return getLocal('turfs', []);
  },

  fetchBookings: async (): Promise<Booking[]> => {
    await new Promise(r => setTimeout(r, DELAY));
    return getLocal('bookings', []);
  },

  saveTurf: async (turf: Turf): Promise<Turf> => {
    await new Promise(r => setTimeout(r, DELAY));
    const turfs = getLocal<Turf[]>('turfs', []);
    const exists = turfs.findIndex(t => t.id === turf.id);
    const updated = exists >= 0 ? turfs.map(t => t.id === turf.id ? turf : t) : [...turfs, turf];
    setLocal('turfs', updated);
    return turf;
  },

  deleteTurf: async (id: string): Promise<void> => {
    await new Promise(r => setTimeout(r, DELAY));
    const turfs = getLocal<Turf[]>('turfs', []);
    setLocal('turfs', turfs.filter(t => t.id !== id));
  },

  saveBooking: async (booking: Booking): Promise<Booking> => {
    await new Promise(r => setTimeout(r, DELAY));
    const bookings = getLocal<Booking[]>('bookings', []);
    const exists = bookings.findIndex(b => b.id === booking.id);
    const updated = exists >= 0 ? bookings.map(b => b.id === booking.id ? booking : b) : [booking, ...bookings];
    setLocal('bookings', updated);
    return booking;
  },

  cancelBooking: async (id: string): Promise<void> => {
    await new Promise(r => setTimeout(r, DELAY));
    const bookings = getLocal<Booking[]>('bookings', []);
    setLocal('bookings', bookings.map(b => b.id === id ? { ...b, status: 'cancelled' } : b));
  },
};