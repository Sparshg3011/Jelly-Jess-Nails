import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

// Define the testimonial type
interface Testimonial {
  id: number;
  name: string;
  image: string;
  text: string;
  rating: number;
}

// Sample testimonials data
const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    image: "https://randomuser.me/api/portraits/women/32.jpg",
    text: "The nail artists at Luxe Nails are truly talented. I've never had my nails look so beautiful, and the designs last for weeks without chipping!",
    rating: 5
  },
  {
    id: 2,
    name: "Michelle Torres",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    text: "The salon environment is so luxurious and relaxing. I love coming here for my monthly pedicure. It's more than a service—it's a true pampering experience.",
    rating: 5
  },
  {
    id: 3,
    name: "Jessica Kim",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    text: "I appreciate how attentive they are to detail and hygiene. The custom nail art they created for my wedding was absolutely perfect and matched my theme beautifully.",
    rating: 4.5
  }
];

export default function Testimonials() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">What Our Clients Say</h2>
          <div className="relative mx-auto">
            <p className="text-lg text-neutral-900 mx-auto max-w-2xl">Experiences from our satisfied clients</p>
            <div className="absolute bottom-[-10px] left-1/2 transform -translate-x-1/2 w-[100px] h-[2px] bg-accent"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  // Function to render stars based on rating
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={`full-${i}`} className="h-4 w-4 fill-amber-400 text-amber-400" />
      );
    }
    
    // Add half star if needed
    if (hasHalfStar) {
      stars.push(
        <span key="half" className="relative">
          <Star className="h-4 w-4 text-amber-400" />
          <span className="absolute inset-0 overflow-hidden w-1/2">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
          </span>
        </span>
      );
    }
    
    // Add empty stars to complete 5 stars
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="h-4 w-4 text-amber-400" />
      );
    }
    
    return stars;
  };
  
  return (
    <Card className="bg-neutral-100 relative">
      <CardContent className="p-8">
        <div className="text-accent text-4xl absolute -top-5 -left-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="currentColor" className="opacity-70">
            <path d="M13 14.725c0-5.141 3.892-10.519 10-11.725l.984 2.126c-2.215.835-4.163 3.742-4.38 5.746 2.491.392 4.396 2.547 4.396 5.149 0 3.182-2.584 4.979-5.199 4.979-3.015 0-5.801-2.305-5.801-6.275zm-13 0c0-5.141 3.892-10.519 10-11.725l.984 2.126c-2.215.835-4.163 3.742-4.38 5.746 2.491.392 4.396 2.547 4.396 5.149 0 3.182-2.584 4.979-5.199 4.979-3.015 0-5.801-2.305-5.801-6.275z" />
          </svg>
        </div>
        <p className="text-neutral-900 mb-6 pt-6">{testimonial.text}</p>
        <div className="flex items-center">
          <div className="mr-4">
            <img 
              src={testimonial.image} 
              alt={testimonial.name} 
              className="w-12 h-12 rounded-full object-cover"
            />
          </div>
          <div>
            <h4 className="font-medium">{testimonial.name}</h4>
            <div className="text-amber-400 text-sm flex">
              {renderStars(testimonial.rating)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
