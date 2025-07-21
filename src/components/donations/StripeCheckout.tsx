'use client';

import { useState } from 'react';
import { CreditCardIcon } from '@heroicons/react/24/outline';
import { DonationTier } from '@/types/donations';

interface StripeCheckoutProps {
  tier?: DonationTier;
  amount?: number;
  isMonthly: boolean;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function StripeCheckout({ 
  tier, 
  amount, 
  isMonthly, 
  onSuccess, 
  onError 
}: StripeCheckoutProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    setIsLoading(true);
    
    try {
      const donationAmount = amount || tier?.amount;
      
      if (!donationAmount || donationAmount <= 0) {
        throw new Error('Valor de doação inválido');
      }

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: donationAmount,
          currency: 'brl',
          isMonthly,
          donationTier: tier?.name || 'Valor Personalizado',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar sessão de pagamento');
      }

      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
        onSuccess?.();
      } else {
        throw new Error('URL de checkout não recebida');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      onError?.(errorMessage);
      alert(`Erro no pagamento: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const donationAmount = amount || tier?.amount || 0;

  return (
    <button
      onClick={handleCheckout}
      disabled={isLoading || donationAmount <= 0}
      className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2 mx-auto"
    >
      <CreditCardIcon className="h-5 w-5" />
      {isLoading ? (
        'Processando...'
      ) : (
        `Pagar R$${donationAmount.toFixed(2)} via Stripe`
      )}
    </button>
  );
}