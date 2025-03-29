import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import FeaturedDesigns from '@/components/FeaturedDesigns';
import About from '@/components/About';
import Services from '@/components/Services';
import Gallery from '@/components/Gallery';
import BookingForm from '@/components/BookingForm';
import Waitlist from '@/components/Waitlist';
import Testimonials from '@/components/Testimonials';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen font-sans antialiased bg-neutral-100 text-neutral-900">
      <Navbar />
      <main>
        <section id="home">
          <Hero />
        </section>
        
        <section>
          <FeaturedDesigns />
        </section>
        
        <section id="about" className="bg-white">
          <About />
        </section>
        
        <section id="services" className="bg-secondary bg-opacity-10">
          <Services />
        </section>
        
        <section id="gallery" className="bg-white">
          <Gallery />
        </section>
        
        <section id="booking" className="bg-neutral-200">
          <BookingForm />
        </section>
        
        <section id="waitlist" className="bg-secondary bg-opacity-20">
          <Waitlist />
        </section>
        
        <section className="bg-white">
          <Testimonials />
        </section>
        
        <section id="contact" className="bg-neutral-100">
          <Contact />
        </section>
      </main>
      <Footer />
    </div>
  );
}
