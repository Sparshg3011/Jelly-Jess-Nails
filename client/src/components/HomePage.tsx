export function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section id="home" className="relative">
        <HeroSection />
      </section>
      
      {/* Services Section */}
      <section id="services" className="py-16 bg-muted/50">
        <ServicesSection />
      </section>
      
      {/* Gallery Section */}
      <section id="gallery" className="py-16">
        <GallerySection />
      </section>
      
      {/* Booking Section */}
      <section id="booking" className="py-16 bg-muted/50">
        <BookingSection />
      </section>
      
      {/* Contact Section */}
      <section id="contact" className="py-16">
        <ContactSection />
      </section>
      
      <Footer />
    </div>
  );
} 