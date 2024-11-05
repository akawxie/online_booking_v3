import { useState } from 'react';
import { Instrument } from '../types';
import { instruments as initialInstruments } from '../data/instruments';

// Simulated database tables
let instrumentsTable = new Map(initialInstruments.map(i => [i.id, i]));
let bookingsTable = new Map();

export function useInstruments() {
  const [instruments, setInstruments] = useState<Instrument[]>(Array.from(instrumentsTable.values()));

  const addInstrument = async (instrument: Omit<Instrument, 'id'>) => {
    const newInstrument = {
      ...instrument,
      id: Math.random().toString(36).substr(2, 9),
    };
    
    // Update database table
    instrumentsTable.set(newInstrument.id, newInstrument);
    
    // Update state
    setInstruments(Array.from(instrumentsTable.values()));
    return newInstrument;
  };

  const updateInstrument = async (updatedInstrument: Instrument) => {
    // Update database table
    instrumentsTable.set(updatedInstrument.id, updatedInstrument);
    
    // Update state
    setInstruments(Array.from(instrumentsTable.values()));
    return updatedInstrument;
  };

  const deleteInstrument = async (id: string) => {
    // Delete from database table
    instrumentsTable.delete(id);
    
    // Delete associated bookings
    for (const [bookingId, booking] of bookingsTable) {
      if (booking.instrumentId === id) {
        bookingsTable.delete(bookingId);
      }
    }
    
    // Update state
    setInstruments(Array.from(instrumentsTable.values()));
  };

  return {
    instruments,
    addInstrument,
    updateInstrument,
    deleteInstrument,
  };
}