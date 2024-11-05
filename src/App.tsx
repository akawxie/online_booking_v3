import React, { useState } from 'react';
import { Calendar, Search, Grid } from 'lucide-react';
import { Timeline } from './components/Timeline';
import { BookingModal } from './components/BookingModal';
import { InstrumentManagement } from './components/InstrumentManagement';
import { useBookings } from './hooks/useBookings';
import { useInstruments } from './hooks/useInstruments';

function App() {
  const [selectedView, setSelectedView] = useState<'timeline' | 'management'>('timeline');
  const [bookingTimes, setBookingTimes] = useState<{ instrumentId: string; start: Date; end: Date } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { bookings, isLoading, createBooking, deleteBooking } = useBookings();
  const { instruments } = useInstruments();

  const handleTimeSelect = (instrumentId: string, start: Date, end: Date) => {
    setBookingTimes({ instrumentId, start, end });
  };

  const handleBookingSubmit = (purpose: string) => {
    if (bookingTimes) {
      createBooking({
        instrumentId: bookingTimes.instrumentId,
        userId: 'current-user',
        startTime: bookingTimes.start,
        endTime: bookingTimes.end,
        purpose,
      });
      setBookingTimes(null);
    }
  };

  const filteredInstruments = instruments.filter((instrument) =>
    instrument.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    instrument.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedInstrument = bookingTimes 
    ? instruments.find(i => i.id === bookingTimes.instrumentId)
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Calendar className="w-8 h-8 text-blue-500" />
              <h1 className="text-2xl font-bold text-gray-900">Instrument Scheduler</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search instruments..."
                  className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex rounded-lg overflow-hidden border border-gray-200">
                <button
                  onClick={() => setSelectedView('management')}
                  className={`px-4 py-2 flex items-center gap-2 ${
                    selectedView === 'management'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                  Management
                </button>
                <button
                  onClick={() => setSelectedView('timeline')}
                  className={`px-4 py-2 flex items-center gap-2 ${
                    selectedView === 'timeline'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  Timeline
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedView === 'timeline' ? (
          <div className="bg-white rounded-lg shadow-sm">
            <Timeline
              instruments={filteredInstruments}
              bookings={bookings}
              onTimeSelect={handleTimeSelect}
              onDeleteBooking={deleteBooking}
              isLoading={isLoading}
            />
          </div>
        ) : (
          <InstrumentManagement />
        )}
      </main>

      {bookingTimes && selectedInstrument && (
        <BookingModal
          instrument={selectedInstrument}
          startTime={bookingTimes.start}
          endTime={bookingTimes.end}
          onClose={() => setBookingTimes(null)}
          onBook={handleBookingSubmit}
        />
      )}
    </div>
  );
}

export default App;