// src/lib/stripe-client.ts

// NOTE: This file is safe to import from both server and client.
// We DO NOT mark it 'use client'. We only touch Stripe.js in the browser.

type CurrencyCode =
  | 'BRL' | 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'JPY' | 'CHF' | 'MXN' | 'ARS';

export const SUPPORTED_CURRENCIES: Record<
  CurrencyCode,
  { name: string; symbol: string; locale: string; zeroDecimal: boolean }
> = {
  BRL: { name: 'Brazilian Real',     symbol: 'R$',  locale: 'pt-BR', zeroDecimal: false },
  USD: { name: 'US Dollar',          symbol: '$',   locale: 'en-US', zeroDecimal: false },
  EUR: { name: 'Euro',               symbol: '€',   locale: 'de-DE', zeroDecimal: false },
  GBP: { name: 'British Pound',      symbol: '£',   locale: 'en-GB', zeroDecimal: false },
  CAD: { name: 'Canadian Dollar',    symbol: 'C$',  locale: 'en-CA', zeroDecimal: false },
  AUD: { name: 'Australian Dollar',  symbol: 'A$',  locale: 'en-AU', zeroDecimal: false },
  JPY: { name: 'Japanese Yen',       symbol: '¥',   locale: 'ja-JP', zeroDecimal: true  },
  CHF: { name: 'Swiss Franc',        symbol: 'CHF', locale: 'de-CH', zeroDecimal: false },
  MXN: { name: 'Mexican Peso',       symbol: 'MX$', locale: 'es-MX', zeroDecimal: false },
  ARS: { name: 'Argentine Peso',     symbol: 'ARS$',locale: 'es-AR', zeroDecimal: false },
};

// ---------- Amount & formatting helpers ----------

export const formatCurrency = (amount: number, currency: CurrencyCode = 'BRL') => {
  const cfg = SUPPORTED_CURRENCIES[currency] ?? SUPPORTED_CURRENCIES.BRL;
  const safe = Number.isFinite(amount) ? amount : 0;
  return new Intl.NumberFormat(cfg.locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: cfg.zeroDecimal ? 0 : 2,
    maximumFractionDigits: cfg.zeroDecimal ? 0 : 2,
  }).format(safe);
};

export const convertToStripeAmount = (amount: number, currency: CurrencyCode = 'BRL') => {
  const cfg = SUPPORTED_CURRENCIES[currency] ?? SUPPORTED_CURRENCIES.BRL;
  const safe = Number.isFinite(amount) ? amount : 0;
  return cfg.zeroDecimal ? Math.round(safe) : Math.round(safe * 100);
};

// ---------- Currency detection (browser only) ----------

export const getUserCurrency = (): CurrencyCode => {
  if (typeof window === 'undefined') return 'BRL';

  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    const locale = navigator.language || 'pt-BR';

    const tzMap: Partial<Record<string, CurrencyCode>> = {
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
      'America/Argentina/Buenos_Aires': 'ARS',
    };

    if (tzMap[timezone]) return tzMap[timezone] as CurrencyCode;

    // Explicit parentheses to avoid precedence surprises
    if (locale.startsWith('pt-BR') || locale.startsWith('pt')) return 'BRL';
    if (locale.startsWith('en-US') || (locale.startsWith('en') && !locale.includes('GB'))) return 'USD';
    if (locale.startsWith('en-GB')) return 'GBP';
    if (/^(de|fr|es|it)/.test(locale)) return 'EUR';
    if (locale.startsWith('ja')) return 'JPY';
    if (locale.startsWith('en-AU')) return 'AUD';
    if (locale.startsWith('en-CA') || locale.startsWith('fr-CA')) return 'CAD';
    if (locale.startsWith('es-MX')) return 'MXN';
    if (locale.startsWith('es-AR')) return 'ARS';

    return 'BRL';
  } catch {
    return 'BRL';
  }
};

// ---------- Payment methods (kept simple for now) ----------

export const getPaymentMethods = (currency: CurrencyCode): string[] => {
  // Keep only card until dashboard enables local methods.
  return ['card'];
};

// ---------- Safe Stripe.js loader (never runs on server) ----------

const PUBLISHABLE = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';

let _stripePromise: Promise<import('@stripe/stripe-js').Stripe | null> | null = null;

/**
 * Load Stripe.js in the browser on demand.
 * Returns `null` on server or when no publishable key is configured.
 */
export async function getStripe() {
  if (typeof window === 'undefined') return null;
  if (!PUBLISHABLE || PUBLISHABLE.startsWith('pk_test_51234567890abcdef')) {
    // Key missing or placeholder – treat as disabled
    return null;
  }
  if (!_stripePromise) {
    const { loadStripe } = await import('@stripe/stripe-js');
    _stripePromise = loadStripe(PUBLISHABLE);
  }
  return _stripePromise;
}

