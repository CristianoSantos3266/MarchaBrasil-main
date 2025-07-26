import { loadStripe } from '@stripe/stripe-js';

// This is a test publishable key - replace with your actual publishable key
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_51234567890abcdef';

export const stripePromise = loadStripe(stripePublishableKey);

// International currency configuration
export const SUPPORTED_CURRENCIES = {
  BRL: { name: 'Brazilian Real', symbol: 'R$', locale: 'pt-BR', zeroDecimal: false },
  USD: { name: 'US Dollar', symbol: '$', locale: 'en-US', zeroDecimal: false },
  EUR: { name: 'Euro', symbol: '€', locale: 'de-DE', zeroDecimal: false },
  GBP: { name: 'British Pound', symbol: '£', locale: 'en-GB', zeroDecimal: false },
  CAD: { name: 'Canadian Dollar', symbol: 'C$', locale: 'en-CA', zeroDecimal: false },
  AUD: { name: 'Australian Dollar', symbol: 'A$', locale: 'en-AU', zeroDecimal: false },
  JPY: { name: 'Japanese Yen', symbol: '¥', locale: 'ja-JP', zeroDecimal: true },
  CHF: { name: 'Swiss Franc', symbol: 'CHF', locale: 'de-CH', zeroDecimal: false },
  MXN: { name: 'Mexican Peso', symbol: 'MX$', locale: 'es-MX', zeroDecimal: false },
  ARS: { name: 'Argentine Peso', symbol: 'ARS$', locale: 'es-AR', zeroDecimal: false }
};

export const formatCurrency = (amount: number, currency: string = 'BRL') => {
  const currencyConfig = SUPPORTED_CURRENCIES[currency as keyof typeof SUPPORTED_CURRENCIES];
  const locale = currencyConfig?.locale || 'pt-BR';
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: currencyConfig?.zeroDecimal ? 0 : 2,
    maximumFractionDigits: currencyConfig?.zeroDecimal ? 0 : 2,
  }).format(amount);
};

export const convertToStripeAmount = (amount: number, currency: string = 'BRL') => {
  const currencyConfig = SUPPORTED_CURRENCIES[currency as keyof typeof SUPPORTED_CURRENCIES];
  
  // Zero-decimal currencies (like JPY) don't use cents
  if (currencyConfig?.zeroDecimal) {
    return Math.round(amount);
  }
  
  // Most currencies use 2 decimal places (cents)
  return Math.round(amount * 100);
};

// Get user's likely currency based on their location
export const getUserCurrency = (): string => {
  if (typeof window === 'undefined') return 'BRL';
  
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const locale = navigator.language;
    
    // Map common locales/timezones to currencies
    const currencyMap: Record<string, string> = {
      'America/Sao_Paulo': 'BRL',
      'America/Fortaleza': 'BRL',
      'America/Recife': 'BRL',
      'America/New_York': 'USD',
      'America/Los_Angeles': 'USD',
      'America/Chicago': 'USD',
      'Europe/London': 'GBP',
      'Europe/Berlin': 'EUR',
      'Europe/Paris': 'EUR',
      'Europe/Madrid': 'EUR',
      'Europe/Rome': 'EUR',
      'Europe/Zurich': 'CHF',
      'Asia/Tokyo': 'JPY',
      'Australia/Sydney': 'AUD',
      'America/Toronto': 'CAD',
      'America/Mexico_City': 'MXN',
      'America/Argentina/Buenos_Aires': 'ARS'
    };
    
    // First try timezone mapping
    if (currencyMap[timezone]) {
      return currencyMap[timezone];
    }
    
    // Fallback to locale-based detection
    if (locale.startsWith('pt-BR') || locale.startsWith('pt')) return 'BRL';
    if (locale.startsWith('en-US') || locale.startsWith('en') && !locale.includes('GB')) return 'USD';
    if (locale.startsWith('en-GB')) return 'GBP';
    if (locale.startsWith('de') || locale.startsWith('fr') || locale.startsWith('es') || locale.startsWith('it')) return 'EUR';
    if (locale.startsWith('ja')) return 'JPY';
    if (locale.startsWith('en-AU')) return 'AUD';
    if (locale.startsWith('en-CA') || locale.startsWith('fr-CA')) return 'CAD';
    if (locale.startsWith('es-MX')) return 'MXN';
    if (locale.startsWith('es-AR')) return 'ARS';
    
    return 'BRL'; // Default to BRL
  } catch (error) {
    console.warn('Could not detect user currency:', error);
    return 'BRL';
  }
};

// Get payment methods available for each country/currency
export const getPaymentMethods = (currency: string): string[] => {
  const basePaymentMethods = ['card'];
  
  // For now, only use card payments until other methods are properly configured
  // TODO: Enable additional payment methods once Stripe account is fully configured
  switch (currency) {
    case 'BRL':
      return basePaymentMethods; // Removed boleto until activated in Stripe dashboard
    case 'EUR':
      return basePaymentMethods; // Simplified for testing
    case 'GBP':
      return basePaymentMethods;
    case 'USD':
      return basePaymentMethods;
    case 'MXN':
      return basePaymentMethods;
    case 'JPY':
      return basePaymentMethods;
    default:
      return basePaymentMethods;
  }
};