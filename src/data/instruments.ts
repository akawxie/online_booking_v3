import { Instrument } from '../types';

export const instruments: Instrument[] = [
  {
    id: '1',
    name: 'Microscope XR-500',
    type: 'Microscope',
    location: 'Lab A-101',
    status: 'Available',
    imageUrl: 'https://images.unsplash.com/photo-1516357231954-91487b459602?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: '2',
    name: 'Spectrometer Pro',
    type: 'Spectrometer',
    location: 'Lab B-202',
    status: 'Available',
    imageUrl: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: '3',
    name: 'Centrifuge C-3000',
    type: 'Centrifuge',
    location: 'Lab C-303',
    status: 'Available',
    imageUrl: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=400',
  },
];