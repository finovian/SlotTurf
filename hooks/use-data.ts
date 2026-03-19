import { api } from "@/lib/api";
import { GroundType } from "@/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useRequestOTP = () => {
  return useMutation({
    mutationFn: api.requestOTP,
  });
};

export const useVerifyOTP = () => {
  return useMutation({
    mutationFn: ({ mobile, otp }: { mobile: string; otp: string }) =>
      api.verifyOTP(mobile, otp),
  });
};

export const useCreateGround = () => {
  return useMutation({
    mutationFn: (groundData: GroundType) => api.createGround(groundData),
  });
};

export const useProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: api.fetchProfile,
  });
};

export const useProfileUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (profileData: any) => api.profileUpdate(profileData),
    onSuccess: () => {
      // 🔁 Refetch profile after successful update
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};

export const useVerifyNum = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (profileData: any) => api.verifyNum(profileData),
    onSuccess: () => {
      // 🔁 Refetch profile after successful update
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};

export const useTurfs = () => {
  return useQuery({
    queryKey: ["turfs"],
    queryFn: api.fetchTurfs,
  });
};

export const useBookings = (groundId?: string, date?: string) => {
  return useQuery({
    queryKey: ["bookings", groundId, date],
    queryFn: () =>
      api.fetchBookings({
        groundId: groundId!,
        date: date!,
      }),
    enabled: Boolean(groundId && date),
    staleTime: 10000,
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
};

export const useSaveBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.updateBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
};

export const useCancelBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.cancelBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
};

export const useSaveTurf = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.saveTurf,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["turfs"] });
    },
  });
};

export const useAddTurf = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.addTuf,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["turfs"] });
    },
  });
};

export const useDeleteTurf = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.deleteTurf,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["turfs"] });
    },
  });
};


export const useDashboard = () => {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: api.fetchDashboard,
    staleTime: 30000, 
  });
};

export const useHistory = (params: { ground_id?: string; search?: string; from?: string; to?: string }) => {
  return useQuery({
    queryKey: ["history", params],
    queryFn: () => api.fetchHistory(params),
    staleTime: 60000,
  });
};

export const useRevenue = (params: { ground_id?: string; from?: string; to?: string }) => {
  return useQuery({
    queryKey: ["revenue", params],
    queryFn: () => api.fetchRevenue(params),
    staleTime: 60000,
  });
};

export const useSubscription = () => {
  return useQuery({
    queryKey: ["subscription"],
    queryFn: api.fetchSubscription,
    staleTime: 60000,
  });
};