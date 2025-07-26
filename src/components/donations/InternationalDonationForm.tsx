'use client';

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { formatCurrency, getUserCurrency, SUPPORTED_CURRENCIES } from '@/lib/stripe';
import { GlobeAltIcon, HeartIcon, CreditCardIcon } from '@heroicons/react/24/outline';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface InternationalDonationFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function InternationalDonationForm({ onSuccess, onError }: InternationalDonationFormProps) {
  const [currency, setCurrency] = useState('BRL');
  const [amount, setAmount] = useState(25);
  const [customAmount, setCustomAmount] = useState('');
  const [isMonthly, setIsMonthly] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  // Auto-detect user's currency on component mount
  useEffect(() => {
    const detectedCurrency = getUserCurrency();
    setCurrency(detectedCurrency);
    
    // Set default amounts based on currency
    const defaultAmounts = {
      'BRL': 25,
      'USD': 5,
      'EUR': 5,
      'GBP': 5,
      'CAD': 7,
      'AUD': 8,
      'JPY': 500,
      'CHF': 5,
      'MXN': 100,
      'ARS': 1000
    };
    
    setAmount(defaultAmounts[detectedCurrency as keyof typeof defaultAmounts] || 25);
  }, []);

  // Donation tiers based on currency
  const getDonationTiers = (curr: string) => {
    const tiers: Record<string, Array<{value: number, label: string, description: string}>> = {
      'BRL': [
        { value: 10, label: 'Apoiador', description: 'Ajuda básica mensal' },
        { value: 25, label: 'Patriota', description: 'Apoio significativo' },
        { value: 50, label: 'Defensor', description: 'Contribuição importante' },
        { value: 100, label: 'Guardião', description: 'Apoio essencial' }
      ],
      'USD': [
        { value: 5, label: 'Supporter', description: 'Basic monthly help' },
        { value: 15, label: 'Patriot', description: 'Meaningful support' },
        { value: 30, label: 'Defender', description: 'Important contribution' },
        { value: 50, label: 'Guardian', description: 'Essential support' }
      ],
      'EUR': [
        { value: 5, label: 'Supporter', description: 'Basic monthly help' },
        { value: 15, label: 'Patriot', description: 'Meaningful support' },
        { value: 30, label: 'Defender', description: 'Important contribution' },
        { value: 50, label: 'Guardian', description: 'Essential support' }
      ]
    };
    
    return tiers[curr] || tiers['USD'];
  };

  const handleDonation = async () => {
    setIsLoading(true);
    
    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to load');

      const finalAmount = selectedTier === 'custom' ? parseFloat(customAmount) : amount;
      
      if (!finalAmount || finalAmount <= 0) {
        throw new Error('Please enter a valid amount');
      }

      // Get user's country for better payment method selection
      const country = await getUserCountry();
      
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: finalAmount,
          currency: currency,
          isMonthly,
          donationTier: selectedTier,
          country
        }),
      });

      const session = await response.json();
      
      if (!response.ok) {
        throw new Error(session.error || 'Failed to create checkout session');
      }

      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      onSuccess?.();
    } catch (error) {
      console.error('Donation error:', error);
      onError?.(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Simple country detection (in production, you might want to use a proper GeoIP service)
  const getUserCountry = async (): Promise<string> => {
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const countryMap: Record<string, string> = {
        'America/Sao_Paulo': 'BR',
        'America/New_York': 'US',
        'Europe/London': 'GB',
        'Europe/Berlin': 'DE',
        'Europe/Paris': 'FR',
        'Asia/Tokyo': 'JP',
        'Australia/Sydney': 'AU',
        'America/Toronto': 'CA',
        'America/Mexico_City': 'MX',
        'America/Argentina/Buenos_Aires': 'AR'
      };
      
      return countryMap[timezone] || 'US';
    } catch {
      return 'US';
    }
  };

  const currencyInfo = SUPPORTED_CURRENCIES[currency as keyof typeof SUPPORTED_CURRENCIES];
  const tiers = getDonationTiers(currency);

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <GlobeAltIcon className="h-8 w-8 text-blue-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Support Global Democracy</h2>
        <p className="text-gray-600">Help strengthen democratic movements worldwide</p>
      </div>

      {/* Currency Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Your Currency
        </label>
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {Object.entries(SUPPORTED_CURRENCIES).map(([code, info]) => (
            <option key={code} value={code}>
              {info.symbol} {info.name} ({code})
            </option>
          ))}
        </select>
      </div>

      {/* Donation Frequency */}
      <div className="mb-6">
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setIsMonthly(false)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              !isMonthly
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            One-time
          </button>
          <button
            onClick={() => setIsMonthly(true)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              isMonthly
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* Donation Tiers */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Choose Amount
        </label>
        <div className="grid grid-cols-2 gap-3 mb-4">
          {tiers.map((tier) => (
            <button
              key={tier.value}
              onClick={() => {
                setAmount(tier.value);
                setSelectedTier(tier.label.toLowerCase());
              }}
              className={`p-4 rounded-lg border-2 text-left transition-colors ${
                amount === tier.value && selectedTier !== 'custom'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-bold text-lg">{formatCurrency(tier.value, currency)}</div>
              <div className="text-sm text-gray-600">{tier.label}</div>
              <div className="text-xs text-gray-500">{tier.description}</div>
            </button>
          ))}
        </div>

        {/* Custom Amount */}
        <div className="mt-4">
          <button
            onClick={() => setSelectedTier('custom')}
            className={`w-full p-4 rounded-lg border-2 text-left transition-colors ${
              selectedTier === 'custom'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-lg">Custom Amount</div>
                <div className="text-sm text-gray-600">Enter your own amount</div>
              </div>
              {selectedTier === 'custom' && (
                <input
                  type="number"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-24 px-2 py-1 border border-gray-300 rounded text-right"
                  min="1"
                  step="0.01"
                />
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Payment Summary */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">
            {isMonthly ? 'Monthly' : 'One-time'} donation:
          </span>
          <span className="text-xl font-bold text-gray-900">
            {formatCurrency(
              selectedTier === 'custom' ? parseFloat(customAmount) || 0 : amount,
              currency
            )}
          </span>
        </div>
        {isMonthly && (
          <p className="text-sm text-gray-500 mt-1">
            Billed monthly • Cancel anytime
          </p>
        )}
      </div>

      {/* Donate Button */}
      <button
        onClick={handleDonation}
        disabled={isLoading || (selectedTier === 'custom' && !customAmount)}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-lg font-bold text-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            Processing...
          </>
        ) : (
          <>
            <HeartIcon className="h-5 w-5" />
            Donate {formatCurrency(
              selectedTier === 'custom' ? parseFloat(customAmount) || 0 : amount,
              currency
            )}
            {isMonthly && '/month'}
          </>
        )}
      </button>

      {/* Security Notice */}
      <div className="mt-4 text-center text-sm text-gray-500">
        <div className="flex items-center justify-center gap-1 mb-1">
          <CreditCardIcon className="h-4 w-4" />
          <span>Secure payment powered by Stripe</span>
        </div>
        <p>Your payment information is encrypted and secure</p>
      </div>
    </div>
  );
}