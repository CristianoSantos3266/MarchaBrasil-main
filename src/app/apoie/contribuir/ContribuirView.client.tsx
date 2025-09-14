'use client';

import React, { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import {
  stripePromise,
  SUPPORTED_CURRENCIES,
  getUserCurrency,
  formatCurrency,
  convertToStripeAmount,
} from '@/lib/stripe';

const Navigation = dynamic(() => import('@/components/ui/Navigation'), { ssr: false });

type CurrencyKey = keyof typeof SUPPORTED_CURRENCIES;

const QUICK_AMOUNTS: Record<CurrencyKey, number[]> = {
  BRL: [20, 50, 100, 200],
  USD: [5, 10, 25, 50],
  EUR: [5, 10, 25, 50],
  GBP: [5, 10, 25, 50],
  CAD: [5, 10, 25, 50],
  AUD: [5, 10, 25, 50],
  JPY: [500, 1000, 2500, 5000],
  CHF: [5, 10, 25, 50],
  MXN: [100, 200, 500, 1000],
  ARS: [1000, 2000, 5000, 10000],
};

export default function ContribuirView() {
  // infer currency from browser, fallback to BRL
  const [currency, setCurrency] = useState<CurrencyKey>('BRL');
  const [amount, setAmount] = useState<number>(QUICK_AMOUNTS.BRL[0]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  // if NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is dummy, we keep UI but don't try real checkout
  const stripeDisabled =
    (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '').includes('dummy') ||
    (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '') === '';

  useEffect(() => {
    const detected = getUserCurrency();
    setCurrency(detected);
    setAmount(QUICK_AMOUNTS[detected][0]);
  }, []);

  const localeSymbol = SUPPORTED_CURRENCIES[currency].symbol;

  const quicks = useMemo(() => QUICK_AMOUNTS[currency], [currency]);

  const onQuick = (v: number) => {
    setAmount(v);
    setMsg(null);
  };

  const onCustom = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number((e.target.value || '').replace(',', '.'));
    if (Number.isFinite(v)) setAmount(Math.max(0, v));
    setMsg(null);
  };

  const onChangeCurrency = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cur = e.target.value as CurrencyKey;
    setCurrency(cur);
    setAmount(QUICK_AMOUNTS[cur][0]);
    setMsg(null);
  };

  const handlePay = async () => {
    setMsg(null);
    if (amount <= 0) {
      setMsg('Escolha um valor acima de zero.');
      return;
    }
    setBusy(true);
    try {
      // If Stripe is disabled locally, simulate a happy path and stop.
      if (stripeDisabled) {
        setMsg('Pagamento desativado no ambiente local. Interface ok ✅');
        return;
      }

      const stripe = await stripePromise;
      if (!stripe) {
        setMsg('Não foi possível inicializar o Stripe.');
        return;
      }

      const cents = convertToStripeAmount(amount, currency);
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ amount: cents, currency }),
      });

      if (!res.ok) {
        const j = await res.json().catch(() => null);
        setMsg(j?.error || 'Erro ao criar sessão de pagamento.');
        return;
      }

      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url; // redirect to Stripe Checkout
      } else {
        setMsg('Sessão criada mas sem URL de redirecionamento.');
      }
    } catch (e: any) {
      setMsg(e?.message || 'Falha inesperada ao iniciar pagamento.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-green-50">
      <Navigation />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-6">
          <Link href="/apoie" className="inline-flex items-center text-gray-600 hover:text-gray-800">
            ← Voltar
          </Link>
          <h1 className="text-2xl sm:text-3xl font-semibold mt-3 text-gray-900">
            Contribuir para Marcha Brasil
          </h1>
          <p className="text-gray-600 mt-1">
            Escolha sua forma de apoio e ajude a manter nossa plataforma livre.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/90 backdrop-blur shadow rounded-xl p-6 sm:p-8">
          {/* Currency + quick amounts */}
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Moeda</label>
              <select
                value={currency}
                onChange={onChangeCurrency}
                className="w-full rounded-lg border-gray-300 focus:border-green-600 focus:ring-green-600"
              >
                {Object.entries(SUPPORTED_CURRENCIES).map(([k, cfg]) => (
                  <option key={k} value={k}>
                    {k} — {cfg.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Valor
              </label>
              <div className="flex flex-wrap gap-2">
                {quicks.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => onQuick(q)}
                    className={`px-3 py-2 rounded-lg border text-sm 
                      ${q === amount ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-800 border-gray-300 hover:border-gray-400'}
                    `}
                  >
                    {formatCurrency(q, currency)}
                  </button>
                ))}
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-2.5 text-gray-400">
                    {localeSymbol}
                  </span>
                  <input
                    inputMode="decimal"
                    placeholder="Outro valor"
                    className="pl-7 pr-3 py-2 rounded-lg border border-gray-300 focus:border-green-600 focus:ring-green-600"
                    value={Number.isFinite(amount) ? String(amount) : ''}
                    onChange={onCustom}
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Total: <strong>{formatCurrency(amount || 0, currency)}</strong>
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-6 flex items-center gap-3">
            <button
              type="button"
              onClick={handlePay}
              disabled={busy || amount <= 0}
              className="inline-flex items-center px-5 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 disabled:opacity-50"
            >
              {busy ? 'Processando…' : 'Contribuir agora'}
            </button>

            <Link
              href="/apoie"
              className="inline-flex items-center px-5 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Voltar para Apoie
            </Link>
          </div>

          {/* Messages */}
          {msg && (
            <div className="mt-4 rounded-md border border-yellow-200 bg-yellow-50 text-yellow-800 px-4 py-3">
              {msg}
            </div>
          )}

          {/* Payment methods note */}
          <div className="mt-6 text-sm text-gray-500">
            {stripeDisabled ? (
              <p>
                Pagamentos estão <strong>desativados</strong> neste ambiente local (chave de
                teste). A interface está funcionando; ativaremos o checkout real na produção.
              </p>
            ) : (
              <p>O checkout é processado com segurança pelo Stripe.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}