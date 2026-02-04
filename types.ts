import { string, z } from "zod";

export enum View {
  LOGIN = "LOGIN",
  OTP = "OTP",
  ONBOARDING = "ONBOARDING",
  DASHBOARD = "DASHBOARD",
  AVAILABILITY = "AVAILABILITY",
  ADD_BOOKING = "ADD_BOOKING",
  EDIT_BOOKING = "EDIT_BOOKING",
  HISTORY = "HISTORY",
  CUSTOMERS = "CUSTOMERS",
  CUSTOMER_HISTORY = "CUSTOMER_HISTORY",
  REVENUE = "REVENUE",
  SETTINGS = "SETTINGS",
  BOOKING_CONFIRMED = "BOOKING_CONFIRMED",
  EDIT_TURF = "EDIT_TURF",
  MANAGE_TURFS = "MANAGE_TURFS",
  SUBSCRIPTION = "SUBSCRIPTION",
  LEGAL = "LEGAL",
  SUPPORT = "SUPPORT",
  ADMIN = "ADMIN",
  EDIT_PROFILE = "EDIT_PROFILE",
}

export const OwnerSchema = z.object({
  owner_name: z.string().min(2, "Business name is required"),
  mobile: z.string().length(10, "Mobile must be 10 digits"),
});

export type Owner = z.infer<typeof OwnerSchema>;

export const TurfSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  hourly_rate: z.number().min(0),
  open_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
  close_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
  is_active: z.enum(["active", "disabled"]),
});

export const TurfSchemaRes = z.object({
  ground: z.array(TurfSchema),
});

export type TurfResponse = z.infer<typeof TurfSchemaRes>;

export type Turf = z.infer<typeof TurfSchema>;

export type BookingStatus = "active" | "cancelled";

export const BookingSchema = z.object({
  id: z.string(),
  client_name: z.string().min(1, "Client name is required"),
  client_mobile: z.string().length(10, "Mobile must be 10 digits"),
  date: z.string(),
  start_time: z.string(),
  end_time: z.string(),
  hours: z.number(),
  amount: z.number(),
  status: z.enum(["booked", "cancelled", "completed"]),
  turfID : z.string()
});

export const BookingSchemaRes = z.object({
  bookings: z.array(BookingSchema),
  close_time: z.string(),
  open_time: z.string(),
});

export type BookingRes = z.infer<typeof BookingSchemaRes>;
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

export interface GroundType {
  user_name: string;
  ground_name: string;
  opening: string;
  closing: string;
  rate: number;
}
