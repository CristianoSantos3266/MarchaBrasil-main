'use client';
export const dynamic = 'force-static';

import { useState } from 'react';

export default function ContribuirPage() {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const testStripe = async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch('/api/test-stripe', { cache: 'no-store' });
      const body = await res.json().catch(() => ({}));
      alert(`Status: ${res.status}\nResponse: ${JSON.stringify(body)}`);
    } catch (e) {
      setErr('Falha na conexão.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-green-50 p-8">
      <h1 className="text-2xl font-semibold mb-4">Contribuir</h1>

      <button
        onClick={testStripe}
        disabled={loading}
        className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
      >
        {loading ? 'Testando…' : 'Testar Stripe'}
      </button>

      {err && <p className="text-red-600 mt-3">{err}</p>}
    </div>
  );
}

