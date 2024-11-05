export interface Instrument {
  id: string;
  name: string;
  type: string;
  location: string;
  imageUrl?: string; // Made optional
  status: 'Available' | 'Maintenance' | 'Out of Service';
}

export interface Booking {
  id: string;
  instrumentId: string;
  userId: string;
  startTime: Date;
  endTime: Date;
  purpose: string;
}