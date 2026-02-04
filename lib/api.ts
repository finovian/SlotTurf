import { toHHMM } from "@/utils/helpers";
import { Booking, BookingRes, GroundType, Turf, TurfResponse } from "../types";
import { apiFetch } from "./apiClient";
import { promises } from "dns";

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
  requestOTP: async (mobile: string): Promise<{ success: boolean }> => {
    return apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        identifier: mobile,
      }),
    });
  },

  verifyOTP: async (
    mobile: string,
    otp: string,
  ): Promise<{ isActive: string; status: string }> => {
    return apiFetch("/auth/verify", {
      method: "POST",
      body: JSON.stringify({
        identifier: mobile,
        otp,
      }),
    });
  },

  createGround: async (
    groundData: GroundType,
  ): Promise<{ user_id: string; status: string }> => {
    return apiFetch("/profile/setup", {
      method: "POST",
      body: JSON.stringify({
        user_name: groundData.user_name,
        ground_name: groundData.ground_name,
        opening: groundData.opening,
        closing: groundData.closing,
        rate: groundData.rate,
      }),
    });
  },

  fetchProfile: async () => {
    return apiFetch("/profile/me", {
      method: "GET",
    });
  },

  profileUpdate: async (
    profiledata: any,
  ): Promise<{ user_id: string; status: string }> => {
    return apiFetch("/profile/update", {
      method: "POST",
      body: JSON.stringify({
        user_name: profiledata.user_name,
        newMobile: profiledata.newMobile,
      }),
    });
  },

  verifyNum: async (
    profiledata: any,
  ): Promise<{ user_id: string; status: string }> => {
    return apiFetch("/profile/verify", {
      method: "POST",
      body: JSON.stringify({
        otp: profiledata.otp,
      }),
    });
  },

  fetchTurfs: async (): Promise<TurfResponse> => {
    return apiFetch("/ground/fetch", {
      method: "GET",
    });
  },

  saveTurf: async (turf: Turf) => {
    return apiFetch("/ground/update", {
      method: "POST",
      body: JSON.stringify({
        ground_name: turf.name,
        opening: toHHMM(turf.open_time),
        closing: toHHMM(turf.close_time),
        rate: turf.hourly_rate,
        groundId: turf.id,
      }),
    });
  },

  addTuf: async (turf: Turf) => {
    return apiFetch("/ground/create", {
      method: "POST",
      body: JSON.stringify({
        ground_name: turf.name,
        opening: toHHMM(turf.open_time),
        closing: toHHMM(turf.close_time),
        rate: turf.hourly_rate,
      }),
    });
  },

  // fetchBookings: async (): Promise<Booking[]> => {
  //   await new Promise((r) => setTimeout(r, DELAY));
  //   return getLocal("bookings", []);
  // },

  deleteTurf: async (id: string) => {
    return apiFetch("/ground/delete", {
      method: "POST",
      body: JSON.stringify({
        GroundId: id,
      }),
    });
  },

  createBooking: async (booking: Booking) => {
    return apiFetch("/booking/create", {
      method: "POST",
      body: JSON.stringify({
        date: booking.date,
        start_time: booking.start_time,
        end_time: booking.end_time,
        name: booking.client_name,
        groundId: booking.turfID,
        amount: booking.amount,
        number: Number(booking.client_mobile),
      }),
    });
  },

  fetchBookings: async (payload: { groundId: string; date: string }): Promise<BookingRes> => {
    return apiFetch("/booking/bookings", {
      method: "POST",
      body: JSON.stringify({
        groundId: payload.groundId,
        date: payload.date,
      }),
    });
  },

  saveBooking: async (booking: Booking): Promise<Booking> => {
    await new Promise((r) => setTimeout(r, DELAY));
    const bookings = getLocal<Booking[]>("bookings", []);
    const exists = bookings.findIndex((b) => b.id === booking.id);
    const updated =
      exists >= 0
        ? bookings.map((b) => (b.id === booking.id ? booking : b))
        : [booking, ...bookings];
    setLocal("bookings", updated);
    return booking;
  },

  cancelBooking: async (id: string): Promise<void> => {
    await new Promise((r) => setTimeout(r, DELAY));
    const bookings = getLocal<Booking[]>("bookings", []);
    setLocal(
      "bookings",
      bookings.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b)),
    );
  },
};
