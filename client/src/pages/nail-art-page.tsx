import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gem, MessageCircle, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';

export default function NailArtPage() {
  return (
    <div className="min-h-screen font-sans antialiased bg-neutral-50 text-neutral-900">
      <Navbar />
      <main>
        <section className="py-12 md:py-20 bg-gradient-to-b from-secondary/30 to-secondary/5">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Nail Art Services</h1>
              <p className="text-lg max-w-2xl mx-auto">Explore our range of beautiful nail art options tailored to your style and preferences.</p>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl font-bold mb-3">Our Nail Art Tiers</h2>
              <p className="text-neutral-600 max-w-3xl mx-auto">Choose from three different levels of nail art complexity to suit your style and budget.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {/* Level 1 */}
              <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-xl font-bold text-primary">Level 1</CardTitle>
                  <CardDescription>Minimal Design</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="relative h-48 mb-4 overflow-hidden rounded-md bg-secondary/10 flex items-center justify-center">
                    <Gem className="w-20 h-20 text-secondary/50" />
                  </div>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-start">
                      <CheckCircle2 className="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Plain French tip or minimal design</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Basic nail art on 2 fingers</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Simple patterns and colors</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href="/booking?service=nailart&level=1">Book Now</Link>
                  </Button>
                </CardFooter>
              </Card>

              {/* Level 2 */}
              <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-xl font-bold text-primary">Level 2</CardTitle>
                  <CardDescription>Moderate Design</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="relative h-48 mb-4 overflow-hidden rounded-md bg-secondary/10 flex items-center justify-center">
                    <Gem className="w-20 h-20 text-secondary/70" />
                  </div>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-start">
                      <CheckCircle2 className="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>4-6 fingers with nail art</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>More complicated designs</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>May include small charms or gems</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href="/booking?service=nailart&level=2">Book Now</Link>
                  </Button>
                </CardFooter>
              </Card>

              {/* Level 3 */}
              <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-xl font-bold text-primary">Level 3</CardTitle>
                  <CardDescription>Premium Design</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="relative h-48 mb-4 overflow-hidden rounded-md bg-secondary/10 flex items-center justify-center">
                    <Gem className="w-20 h-20 text-secondary" />
                  </div>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-start">
                      <CheckCircle2 className="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Full design on all fingers</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Detailed, complex designs</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Includes charms and 3D sculpting</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href="/booking?service=nailart&level=3">Book Now</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div className="bg-secondary/10 p-6 rounded-lg my-12">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <MessageCircle className="w-12 h-12 text-secondary flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold mb-2">Have an Inspiration Picture?</h3>
                  <p className="text-neutral-700 mb-4">Send me a DM on Instagram with your inspiration picture, and I'll provide a quote on how much it will cost and which tier it falls under.</p>
                  <Button variant="secondary" asChild>
                    <a href="https://instagram.com/yourusername" target="_blank" rel="noopener noreferrer">
                      Message on Instagram
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-neutral-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl font-bold mb-3">Our Services & Pricing</h2>
              <p className="text-neutral-600 max-w-3xl mx-auto">Explore our range of services with beginner and standard pricing options.</p>
            </div>

            <Tabs defaultValue="gelpolish" className="w-full max-w-4xl mx-auto">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="gelpolish">Gel Polish</TabsTrigger>
                <TabsTrigger value="builder">Builder/Hard Gel</TabsTrigger>
                <TabsTrigger value="gelx">Gel X</TabsTrigger>
              </TabsList>
              
              {/* Gel Polish Tab */}
              <TabsContent value="gelpolish" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Gel Polish Services</CardTitle>
                    <CardDescription>Durable, high-shine gel polish that lasts 2-3 weeks</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="bg-white p-4 rounded-md border">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">Plain Color</h4>
                          <div className="flex gap-2">
                            <Badge variant="outline">Beginner: £20</Badge>
                            <Badge variant="default">Normal: £25</Badge>
                          </div>
                        </div>
                        <p className="text-sm text-neutral-600">Single color application without design</p>
                      </div>
                      
                      <div className="bg-white p-4 rounded-md border">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">Nail Art - Level 1</h4>
                          <div className="flex gap-2">
                            <Badge variant="outline">Beginner: £23</Badge>
                            <Badge variant="default">Normal: £28</Badge>
                          </div>
                        </div>
                        <p className="text-sm text-neutral-600">Basic nail art on 2 fingers or French tip</p>
                      </div>
                      
                      <div className="bg-white p-4 rounded-md border">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">Nail Art - Level 2</h4>
                          <div className="flex gap-2">
                            <Badge variant="outline">Beginner: £28</Badge>
                            <Badge variant="default">Normal: £32</Badge>
                          </div>
                        </div>
                        <p className="text-sm text-neutral-600">Nail art on 4-6 fingers with optional small charms</p>
                      </div>
                      
                      <div className="bg-white p-4 rounded-md border">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">Nail Art - Level 3</h4>
                          <div className="flex gap-2">
                            <Badge variant="outline">Beginner: £30</Badge>
                            <Badge variant="default">Normal: £38</Badge>
                          </div>
                        </div>
                        <p className="text-sm text-neutral-600">Full design on all fingers with detailed work</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Builder Gel Tab */}
              <TabsContent value="builder" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Builder/Hard Gel Services</CardTitle>
                    <CardDescription>Strengthening gel for natural nails with added durability</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="bg-white p-4 rounded-md border">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">Plain Color</h4>
                          <div className="flex gap-2">
                            <Badge variant="outline">Beginner: £25</Badge>
                            <Badge variant="default">Normal: £30</Badge>
                          </div>
                        </div>
                        <p className="text-sm text-neutral-600">Builder gel with single color application</p>
                      </div>
                      
                      <div className="bg-white p-4 rounded-md border">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">Infill - Plain Color</h4>
                          <div className="flex gap-2">
                            <Badge variant="outline">Beginner: £20</Badge>
                            <Badge variant="default">Normal: £25</Badge>
                          </div>
                        </div>
                        <p className="text-sm text-neutral-600">Maintenance for existing builder gel application</p>
                      </div>
                      
                      <div className="bg-white p-4 rounded-md border">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">Nail Art - Level 1</h4>
                          <div className="flex gap-2">
                            <Badge variant="outline">Beginner: £30</Badge>
                            <Badge variant="default">Normal: £35</Badge>
                          </div>
                        </div>
                        <p className="text-sm text-neutral-600">Builder gel with basic nail art on 2 fingers</p>
                      </div>
                      
                      <div className="bg-white p-4 rounded-md border">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">Infill - Level 1</h4>
                          <div className="flex gap-2">
                            <Badge variant="outline">Beginner: £25</Badge>
                            <Badge variant="default">Normal: £30</Badge>
                          </div>
                        </div>
                        <p className="text-sm text-neutral-600">Infill with basic nail art on 2 fingers</p>
                      </div>
                      
                      <div className="bg-white p-4 rounded-md border">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">Nail Art - Level 2</h4>
                          <div className="flex gap-2">
                            <Badge variant="outline">Beginner: £33</Badge>
                            <Badge variant="default">Normal: £38</Badge>
                          </div>
                        </div>
                        <p className="text-sm text-neutral-600">Builder gel with nail art on 4-6 fingers</p>
                      </div>
                      
                      <div className="bg-white p-4 rounded-md border">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">Infill - Level 2</h4>
                          <div className="flex gap-2">
                            <Badge variant="outline">Beginner: £30</Badge>
                            <Badge variant="default">Normal: £35</Badge>
                          </div>
                        </div>
                        <p className="text-sm text-neutral-600">Infill with nail art on 4-6 fingers</p>
                      </div>
                      
                      <div className="bg-white p-4 rounded-md border">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">Nail Art - Level 3</h4>
                          <div className="flex gap-2">
                            <Badge variant="outline">Starts at £38</Badge>
                            <Badge variant="default">Starts at £42</Badge>
                          </div>
                        </div>
                        <p className="text-sm text-neutral-600">Builder gel with full design on all fingers</p>
                      </div>
                      
                      <div className="bg-white p-4 rounded-md border">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">Infill - Level 3</h4>
                          <div className="flex gap-2">
                            <Badge variant="outline">Starts at £33</Badge>
                            <Badge variant="default">Starts at £38</Badge>
                          </div>
                        </div>
                        <p className="text-sm text-neutral-600">Infill with full design on all fingers</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Gel X Tab */}
              <TabsContent value="gelx" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Gel X Services</CardTitle>
                    <CardDescription>Full-coverage soft gel extensions for beautiful, natural-looking nails</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="bg-white p-4 rounded-md border">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">Plain Color</h4>
                          <div className="flex gap-2">
                            <Badge variant="outline">Beginner: £35</Badge>
                            <Badge variant="default">Normal: £40</Badge>
                          </div>
                        </div>
                        <p className="text-sm text-neutral-600">Gel X extensions with single color application</p>
                      </div>
                      
                      <div className="bg-white p-4 rounded-md border">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">Infill - Plain Color</h4>
                          <div className="flex gap-2">
                            <Badge variant="outline">Beginner: £30</Badge>
                            <Badge variant="default">Normal: £35</Badge>
                          </div>
                        </div>
                        <p className="text-sm text-neutral-600">Maintenance for existing Gel X extensions</p>
                      </div>
                      
                      <div className="bg-white p-4 rounded-md border">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">Nail Art - Level 1</h4>
                          <div className="flex gap-2">
                            <Badge variant="outline">Beginner: £40</Badge>
                            <Badge variant="default">Normal: £45</Badge>
                          </div>
                        </div>
                        <p className="text-sm text-neutral-600">Gel X with basic nail art on 2 fingers</p>
                      </div>
                      
                      <div className="bg-white p-4 rounded-md border">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">Infill - Level 1</h4>
                          <div className="flex gap-2">
                            <Badge variant="outline">Beginner: £35</Badge>
                            <Badge variant="default">Normal: £40</Badge>
                          </div>
                        </div>
                        <p className="text-sm text-neutral-600">Infill with basic nail art on 2 fingers</p>
                      </div>
                      
                      <div className="bg-white p-4 rounded-md border">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">Nail Art - Level 2</h4>
                          <div className="flex gap-2">
                            <Badge variant="outline">Beginner: £43</Badge>
                            <Badge variant="default">Normal: £48</Badge>
                          </div>
                        </div>
                        <p className="text-sm text-neutral-600">Gel X with nail art on 4-6 fingers</p>
                      </div>
                      
                      <div className="bg-white p-4 rounded-md border">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">Infill - Level 2</h4>
                          <div className="flex gap-2">
                            <Badge variant="outline">Beginner: £40</Badge>
                            <Badge variant="default">Normal: £45</Badge>
                          </div>
                        </div>
                        <p className="text-sm text-neutral-600">Infill with nail art on 4-6 fingers</p>
                      </div>
                      
                      <div className="bg-white p-4 rounded-md border">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">Nail Art - Level 3</h4>
                          <div className="flex gap-2">
                            <Badge variant="outline">Starts at £48</Badge>
                            <Badge variant="default">Starts at £52</Badge>
                          </div>
                        </div>
                        <p className="text-sm text-neutral-600">Gel X with full design on all fingers</p>
                      </div>
                      
                      <div className="bg-white p-4 rounded-md border">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">Infill - Level 3</h4>
                          <div className="flex gap-2">
                            <Badge variant="outline">Starts at £43</Badge>
                            <Badge variant="default">Starts at £48</Badge>
                          </div>
                        </div>
                        <p className="text-sm text-neutral-600">Infill with full design on all fingers</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-start gap-4">
                  <Clock className="w-10 h-10 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold mb-2">Appointment Duration</h3>
                    <p className="text-neutral-700 mb-2">As a nail technician focused on quality over speed, please be aware of my typical appointment durations:</p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <CheckCircle2 className="mr-2 h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>Simple designs: 1.5-2 hours</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="mr-2 h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>Gel X and complicated designs: 3-4 hours</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-start gap-4">
                  <AlertCircle className="w-10 h-10 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold mb-2">Additional Services</h3>
                    <ul className="space-y-2">
                      <li className="flex justify-between">
                        <span>Soak Off</span>
                        <span className="font-medium">£10</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Repairing a Natural Nail</span>
                        <span className="font-medium">£3 each</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Model Set - Builder/Hard Gel</span>
                        <span className="font-medium">£25</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Model Set - Gel X</span>
                        <span className="font-medium">£30</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-12 bg-secondary/10 p-6 rounded-lg border border-secondary/20">
              <h3 className="text-xl font-bold mb-4">Model Sets - Limited Time Offer</h3>
              <p className="text-neutral-700 mb-4"><strong>This service is only available while I'm building my client base.</strong> Model sets consist of me giving you design ideas I want to try and practice. You'll choose from my options so I can practice and post on social media, offered at a discounted price.</p>
              <div className="flex items-center">
                <Checkbox id="model-consent" />
                <label htmlFor="model-consent" className="ml-2 text-sm font-medium">
                  I consent to having photos of my nails posted on social media
                </label>
              </div>
              <p className="mt-4 text-sm text-neutral-500"><strong>Note:</strong> This option will only be available for a few months.</p>
            </div>
          </div>
        </section>
        
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto bg-neutral-50 p-6 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold mb-4">Booking Information</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-medium">Booking Fee</h4>
                    <p className="text-sm text-neutral-600">A £15 booking fee is required to secure your appointment. This fee will be deducted from the final price of your service.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-medium">Cancellation Policy</h4>
                    <p className="text-sm text-neutral-600">If you cancel with less than 48 hours' notice, your booking fee will not be refunded.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-medium">Late Arrival</h4>
                    <p className="text-sm text-neutral-600">If you arrive more than 20 minutes late to your appointment, it may be cancelled and your booking fee will not be refunded.</p>
                  </div>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <div className="text-center">
                <Button asChild size="lg" className="mt-2">
                  <Link href="/booking">Book Your Appointment</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
} 