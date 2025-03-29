import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { GalleryItem } from '@shared/schema';
import { Loader2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { getUniqueCategories } from '@/lib/utils';
import GalleryImage from './GalleryImage';

export default function Gallery() {
  const { data: galleryItems, isLoading } = useQuery<GalleryItem[]>({
    queryKey: ['/api/gallery']
  });
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  
  const categories = galleryItems ? getUniqueCategories(galleryItems, 'category') : [];
  
  const filteredItems = selectedCategory 
    ? galleryItems?.filter(item => item.category === selectedCategory)
    : galleryItems;

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">Nail Art Gallery</h2>
          <div className="relative mx-auto">
            <p className="text-lg text-neutral-900 mx-auto max-w-2xl">Browse our portfolio of designs</p>
            <div className="absolute bottom-[-10px] left-1/2 transform -translate-x-1/2 w-[100px] h-[2px] bg-accent"></div>
          </div>
        </div>
        
        {/* Gallery Categories */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          <Button 
            onClick={() => setSelectedCategory(null)}
            variant={selectedCategory === null ? "default" : "outline"}
            className={selectedCategory === null 
              ? "bg-primary text-white hover:bg-primary/90 rounded-full px-6" 
              : "border border-primary text-primary hover:bg-primary hover:text-white rounded-full px-6"}
          >
            All Designs
          </Button>
          
          {categories.map(category => (
            <Button
              key={category}
              onClick={() => setSelectedCategory(category)}
              variant={selectedCategory === category ? "default" : "outline"}
              className={selectedCategory === category 
                ? "bg-primary text-white hover:bg-primary/90 rounded-full px-6" 
                : "border border-primary text-primary hover:bg-primary hover:text-white rounded-full px-6"}
            >
              {category}
            </Button>
          ))}
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Gallery Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredItems?.map((item) => (
                <Dialog key={item.id}>
                  <DialogTrigger asChild>
                    <div className="relative overflow-hidden rounded-lg shadow-md group cursor-pointer" onClick={() => setSelectedImage(item)}>
                      <img 
                        src={item.imageUrl} 
                        alt={item.title} 
                        className="w-full h-60 object-cover"
                      />
                      <div className="absolute inset-0 bg-primary bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="bg-white text-primary p-3 rounded-full">
                          <Search className="h-5 w-5" />
                        </div>
                      </div>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl p-0 overflow-hidden">
                    <GalleryImage item={item} />
                  </DialogContent>
                </Dialog>
              ))}
            </div>
            
            {/* This would be replaced with actual pagination or load more functionality */}
            {filteredItems && filteredItems.length > 8 && (
              <div className="text-center mt-10">
                <Button className="bg-accent hover:bg-accent/90 text-white px-8 py-3 h-auto rounded-full transition-all duration-300 font-medium">
                  Load More Designs
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
