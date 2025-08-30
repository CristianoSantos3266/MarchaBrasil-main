export const SHOW_DONATION_STATS =
  (process.env.NEXT_PUBLIC_SHOW_DONATION_STATS ?? 'false').toLowerCase() === 'true';

// Momentum thresholds (can be tuned later)
export const MOMENTUM_MIN_PROGRESS = Number(process.env.NEXT_PUBLIC_MOMENTUM_MIN_PROGRESS ?? 0.30); // 30%
export const MOMENTUM_MIN_DONORS_7D = Number(process.env.NEXT_PUBLIC_MOMENTUM_MIN_DONORS_7D ?? 25);