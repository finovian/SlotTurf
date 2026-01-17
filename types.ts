import { z } from 'zod';

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
  ADMIN = 'ADMIN',
  EDIT_PROFILE = 'EDIT_PROFILE'
}

export const OwnerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  businessName: z.string().min(2, "Business name is required"),
  mobile: z.string().length(10, "Mobile must be 10 digits"),
});

export type Owner = z.infer<typeof OwnerSchema>;

export const TurfSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  type: z.literal('Cricket'),
  hourlyPrice: z.number().min(0),
  openingTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
  closingTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
  status: z.enum(['active', 'disabled']),
});

export type Turf = z.infer<typeof TurfSchema>;

export type BookingStatus = 'active' | 'cancelled';

export const BookingSchema = z.object({
  id: z.string(),
  turfId: z.string(),
  clientName: z.string().min(1, "Client name is required"),
  mobileNumber: z.string().length(10, "Mobile must be 10 digits"),
  date: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  hours: z.number(),
  totalAmount: z.number(),
  createdAt: z.number(),
  status: z.enum(['active', 'cancelled']),
});

export type Booking = z.infer<typeof BookingSchema>;

export interface AppState {
  isLoggedIn: boolean;
  owner?: Owner;
  currentView: View;
  selectedTurfId: string | null;
  tempMobile?: string;
  editingBooking?: Booking | null;
  subscriptionActive: boolean;
}