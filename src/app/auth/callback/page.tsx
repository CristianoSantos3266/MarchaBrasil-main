import { Suspense } from 'react';
import CallbackClient from './CallbackClient';

// This route depends on URL params/tokens; don't statically prerender
export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6">Processando login…</div>}>
      <CallbackClient />
    </Suspense>
  );
}

