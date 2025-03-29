import React from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { GalleryItem } from '@shared/schema';
import { Loader2 } from 'lucide-react';

export default function FeaturedDesigns() {
  const { data: featuredItems, isLoading } = useQuery<GalleryItem[]>({
    queryKey: ['/api/gallery', { featured: true }],
  });

  return (
    <section className="py-16 bg-neutral-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">Featured Nail Designs</h2>
          <div className="relative mx-auto">
            <p className="text-lg text-neutral-900 mx-auto max-w-2xl">Explore our signature styles and artistry</p>
            <div className="absolute bottom-[-10px] left-1/2 transform -translate-x-1/2 w-[100px] h-[2px] bg-accent"></div>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featuredItems?.map((item) => (
              <div key={item.id} className="group relative overflow-hidden rounded-lg shadow-md">
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-4 text-white">
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="text-sm">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="text-center mt-10">
          <Link href="#gallery">
            <div className="inline-flex items-center font-medium text-primary hover:text-accent transition-colors duration-300 cursor-pointer">
              View Full Gallery
              <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
