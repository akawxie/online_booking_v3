import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchBookings, createBooking, deleteBooking } from '../api/bookings';
import { Booking } from '../types';

export function useBookings() {
  const queryClient = useQueryClient();

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: fetchBookings,
  });

  const createMutation = useMutation({
    mutationFn: (newBooking: Omit<Booking, 'id'>) => createBooking(newBooking),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });

  return {
    bookings,
    isLoading,
    createBooking: createMutation.mutate,
    deleteBooking: deleteMutation.mutate,
  };
}