import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Service } from '@shared/schema';
import { Loader2, Gem, Wand2, Scissors, Heart, Sparkles, Paintbrush } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function Services() {
  const { data: services, isLoading } = useQuery<Service[]>({
    queryKey: ['/api/services']
  });
  
  // Map service categories to icons
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Manicure':
        return <Scissors className="h-8 w-8" />;
      case 'Extensions':
        return <Gem className="h-8 w-8" />;
      case 'Art':
        return <Paintbrush className="h-8 w-8" />;
      case 'Spa':
        return <Heart className="h-8 w-8" />;
      case 'Pedicure':
        return <Wand2 className="h-8 w-8" />;
      case 'Add-ons':
        return <Sparkles className="h-8 w-8" />;
      default:
        return <Scissors className="h-8 w-8" />;
    }
  };

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">Our Premium Services</h2>
          <div className="relative mx-auto">
            <p className="text-lg text-neutral-900 mx-auto max-w-2xl">Luxurious treatments for beautiful hands</p>
            <div className="absolute bottom-[-10px] left-1/2 transform -translate-x-1/2 w-[100px] h-[2px] bg-accent"></div>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services?.map((service) => (
              <div key={service.id} className="bg-white p-8 rounded-lg shadow-md transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="text-accent text-5xl mb-4">
                  {getCategoryIcon(service.category)}
                </div>
                <h3 className="font-display text-xl font-bold mb-3">{service.name}</h3>
                <p className="text-neutral-900 mb-4">{service.description}</p>
                <p className="font-medium text-primary">{formatCurrency(service.price)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
