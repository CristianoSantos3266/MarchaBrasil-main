'use client';

import { useEffect, useState } from 'react';

// Simple fallback map component that loads when window is ready
export default function SimpleMapboxGlobal() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Carregando mapa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-96 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg border-2 border-green-200 flex items-center justify-center">
      <div className="text-center p-8">
        <div className="text-6xl mb-4">🗺️</div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Mapa Interativo</h3>
        <p className="text-gray-600 mb-6 max-w-md">
          Para visualizar o mapa completo com todas as manifestações, configure sua chave do Mapbox.
        </p>
        <div className="bg-white rounded-lg p-4 text-left text-sm">
          <p className="font-semibold text-gray-900 mb-2">Como configurar:</p>
          <ol className="list-decimal list-inside space-y-1 text-gray-600">
            <li>Crie uma conta gratuita em <span className="font-mono text-blue-600">mapbox.com</span></li>
            <li>Gere um token de acesso</li>
            <li>Adicione no arquivo <span className="font-mono">.env.local</span>:</li>
          </ol>
          <div className="bg-gray-100 rounded p-2 mt-2 font-mono text-xs">
            NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=seu_token_aqui
          </div>
        </div>
      </div>
    </div>
  );
}