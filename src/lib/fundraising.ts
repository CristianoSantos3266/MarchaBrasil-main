export type FundraisingStats = {
  goalCents: number;       // e.g., 1000000 for R$10,000
  raisedCents: number;     // e.g., 250000 for R$2,500
  donorsLast7d: number;    // recent donors
  donorsTotal?: number;
  updatedAt?: string;
};

export function pct(stats: FundraisingStats) {
  if (!stats || !stats.goalCents) return 0;
  return Math.max(0, Math.min(1, stats.raisedCents / stats.goalCents));
}

export function shouldShowProgress(stats: FundraisingStats, opts?: {
  minProgress?: number;
  minDonors7d?: number;
}) {
  const progress = pct(stats);
  const minProgress = opts?.minProgress ?? 0.30;
  const minDonors7d = opts?.minDonors7d ?? 25;
  return progress >= minProgress || (stats?.donorsLast7d ?? 0) >= minDonors7d;
}

export function formatBRL(cents: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
    .format((cents || 0) / 100);
}