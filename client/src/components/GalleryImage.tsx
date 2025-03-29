import React from 'react';
import { GalleryItem } from '@shared/schema';
import { DialogClose } from '@/components/ui/dialog';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GalleryImageProps {
  item: GalleryItem;
}

export default function GalleryImage({ item }: GalleryImageProps) {
  return (
    <div className="bg-white rounded-lg overflow-hidden">
      <div className="relative">
        <img 
          src={item.imageUrl} 
          alt={item.title} 
          className="w-full h-auto max-h-[70vh] object-contain"
        />
        <DialogClose className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-1">
          <X className="h-5 w-5" />
        </DialogClose>
      </div>
      <div className="p-6">
        <h3 className="font-display text-2xl font-bold">{item.title}</h3>
        <p className="text-neutral-700 mt-2">{item.description}</p>
        <div className="mt-4 flex items-center">
          <span className="text-sm bg-secondary/30 text-neutral-800 px-3 py-1 rounded-full">
            {item.category}
          </span>
        </div>
      </div>
    </div>
  );
}
