import { Booking } from '../types';
import { addHours } from 'date-fns';

const today = new Date();

export const mockBookings: Booking[] = [
  {
    id: '1',
    instrumentId: '1',
    userId: 'user1',
    startTime: addHours(today, 9),
    endTime: addHours(today, 11),
    purpose: 'Sample Analysis',
  },
  {
    id: '2',
    instrumentId: '2',
    userId: 'user2',
    startTime: addHours(today, 13),
    endTime: addHours(today, 15),
    purpose: 'Spectral Analysis',
  },
];