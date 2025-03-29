import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { Gallery as GalleryType } from '@shared/schema';
import { Loader2, Image, ImageIcon, HeartIcon } from 'lucide-react';

export default function PortfolioPage() {
  const { data: galleryItems, isLoading } = useQuery<GalleryType[]>({
    queryKey: ['/api/gallery']
  });

  const categories = ['All', 'Gel Polish', 'Builder Gel', 'Gel X', 'Level 1', 'Level 2', 'Level 3'];
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredItems = galleryItems?.filter(item => 
    activeCategory === 'All' || item.category === activeCategory
  );

  return (
    <div className="min-h-screen font-sans antialiased bg-neutral-50 text-neutral-900">
      <Navbar />
      <main>
        <section className="py-12 md:py-20 bg-gradient-to-b from-secondary/30 to-secondary/5">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">My Portfolio</h1>
              <p className="text-lg max-w-2xl mx-auto">Browse through my recent nail art creations and get inspired for your next appointment.</p>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="All" className="w-full max-w-4xl mx-auto mb-12">
              <TabsList className="grid grid-cols-7 w-full">
                {categories.map((category) => (
                  <TabsTrigger 
                    key={category} 
                    value={category}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredItems && filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredItems.map((item) => (
                  <Card key={item.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
                    <div className="relative aspect-square">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                        <h3 className="text-white font-bold">{item.title}</h3>
                        <p className="text-white/80 text-sm">{item.description}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                  <ImageIcon className="h-12 w-12 text-neutral-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">No images yet</h3>
                <p className="text-neutral-500 max-w-md mx-auto mb-8">
                  Check back soon for new nail art creations or follow me on Instagram for the latest updates.
                </p>
                <Button asChild variant="secondary">
                  <a href="https://instagram.com/yourusername" target="_blank" rel="noopener noreferrer">
                    Follow on Instagram
                  </a>
                </Button>
              </div>
            )}
          </div>
        </section>
        
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="bg-secondary/10 p-6 rounded-lg max-w-3xl mx-auto">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <HeartIcon className="w-16 h-16 text-secondary flex-shrink-0" />
                <div>
                  <h3 className="text-2xl font-bold mb-2">Love what you see?</h3>
                  <p className="mb-4">I'd be delighted to create a custom nail design for you. Book an appointment today to bring your nail art vision to life.</p>
                  <div className="flex flex-wrap gap-3">
                    <Button asChild>
                      <a href="/booking">Book Now</a>
                    </Button>
                    <Button asChild variant="outline">
                      <a href="/nail-art">View Services</a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
} 