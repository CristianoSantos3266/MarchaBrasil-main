'use client';

import { useEffect, useState } from 'react';

interface ConvoyRoute {
  startLocation: string;
  destination: string;
  departureTime: string;
  description?: string;
}

interface SimpleConvoyMapProps {
  convoy: ConvoyRoute;
  className?: string;
}

export default function SimpleConvoyMap({ convoy, className = '' }: SimpleConvoyMapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Carregando rota...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <div className="w-full h-64 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg border-2 border-blue-200 flex items-center justify-center">
        <div className="text-center p-6">
          <div className="text-5xl mb-4">🛣️</div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Rota da Manifestação</h3>
          
          <div className="bg-white rounded-lg p-4 text-left max-w-md">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🚀</span>
                <div>
                  <p className="font-semibold text-gray-900">Ponto de Partida</p>
                  <p className="text-sm text-gray-600">{convoy.startLocation}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="text-2xl">🕐</span>
                <div>
                  <p className="font-semibold text-gray-900">Horário de Saída</p>
                  <p className="text-sm text-gray-600">{convoy.departureTime}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="text-2xl">🏁</span>
                <div>
                  <p className="font-semibold text-gray-900">Destino</p>
                  <p className="text-sm text-gray-600">{convoy.destination}</p>
                </div>
              </div>
              
              {convoy.description && (
                <div className="pt-2 border-t">
                  <p className="text-xs text-gray-500">{convoy.description}</p>
                </div>
              )}
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mt-4">
            Para ver o mapa interativo da rota, configure o Mapbox
          </p>
        </div>
      </div>
      
      {/* Safety Notice */}
      <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <p className="text-xs text-yellow-800">
          ⚠️ <strong>Importante:</strong> Respeite as leis de trânsito, mantenha distância segura e siga as orientações dos organizadores durante todo o percurso.
        </p>
      </div>
    </div>
  );
}