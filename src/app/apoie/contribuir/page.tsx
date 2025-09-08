export const dynamic = 'force-static';

import dynamic from 'next/dynamic';

const ContribuirView = dynamic(
  () => import('./ContribuirView.client'),
  { ssr: false, loading: () => <div className="p-6">Carregando…</div> }
);

export default function Page() {
  return <ContribuirView />;
}

