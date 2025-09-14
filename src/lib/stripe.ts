import { loadStripe } from '@stripe/stripe-js';
const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_dummy_123';
export const stripePromise = loadStripe(key);

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
  ARS: { name: 'Argentine Peso', symbol: 'ARS$', locale: 'es-AR', zeroDecimal: false },
} as const;

export const formatCurrency = (amount: number, currency: keyof typeof SUPPORTED_CURRENCIES = 'BRL') => {
  const c = SUPPORTED_CURRENCIES[currency];
  return new Intl.NumberFormat(c.locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: c.zeroDecimal ? 0 : 2,
    maximumFractionDigits: c.zeroDecimal ? 0 : 2,
  }).format(amount);
};

export const convertToStripeAmount = (amount: number, currency: keyof typeof SUPPORTED_CURRENCIES = 'BRL') => {
  const c = SUPPORTED_CURRENCIES[currency];
  return c.zeroDecimal ? Math.round(amount) : Math.round(amount * 100);
};

export const getUserCurrency = (): keyof typeof SUPPORTED_CURRENCIES => {
  if (typeof window === 'undefined') return 'BRL';
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    const map: Record<string, keyof typeof SUPPORTED_CURRENCIES> = {
      'America/Sao_Paulo': 'BRL', 'America/Fortaleza': 'BRL', 'America/Recife': 'BRL',
      'America/New_York': 'USD', 'America/Los_Angeles': 'USD', 'America/Chicago': 'USD',
      'Europe/London': 'GBP', 'Europe/Berlin': 'EUR', 'Europe/Paris': 'EUR', 'Europe/Madrid': 'EUR', 'Europe/Rome': 'EUR',
      'Europe/Zurich': 'CHF', 'Asia/Tokyo': 'JPY', 'Australia/Sydney': 'AUD',
      'America/Toronto': 'CAD', 'America/Mexico_City': 'MXN', 'America/Argentina/Buenos_Aires': 'ARS'
    };
    if (map[tz]) return map[tz];
    const loc = navigator.language || '';
    if (loc.startsWith('pt')) return 'BRL';
    if (loc.startsWith('en-GB')) return 'GBP';
    if (loc.startsWith('en')) return 'USD';
    if (/^(de < /dev/null | fr|es|it)/.test(loc)) return 'EUR';
    if (loc.startsWith('ja')) return 'JPY';
    if (loc.startsWith('en-AU')) return 'AUD';
    if (/(en-CA|fr-CA)/.test(loc)) return 'CAD';
    if (loc.startsWith('es-MX')) return 'MXN';
    if (loc.startsWith('es-AR')) return 'ARS';
    return 'BRL';
  } catch { return 'BRL'; }
};

export const getPaymentMethods = (_currency: keyof typeof SUPPORTED_CURRENCIES) => ['card']; // keep simple while debugging
