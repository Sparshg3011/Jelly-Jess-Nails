import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/use-auth';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { GoogleAuthButton } from './GoogleAuthButton';
import { Separator } from '@/components/ui/separator';

// Schema for login form
const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

// Extended schema for registration to include email
const registrationSchema = loginSchema.extend({
  email: z.string().email("Invalid email address"),
});

interface LoginFormProps {
  isRegistration: boolean;
}

export default function LoginForm({ isRegistration }: LoginFormProps) {
  const { loginMutation, registerMutation } = useAuth();
  
  // Set up the form with correct schema based on isRegistration
  const form = useForm({
    resolver: zodResolver(isRegistration ? registrationSchema : loginSchema),
    defaultValues: {
      username: "",
      password: "",
      ...(isRegistration ? { email: "" } : {}),
    },
  });
  
  // Handle form submission
  function onSubmit(values: any) {
    if (isRegistration) {
      registerMutation.mutate({
        username: values.username,
        password: values.password,
        email: values.email,
        isAdmin: false // Ensure customers don't get admin access
      });
    } else {
      loginMutation.mutate({
        username: values.username,
        password: values.password,
      });
    }
  }
  
  // Determine if form is submitting
  const isSubmitting = isRegistration ? registerMutation.isPending : loginMutation.isPending;
  
  return (
    <div className="space-y-6">
      {/* Google Auth Button */}
      <GoogleAuthButton />
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {isRegistration && (
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isRegistration ? 'Creating account...' : 'Logging in...'}
              </>
            ) : (
              isRegistration ? 'Create Account' : 'Login'
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
