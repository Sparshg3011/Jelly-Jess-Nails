import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Booking, BookingSlot, Service } from '@shared/schema';
import { Loader2 } from 'lucide-react';
import { formatTime } from '@/lib/utils';

export default function BookingCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  const { data: bookings, isLoading: bookingsLoading } = useQuery<Booking[]>({
    queryKey: ['/api/bookings']
  });
  
  const { data: slots, isLoading: slotsLoading } = useQuery<BookingSlot[]>({
    queryKey: ['/api/booking-slots']
  });
  
  const { data: services, isLoading: servicesLoading } = useQuery<Service[]>({
    queryKey: ['/api/services']
  });
  
  const isLoading = bookingsLoading || slotsLoading || servicesLoading;
  
  // Get booking dates for highlighting in the calendar
  const bookingDates = slots ? slots.reduce((acc: Record<string, BookingSlot[]>, slot) => {
    const dateStr = new Date(slot.startTime).toDateString();
    if (!acc[dateStr]) {
      acc[dateStr] = [];
    }
    acc[dateStr].push(slot);
    return acc;
  }, {}) : {};
  
  // Get bookings for the selected date
  const bookingsForSelectedDate = selectedDate && bookings && slots
    ? bookings.filter(booking => {
        const slot = slots.find(s => s.id === booking.slotId);
        return slot && new Date(slot.startTime).toDateString() === selectedDate.toDateString();
      })
    : [];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle className="text-lg">Appointment Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
            modifiers={{
              booked: (date) => {
                const dateStr = date.toDateString();
                return !!bookingDates[dateStr] && bookingDates[dateStr].some(slot => {
                  const booking = bookings?.find(b => b.slotId === slot.id);
                  return !!booking;
                });
              }
            }}
            modifiersStyles={{
              booked: { backgroundColor: 'rgba(245, 192, 192, 0.2)', fontWeight: 'bold' }
            }}
          />
        </CardContent>
      </Card>
      
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">
            {selectedDate ? (
              `Appointments for ${selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}`
            ) : (
              'Select a date to view appointments'
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : bookingsForSelectedDate.length > 0 ? (
            <div className="space-y-4">
              {bookingsForSelectedDate.map(booking => {
                const service = services?.find(s => s.id === booking.serviceId);
                const slot = slots?.find(s => s.id === booking.slotId);
                
                return (
                  <div 
                    key={booking.id}
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <div>
                      <div className="font-medium">{booking.customerName}</div>
                      <div className="text-sm text-muted-foreground">{service?.name}</div>
                      <div className="text-xs">{booking.customerPhone}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {slot && formatTime(slot.startTime)}
                      </div>
                      <div className={`text-xs px-2 py-0.5 rounded-full ${
                        booking.paymentStatus === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {booking.paymentStatus === 'completed' ? 'Paid' : 'Pending'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No appointments found for this date
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
