import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AdminPanel from '@/components/AdminPanel';
import { useAuth } from '@/hooks/use-auth';
import { Redirect } from 'wouter';

export default function AdminPage() {
  const { user } = useAuth();
  
  // Check if user is admin
  if (user && !user.isAdmin) {
    return <Redirect to="/" />;
  }
  
  return (
    <div className="min-h-screen font-sans antialiased bg-neutral-100 text-neutral-900">
      <Navbar />
      
      <main className="pt-28 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-center mb-8">
            Admin Dashboard
          </h1>
          
          <AdminPanel />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
