import React, { useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';

declare global {
  interface Window {
    paypal: any;
  }
}

interface PayPalButtonProps {
  amount: number;
  onSuccess: (paymentId: string) => void;
}

export default function PayPalButton({ amount, onSuccess }: PayPalButtonProps) {
  const paypalRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    // Check if PayPal script is already loaded
    if (window.paypal) {
      renderPayPalButton();
      return;
    }

    // Load the PayPal SDK script
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${import.meta.env.VITE_PAYPAL_CLIENT_ID || 'sb'}&currency=USD`;
    script.async = true;
    script.onload = () => renderPayPalButton();
    script.onerror = () => {
      setLoading(false);
      setError('Failed to load PayPal SDK. Please try again later.');
    };

    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [amount]);

  const renderPayPalButton = () => {
    if (paypalRef.current && window.paypal) {
      paypalRef.current.innerHTML = '';
      
      window.paypal.Buttons({
        createOrder: (data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: amount.toFixed(2),
                },
              },
            ],
          });
        },
        onApprove: async (data: any, actions: any) => {
          const order = await actions.order.capture();
          onSuccess(order.id);
        },
        onError: (err: any) => {
          setError('Payment failed. Please try again.');
          console.error('PayPal Error:', err);
        },
        style: {
          layout: 'vertical',
          color: 'gold',
          shape: 'rect',
          label: 'pay',
        },
      }).render(paypalRef.current);
      
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      {loading && (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="ml-2">Loading payment options...</span>
        </div>
      )}
      <div ref={paypalRef} />
    </div>
  );
}
