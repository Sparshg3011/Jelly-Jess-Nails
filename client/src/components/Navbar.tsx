import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { cn, scrollToSection } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  // Handle navigation with smooth scrolling for sections on the homepage
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    // Only handle hash navigation on the home page
    if (location === "/" || location.startsWith("/#")) {
      e.preventDefault();
      scrollToSection(sectionId);
    }
  };
  
  return (
    <nav className={cn(
      "fixed w-full z-50 bg-white bg-opacity-95 shadow-sm transition-all duration-300",
      isScrolled ? "py-2 shadow-md" : "py-3"
    )}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center cursor-pointer">
            <span className="font-script text-3xl text-primary">Jelly Jessy Nails</span>
          </div>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6">
          <Link href="/">
            <a className={cn(
              "text-neutral-900 hover:text-primary transition-colors duration-300 font-medium cursor-pointer",
              location === "/" && "text-primary"
            )}>Home</a>
          </Link>
          <Link href="/nail-art">
            <a className={cn(
              "text-neutral-900 hover:text-primary transition-colors duration-300 font-medium cursor-pointer",
              location === "/nail-art" && "text-primary"
            )}>Nail Art</a>
          </Link>
          <Link href="/portfolio">
            <a className={cn(
              "text-neutral-900 hover:text-primary transition-colors duration-300 font-medium cursor-pointer",
              location === "/portfolio" && "text-primary"
            )}>Portfolio</a>
          </Link>
          <Link href="/shop">
            <a className={cn(
              "text-neutral-900 hover:text-primary transition-colors duration-300 font-medium cursor-pointer",
              location === "/shop" && "text-primary"
            )}>Shop</a>
          </Link>
          <Link href="/#about">
            <a onClick={(e) => handleNavClick(e, 'about')} className="text-neutral-900 hover:text-primary transition-colors duration-300 font-medium cursor-pointer">About</a>
          </Link>
          <Link href="/#contact">
            <a onClick={(e) => handleNavClick(e, 'contact')} className="text-neutral-900 hover:text-primary transition-colors duration-300 font-medium cursor-pointer">Contact</a>
          </Link>
          {user?.isAdmin && (
            <Link href="/admin">
              <a className={cn(
                "text-neutral-900 hover:text-primary transition-colors duration-300 font-medium cursor-pointer",
                location === "/admin" && "text-primary"
              )}>Admin</a>
            </Link>
          )}
        </div>
        
        {/* Auth / Book buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <Button 
              variant="ghost" 
              onClick={handleLogout}
              className="text-neutral-900 hover:text-primary"
            >
              Logout
            </Button>
          ) : (
            <Link href="/auth">
              <a className={cn(
                "text-neutral-900 hover:text-primary transition-colors duration-300 font-medium px-4 py-2 rounded-md",
                location === "/auth" && "text-primary"
              )}>
                Login / Register
              </a>
            </Link>
          )}
          
          <Link href="/booking">
            <a className={cn(
              "bg-primary hover:bg-opacity-90 text-white px-6 py-2 rounded-full transition-all duration-300 font-medium cursor-pointer",
              location === "/booking" && "bg-opacity-90"
            )}>Book Now</a>
          </Link>
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-neutral-900 focus:outline-none"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>
      
      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white px-4 py-3 shadow-md absolute w-full">
          <div className="flex flex-col space-y-3">
            <Link href="/">
              <a onClick={() => setMobileMenuOpen(false)} className={cn(
                "text-neutral-900 hover:text-primary transition-colors duration-300 font-medium py-2 cursor-pointer",
                location === "/" && "text-primary"
              )}>Home</a>
            </Link>
            <Link href="/nail-art">
              <a onClick={() => setMobileMenuOpen(false)} className={cn(
                "text-neutral-900 hover:text-primary transition-colors duration-300 font-medium py-2 cursor-pointer",
                location === "/nail-art" && "text-primary"
              )}>Nail Art</a>
            </Link>
            <Link href="/portfolio">
              <a onClick={() => setMobileMenuOpen(false)} className={cn(
                "text-neutral-900 hover:text-primary transition-colors duration-300 font-medium py-2 cursor-pointer",
                location === "/portfolio" && "text-primary"
              )}>Portfolio</a>
            </Link>
            <Link href="/shop">
              <a onClick={() => setMobileMenuOpen(false)} className={cn(
                "text-neutral-900 hover:text-primary transition-colors duration-300 font-medium py-2 cursor-pointer",
                location === "/shop" && "text-primary"
              )}>Shop</a>
            </Link>
            <Link href="/#about">
              <a onClick={(e) => {
                handleNavClick(e, 'about');
                setMobileMenuOpen(false);
              }} className="text-neutral-900 hover:text-primary transition-colors duration-300 font-medium py-2 cursor-pointer">About</a>
            </Link>
            <Link href="/#contact">
              <a onClick={(e) => {
                handleNavClick(e, 'contact');
                setMobileMenuOpen(false);
              }} className="text-neutral-900 hover:text-primary transition-colors duration-300 font-medium py-2 cursor-pointer">Contact</a>
            </Link>
            {user?.isAdmin && (
              <Link href="/admin">
                <a onClick={() => setMobileMenuOpen(false)} className="text-neutral-900 hover:text-primary transition-colors duration-300 font-medium py-2 cursor-pointer">Admin</a>
              </Link>
            )}
            
            {user ? (
              <Button 
                variant="ghost" 
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="text-neutral-900 hover:text-primary justify-start p-2"
              >
                Logout
              </Button>
            ) : (
              <Link href="/auth">
                <a onClick={() => setMobileMenuOpen(false)} className="text-neutral-900 hover:text-primary transition-colors duration-300 font-medium py-2 cursor-pointer">Login / Register</a>
              </Link>
            )}
            
            <Link href="/booking">
              <a onClick={() => setMobileMenuOpen(false)} className="bg-primary hover:bg-opacity-90 text-white px-6 py-2 rounded-full transition-all duration-300 font-medium text-center my-2 cursor-pointer">Book Now</a>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
