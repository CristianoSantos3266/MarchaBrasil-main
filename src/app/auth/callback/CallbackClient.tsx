'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient'; // ← use alias

export default function CallbackClient() {
  const router = useRouter();
  const search = useSearchParams();
  const [msg, setMsg] = useState('Finalizando autenticação...');

  useEffect(() => {
    (async () => {
      try {
        // Store session if the URL contains a confirmation/recovery token
        const { error } = await supabase.auth.getSessionFromUrl({ storeSession: true });
        if (error) {
          setMsg('Erro: ' + error.message);
          return;
        }

        const type = search.get('type'); // 'recovery' for password reset
        if (type === 'recovery') {
          router.replace('/reset-password');
          return;
        }

        router.replace('/'); // success
      } catch (e: any) {
        setMsg('Erro inesperado: ' + (e?.message || String(e)));
      }
    })();
  }, [router, search]);

  return (
    <div className="min-h-[60vh] grid place-items-center p-6">
      <div className="w-full max-w-md rounded-lg border px-4 py-6 text-center">
        {msg}
      </div>
    </div>
  );
}


