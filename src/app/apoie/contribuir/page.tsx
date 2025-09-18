
import { Suspense } from 'react';
import ContribuirClient from './ContribuirClient';

// This page reads search params through the client child; avoid static prerender.
export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6">Carregando…</div>}>
      <ContribuirClient />
    </Suspense>
  );
}

