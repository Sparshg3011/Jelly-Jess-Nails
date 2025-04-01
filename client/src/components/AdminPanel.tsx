import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { z } from 'zod';
import { cn, formatCurrency, formatDate, formatTime } from '@/lib/utils';
import { Booking, Service, GalleryItem, WaitlistEntry, ContactMessage, BookingSlot, ProductCategory, Product } from '@shared/schema';
import { insertServiceSchema, insertGalleryItemSchema, insertBookingSlotSchema } from '@shared/schema';
import { Check, Edit, Loader2, Plus, Trash2, X, CalendarIcon, Star, FolderPlus, ImagePlus, UploadCloud, MessageSquare, Eye, User, Mail, Phone, ChevronDown, Filter, ShoppingBag } from 'lucide-react';
import BookingCalendar from './BookingCalendar';
import { format } from 'date-fns';
import ProductForm from './ProductForm';

// Define ServiceCategory type
interface ServiceCategory {
  id: number;
  name: string;
  description: string;
  createdAt?: Date;
}

export default function AdminPanel() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('bookings');
  
  // Get products in low stock (assuming inStock is a boolean)
  const productsOutOfStock = products?.filter(p => !p.inStock)?.length || 0;
  
  // Load service categories
  const { data: serviceCategories, isLoading: isCategoriesLoading, refetch: refetchCategories } = useQuery<ServiceCategory[]>({
    queryKey: ['/api/categories/services'],
  });
  
  return (
    <Card className="max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="font-display text-2xl">Admin Dashboard</CardTitle>
        <CardDescription>Manage your nail salon services, bookings, and content</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="bookings" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 md:grid-cols-7 gap-2 mb-8">
            <TabsTrigger value="bookings" className="text-xs md:text-sm">Bookings</TabsTrigger>
            <TabsTrigger value="slots" className="text-xs md:text-sm">Time Slots</TabsTrigger>
            <TabsTrigger value="services" className="text-xs md:text-sm">Services</TabsTrigger>
            <TabsTrigger value="products" className="text-xs md:text-sm">Products</TabsTrigger>
            <TabsTrigger value="gallery" className="text-xs md:text-sm">Gallery</TabsTrigger>
            <TabsTrigger value="waitlist" className="text-xs md:text-sm">Waitlist</TabsTrigger>
            <TabsTrigger value="messages" className="text-xs md:text-sm">Messages</TabsTrigger>
          </TabsList>
          
          <TabsContent value="bookings">
            <BookingsPanel />
          </TabsContent>
          
          <TabsContent value="slots">
            <SlotsPanel />
          </TabsContent>
          
          <TabsContent value="services">
            <ServicesPanel />
          </TabsContent>
          
          <TabsContent value="products">
            <ProductsPanel />
          </TabsContent>
          
          <TabsContent value="gallery">
            <GalleryPanel />
          </TabsContent>
          
          <TabsContent value="waitlist">
            <WaitlistPanel />
          </TabsContent>
          
          <TabsContent value="messages">
            <MessagesPanel />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function BookingsPanel() {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('calendar');
  
  const { data: bookings, isLoading: bookingsLoading } = useQuery<Booking[]>({
    queryKey: ['/api/bookings'],
  });
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Appointment Bookings</h3>
        <div className="flex space-x-4">
          <Button 
            variant={viewMode === 'list' ? 'default' : 'outline'} 
            onClick={() => setViewMode('list')}
            size="sm"
          >
            List View
          </Button>
          <Button 
            variant={viewMode === 'calendar' ? 'default' : 'outline'} 
            onClick={() => setViewMode('calendar')}
            size="sm"
          >
            Calendar View
          </Button>
        </div>
      </div>
      
      {viewMode === 'calendar' ? (
        <BookingCalendar />
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Payment Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookingsLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary mx-auto" />
                  </TableCell>
                </TableRow>
              ) : bookings && bookings.length > 0 ? (
                bookings.map((booking) => (
                  <BookingRow key={booking.id} booking={booking} />
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    No bookings found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

function BookingRow({ booking }: { booking: Booking }) {
  const { toast } = useToast();
  
  const { data: services } = useQuery<Service[]>({
    queryKey: ['/api/services'],
  });
  
  const { data: slots } = useQuery<BookingSlot[]>({
    queryKey: ['/api/booking-slots'],
  });
  
  const service = services?.find(s => s.id === booking.serviceId);
  const slot = slots?.find(s => s.id === booking.slotId);
  
  const deleteBooking = useMutation({
    mutationFn: async () => {
      await apiRequest('DELETE', `/api/bookings/${booking.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/bookings'] });
      queryClient.invalidateQueries({ queryKey: ['/api/booking-slots'] });
      toast({
        title: 'Booking deleted',
        description: 'The booking has been cancelled successfully'
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
  
  return (
    <TableRow>
      <TableCell>
        <div>
          <div className="font-medium">{booking.customerName}</div>
          <div className="text-sm text-muted-foreground">{booking.customerEmail}</div>
          <div className="text-xs text-muted-foreground">{booking.customerPhone}</div>
        </div>
      </TableCell>
      <TableCell>{service?.name || 'Unknown service'}</TableCell>
      <TableCell>
        {slot ? (
          <div>
            <div>{formatDate(slot.startTime)}</div>
            <div className="text-sm text-muted-foreground">
              {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
            </div>
          </div>
        ) : (
          'Unknown time slot'
        )}
      </TableCell>
      <TableCell>
        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          booking.paymentStatus === 'completed' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {booking.paymentStatus === 'completed' ? 'Paid' : 'Pending'}
        </div>
      </TableCell>
      <TableCell>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon" className="mr-2">
              <Edit className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-2xl">Booking Details</DialogTitle>
              <DialogDescription>
                View complete information about this booking
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              {/* Customer Information Section */}
              <div className="bg-muted/50 rounded-lg p-4 border border-border">
                <h3 className="text-lg font-semibold mb-3 text-primary">Customer Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Full Name</Label>
                    <div className="font-medium mt-1 text-foreground">{booking.customerName || 'Not provided'}</div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Email Address</Label>
                    <div className="font-medium mt-1 text-foreground break-all">{booking.customerEmail || 'Not provided'}</div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Phone Number</Label>
                    <div className="font-medium mt-1 text-foreground">{booking.customerPhone || 'Not provided'}</div>
                  </div>
                </div>
              </div>

              {/* Appointment Details Section */}
              <div className="bg-muted/50 rounded-lg p-4 border border-border">
                <h3 className="text-lg font-semibold mb-3 text-primary">Appointment Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Service</Label>
                    <div className="font-medium mt-1 text-foreground">{service?.name || 'Unknown'}</div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Price</Label>
                    <div className="font-medium mt-1 text-foreground">{service ? formatCurrency(service.price) : 'Unknown'}</div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Date</Label>
                    <div className="font-medium mt-1 text-foreground">{slot ? formatDate(slot.startTime) : 'Unknown'}</div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Time</Label>
                    <div className="font-medium mt-1 text-foreground">
                      {slot ? `${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}` : 'Unknown'}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Payment Information Section */}
              <div className="bg-muted/50 rounded-lg p-4 border border-border">
                <h3 className="text-lg font-semibold mb-3 text-primary">Payment Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Payment Status</Label>
                    <div className="mt-1">
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        booking.paymentStatus === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {booking.paymentStatus === 'completed' ? 'Paid' : 'Pending'}
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Payment ID</Label>
                    <div className="font-medium mt-1 text-sm text-foreground">
                      {booking.paymentId || 'No payment ID'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="destructive"
                onClick={() => deleteBooking.mutate()}
                disabled={deleteBooking.isPending}
              >
                {deleteBooking.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  'Cancel Booking'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => deleteBooking.mutate()}
          disabled={deleteBooking.isPending}
        >
          {deleteBooking.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4 text-destructive" />
          )}
        </Button>
      </TableCell>
    </TableRow>
  );
}

function ServicesPanel() {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  const { data: services, isLoading } = useQuery<Service[]>({
    queryKey: ['/api/services'],
  });
  
  const form = useForm<z.infer<typeof insertServiceSchema>>({
    resolver: zodResolver(insertServiceSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      duration: 60,
      category: "",
      imageUrl: "",
    },
  });
  
  const createService = useMutation({
    mutationFn: async (values: z.infer<typeof insertServiceSchema>) => {
      // Convert price to cents
      const priceInCents = Math.round(parseFloat(values.price.toString()) * 100);
      const serviceData = { ...values, price: priceInCents };
      
      await apiRequest('POST', '/api/services', serviceData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/services'] });
      setIsAddDialogOpen(false);
      form.reset();
      toast({
        title: 'Service created',
        description: 'The service has been added successfully'
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
  
  const onSubmit = (values: z.infer<typeof insertServiceSchema>) => {
    createService.mutate(values);
  };
  
  const deleteService = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/services/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/services'] });
      toast({
        title: 'Service deleted',
        description: 'The service has been removed successfully'
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
  
  const categories = [
    'Manicure',
    'Pedicure',
    'Extensions',
    'Art',
    'Spa',
    'Add-ons'
  ];
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Nail Services</h3>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Service
        </Button>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary mx-auto" />
                </TableCell>
              </TableRow>
            ) : services && services.length > 0 ? (
              services.map((service) => (
                <TableRow key={service.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{service.name}</div>
                      <div className="text-sm text-muted-foreground line-clamp-1">
                        {service.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{service.category}</TableCell>
                  <TableCell>{service.duration} min</TableCell>
                  <TableCell>{formatCurrency(service.price)}</TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => deleteService.mutate(service.id)}
                      disabled={deleteService.isPending}
                      className="ml-2"
                    >
                      {deleteService.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4 text-destructive" />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  No services found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Service</DialogTitle>
            <DialogDescription>
              Create a new service offering for your nail salon
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Luxury Gel Manicure" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe the service in detail" 
                        {...field} 
                        className="resize-none"
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price ($)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="29.99"
                          step="0.01" 
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
                            field.onChange(value);
                          }}
                          value={field.value.toString()}
                        />
                      </FormControl>
                      <FormDescription>Enter price in dollars</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (minutes)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="60"
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value === '' ? 0 : parseInt(e.target.value);
                            field.onChange(value);
                          }}
                          value={field.value.toString()}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/image.jpg" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter a URL for an image representing this service
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={createService.isPending}
                >
                  {createService.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Add Service'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SlotsPanel() {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // Get all slots including booked ones
  const { data: slots, isLoading } = useQuery<BookingSlot[]>({
    queryKey: ['/api/booking-slots'],
  });
  
  // Form for adding new slots
  const now = new Date();
  // Round to the nearest half hour for better UX
  const roundToNearest30Min = new Date(Math.ceil(now.getTime() / (30 * 60000)) * (30 * 60000));
  
  const form = useForm<z.infer<typeof insertBookingSlotSchema>>({
    resolver: zodResolver(insertBookingSlotSchema),
    defaultValues: {
      startTime: roundToNearest30Min,
      endTime: new Date(new Date(roundToNearest30Min).setHours(roundToNearest30Min.getHours() + 1)),
      available: true,
    },
  });
  
  // Create a new slot
  const createSlot = useMutation({
    mutationFn: async (values: z.infer<typeof insertBookingSlotSchema>) => {
      try {
        console.log('Sending to API:', JSON.stringify(values, null, 2));
        const response = await apiRequest('POST', '/api/booking-slots', values);
        console.log('API response:', response);
        return response;
      } catch (error) {
        console.error('API error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/booking-slots'] });
      setIsAddDialogOpen(false);
      form.reset();
      toast({
        title: 'Time slot added',
        description: 'The booking slot has been added successfully'
      });
    },
    onError: (error: Error) => {
      console.error('Mutation error:', error);
      toast({
        title: 'Error creating slot',
        description: `${error.message}. Please try again.`,
        variant: 'destructive'
      });
    }
  });
  
  // Delete a slot
  const deleteSlot = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/booking-slots/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/booking-slots'] });
      toast({
        title: 'Slot deleted',
        description: 'The booking slot has been removed successfully'
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
  
  // Delete all slots for a specific date
  const deleteDateSlots = useMutation({
    mutationFn: async (date: string) => {
      // Get all slots for this date
      const slotsForDate = slots?.filter(slot => 
        new Date(slot.startTime).toDateString() === date && slot.available
      );
      
      if (!slotsForDate || slotsForDate.length === 0) {
        throw new Error("No available slots found for this date");
      }
      
      // Delete each slot one by one
      for (const slot of slotsForDate) {
        await apiRequest('DELETE', `/api/booking-slots/${slot.id}`);
      }
      
      return slotsForDate.length;
    },
    onSuccess: (count) => {
      queryClient.invalidateQueries({ queryKey: ['/api/booking-slots'] });
      toast({
        title: 'Date slots deleted',
        description: `Successfully removed ${count} time slots`
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
  
  // Toggle slot availability
  const toggleAvailability = useMutation({
    mutationFn: async ({ id, available }: { id: number, available: boolean }) => {
      await apiRequest('PATCH', `/api/booking-slots/${id}`, { available });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/booking-slots'] });
      toast({
        title: 'Slot updated',
        description: 'The booking slot availability has been updated'
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
  
  const onSubmit = (values: z.infer<typeof insertBookingSlotSchema>) => {
    try {
      // Get the date objects - these are already Date objects from the form
      // No need to create new Date objects from them
      const startTime = values.startTime;
      const endTime = values.endTime;
      
      if (!startTime || !endTime) {
        toast({
          title: 'Missing times',
          description: 'Please select both start and end times',
          variant: 'destructive'
        });
        return;
      }
      
      // Ensure end time is after start time
      if (endTime <= startTime) {
        toast({
          title: 'Invalid time range',
          description: 'End time must be after start time',
          variant: 'destructive'
        });
        return;
      }
      
      // Make sure both dates are valid
      if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
        toast({
          title: 'Invalid date/time',
          description: 'Please select valid start and end times',
          variant: 'destructive'
        });
        return;
      }
      
      // Create the data object
      const data = {
        startTime,
        endTime,
        available: values.available === null ? true : values.available,
      };
      
      console.log('Submitting slot data:', data);
      createSlot.mutate(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'There was an error processing your date/time selection',
        variant: 'destructive'
      });
      console.error(error);
    }
  };
  
  // Group slots by date for better organization
  const groupedSlots = slots ? slots.reduce((acc, slot) => {
    const date = new Date(slot.startTime).toDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(slot);
    return acc;
  }, {} as Record<string, BookingSlot[]>) : {};
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Available Time Slots</h3>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Time Slot
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : slots && slots.length > 0 ? (
        <div className="space-y-6">
          {Object.entries(groupedSlots).map(([date, dateSlots]) => (
            <div key={date} className="space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">{date}</h4>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive"
                  onClick={() => {
                    if (window.confirm(`Are you sure you want to delete all available slots for ${date}?`)) {
                      deleteDateSlots.mutate(date);
                    }
                  }}
                  disabled={deleteDateSlots.isPending}
                >
                  {deleteDateSlots.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Trash2 className="h-4 w-4 mr-2" />
                  )}
                  Delete All Available Slots
                </Button>
              </div>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Time</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead className="w-[100px]">Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dateSlots.map((slot) => {
                      const startTime = new Date(slot.startTime);
                      const endTime = new Date(slot.endTime);
                      const durationMinutes = Math.round((endTime.getTime() - startTime.getTime()) / 60000);
                      
                      return (
                        <TableRow key={slot.id}>
                          <TableCell>
                            {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                          </TableCell>
                          <TableCell>{durationMinutes} minutes</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Switch 
                                checked={slot.available} 
                                onCheckedChange={(checked) => {
                                  toggleAvailability.mutate({ id: slot.id, available: checked });
                                }}
                                disabled={toggleAvailability.isPending}
                              />
                              <span className={slot.available ? "text-green-600" : "text-red-600"}>
                                {slot.available ? "Available" : "Booked"}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => deleteSlot.mutate(slot.id)}
                              disabled={deleteSlot.isPending || !slot.available}
                            >
                              {deleteSlot.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4 text-destructive" />
                              )}
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-md border p-8 text-center">
          <p className="text-muted-foreground mb-4">No time slots found</p>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add your first time slot
          </Button>
        </div>
      )}
      
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Time Slot</DialogTitle>
            <DialogDescription>
              Create a new booking time slot for your customers
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Start Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "pl-3 text-left font-normal w-full",
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
                                if (date) {
                                  // Keep the time part from the current value
                                  const newDate = new Date(date);
                                  const currentDate = new Date(field.value);
                                  newDate.setHours(
                                    currentDate.getHours(),
                                    currentDate.getMinutes()
                                  );
                                  field.onChange(newDate);
                                  
                                  // Also update end time to be 1 hour later
                                  const endTime = new Date(newDate);
                                  endTime.setHours(endTime.getHours() + 1);
                                  form.setValue("endTime", endTime);
                                }
                              }}
                              disabled={(date) => {
                                // Disable dates in the past
                                const now = new Date();
                                now.setHours(0, 0, 0, 0);
                                return date < now;
                              }}
                              initialFocus
                              className="rounded-md border"
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Time</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            const [time, period] = value.split(' ');
                            const [hours, minutes] = time.split(':').map(Number);
                            let hour = hours;
                            
                            // Convert 12-hour format to 24-hour for the Date object
                            if (period === 'PM' && hour < 12) {
                              hour += 12;
                            } else if (period === 'AM' && hour === 12) {
                              hour = 0;
                            }
                            
                            const newDate = new Date(field.value);
                            newDate.setHours(hour, minutes);
                            field.onChange(newDate);
                            
                            // Also update end time to be 1 hour later
                            const endTime = new Date(newDate);
                            endTime.setHours(endTime.getHours() + 1);
                            form.setValue("endTime", endTime);
                          }}
                          value={
                            field.value 
                              ? `${(new Date(field.value).getHours() % 12 === 0 ? 12 : new Date(field.value).getHours() % 12).toString().padStart(2, '0')}:${new Date(field.value).getMinutes().toString().padStart(2, '0')} ${new Date(field.value).getHours() >= 12 ? 'PM' : 'AM'}`
                              : undefined
                          }
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select time" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent position="popper" className="max-h-[300px]">
                            {/* AM Times */}
                            <SelectItem value="12:00 AM">12:00 AM</SelectItem>
                            <SelectItem value="12:30 AM">12:30 AM</SelectItem>
                            {Array.from({ length: 11 }).map((_, hour) => (
                              <React.Fragment key={hour}>
                                <SelectItem value={`${(hour + 1).toString().padStart(2, '0')}:00 AM`}>
                                  {(hour + 1).toString().padStart(2, '0')}:00 AM
                                </SelectItem>
                                <SelectItem value={`${(hour + 1).toString().padStart(2, '0')}:30 AM`}>
                                  {(hour + 1).toString().padStart(2, '0')}:30 AM
                                </SelectItem>
                              </React.Fragment>
                            ))}
                            
                            {/* PM Times */}
                            <SelectItem value="12:00 PM">12:00 PM</SelectItem>
                            <SelectItem value="12:30 PM">12:30 PM</SelectItem>
                            {Array.from({ length: 11 }).map((_, hour) => (
                              <React.Fragment key={hour}>
                                <SelectItem value={`${(hour + 1).toString().padStart(2, '0')}:00 PM`}>
                                  {(hour + 1).toString().padStart(2, '0')}:00 PM
                                </SelectItem>
                                <SelectItem value={`${(hour + 1).toString().padStart(2, '0')}:30 PM`}>
                                  {(hour + 1).toString().padStart(2, '0')}:30 PM
                                </SelectItem>
                              </React.Fragment>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="endTime"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>End Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "pl-3 text-left font-normal w-full",
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
                                if (date) {
                                  // Keep the time part from the current value
                                  const newDate = new Date(date);
                                  const currentDate = new Date(field.value);
                                  newDate.setHours(
                                    currentDate.getHours(),
                                    currentDate.getMinutes()
                                  );
                                  field.onChange(newDate);
                                }
                              }}
                              disabled={(date) => {
                                // Disable dates in the past
                                const now = new Date();
                                now.setHours(0, 0, 0, 0);
                                return date < now;
                              }}
                              initialFocus
                              className="rounded-md border"
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Time</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            const [time, period] = value.split(' ');
                            const [hours, minutes] = time.split(':').map(Number);
                            let hour = hours;
                            
                            // Convert 12-hour format to 24-hour for the Date object
                            if (period === 'PM' && hour < 12) {
                              hour += 12;
                            } else if (period === 'AM' && hour === 12) {
                              hour = 0;
                            }
                            
                            const newDate = new Date(field.value);
                            newDate.setHours(hour, minutes);
                            field.onChange(newDate);
                          }}
                          value={
                            field.value 
                              ? `${(new Date(field.value).getHours() % 12 === 0 ? 12 : new Date(field.value).getHours() % 12).toString().padStart(2, '0')}:${new Date(field.value).getMinutes().toString().padStart(2, '0')} ${new Date(field.value).getHours() >= 12 ? 'PM' : 'AM'}`
                              : undefined
                          }
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select time" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent position="popper" className="max-h-[300px]">
                            {/* AM Times */}
                            <SelectItem value="12:00 AM">12:00 AM</SelectItem>
                            <SelectItem value="12:30 AM">12:30 AM</SelectItem>
                            {Array.from({ length: 11 }).map((_, hour) => (
                              <React.Fragment key={hour}>
                                <SelectItem value={`${(hour + 1).toString().padStart(2, '0')}:00 AM`}>
                                  {(hour + 1).toString().padStart(2, '0')}:00 AM
                                </SelectItem>
                                <SelectItem value={`${(hour + 1).toString().padStart(2, '0')}:30 AM`}>
                                  {(hour + 1).toString().padStart(2, '0')}:30 AM
                                </SelectItem>
                              </React.Fragment>
                            ))}
                            
                            {/* PM Times */}
                            <SelectItem value="12:00 PM">12:00 PM</SelectItem>
                            <SelectItem value="12:30 PM">12:30 PM</SelectItem>
                            {Array.from({ length: 11 }).map((_, hour) => (
                              <React.Fragment key={hour}>
                                <SelectItem value={`${(hour + 1).toString().padStart(2, '0')}:00 PM`}>
                                  {(hour + 1).toString().padStart(2, '0')}:00 PM
                                </SelectItem>
                                <SelectItem value={`${(hour + 1).toString().padStart(2, '0')}:30 PM`}>
                                  {(hour + 1).toString().padStart(2, '0')}:30 PM
                                </SelectItem>
                              </React.Fragment>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <FormField
                control={form.control}
                name="available"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-lg border p-4">
                    <FormControl>
                      <Switch
                        checked={field.value ?? false}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Available</FormLabel>
                      <FormDescription>
                        Make this slot available for booking
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="submit" 
                  disabled={createSlot.isPending}
                >
                  {createSlot.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Add Slot'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function GalleryPanel() {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { data: galleryItems, isLoading } = useQuery<GalleryItem[]>({
    queryKey: ['/api/gallery'],
  });
  
  const form = useForm<z.infer<typeof insertGalleryItemSchema>>({
    resolver: zodResolver(insertGalleryItemSchema),
    defaultValues: {
      title: "",
      description: "",
      imageUrl: "",
      category: "",
      featured: false,
    },
  });
  
  // Get unique categories from gallery items
  const existingCategories = useMemo(() => {
    if (!galleryItems) return [];
    const categories = galleryItems.map(item => item.category);
    return [...new Set(categories)].filter(Boolean);
  }, [galleryItems]);
  
  // Combined categories (existing + predefined)
  const predefinedCategories = [
    'French Tips',
    'Geometric',
    'Floral',
    'Glitter & Gems'
  ];
  
  const allCategories = useMemo(() => {
    return [...new Set([...predefinedCategories, ...existingCategories])];
  }, [existingCategories]);
  
  // Handler for file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    
    if (file) {
      // Create a preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      // Set this filename to the form
      form.setValue("title", file.name.split('.')[0].replace(/-|_/g, ' '));
    } else {
      setImagePreview(null);
    }
  };
  
  // Handler for file upload
  const uploadFile = async (): Promise<string> => {
    if (!selectedFile) {
      throw new Error("No file selected");
    }
    
    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append('file', selectedFile);
    
    try {
      // Simulate progress for better UX
      const timer = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(timer);
            return prev;
          }
          return prev + 10;
        });
      }, 200);
      
      // In a real app, you would upload to a storage service like S3
      // For this example, we'll use a data URL as a placeholder
      const imageUrl = imagePreview;
      
      // Clear the progress timer
      clearInterval(timer);
      setUploadProgress(100);
      
      // In a real app with an actual upload, you'd return the URL from the server
      return imageUrl || '';
    } catch (error) {
      console.error("Upload failed:", error);
      throw new Error("File upload failed");
    }
  };
  
  const createGalleryItem = useMutation({
    mutationFn: async (values: z.infer<typeof insertGalleryItemSchema>) => {
      let imageUrl = values.imageUrl;
      
      // If a file was selected, upload it first
      if (selectedFile) {
        imageUrl = await uploadFile();
      }
      
      // Create the gallery item with the image URL
      await apiRequest('POST', '/api/gallery', {
        ...values,
        imageUrl
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/gallery'] });
      setIsAddDialogOpen(false);
      setSelectedFile(null);
      setImagePreview(null);
      setUploadProgress(0);
      form.reset();
      toast({
        title: 'Gallery item added',
        description: 'The gallery item has been created successfully'
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
  
  const onSubmit = (values: z.infer<typeof insertGalleryItemSchema>) => {
    createGalleryItem.mutate(values);
  };
  
  const deleteGalleryItem = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/gallery/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/gallery'] });
      toast({
        title: 'Gallery item deleted',
        description: 'The gallery item has been removed successfully'
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
  
  const toggleFeatured = useMutation({
    mutationFn: async ({ id, featured }: { id: number, featured: boolean }) => {
      await apiRequest('PATCH', `/api/gallery/${id}`, { featured });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/gallery'] });
      toast({
        title: 'Gallery item updated',
        description: 'The featured status has been updated successfully'
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
  
  // Add a new category
  const addCategory = () => {
    if (!newCategory.trim()) {
      toast({
        title: 'Error',
        description: 'Category name cannot be empty',
        variant: 'destructive'
      });
      return;
    }
    
    // Check if category already exists
    if (allCategories.includes(newCategory.trim())) {
      toast({
        title: 'Error',
        description: 'This category already exists',
        variant: 'destructive'
      });
      return;
    }
    
    // In a real app, you would send this to the server
    // For now, we'll just update our local state
    predefinedCategories.push(newCategory.trim());
    setNewCategory("");
    setIsCategoryDialogOpen(false);
    
    toast({
      title: 'Category added',
      description: `The category "${newCategory}" has been added successfully`
    });
  };
  
  return (
    <div>
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <h3 className="text-xl font-semibold">Gallery Management</h3>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setIsCategoryDialogOpen(true)}
          >
            <FolderPlus className="mr-2 h-4 w-4" />
            Manage Categories
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Gallery Item
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {galleryItems && galleryItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="relative h-48">
                <img 
                  src={item.imageUrl} 
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="bg-white/80 hover:bg-white"
                    onClick={() => toggleFeatured.mutate({ 
                      id: item.id, 
                      featured: !item.featured 
                    })}
                  >
                    {item.featured ? (
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    ) : (
                      <Star className="h-4 w-4" />
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="bg-white/80 hover:bg-white text-destructive"
                    onClick={() => deleteGalleryItem.mutate(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                {item.featured && (
                  <div className="absolute bottom-2 left-2 bg-accent text-white text-xs px-2 py-1 rounded-full">
                    Featured
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <div className="font-medium">{item.title}</div>
                <div className="text-sm text-muted-foreground">{item.description}</div>
                <div className="text-xs mt-2 bg-secondary/20 inline-block px-2 py-1 rounded">
                  {item.category}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* Add Gallery Item Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[450px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Gallery Item</DialogTitle>
            <DialogDescription>
              Add a new nail design to your gallery
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* File Upload Section */}
              <div className="space-y-3">
                <Label>Upload Image</Label>
                
                {/* Hidden file input */}
                <input 
                  type="file" 
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
                
                {/* Custom upload button and preview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div 
                    className={`border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center 
                      ${selectedFile ? 'border-primary/40 bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/25 hover:bg-muted/50'} 
                      transition-colors cursor-pointer text-center h-[140px] sm:h-full`} 
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {selectedFile ? (
                      <>
                        <ImagePlus className="h-6 w-6 text-primary mb-2" />
                        <div className="text-sm font-medium">{selectedFile.name}</div>
                        <div className="text-xs text-muted-foreground mt-1">Click to change</div>
                      </>
                    ) : (
                      <>
                        <UploadCloud className="h-6 w-6 text-muted-foreground mb-2" />
                        <div className="text-sm">Click to upload an image</div>
                        <div className="text-xs text-muted-foreground mt-1">JPG, PNG, GIF up to 5MB</div>
                      </>
                    )}
                  </div>
                  
                  <div className={`h-[140px] sm:h-auto border rounded-lg flex items-center justify-center overflow-hidden ${!imagePreview ? 'bg-muted/50' : ''}`}>
                    {imagePreview ? (
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-xs text-muted-foreground px-4 text-center">
                        Image preview will appear here
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Upload progress bar */}
                {uploadProgress > 0 && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-1" />
                  </div>
                )}
                
                {/* Or divider */}
                <div className="relative mt-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or enter image URL
                    </span>
                  </div>
                </div>
              </div>
              
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://example.com/image.jpg" 
                        {...field} 
                        value={field.value || ''} 
                      />
                    </FormControl>
                    <FormDescription>
                      Enter a URL for the nail design image
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. French Tips" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g. Classic with a twist" 
                        {...field} 
                        value={field.value || ''} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                      <FormLabel>Category</FormLabel>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 px-2 text-xs"
                        onClick={() => {
                          setIsAddDialogOpen(false);
                          setTimeout(() => setIsCategoryDialogOpen(true), 300);
                        }}
                      >
                        <Plus className="mr-1 h-3 w-3" />
                        Add Category
                      </Button>
                    </div>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      value={field.value || undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {allCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Featured Item</FormLabel>
                      <FormDescription>
                        Featured items will appear on the homepage
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value ?? false}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddDialogOpen(false);
                    setSelectedFile(null);
                    setImagePreview(null);
                    setUploadProgress(0);
                    form.reset();
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={createGalleryItem.isPending}
                >
                  {createGalleryItem.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Add to Gallery'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Category Management Dialog */}
      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Manage Categories</DialogTitle>
            <DialogDescription>
              Add or remove categories for your gallery items
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex items-center space-x-2">
              <Input 
                placeholder="New category name" 
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
              <Button 
                onClick={addCategory}
                disabled={!newCategory.trim()}
              >
                Add
              </Button>
            </div>
            
            <div className="border rounded-md p-4">
              <Label className="text-sm font-medium mb-3 block">
                Current Categories
              </Label>
              {allCategories.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {allCategories.map((category) => (
                    <div 
                      key={category}
                      className="inline-flex items-center bg-secondary/10 hover:bg-secondary/20 px-2.5 py-1 rounded-full text-sm"
                    >
                      {category}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  No categories added yet
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={() => setIsCategoryDialogOpen(false)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function WaitlistPanel() {
  const { toast } = useToast();
  
  const { data: waitlistEntries, isLoading } = useQuery<WaitlistEntry[]>({
    queryKey: ['/api/waitlist'],
  });
  
  const deleteWaitlistEntry = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/waitlist/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/waitlist'] });
      toast({
        title: 'Entry removed',
        description: 'The waitlist entry has been removed successfully'
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
  
  return (
    <div>
      <h3 className="text-xl font-semibold mb-6">Waitlist Entries</h3>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contact Info</TableHead>
              <TableHead>Interests</TableHead>
              <TableHead>Date Added</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary mx-auto" />
                </TableCell>
              </TableRow>
            ) : waitlistEntries && waitlistEntries.length > 0 ? (
              waitlistEntries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>
                    <div className="font-medium">{entry.firstName} {entry.lastName}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{entry.email}</div>
                    <div className="text-sm text-muted-foreground">{entry.phone}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {entry.interests.map((interest: string) => (
                        <span 
                          key={interest}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-secondary/20"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    {formatDate(entry.createdAt)}
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => deleteWaitlistEntry.mutate(entry.id)}
                      disabled={deleteWaitlistEntry.isPending}
                    >
                      {deleteWaitlistEntry.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4 text-destructive" />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  No waitlist entries found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function MessagesPanel() {
  const { toast } = useToast();
  
  const { data: messages, isLoading } = useQuery<ContactMessage[]>({
    queryKey: ['/api/contact'],
  });
  
  const deleteMessage = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/contact/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/contact'] });
      toast({
        title: 'Message deleted',
        description: 'The contact message has been deleted successfully'
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
  
  const markAsRead = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('PATCH', `/api/contact/${id}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/contact'] });
      toast({
        title: 'Message updated',
        description: 'The message has been marked as read'
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
  
  return (
    <div>
      <h3 className="text-xl font-semibold mb-6">Contact Messages</h3>
      
      <div className="space-y-6">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : messages && messages.length > 0 ? (
          messages.map((message) => (
            <Card key={message.id} className={message.read ? "" : "border-l-4 border-l-primary"}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{message.subject}</CardTitle>
                    <CardDescription>
                      From: {message.name} ({message.email}) - {formatDate(message.createdAt)}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!message.read && (
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => markAsRead.mutate(message.id)}
                        disabled={markAsRead.isPending}
                      >
                        {markAsRead.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Check className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => deleteMessage.mutate(message.id)}
                      disabled={deleteMessage.isPending}
                    >
                      {deleteMessage.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4 text-destructive" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line">{message.message}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No contact messages found
          </div>
        )}
      </div>
    </div>
  );
}

function ProductsPanel() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  const { data: products, isLoading } = useQuery({
    queryKey: ['/api/products'],
  });

  const handleAddProduct = () => {
    setEditingProduct(null);
    setDialogOpen(true);
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingProduct(null);
  };

  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest('DELETE', `/api/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      toast({
        title: 'Product deleted',
        description: 'The product has been removed from your shop',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: `Failed to delete product: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const handleDeleteProduct = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProductMutation.mutate(id);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Shop Products</h3>
        <Button onClick={handleAddProduct}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : products && products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product: any) => (
            <Card key={product.id} className="overflow-hidden">
              <div className="aspect-square relative">
                <img 
                  src={product.imageUrl} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="bg-white px-3 py-1 text-sm font-medium rounded-md">Sold Out</span>
                  </div>
                )}
                {product.featured && (
                  <div className="absolute top-2 right-2">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  </div>
                )}
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex justify-between items-start">
                  <span>{product.name}</span>
                  <span className="text-base font-medium">£{(parseFloat(product.price)).toFixed(2)}</span>
                </CardTitle>
                <CardDescription className="line-clamp-2">{product.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between">
                  <div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {product.category}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="icon" onClick={() => handleEditProduct(product)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="text-red-500" onClick={() => handleDeleteProduct(product.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <ShoppingBag className="h-8 w-8 text-primary/60" />
          </div>
          <h3 className="text-xl font-bold mb-2">No Products Yet</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            Start adding products to your shop. These will be displayed on your shop page for customers to browse.
          </p>
          <Button onClick={handleAddProduct}>
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Product
          </Button>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            <DialogDescription>
              {editingProduct
                ? 'Update your product details below.'
                : 'Fill in the details to add a new product to your shop.'}
            </DialogDescription>
          </DialogHeader>
          <ProductForm 
            onSuccess={handleDialogClose}
            initialValues={editingProduct || undefined}
            productId={editingProduct?.id}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}


