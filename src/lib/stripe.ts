import { loadStripe } from '@stripe/stripe-js';

// This is a test publishable key - replace with your actual publishable key
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_51234567890abcdef';

export const stripePromise = loadStripe(stripePublishableKey);

export const formatCurrency = (amount: number, currency: string = 'BRL') => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

export const convertToStripeAmount = (amount: number, currency: string = 'BRL') => {
  // Stripe expects amounts in the smallest currency unit (cents for BRL)
  return Math.round(amount * 100);
};