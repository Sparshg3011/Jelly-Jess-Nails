import React, { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Redirect } from 'wouter';
import LoginForm from '@/components/LoginForm';

export default function AuthPage() {
  const [isRegistration, setIsRegistration] = useState(false);
  const { user, isLoading } = useAuth();
  
  // Redirect if user is already logged in
  if (!isLoading && user) {
    if (user.isAdmin) {
      return <Redirect to="/admin" />; // Redirect admins to admin page
    } else {
      return <Redirect to="/" />; // Redirect regular users to home
    }
  }
  
  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center">
      <div className="max-w-6xl mx-auto w-full p-4 grid md:grid-cols-2 gap-8 items-center">
        {/* Left column - Admin Login form */}
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="text-center mb-8">
            <h1 className="font-script text-4xl text-primary mb-4">Jelly Jessy Nails</h1>
            <h2 className="font-display text-2xl font-bold">Customer Portal</h2>
            <p className="text-muted-foreground mt-2">
              Login or create an account to manage your appointments.
            </p>
          </div>
          
          <div className="flex justify-center mb-6">
            <div role="tablist" className="flex space-x-4 bg-neutral-100 rounded-full p-1">
              <button role="tab" 
                className={`px-6 py-2 rounded-full ${!isRegistration ? 'bg-primary text-white' : 'bg-transparent text-neutral-700'}`}
                onClick={() => setIsRegistration(false)}>
                Login
              </button>
              <button role="tab" 
                className={`px-6 py-2 rounded-full ${isRegistration ? 'bg-primary text-white' : 'bg-transparent text-neutral-700'}`}
                onClick={() => setIsRegistration(true)}>
                Register
              </button>
            </div>
          </div>
          
          <LoginForm isRegistration={isRegistration} />
        </div>
        
        {/* Right column - Hero image and info */}
        <div className="hidden md:block">
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&q=80&w=600" 
              alt="Beautiful nail art design" 
              className="rounded-lg shadow-xl w-full"
            />
            <div className="absolute inset-0 bg-primary bg-opacity-20 rounded-lg"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
              <h3 className="font-display text-3xl font-bold text-white mb-4">Customer Portal</h3>
              <p className="text-white text-lg max-w-md">
                Book your appointments, view our latest nail designs, and join our waitlist for special events and promotions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
