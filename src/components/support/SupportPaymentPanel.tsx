'use client';

import { useState } from 'react';
import {
  ClipboardDocumentIcon,
  CreditCardIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';
import CryptoDonations from './CryptoDonations';

function formatBRL(n: number) {
  return n.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  });
}

export default function SupportPaymentPanel() {
  const [activeTab, setActiveTab] = useState<'pix' | 'card' | 'crypto'>('pix');
  const [selectedAmount, setSelectedAmount] = useState<number | null>(25);
  const [customAmount, setCustomAmount] = useState<string>('');

  const preset = [10, 25, 50, 100];

  const getAmount = () => {
    const raw =
      customAmount.trim() === ''
        ? selectedAmount ?? 0
        : Number(customAmount.replace(',', '.'));
    return isFinite(raw) && raw > 0 ? Math.round(raw * 100) / 100 : 0;
  };

  const copyPixKey = async () => {
    const key = 'd271a5b0-4256-4c14-a3cc-8f71f3bf5bec'; // demo key
    try {
      await navigator.clipboard.writeText(key);
      alert('Chave PIX copiada!');
    } catch {
      alert('Não foi possível copiar a chave PIX.');
    }
  };

  const payWithCard = async () => {
    const amount = getAmount();
    if (!amount || amount < 5) {
      alert('Selecione um valor mínimo de R$ 5');
      return;
    }

    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ amount, currency: 'BRL' }),
      });

      const data = await res.json();
      if (res.ok && data?.url) {
        window.location.href = data.url; // redireciona para o Stripe Checkout
        return;
      }
      alert(data?.error || 'Não foi possível iniciar o pagamento.');
    } catch (err) {
      console.error(err);
      alert('Erro ao iniciar o pagamento.');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex">
          <button
            type="button"
            onClick={() => setActiveTab('pix')}
            className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
              activeTab === 'pix'
                ? 'bg-green-600 text-white border-b-2 border-green-600'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            aria-selected={activeTab === 'pix'}
          >
            <CurrencyDollarIcon className="inline h-5 w-5 mr-2" />
            PIX
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('card')}
            className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
              activeTab === 'card'
                ? 'bg-blue-600 text-white border-b-2 border-blue-600'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            aria-selected={activeTab === 'card'}
          >
            <CreditCardIcon className="inline h-5 w-5 mr-2" />
            Cartão
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('crypto')}
            className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
              activeTab === 'crypto'
                ? 'bg-purple-600 text-white border-b-2 border-purple-600'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            aria-selected={activeTab === 'crypto'}
          >
            Crypto
          </button>
        </div>
      </div>

      {/* Amount selector */}
      <div className="p-6">
        <h3 className="text-center text-gray-700 font-medium mb-4">
          Escolha o valor do seu apoio
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {preset.map((v) => (
            <button
              type="button"
              key={v}
              onClick={() => {
                setSelectedAmount(v);
                setCustomAmount('');
              }}
              className={`rounded-lg border px-4 py-3 text-center font-semibold transition ${
                selectedAmount === v && customAmount === ''
                  ? 'border-green-600 bg-green-50 text-green-700'
                  : 'border-gray-200 hover:bg-gray-50 text-gray-800'
              }`}
            >
              {formatBRL(v)}
              <div className="block text-xs font-normal text-gray-500 mt-1">
                {v === 10
                  ? 'Básico'
                  : v === 25
                  ? 'Popular'
                  : v === 50
                  ? 'Generoso'
                  : 'Defensor'}
              </div>
            </button>
          ))}
        </div>

        <div className="relative">
          <input
            inputMode="decimal"
            placeholder="R$25"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={customAmount}
            onChange={(e) => {
              setCustomAmount(e.target.value);
              setSelectedAmount(null);
            }}
          />
          <span className="absolute right-3 top-3.5 text-gray-400 pointer-events-none">
            R$
          </span>
          <p className="mt-2 text-xs text-gray-500">Valor mínimo: R$ 5</p>
        </div>
      </div>

      {/* Panels */}
      <div className="p-6 pt-0">
        {activeTab === 'pix' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <CurrencyDollarIcon className="h-6 w-6 text-green-700" />
            </div>
            <h4 className="text-lg font-bold text-green-900 mb-1">
              Pagamento via PIX
            </h4>
            <p className="text-green-800 mb-4 text-sm">
              Transferência instantânea e segura
            </p>

            <div className="bg-white border border-green-200 rounded-lg p-3 max-w-xl mx-auto flex items-center gap-2">
              <code className="flex-1 text-sm text-green-900 break-all">
                d271a5b0-4256-4c14-a3cc-8f71f3bf5bec
              </code>
              <button
                type="button"
                onClick={copyPixKey}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-green-600 text-white hover:bg-green-700"
              >
                <ClipboardDocumentIcon className="h-5 w-5" />
                Copiar
              </button>
            </div>

            {getAmount() > 0 && (
              <div className="mt-3 text-green-900 font-semibold">
                Valor: {formatBRL(getAmount())}
              </div>
            )}
          </div>
        )}

        {activeTab === 'card' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <h4 className="text-lg font-bold text-blue-900 mb-2">
              Pagamento por Cartão
            </h4>
            {getAmount() > 0 ? (
              <>
                <div className="text-2xl font-bold text-blue-900 mb-4">
                  {formatBRL(getAmount())}
                </div>
                <button
                  type="button"
                  onClick={payWithCard}
                  className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
                >
                  Pagar com Cartão
                </button>
                <p className="mt-2 text-sm text-blue-700">
                  Processamento seguro via Stripe
                </p>
              </>
            ) : (
              <p className="text-blue-800">
                Escolha um valor para habilitar o pagamento.
              </p>
            )}
          </div>
        )}

        {activeTab === 'crypto' && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <CryptoDonations />
          </div>
        )}
      </div>
    </div>
  );
}

