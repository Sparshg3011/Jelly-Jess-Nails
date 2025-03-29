import React from 'react';
import { Medal, Paintbrush, Star } from 'lucide-react';

export default function About() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0 pr-0 md:pr-12">
            <div className="grid grid-cols-2 gap-4">
              <img 
                src="https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=300" 
                alt="Luxurious salon interior" 
                className="rounded-lg shadow-md h-48 object-cover"
              />
              <img 
                src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=300" 
                alt="Nail technician at work" 
                className="rounded-lg shadow-md h-48 object-cover mt-6"
              />
              <img 
                src="https://images.unsplash.com/photo-1595867818082-083862f3d630?auto=format&fit=crop&q=80&w=300" 
                alt="Nail polish collection" 
                className="rounded-lg shadow-md h-48 object-cover"
              />
              <img 
                src="https://images.unsplash.com/photo-1607779097040-017f887063e0?auto=format&fit=crop&q=80&w=300" 
                alt="Manicure station" 
                className="rounded-lg shadow-md h-48 object-cover mt-6"
              />
            </div>
          </div>
          <div className="md:w-1/2">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">Our Nail Artistry Journey</h2>
            <div className="relative mb-8 h-[2px] w-[100px] bg-accent"></div>
            <p className="text-lg mb-5">
              At Luxe Nails, we believe that nail care is more than just a beauty service—it's an art form that enhances your personal style and boosts your confidence.
            </p>
            <p className="text-lg mb-5">
              Founded by master nail technicians with over 15 years of experience, our salon combines luxury, creativity, and impeccable hygiene standards to deliver exceptional nail artistry.
            </p>
            <p className="text-lg mb-8">
              We use only premium, non-toxic products and cutting-edge techniques to ensure your nails look stunning while remaining healthy and strong.
            </p>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center">
                <Medal className="text-accent h-7 w-7 mr-3" />
                <div>
                  <h3 className="font-medium">Premium Quality</h3>
                  <p className="text-sm text-neutral-900">Only the finest products</p>
                </div>
              </div>
              <div className="flex items-center">
                <Paintbrush className="text-accent h-7 w-7 mr-3" />
                <div>
                  <h3 className="font-medium">Custom Designs</h3>
                  <p className="text-sm text-neutral-900">Personalized artistry</p>
                </div>
              </div>
              <div className="flex items-center">
                <Star className="text-accent h-7 w-7 mr-3" />
                <div>
                  <h3 className="font-medium">Expert Technicians</h3>
                  <p className="text-sm text-neutral-900">Trained professionals</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
