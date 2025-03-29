import React from 'react';
import { Button } from '@/components/ui/button';
import { FaGoogle } from 'react-icons/fa'; // You'll need to install react-icons package

interface GoogleAuthButtonProps {
  className?: string;
}

export function GoogleAuthButton({ className }: GoogleAuthButtonProps) {
  const handleGoogleLogin = () => {
    // Redirect to the Google OAuth route
    window.location.href = '/api/auth/google';
  };

  return (
    <Button 
      type="button" 
      variant="outline" 
      className={`w-full flex items-center justify-center space-x-2 ${className}`}
      onClick={handleGoogleLogin}
    >
      <FaGoogle className="h-4 w-4" />
      <span>Continue with Google</span>
    </Button>
  );
} 