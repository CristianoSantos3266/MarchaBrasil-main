'use client';

import { useState, useEffect } from 'react';

export default function SimpleWorkingMap() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
        <p className="text-gray-600">Carregando mapa...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Map controls */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-gray-600">
            <strong>15</strong> manifestações encontradas
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-xs rounded-full bg-green-600 text-white">
              🇧🇷 Brasil (12)
            </button>
            <button className="px-3 py-1 text-xs rounded-full bg-blue-200 text-blue-700 hover:bg-blue-300 transition-colors">
              🌍 Global (3)
            </button>
          </div>
        </div>
        
        <div className="text-xs text-gray-500 flex items-center gap-4">
          <span>🇧🇷 Eventos nacionais: 12</span>
          <span>🌍 Diáspora internacional: 3</span>
        </div>
      </div>

      {/* Simple map replacement with Brazilian cities */}
      <div className="w-full h-96 rounded-lg overflow-hidden border border-gray-300 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="p-6 h-full flex flex-col">
          <div className="text-center mb-6">
            <div className="text-4xl mb-2">🇧🇷</div>
            <h3 className="text-xl font-bold text-gray-900">Manifestações no Brasil</h3>
            <p className="text-sm text-gray-600">Clique nas cidades para ver detalhes</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 flex-1">
            {/* São Paulo */}
            <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer border-l-4 border-green-500">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">📍</span>
                <h4 className="font-bold text-gray-900">São Paulo</h4>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>👥</strong> 12.500 participantes</p>
                <p><strong>📅</strong> Hoje às 14:00</p>
                <p><strong>📍</strong> Av. Paulista</p>
              </div>
              <button className="mt-2 w-full px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700">
                Ver Detalhes
              </button>
            </div>

            {/* Rio de Janeiro */}
            <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer border-l-4 border-blue-500">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">📍</span>
                <h4 className="font-bold text-gray-900">Rio de Janeiro</h4>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>👥</strong> 8.700 participantes</p>
                <p><strong>📅</strong> Hoje às 15:00</p>
                <p><strong>📍</strong> Copacabana</p>
              </div>
              <button className="mt-2 w-full px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
                Ver Detalhes
              </button>
            </div>

            {/* Brasília */}
            <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer border-l-4 border-yellow-500">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">📍</span>
                <h4 className="font-bold text-gray-900">Brasília</h4>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>👥</strong> 15.600 participantes</p>
                <p><strong>📅</strong> Hoje às 16:00</p>
                <p><strong>📍</strong> Esplanada</p>
              </div>
              <button className="mt-2 w-full px-3 py-1 bg-yellow-600 text-white text-xs rounded hover:bg-yellow-700">
                Ver Detalhes
              </button>
            </div>

            {/* Belo Horizonte */}
            <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer border-l-4 border-purple-500">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">📍</span>
                <h4 className="font-bold text-gray-900">Belo Horizonte</h4>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>👥</strong> 5.200 participantes</p>
                <p><strong>📅</strong> Hoje às 14:30</p>
                <p><strong>📍</strong> Praça da Liberdade</p>
              </div>
              <button className="mt-2 w-full px-3 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700">
                Ver Detalhes
              </button>
            </div>

            {/* Porto Alegre */}
            <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer border-l-4 border-red-500">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">📍</span>
                <h4 className="font-bold text-gray-900">Porto Alegre</h4>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>👥</strong> 4.300 participantes</p>
                <p><strong>📅</strong> Hoje às 15:30</p>
                <p><strong>📍</strong> Centro</p>
              </div>
              <button className="mt-2 w-full px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700">
                Ver Detalhes
              </button>
            </div>

            {/* Curitiba */}
            <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer border-l-4 border-indigo-500">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">📍</span>
                <h4 className="font-bold text-gray-900">Curitiba</h4>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>👥</strong> 3.800 participantes</p>
                <p><strong>📅</strong> Hoje às 16:30</p>
                <p><strong>📍</strong> Centro Cívico</p>
              </div>
              <button className="mt-2 w-full px-3 py-1 bg-indigo-600 text-white text-xs rounded hover:bg-indigo-700">
                Ver Detalhes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-4 text-sm text-gray-600 text-center">
        <p>🗺️ Manifestações em tempo real • Clique nos cards para mais detalhes</p>
      </div>
    </div>
  );
}