import { api } from '@/lib/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';


export const useTurfs = () => {
  return useQuery({
    queryKey: ['turfs'],
    queryFn: api.fetchTurfs,
  });
};

export const useBookings = () => {
  return useQuery({
    queryKey: ['bookings'],
    queryFn: api.fetchBookings,
  });
};

export const useSaveBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.saveBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
};

export const useCancelBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.cancelBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
};

export const useSaveTurf = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.saveTurf,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['turfs'] });
    },
  });
};

export const useDeleteTurf = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.deleteTurf,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['turfs'] });
    },
  });
};