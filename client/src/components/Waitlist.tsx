import React from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { insertWaitlistEntrySchema } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';

// Extended validation schema
const waitlistFormSchema = insertWaitlistEntrySchema.extend({
  acceptTerms: z.boolean().refine(val => val === true, {
    message: "You must agree to receive emails about offers and updates.",
  }),
});

// Define the interest options
const interestOptions = [
  { id: 'manicures', label: 'Manicures' },
  { id: 'pedicures', label: 'Pedicures' },
  { id: 'extensions', label: 'Nail Extensions' },
  { id: 'art', label: 'Custom Nail Art' },
];

type WaitlistFormValues = z.infer<typeof waitlistFormSchema>;

export default function Waitlist() {
  const { toast } = useToast();
  
  // Set up the form
  const form = useForm<WaitlistFormValues>({
    resolver: zodResolver(waitlistFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      interests: [],
      acceptTerms: false,
    },
  });
  
  const waitlistMutation = useMutation({
    mutationFn: async (data: WaitlistFormValues) => {
      // Remove the acceptTerms field before sending to API
      const { acceptTerms, ...submitData } = data;
      const res = await apiRequest("POST", "/api/waitlist", submitData);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Added to waitlist!",
        description: "Thank you for joining our waitlist. We'll be in touch soon!",
      });
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Submission failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  function onSubmit(data: WaitlistFormValues) {
    waitlistMutation.mutate(data);
  }

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Join Our VIP Waitlist</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">Be the first to experience our premium nail services and receive exclusive opening offers and promotions.</p>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="First Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Last Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="mb-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="email" placeholder="Email Address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="mb-6">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="tel" placeholder="Phone Number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="mb-6">
                <FormField
                  control={form.control}
                  name="interests"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="text-left text-sm font-medium">Interested Services (select all that apply)</FormLabel>
                        <FormDescription>
                          Choose the services you're most interested in
                        </FormDescription>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {interestOptions.map((option) => (
                          <FormField
                            key={option.id}
                            control={form.control}
                            name="interests"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={option.id}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(option.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, option.id])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== option.id
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {option.label}
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="mb-6">
                <FormField
                  control={form.control}
                  name="acceptTerms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm">
                          I agree to receive emails about exclusive offers and updates
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
                disabled={waitlistMutation.isPending}
              >
                {waitlistMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing
                  </>
                ) : (
                  "Join Waitlist"
                )}
              </Button>
            </form>
          </Form>
          
          <div className="mt-8 flex justify-center gap-10 text-neutral-900">
            <div>
              <h3 className="font-display text-4xl font-bold text-primary mb-2">70+</h3>
              <p>Nail Art Designs</p>
            </div>
            <div>
              <h3 className="font-display text-4xl font-bold text-primary mb-2">15+</h3>
              <p>Premium Services</p>
            </div>
            <div>
              <h3 className="font-display text-4xl font-bold text-primary mb-2">300+</h3>
              <p>VIP Members</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
