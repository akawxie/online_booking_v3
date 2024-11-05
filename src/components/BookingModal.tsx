import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Instrument } from '../types';
import { format } from 'date-fns';

interface Props {
  instrument: Instrument;
  startTime: Date;
  endTime: Date;
  onClose: () => void;
  onBook: (purpose: string) => void;
}

export function BookingModal({ instrument, startTime, endTime, onClose, onBook }: Props) {
  const [purpose, setPurpose] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onBook(purpose);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Book {instrument.name}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Selected Dates
            </label>
            <p className="text-gray-600">
              {format(startTime, 'MMM d, yyyy')} - {format(endTime, 'MMM d, yyyy')}
            </p>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Purpose
            </label>
            <textarea
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="Enter the purpose of your booking..."
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Book Instrument
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}