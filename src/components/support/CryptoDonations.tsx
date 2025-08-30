'use client';
import { useState } from 'react';

const BTC_ADDRESS  = '';
const USDT_TRC20   = '';
const ETH_ADDRESS  = '';

type Method = { key: string; label: string; note: string; code?: string; addr: string };

const methods: Method[] = [
  { key: 'btc',  label: 'Bitcoin (BTC)',     note: 'Rede Bitcoin',        addr: BTC_ADDRESS },
  { key: 'usdt', label: 'USDT (TRC20)',      note: 'Tether na rede Tron', addr: USDT_TRC20, code: 'TRC20' },
  { key: 'eth',  label: 'Ethereum (ETH)',    note: 'Rede Ethereum',       addr: ETH_ADDRESS },
];

export default function CryptoDonations() {
  const [copied, setCopied] = useState<string | null>(null);
  const onCopy = async (addr: string, key: string) => {
    if (!addr) return;
    await navigator.clipboard.writeText(addr);
    setCopied(key);
    setTimeout(() => setCopied(null), 1200);
  };

  const allEmpty = methods.every(m => !m.addr);

  return (
    <div className="bg-purple-50 rounded-xl p-6">
      <div className="text-center mb-6">
        <div className="mx-auto w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-2xl">₿</div>
        <h3 className="mt-3 text-lg font-semibold text-gray-900">Criptomoedas</h3>
        <p className="text-sm text-purple-700">Máxima privacidade e anonimato</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {methods.map(m => {
          const empty = !m.addr;
          return (
            <div key={m.key} className="bg-white rounded-lg border border-purple-200 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold text-gray-900">{m.label}</div>
                {m.code && <span className="text-xs px-2 py-0.5 rounded bg-purple-100 text-purple-800">{m.code}</span>}
              </div>
              <div className="text-xs text-gray-500 mb-3">{m.note}</div>

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
          Os endereços de carteira serão adicionados em breve (BTC, USDT-TRC20 e ETH).
        </p>
      )}
    </div>
  );
}