import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { Loader2, ShoppingBag, LayoutGrid } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Product } from '@shared/schema';

export default function ShopPage() {
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products']
  });

  return (
    <div className="min-h-screen font-sans antialiased bg-neutral-50 text-neutral-900">
      <Navbar />
      <main>
        <section className="py-12 md:py-20 bg-gradient-to-b from-secondary/30 to-secondary/5">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Shop Press-On Nails</h1>
              <p className="text-lg max-w-2xl mx-auto">Handcrafted, custom press-on nails for an instant manicure that looks professionally done.</p>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="all" className="w-full max-w-4xl mx-auto mb-12">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All Products</TabsTrigger>
                <TabsTrigger value="press-on-nails">Press-On Nails</TabsTrigger>
                <TabsTrigger value="nail-accessories">Accessories</TabsTrigger>
                <TabsTrigger value="gift-cards">Gift Cards</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-6">
                {renderProductGrid(products, isLoading)}
              </TabsContent>
              
              <TabsContent value="press-on-nails" className="mt-6">
                {renderProductGrid(products?.filter(p => p.category === 'press-on-nails'), isLoading)}
              </TabsContent>
              
              <TabsContent value="nail-accessories" className="mt-6">
                {renderProductGrid(products?.filter(p => p.category === 'nail-accessories'), isLoading)}
              </TabsContent>
              
              <TabsContent value="gift-cards" className="mt-6">
                {renderProductGrid(products?.filter(p => p.category === 'gift-cards'), isLoading)}
              </TabsContent>
            </Tabs>
          </div>
        </section>
        
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto bg-neutral-50 p-6 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold mb-4">How Press-On Nails Work</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div className="text-center">
                  <div className="bg-secondary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-primary">1</span>
                  </div>
                  <h4 className="font-medium mb-2">Choose Your Design</h4>
                  <p className="text-sm text-neutral-600">Browse through our collection or request a custom design.</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-secondary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-primary">2</span>
                  </div>
                  <h4 className="font-medium mb-2">Prepare Your Nails</h4>
                  <p className="text-sm text-neutral-600">Clean, buff, and prime your natural nails for application.</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-secondary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-primary">3</span>
                  </div>
                  <h4 className="font-medium mb-2">Apply & Enjoy</h4>
                  <p className="text-sm text-neutral-600">Apply with included adhesive and enjoy your beautiful nails!</p>
                </div>
              </div>
              
              <div className="bg-secondary/10 p-4 rounded">
                <p className="text-center text-sm">Each set includes 10 press-on nails, nail glue, a file, and application instructions.</p>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-12 bg-neutral-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">Custom Press-On Orders</h3>
                <p className="text-neutral-600">Looking for something unique? Contact me for custom press-on nail designs.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Custom Size Fit</CardTitle>
                    <CardDescription>Perfect fit for your nail beds</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-neutral-600">
                      I can create press-on nails customized to your exact nail measurements for a perfect, comfortable fit.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button asChild variant="outline" className="w-full">
                      <a href="https://instagram.com/jellyjess_nails" target="_blank" rel="noopener noreferrer">
                        Message for Details
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Custom Design</CardTitle>
                    <CardDescription>Your vision brought to life</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-neutral-600">
                      Have a specific design in mind? Send me your inspiration and I'll create a custom set just for you.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button asChild variant="outline" className="w-full">
                      <a href="https://instagram.com/jellyjess_nails" target="_blank" rel="noopener noreferrer">
                        Request Custom Design
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function renderProductGrid(products: Product[] | undefined, isLoading: boolean) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="mx-auto w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
          <ShoppingBag className="h-12 w-12 text-neutral-400" />
        </div>
        <h3 className="text-xl font-bold mb-2">Coming Soon!</h3>
        <p className="text-neutral-500 max-w-md mx-auto mb-8">
          No products available yet. Check back soon for beautiful press-on nail sets or follow me on Instagram for updates.
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild variant="secondary">
            <a href="https://instagram.com/jellyjess_nails" target="_blank" rel="noopener noreferrer">
              Follow on Instagram
            </a>
          </Button>
          <Button asChild variant="outline">
            <a href="/nail-art">View Nail Services</a>
          </Button>
        </div>
        
        {/* Placeholder character */}
        <div className="mt-12 max-w-xs mx-auto">
          <div className="relative aspect-square bg-secondary/20 rounded-lg flex items-center justify-center overflow-hidden">
            <LayoutGrid className="w-24 h-24 text-secondary" />
            <div className="absolute bottom-0 inset-x-0 bg-white/80 p-3 text-center">
              <p className="text-sm font-medium">A little character will be here soon!</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="relative aspect-square">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {!product.inStock && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="bg-white px-3 py-1 text-sm font-medium rounded-md">Sold Out</span>
              </div>
            )}
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{product.name}</CardTitle>
            <CardDescription>{product.description}</CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-between items-center pt-0">
            <span className="font-bold">£{Number(product.price).toFixed(2)}</span>
            <Button disabled={!product.inStock} size="sm">
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
} 