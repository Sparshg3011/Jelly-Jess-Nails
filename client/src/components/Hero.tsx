import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import gummyHeroBg from '../assets/gummy-hero-bg.svg';
import { Sparkles, CalendarCheck, Star } from 'lucide-react';
import { scrollToSection } from '@/lib/utils';

export default function Hero() {
  // Handle smooth scrolling for section links
  const handleSectionClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    scrollToSection(sectionId);
  };

  return (
    <section className="pt-28 pb-16 md:pt-40 md:pb-24 relative overflow-hidden">
      {/* Gummy bear background with blur effect */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${gummyHeroBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(8px)",
          transform: "scale(1.1)", // Prevent blur edges
          opacity: 0.85
        }}
      ></div>
      
      {/* Decorative gummy bear elements */}
      <div className="absolute top-20 left-10 w-20 h-20 rounded-full bg-pink-300 opacity-60 animate-bounce-slow hidden md:block"></div>
      <div className="absolute top-40 right-20 w-16 h-16 rounded-full bg-purple-300 opacity-60 animate-bounce-slower hidden md:block"></div>
      <div className="absolute bottom-20 left-1/4 w-14 h-14 rounded-full bg-yellow-300 opacity-60 animate-pulse hidden md:block"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0 animate-fade-in">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
              Sweet Nail Designs by <span className="text-primary bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">Jelly Jessy Nails</span>
            </h1>
            <p className="text-lg md:text-xl mb-8 text-neutral-800 max-w-xl bg-white/60 p-4 rounded-lg backdrop-blur-sm">
              Discover fun and colorful nail artistry with our signature gummy bear themed designs. Book your appointment or join our exclusive waitlist now!
            </p>
            
            {/* Feature badges */}
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center gap-2 bg-white/80 py-2 px-4 rounded-full shadow-sm">
                <Sparkles className="h-4 w-4 text-pink-500" />
                <span className="text-sm font-medium">Premium Quality</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 py-2 px-4 rounded-full shadow-sm">
                <CalendarCheck className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium">Easy Booking</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 py-2 px-4 rounded-full shadow-sm">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium">Unique Designs</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="#waitlist">
                <a onClick={(e) => handleSectionClick(e, 'waitlist')}>
                  <Button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:opacity-90 text-white px-8 py-6 h-auto rounded-full transition-all duration-300 font-medium text-center shadow-md hover:shadow-lg">
                    Join Waitlist
                  </Button>
                </a>
              </Link>
              <Link href="#gallery">
                <a onClick={(e) => handleSectionClick(e, 'gallery')}>
                  <Button variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-6 h-auto rounded-full transition-all duration-300 font-medium text-center backdrop-blur-sm bg-white/50">
                    View Gallery
                  </Button>
                </a>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center md:justify-end animate-slide-up">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-pink-300 to-purple-300 rounded-lg blur-md opacity-70"></div>
              <img 
                src="https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&q=80&w=600" 
                alt="Beautiful nail art design" 
                className="relative rounded-lg shadow-xl border-4 border-white" 
                width="500" 
                height="600" 
              />
              <div className="absolute -bottom-5 -left-5 bg-white p-4 rounded-lg shadow-lg animate-pulse">
                <p className="font-script text-primary text-xl font-bold">Book Now!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
