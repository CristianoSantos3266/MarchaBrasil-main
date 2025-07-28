'use client';

import { useState, useEffect } from 'react';
import { countries, getCountryByCode } from '@/data/countries';
import { Country, Region } from '@/data/countries';

interface SimpleMapboxGlobalProps {
  onCountrySelect?: (country: Country) => void;
  onRegionSelect?: (country: Country, region: Region) => void;
}

export default function SimpleMapboxGlobal({ onCountrySelect, onRegionSelect }: SimpleMapboxGlobalProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedView, setSelectedView] = useState<'world' | 'country'>('world');

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

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setSelectedView('country');
    onCountrySelect?.(country);
  };

  const handleRegionSelect = (region: Region) => {
    if (selectedCountry && onRegionSelect) {
      onRegionSelect(selectedCountry, region);
    }
  };

  const handleBackToWorld = () => {
    setSelectedCountry(null);
    setSelectedView('world');
  };

  const renderWorldView = () => (
    <div className="w-full h-96 rounded-lg overflow-hidden border border-gray-300 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="p-6 h-full flex flex-col">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🌍</div>
          <h3 className="text-xl font-bold text-gray-900">Escolha seu País</h3>
          <p className="text-sm text-gray-600">Clique em um país para ver os estados/regiões</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 flex-1 overflow-y-auto">
          {countries.map((country) => (
            <div 
              key={country.code}
              onClick={() => handleCountrySelect(country)}
              className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer border-l-4 border-green-500 hover:border-green-600"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">
                  {country.code === 'BR' ? '🇧🇷' : 
                   country.code === 'US' ? '🇺🇸' : 
                   country.code === 'AR' ? '🇦🇷' : 
                   country.code === 'CA' ? '🇨🇦' : 
                   country.code === 'FR' ? '🇫🇷' : 
                   country.code === 'DE' ? '🇩🇪' : 
                   country.code === 'GB' ? '🇬🇧' : 
                   country.code === 'IT' ? '🇮🇹' : 
                   country.code === 'ES' ? '🇪🇸' : 
                   country.code === 'PT' ? '🇵🇹' : 
                   country.code === 'JP' ? '🇯🇵' : 
                   country.code === 'AU' ? '🇦🇺' : '📍'}
                </span>
                <h4 className="font-bold text-gray-900 text-sm">{country.name}</h4>
              </div>
              <div className="text-xs text-gray-600">
                <p><strong>{country.regions.length}</strong> regiões</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCountryView = () => {
    if (!selectedCountry) return null;

    return (
      <div className="w-full h-96 rounded-lg overflow-hidden border border-gray-300 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="p-6 h-full flex flex-col">
          <div className="text-center mb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <button 
                onClick={handleBackToWorld}
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                ← Voltar
              </button>
              <div className="text-2xl">
                {selectedCountry.code === 'BR' ? '🇧🇷' : 
                 selectedCountry.code === 'US' ? '🇺🇸' : 
                 selectedCountry.code === 'AR' ? '🇦🇷' : '📍'}
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900">{selectedCountry.name}</h3>
            <p className="text-sm text-gray-600">Clique em uma região para ver manifestações</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 flex-1 overflow-y-auto">
            {selectedCountry.regions.map((region) => (
              <div 
                key={region.code}
                onClick={() => handleRegionSelect(region)}
                className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer border-l-4 border-blue-500 hover:border-blue-600"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm">📍</span>
                  <h4 className="font-bold text-gray-900 text-xs">{region.code}</h4>
                </div>
                <div className="text-xs text-gray-600">
                  <p className="truncate" title={region.name}>{region.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      {/* Map controls */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-gray-600">
            <strong>Mapa Interativo</strong> - {selectedView === 'world' ? 'Visualização Mundial' : `${selectedCountry?.name}`}
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => handleCountrySelect(getCountryByCode('BR')!)}
              className="px-3 py-1 text-xs rounded-full bg-green-600 text-white hover:bg-green-700 transition-colors"
            >
              🇧🇷 Brasil
            </button>
            <button 
              onClick={handleBackToWorld}
              className="px-3 py-1 text-xs rounded-full bg-blue-200 text-blue-700 hover:bg-blue-300 transition-colors"
            >
              🌍 Mundial
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Map */}
      {selectedView === 'world' ? renderWorldView() : renderCountryView()}

      {/* Instructions */}
      <div className="mt-4 text-sm text-gray-600 text-center">
        <p>🗺️ Mapa interativo • Clique para navegar entre países e regiões</p>
      </div>
    </div>
  );
}