import { Booking } from '../types';
import { mockBookings } from './mockData';

// Use a Map to store bookings in memory
const bookingsStore = new Map<string, Booking>();

// Initialize with mock data
mockBookings.forEach(booking => {
  bookingsStore.set(booking.id, booking);
});

export async function fetchBookings(): Promise<Booking[]> {
  return Promise.resolve(Array.from(bookingsStore.values()));
}

export async function createBooking(booking: Omit<Booking, 'id'>): Promise<Booking> {
  const newBooking = {
    ...booking,
    id: Math.random().toString(36).substr(2, 9),
    // Ensure dates are stored as Date objects
    startTime: new Date(booking.startTime),
    endTime: new Date(booking.endTime),
  };
  
  bookingsStore.set(newBooking.id, newBooking);
  return Promise.resolve(newBooking);
}

export async function deleteBooking(id: string): Promise<void> {
  bookingsStore.delete(id);
  return Promise.resolve();
}