'use client';

import { useState } from 'react';
import { CRYPTO_ADDRESSES } from '@/config/crypto';

type CoinKey = 'ETH' | 'BTC' | 'LTC' | 'DOGE';

type Coin = {
  key: CoinKey;
  name: string;
  ticker: string;
  address: string;
  qrSrc: string;    // served from /public
  iconSrc: string;  // served from /public
};

const COINS: Coin[] = [
  {
    key: 'ETH',
    name: 'Ethereum',
    ticker: 'ETH',
    address: CRYPTO_ADDRESSES.ETH,
    qrSrc: '/qr/eth.png',
    iconSrc: '/icons/eth.svg',
  },
  {
    key: 'BTC',
    name: 'Bitcoin',
    ticker: 'BTC',
    address: CRYPTO_ADDRESSES.BTC,
    qrSrc: '/qr/btc.png',
    iconSrc: '/icons/btc.svg',
  },
  {
    key: 'LTC',
    name: 'Litecoin',
    ticker: 'LTC',
    address: CRYPTO_ADDRESSES.LTC,
    qrSrc: '/qr/ltc.png',
    iconSrc: '/icons/ltc.svg',
  },
  {
    key: 'DOGE',
    name: 'Dogecoin',
    ticker: 'DOGE',
    address: CRYPTO_ADDRESSES.DOGE,
    qrSrc: '/qr/doge.png',
    iconSrc: '/icons/doge.svg',
  },
];

export default function CryptoDonations() {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (text: string, coin: string) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopied(coin);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      alert('Não foi possível copiar. Por favor, copie manualmente.');
    }
  };

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {COINS.map((c) => (
        <div
          key={c.key}
          className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
        >
          {/* Header */}
          <div className="mb-3 flex items-center gap-2">
            <img
              src={c.iconSrc}
              alt={`${c.name} logo`}
              width={24}
              height={24}
              style={{ borderRadius: '9999px' }}
            />
            <h3 className="text-lg font-semibold">
              {c.name} ({c.ticker})
            </h3>
          </div>

          {/* QR */}
          <div className="mt-3 flex justify-center">
            <img
              src={c.qrSrc}
              alt={`${c.name} QR`}
              width={220}
              height={220}
              className="rounded-lg border border-gray-200 shadow-sm"
              loading="eager"
              decoding="async"
            />
          </div>

          {/* Address */}
          <p className="mt-3 break-all text-sm text-gray-800">
            <span className="font-medium">Address:</span> {c.address}
          </p>

          {/* Actions */}
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              className="rounded-lg border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50"
              onClick={() => copy(c.address, c.ticker)}
            >
              {copied === c.ticker ? 'Copiado!' : 'Copiar endereço'}
            </button>

            <a
              className="rounded-lg border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50"
              href={c.qrSrc}
              download={`${c.ticker}-qr.png`}
            >
              Baixar QR
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}

