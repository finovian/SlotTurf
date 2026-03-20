import {
  Booking,
  BookingRes,
  GroundType,
  TurfResponse,
  HistoryRes,
  RevenueRes,
  DashboardRes,
} from "../types";
import { apiFetch } from "./apiClient";

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
  ): Promise<{ isActive: string; status: string; token: string }> => {
    return apiFetch("/auth/verify", {
      method: "POST",
      body: JSON.stringify({
        identifier: mobile,
        otp,
        name: `user#${mobile}`,
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

  fetchProfile: async (): Promise<any> => {
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

  saveTurf: async (turf: any) => {
    console.log("turfapi", turf);
    return apiFetch("/ground/update", {
      method: "POST",
      body: JSON.stringify({
        ground_name: turf.name,
        opening: turf.opening,
        closing: turf.closing,
        rate: turf.rate,
        groundId: turf.id,
      }),
    });
  },

  addTurf: async (turf: any) => {
    return apiFetch("/ground/create", {
      method: "POST",
      body: JSON.stringify({
        ground_name: turf.name,
        opening: turf.opening,
        closing: turf.closing,
        rate: turf.rate,
      }),
    });
  },

  deleteTurf: async (id: string) => {
    console.log("id", id);
    return apiFetch("/ground/delete", {
      method: "POST",
      body: JSON.stringify({
        groundId: id,
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
        mobile: booking.client_mobile,
      }),
    });
  },

  fetchBookings: async (payload: {
    groundId: string;
    date: string;
  }): Promise<BookingRes> => {
    return apiFetch("/booking/bookings", {
      method: "POST",
      body: JSON.stringify({
        groundId: payload.groundId,
        date: payload.date,
      }),
    });
  },

  updateBooking: async (booking: Booking) => {
    return apiFetch("/booking/update-bookings", {
      method: "POST",
      body: JSON.stringify({
        bookingId: booking.id,
        date: booking.date,
        start_time: booking.start_time,
        end_time: booking.end_time,
        name: booking.client_name,
        groundId: booking.turfID,
        amount: booking.amount,
        mobile: booking.client_mobile,
      }),
    });
  },

  cancelBooking: async (id: string): Promise<void> => {
    return apiFetch("/booking/delete", {
      method: "POST",
      body: JSON.stringify({
        bookingId: id,
      }),
    });
  },

  fetchDashboard: async (): Promise<DashboardRes> => {
    return apiFetch("/dashboard", { method: "GET" });
  },

  fetchHistory: async (params: {
    ground_id?: string;
    search?: string;
    from?: string;
    to?: string;
  }): Promise<HistoryRes> => {
    const q = new URLSearchParams();
    if (params.ground_id) q.set("ground_id", params.ground_id);
    if (params.search) q.set("search", params.search);
    if (params.from) q.set("from", params.from);
    if (params.to) q.set("to", params.to);
    return apiFetch(`/history?${q.toString()}`, { method: "GET" });
  },

  fetchRevenue: async (params: {
    ground_id?: string;
    from?: string;
    to?: string;
  }): Promise<RevenueRes> => {
    const q = new URLSearchParams();
    if (params.ground_id) q.set("ground_id", params.ground_id);
    if (params.from) q.set("from", params.from);
    if (params.to) q.set("to", params.to);
    return apiFetch(`/revenue/summary?${q.toString()}`, { method: "GET" });
  },

  fetchSubscription: async () => {
    return apiFetch("/profile/subscription", { method: "GET" });
  },

  fetchCustomers: async (params: { filter?: string; search?: string }) => {
    const q = new URLSearchParams();
    if (params.filter) q.set("filter", params.filter);
    if (params.search) q.set("search", params.search);
    return apiFetch(`/customers?${q.toString()}`, { method: "GET" });
  },

  fetchCustomerDetail: async (mobile: string) => {
    return apiFetch(`/customers/${mobile}`, { method: "GET" });
  },

  createCheckout: async (plan: string) => {
    return apiFetch("/subscription/checkout", {
      method: "POST",
      body: JSON.stringify({ plan }),
    });
  },

  cancelSubscription: async () => {
    return apiFetch("/subscription/cancel", {
      method: "POST",
    });
  },
};
