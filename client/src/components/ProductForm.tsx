import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productCategoryEnum, insertProductZodSchema } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const productFormSchema = insertProductZodSchema;

type ProductFormValues = z.infer<typeof productFormSchema>;

interface ProductFormProps {
  onSuccess?: () => void;
  initialValues?: Partial<ProductFormValues>;
  productId?: string;
}

export default function ProductForm({ onSuccess, initialValues, productId }: ProductFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditing = !!productId;

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: initialValues || {
      name: '',
      description: '',
      price: 0,
      category: 'press-on-nails',
      imageUrl: '',
      featured: false,
      inStock: true
    }
  });

  // Mutation for creating or updating a product
  const productMutation = useMutation({
    mutationFn: async (data: ProductFormValues) => {
      const url = isEditing ? `/api/products/${productId}` : '/api/products';
      const method = isEditing ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save product');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      toast({
        title: isEditing ? 'Product Updated' : 'Product Created',
        description: isEditing 
          ? 'The product has been updated successfully.' 
          : 'The product has been added to the shop.',
      });
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save product. Please try again.',
        variant: 'destructive'
      });
    }
  });

  const onSubmit = (data: ProductFormValues) => {
    productMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Product Name</Label>
          <Input 
            id="name" 
            {...register('name')} 
            placeholder="Floral Fantasy Press-On Set" 
          />
          {errors.name && (
            <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea 
            id="description" 
            {...register('description')} 
            placeholder="Hand-painted floral design on medium length coffin nails..."
            rows={4}
          />
          {errors.description && (
            <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="price">Price (£)</Label>
          <Input 
            id="price" 
            type="number" 
            step="0.01"
            min="0.01"
            {...register('price')} 
            placeholder="29.99"
          />
          {errors.price && (
            <p className="text-sm text-red-500 mt-1">{errors.price.message}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="category">Category</Label>
          <Select 
            defaultValue={watch('category')} 
            onValueChange={(value) => setValue('category', value as any)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="press-on-nails">Press-On Nails</SelectItem>
              <SelectItem value="nail-accessories">Nail Accessories</SelectItem>
              <SelectItem value="gift-cards">Gift Cards</SelectItem>
            </SelectContent>
          </Select>
          {errors.category && (
            <p className="text-sm text-red-500 mt-1">{errors.category.message}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="imageUrl">Image URL</Label>
          <Input 
            id="imageUrl" 
            {...register('imageUrl')} 
            placeholder="https://example.com/image.jpg" 
          />
          {errors.imageUrl && (
            <p className="text-sm text-red-500 mt-1">{errors.imageUrl.message}</p>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="featured" 
            {...register('featured')} 
            checked={watch('featured')} 
            onCheckedChange={(checked) => setValue('featured', !!checked)}
          />
          <Label htmlFor="featured" className="cursor-pointer">Feature this product on the homepage</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="inStock" 
            {...register('inStock')} 
            checked={watch('inStock')} 
            onCheckedChange={(checked) => setValue('inStock', !!checked)}
          />
          <Label htmlFor="inStock" className="cursor-pointer">Product is in stock</Label>
        </div>
      </div>
      
      <Button type="submit" disabled={productMutation.isPending}>
        {productMutation.isPending ? 'Saving...' : isEditing ? 'Update Product' : 'Create Product'}
      </Button>
    </form>
  );
} 