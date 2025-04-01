import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Service, BookingSlot, InsertBooking } from '@shared/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { format } from 'date-fns';
import { formatTime, formatCurrency } from '@/lib/utils';
import { insertBookingSchema } from '@shared/schema';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { CalendarIcon, Loader2, AlertTriangle, LogIn } from 'lucide-react';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { useLocation } from 'wouter';

// Extended schema with validation and policy acceptance
const bookingFormSchema = insertBookingSchema.extend({
  customerName: z.string().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
  customerEmail: z.string().email("Please enter a valid email address"),
  customerPhone: z.string().min(10, "Phone number must be at least 10 digits").max(15, "Phone number is too long")
    .regex(/^[0-9()\-\s+]+$/, "Please enter a valid phone number"),
  date: z.date({
    required_error: "Please select a date for your appointment.",
  }),
  serviceId: z.number().min(1, "Please select a service"),
  slotId: z.number().min(1, "Please select a time slot"),
  acceptCancellationPolicy: z.boolean().refine(val => val === true, {
    message: "You must accept the cancellation policy to proceed."
  }),
  acceptLatePolicy: z.boolean().refine(val => val === true, {
    message: "You must accept the late arrival policy to proceed."
  }),
});

// Type for the form
type BookingFormValues = z.infer<typeof bookingFormSchema>;

interface BookingFormProps {
  standalone?: boolean;
}

export default function BookingForm({ standalone = false }: BookingFormProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);
  
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Get services
  const { data: services, isLoading: servicesLoading } = useQuery<Service[]>({
    queryKey: ['/api/services']
  });
  
  // Get booking slots
  const { data: slots, isLoading: slotsLoading } = useQuery<BookingSlot[]>({
    queryKey: ['/api/booking-slots', { available: true }]
  });
  
  // Filter slots for selected date, ensuring proper date comparison
  const availableSlotsForDate = React.useMemo(() => {
    if (!selectedDate || !slots || !Array.isArray(slots)) {
      return [];
    }
    
    return slots.filter(slot => {
      if (!slot || !slot.startTime) return false;
      
      // Create a new date object from the slot's startTime
      const slotDate = new Date(slot.startTime);
      
      // Only compare the date portion (year, month, day)
      const sameDate = 
        slotDate.getFullYear() === selectedDate.getFullYear() &&
        slotDate.getMonth() === selectedDate.getMonth() &&
        slotDate.getDate() === selectedDate.getDate();
        
      return sameDate && slot.available;
    });
  }, [selectedDate, slots]);
  
  // Form setup
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      serviceId: 0,
      slotId: 0,
      paymentStatus: "pending",
      paymentId: "",
      date: new Date(),
      acceptCancellationPolicy: false,
      acceptLatePolicy: false,
    }
  });
  
  // Create booking mutation
  const createBooking = useMutation({
    mutationFn: async (data: InsertBooking) => {
      const res = await apiRequest("POST", "/api/bookings", data);
      if (!res.ok) {
        const errorData = await res.json();
        // If unauthorized, redirect to login
        if (res.status === 401) {
          throw new Error("Authentication required to book an appointment.");
        }
        throw new Error(errorData.message || "Failed to book appointment");
      }
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/booking-slots'] });
      toast({
        title: "Booking confirmed!",
        description: "Your appointment has been successfully booked.",
      });
      form.reset();
      setSelectedSlot(null);
    },
    onError: (error: Error) => {
      if (error.message.includes("Authentication required")) {
        toast({
          title: "Login Required",
          description: "You must be logged in to book an appointment.",
          variant: "destructive",
        });
        // Navigate to login
        setTimeout(() => setLocation('/auth'), 1500);
      } else {
        toast({
          title: "Booking failed",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  });
  
  // When slot is selected, update the form
  useEffect(() => {
    if (selectedSlot) {
      form.setValue('slotId', selectedSlot);
    }
  }, [selectedSlot, form]);
  
  // Handle form submission
  const onSubmit = (data: BookingFormValues) => {
    // Check if user is authenticated first
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "You must be logged in to book an appointment.",
        variant: "destructive",
      });
      setTimeout(() => setLocation('/auth'), 1500);
      return;
    }
    
    // Validate required fields before submission
    if (!data.slotId || data.slotId === 0) {
      toast({
        title: "Please select a time slot",
        description: "You need to select an available time slot for your appointment.",
        variant: "destructive",
      });
      return;
    }
    
    if (!data.serviceId || data.serviceId === 0) {
      toast({
        title: "Please select a service",
        description: "You need to select a service for your appointment.",
        variant: "destructive",
      });
      return;
    }
    
    // Create booking data and submit directly
    const bookingData: InsertBooking = {
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      serviceId: data.serviceId,
      slotId: data.slotId,
      paymentStatus: "confirmed", // Mark as confirmed since we're skipping payment
      paymentId: "direct-booking", // Placeholder for skipped payment
    };
    
    console.log("Submitting booking data:", bookingData);
    
    // Directly create the booking without payment step
    createBooking.mutate(bookingData);
  };
  
  // Get selected service price for payment
  const selectedService = services?.find(service => service.id === form.getValues().serviceId);
  const bookingFee = 15; // £15 booking fee
  
  // Show login prompt if not authenticated
  if (!isCheckingAuth && !isAuthenticated) {
    return (
      <section className={cn("py-20", !standalone && "pt-0")}>
        <div className={cn(standalone ? "container mx-auto px-4" : "")}>
          <Card className="max-w-md mx-auto p-8 text-center">
            <div className="flex flex-col items-center gap-4">
              <LogIn className="h-12 w-12 text-primary" />
              <h3 className="text-2xl font-bold">Login Required</h3>
              <p className="text-muted-foreground mb-4">
                You need to be logged in to book an appointment. Please login or create an account to continue.
              </p>
              <Button onClick={() => setLocation('/auth')} className="w-full">
                Login or Sign Up
              </Button>
            </div>
          </Card>
        </div>
      </section>
    );
  }
  
  return (
    <section className={cn("py-20", !standalone && "pt-0")}>
      <div className={cn(standalone ? "container mx-auto px-4" : "")}>
        {!standalone && (
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-3 pt-20">Book Your Visit</h2>
            <div className="relative mx-auto">
              <p className="text-lg text-neutral-900 mx-auto max-w-2xl">Schedule your appointment today</p>
              <div className="absolute bottom-[-10px] left-1/2 transform -translate-x-1/2 w-[100px] h-[2px] bg-accent"></div>
            </div>
          </div>
        )}
        
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 bg-primary p-10 text-white flex items-center justify-center">
              <div className="text-center">
                <h3 className="font-script text-3xl mb-4">Book Your Visit</h3>
                <p className="mb-6">Select your preferred service and time slot</p>
                <div className="mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  (555) 123-4567
                </div>
                <div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  123 Beauty Lane, Suite 100
                </div>
              </div>
            </div>
            <div className="md:w-2/3 p-10">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="customerName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your Full Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="customerEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="your@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="customerPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="(555) 123-4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="serviceId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Service</FormLabel>
                          <Select 
                            onValueChange={(value) => field.onChange(parseInt(value))} 
                            defaultValue={field.value.toString()}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a service" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {servicesLoading ? (
                                <div className="flex items-center justify-center p-4">
                                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                                </div>
                              ) : services && services.length > 0 ? (
                                services.map(service => (
                                  <SelectItem key={service.id} value={service.id.toString()}>
                                    {service.name} - {formatCurrency(service.price)}
                                  </SelectItem>
                                ))
                              ) : (
                                <SelectItem value="no-services" disabled>No services available</SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Preferred Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={(date) => {
                                field.onChange(date);
                                setSelectedDate(date);
                                setSelectedSlot(null);
                              }}
                              disabled={(date) => {
                                // Disable dates in the past and dates more than 2 weeks in the future
                                const now = new Date();
                                now.setHours(0, 0, 0, 0);
                                const twoWeeksFromNow = new Date();
                                twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14);
                                return date < now || date > twoWeeksFromNow;
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="slotId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Available Time Slots</FormLabel>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {slotsLoading ? (
                            <div className="col-span-full flex items-center justify-center p-4">
                              <Loader2 className="h-5 w-5 animate-spin text-primary" />
                            </div>
                          ) : availableSlotsForDate.length > 0 ? (
                            availableSlotsForDate.map((slot) => (
                              <button
                                key={slot.id}
                                type="button"
                                onClick={() => {
                                  setSelectedSlot(slot.id);
                                  field.onChange(slot.id);
                                }}
                                className={cn(
                                  "booking-time-slot border rounded-lg p-3 text-center cursor-pointer transition-all",
                                  selectedSlot === slot.id
                                    ? "bg-primary text-white border-primary"
                                    : "border-neutral-200 hover:border-primary"
                                )}
                              >
                                {formatTime(slot.startTime)}
                              </button>
                            ))
                          ) : (
                            <p className="col-span-full text-center text-neutral-500 py-3">
                              No available slots for the selected date. Please choose another date.
                            </p>
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Booking Fee Notice */}
                  <div className="bg-secondary/10 p-4 rounded-md mb-6">
                    <div className="flex gap-3">
                      <AlertTriangle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium mb-1">Booking Fee</h4>
                        <p className="text-sm text-neutral-700">
                          A non-refundable booking fee of £{bookingFee} will be charged to secure your appointment. 
                          This fee will be deducted from the final price of your service.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Appointment Duration Notice */}
                  <div className="bg-neutral-100 p-4 rounded-md mb-6">
                    <h4 className="font-medium mb-1">Appointment Duration</h4>
                    <p className="text-sm text-neutral-700 mb-2">
                      Please be aware that I am a thorough nail technician focused on quality:
                    </p>
                    <ul className="text-sm text-neutral-700 list-disc pl-5 space-y-1">
                      <li>Simple designs: 1.5-2 hours</li>
                      <li>Gel X and complicated designs: 3-4 hours</li>
                    </ul>
                  </div>
                  
                  {/* Policies Acceptance */}
                  <div className="space-y-4 mb-6">
                    <FormField
                      control={form.control}
                      name="acceptCancellationPolicy"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox 
                              checked={field.value} 
                              onCheckedChange={field.onChange} 
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              I acknowledge that if I cancel my appointment with less than 48 hours notice, my booking fee will not be refunded.
                            </FormLabel>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="acceptLatePolicy"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox 
                              checked={field.value} 
                              onCheckedChange={field.onChange} 
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              I acknowledge that if I arrive more than 20 minutes late to my appointment, it may be cancelled and my booking fee will not be refunded.
                            </FormLabel>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-opacity-90 text-white py-3 h-auto rounded-lg transition-all duration-300 font-medium"
                    disabled={createBooking.isPending}
                  >
                    {createBooking.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing
                      </>
                    ) : (
                      `Pay £${bookingFee} Booking Fee`
                    )}
                  </Button>
                  
                  <p className="text-xs text-center mt-4 text-neutral-500">
                    By proceeding with the booking, you agree to pay a £{bookingFee} booking fee which will be deducted from your final service cost.
                  </p>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
