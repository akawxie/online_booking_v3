import React from 'react';
import { Clock, MapPin } from 'lucide-react';
import { Instrument } from '../types';

interface Props {
  instrument: Instrument;
  onSelect: (instrument: Instrument) => void;
}

export function InstrumentCard({ instrument, onSelect }: Props) {
  return (
    <div 
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      onClick={() => onSelect(instrument)}
    >
      <div className="h-48 overflow-hidden">
        <img 
          src={instrument.imageUrl} 
          alt={instrument.name}
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{instrument.name}</h3>
        <p className="text-gray-600 mb-4">{instrument.type}</p>
        <div className="flex items-center text-gray-500 mb-2">
          <MapPin className="w-4 h-4 mr-2" />
          <span className="text-sm">{instrument.location}</span>
        </div>
        <div className="flex items-center text-gray-500">
          <Clock className="w-4 h-4 mr-2" />
          <span className="text-sm">Click to view schedule</span>
        </div>
      </div>
    </div>
  );
}