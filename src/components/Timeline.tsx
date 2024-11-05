import React, { useState, useRef, useEffect } from 'react';
import { format, addDays, startOfDay, isWithinInterval, subMonths, addMonths, isSameDay, differenceInDays, isAfter, isBefore } from 'date-fns';
import { Booking, Instrument } from '../types';
import { Trash2, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import { useInstruments } from '../hooks/useInstruments';

interface Props {
  instruments: Instrument[];
  bookings: Booking[];
  onTimeSelect: (instrumentId: string, start: Date, end: Date) => void;
  onDeleteBooking?: (bookingId: string) => void;
  isLoading?: boolean;
}

export function Timeline({ instruments: initialInstruments, bookings, onTimeSelect, onDeleteBooking, isLoading }: Props) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ date: Date; instrumentId: string } | null>(null);
  const [dragEnd, setDragEnd] = useState<Date | null>(null);
  const [bookingToDelete, setBookingToDelete] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);

  const { instruments: latestInstruments } = useInstruments();
  const [instruments, setInstruments] = useState(initialInstruments);

  useEffect(() => {
    setInstruments(latestInstruments);
  }, [latestInstruments]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setInstruments(latestInstruments);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // Generate 90 days range
  const days = Array.from({ length: 90 }, (_, i) => addDays(startOfDay(currentDate), i));

  const handleMouseDown = (instrumentId: string, date: Date, existingBooking?: Booking) => {
    if (isLoading || existingBooking) return;
    setIsDragging(true);
    setDragStart({ date, instrumentId });
    setDragEnd(date);
  };

  const handleMouseMove = (date: Date) => {
    if (isDragging && dragStart) {
      setDragEnd(date);
    }
  };

  const handleMouseUp = () => {
    if (isDragging && dragStart && dragEnd) {
      const start = new Date(Math.min(dragStart.date.getTime(), dragEnd.getTime()));
      const end = new Date(Math.max(dragStart.date.getTime(), dragEnd.getTime()));
      onTimeSelect(dragStart.instrumentId, start, end);
    }
    setIsDragging(false);
    setDragStart(null);
    setDragEnd(null);
  };

  const handleDeleteClick = (e: React.MouseEvent, bookingId: string) => {
    e.stopPropagation();
    setBookingToDelete(bookingId);
  };

  const handleConfirmDelete = () => {
    if (bookingToDelete && onDeleteBooking) {
      onDeleteBooking(bookingToDelete);
      setBookingToDelete(null);
    }
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        handleMouseUp();
      }
    };

    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, [isDragging, dragStart, dragEnd]);

  const isInDragSelection = (date: Date, instrumentId: string) => {
    if (!isDragging || !dragStart || !dragEnd || dragStart.instrumentId !== instrumentId) return false;
    const start = new Date(Math.min(dragStart.date.getTime(), dragEnd.getTime()));
    const end = new Date(Math.max(dragStart.date.getTime(), dragEnd.getTime()));
    return isWithinInterval(date, { start, end });
  };

  const getBookingSpan = (booking: Booking, day: Date) => {
    const bookingStart = startOfDay(new Date(booking.startTime));
    const bookingEnd = startOfDay(new Date(booking.endTime));
    const currentDay = startOfDay(day);
    
    const isFirst = isSameDay(bookingStart, currentDay);
    const isLast = isSameDay(bookingEnd, currentDay);
    const isMiddle = isAfter(currentDay, bookingStart) && isBefore(currentDay, bookingEnd);
    
    return { isFirst, isMiddle, isLast };
  };

  const getBookingsForDay = (instrumentId: string, date: Date) => {
    return bookings.filter(booking => {
      const bookingStart = startOfDay(new Date(booking.startTime));
      const bookingEnd = startOfDay(new Date(booking.endTime));
      const currentDay = startOfDay(date);
      
      return (
        booking.instrumentId === instrumentId &&
        isWithinInterval(currentDay, { start: bookingStart, end: bookingEnd })
      );
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const cellWidth = 100; // Fixed width for date cells
  const sidebarWidth = 180; // Fixed width for sidebar

  return (
    <>
      <div className="flex flex-col bg-white rounded-lg shadow">
        {/* Navigation controls */}
        <div className="flex justify-between items-center p-3 border-b">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentDate(subMonths(currentDate, 1))}
              className="p-1.5 hover:bg-gray-100 rounded"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <h2 className="text-base font-semibold">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <button
              onClick={() => setCurrentDate(addMonths(currentDate, 1))}
              className="p-1.5 hover:bg-gray-100 rounded"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={handleRefresh}
            className={`p-2 text-blue-500 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-all ${
              isRefreshing ? 'animate-spin' : ''
            }`}
            title="Refresh instrument list"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <div style={{ minWidth: sidebarWidth + (days.length * cellWidth) }} ref={timelineRef}>
            {/* Date headers */}
            <div className="flex" style={{ marginLeft: sidebarWidth }}>
              {days.map((day) => (
                <div
                  key={day.toISOString()}
                  className="flex-none border-r border-gray-200 bg-gray-50"
                  style={{ width: cellWidth }}
                >
                  <div className="px-2 py-1.5 text-center">
                    <div className="text-sm font-medium text-gray-900">
                      {format(day, 'MMM d')}
                    </div>
                    <div className="text-xs text-gray-500">
                      {format(day, 'EEE')}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Instrument rows */}
            <div className="relative">
              {instruments.map((instrument) => (
                <div key={instrument.id} className="flex border-b border-gray-200">
                  {/* Instrument info - fixed on the left */}
                  <div 
                    className="flex-none bg-white border-r border-gray-200 p-2"
                    style={{ width: sidebarWidth }}
                  >
                    <div className="flex flex-col">
                      <div className="font-medium text-sm truncate">{instrument.name}</div>
                      <div className="text-xs text-gray-500 truncate">{instrument.location}</div>
                    </div>
                  </div>

                  {/* Time slots */}
                  {days.map((day) => {
                    const dayBookings = getBookingsForDay(instrument.id, day);
                    const isSelected = isInDragSelection(day, instrument.id);
                    
                    return (
                      <div
                        key={`${instrument.id}-${day.toISOString()}`}
                        className="flex-none border-r border-gray-200"
                        style={{ width: cellWidth }}
                        onMouseDown={() => handleMouseDown(instrument.id, day, dayBookings[0])}
                        onMouseMove={() => handleMouseMove(day)}
                      >
                        <div
                          className={`h-12 p-1 ${
                            dayBookings.length > 0
                              ? 'bg-blue-100'
                              : isSelected
                              ? 'bg-blue-50'
                              : 'hover:bg-gray-50 cursor-pointer'
                          }`}
                        >
                          {dayBookings.map((booking) => {
                            const { isFirst, isMiddle, isLast } = getBookingSpan(booking, day);
                            return (
                              <div key={booking.id} className="relative group h-full">
                                <div
                                  className={`absolute h-full bg-blue-500 ${
                                    isFirst ? 'rounded-l' : ''
                                  } ${isLast ? 'rounded-r' : ''} ${
                                    !isFirst ? '-ml-1' : ''
                                  } ${!isLast ? '-mr-1' : ''}`}
                                  style={{
                                    left: isFirst ? '4px' : '0',
                                    right: isLast ? '4px' : '0',
                                    top: '4px',
                                    bottom: '4px',
                                  }}
                                >
                                  {isFirst && (
                                    <p className="text-xs text-white truncate px-1 py-0.5">
                                      {booking.purpose}
                                    </p>
                                  )}
                                  {onDeleteBooking && isFirst && (
                                    <button
                                      onClick={(e) => handleDeleteClick(e, booking.id)}
                                      className="absolute top-0.5 right-0.5 hidden group-hover:block p-0.5 bg-red-500 rounded text-white"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {bookingToDelete && (
        <DeleteConfirmationModal
          onConfirm={handleConfirmDelete}
          onCancel={() => setBookingToDelete(null)}
        />
      )}
    </>
  );
}