'use client';
import { useState } from 'react';
import Image from 'next/image';
import { CRYPTO_METHODS } from '@/config/crypto';

export default function CryptoDonations() {
  const [copied, setCopied] = useState<string | null>(null);
  const onCopy = async (addr: string, key: string) => {
    if (!addr) return;
    await navigator.clipboard.writeText(addr);
    setCopied(key);
    setTimeout(() => setCopied(null), 1200);
  };

  const allEmpty = CRYPTO_METHODS.every(m => !m.addr);

  return (
    <div className="bg-purple-50 rounded-xl p-6">
      <div className="text-center mb-6">
        <div className="mx-auto w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-2xl">₿</div>
        <h3 className="mt-3 text-lg font-semibold text-gray-900">Criptomoedas</h3>
        <p className="text-sm text-purple-700">Máxima privacidade e anonimato</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {CRYPTO_METHODS.map(m => {
          const empty = !m.addr;
          return (
            <div key={m.key} className="bg-white rounded-lg border border-purple-200 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold text-gray-900">{m.label}</div>
              </div>
              <div className="text-xs text-gray-500 mb-3">{m.note}</div>

              {/* QR Code */}
              <div className="flex justify-center mb-3">
                <div className="w-24 h-24 bg-white border border-gray-200 rounded-lg p-2">
                  <Image
                    src={m.qrPath}
                    alt={`QR Code for ${m.label}`}
                    width={80}
                    height={80}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              <div className={`font-mono text-sm break-all rounded-md px-3 py-2 ${
                empty ? 'bg-gray-50 text-gray-400' : 'bg-gray-100 text-gray-800'
              }`}>
                {empty ? '— a ser preenchido —' : m.addr}
              </div>

              <button
                type="button"
                onClick={() => onCopy(m.addr, m.key)}
                disabled={empty}
                className={`mt-3 w-full rounded-md px-3 py-2 text-sm font-medium transition ${
                  empty ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-purple-600 text-white hover:bg-purple-700'
                }`}
                title={empty ? 'Endereço ainda não definido' : 'Copiar endereço'}
              >
                {empty ? 'Em breve' : (copied === m.key ? 'Copiado!' : 'Copiar')}
              </button>
            </div>
          );
        })}
      </div>

      {allEmpty && (
        <p className="mt-4 text-center text-sm text-purple-700">
          Os endereços de carteira serão adicionados em breve (ETH, BTC, LTC e DOGE).
        </p>
      )}
    </div>
  );
}