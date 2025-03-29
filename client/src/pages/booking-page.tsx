import React from 'react';
import Navbar from '@/components/Navbar';
import BookingForm from '@/components/BookingForm';
import Footer from '@/components/Footer';
import { useQuery } from '@tanstack/react-query';
import { Service } from '@shared/schema';
import { Loader2 } from 'lucide-react';

export default function BookingPage() {
  const { data: services, isLoading } = useQuery<Service[]>({ 
    queryKey: ['/api/services'], 
  });

  return (
    <div className="min-h-screen font-sans antialiased bg-neutral-100 text-neutral-900">
      <Navbar />
      
      <main className="pt-28 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-center mb-8">
            Book Your Appointment
          </h1>
          <p className="text-center text-lg mb-12 max-w-2xl mx-auto">
            Select your preferred service, date, and time to schedule your appointment at Luxe Nails
          </p>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <BookingForm standalone={true} />
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
