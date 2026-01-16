
export enum View {
  LOGIN = 'LOGIN',
  OTP = 'OTP',
  ONBOARDING = 'ONBOARDING',
  DASHBOARD = 'DASHBOARD',
  AVAILABILITY = 'AVAILABILITY',
  ADD_BOOKING = 'ADD_BOOKING',
  EDIT_BOOKING = 'EDIT_BOOKING',
  HISTORY = 'HISTORY',
  CUSTOMERS = 'CUSTOMERS',
  CUSTOMER_HISTORY = 'CUSTOMER_HISTORY',
  REVENUE = 'REVENUE',
  SETTINGS = 'SETTINGS',
  BOOKING_CONFIRMED = 'BOOKING_CONFIRMED',
  EDIT_TURF = 'EDIT_TURF',
  MANAGE_TURFS = 'MANAGE_TURFS',
  SUBSCRIPTION = 'SUBSCRIPTION',
  LEGAL = 'LEGAL',
  SUPPORT = 'SUPPORT',
  ADMIN = 'ADMIN'
}

export interface Turf {
  id: string;
  name: string;
  type: 'Cricket';
  hourlyPrice: number;
  openingTime: string;
  closingTime: string;
  status: 'active' | 'disabled';
}

export type BookingStatus = 'active' | 'cancelled';

export interface Booking {
  id: string;
  turfId: string;
  clientName: string;
  mobileNumber: string;
  date: string;
  startTime: string;
  endTime: string;
  hours: number;
  totalAmount: number;
  createdAt: number;
  status: BookingStatus;
}

export interface AppState {
  isLoggedIn: boolean;
  turfs: Turf[];
  selectedTurfId: string | null;
  bookings: Booking[];
  currentView: View;
  tempMobile?: string;
  editingBooking?: Booking | null;
  selectedCustomerMobile?: string | null;
  subscriptionActive: boolean;
}
