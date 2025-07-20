'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { countries, Country, Region } from '@/data/countries';

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

interface GlobalMapProps {
  onCountrySelect: (country: Country) => void;
  onRegionSelect: (country: Country, region: Region) => void;
  selectedCountry?: string;
  selectedRegion?: string;
}

export default function GlobalMap({ onCountrySelect, onRegionSelect, selectedCountry, selectedRegion }: GlobalMapProps) {
  const [currentCountry, setCurrentCountry] = useState<Country | null>(null);

  const handleCountryClick = (country: Country) => {
    setCurrentCountry(country);
    onCountrySelect(country);
  };

  const handleRegionClick = (country: Country, region: Region) => {
    onRegionSelect(country, region);
  };

  const handleBackToGlobal = () => {
    setCurrentCountry(null);
  };

  if (typeof window === 'undefined') {
    return (
      <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
        <p className="text-gray-600">Carregando mapa...</p>
      </div>
    );
  }

  // Show global view or specific country view
  const mapCenter = currentCountry ? currentCountry.coordinates : [20, 0];
  const mapZoom = currentCountry ? currentCountry.zoom : 2;
  const markersToShow = currentCountry ? currentCountry.regions : countries.map(c => ({ ...c, type: 'country' as const }));

  return (
    <div className="w-full">
      {/* Navigation breadcrumb */}
      <div className="mb-4 flex items-center gap-2 text-sm">
        <button
          onClick={handleBackToGlobal}
          className={`px-3 py-1 rounded ${!currentCountry ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          🌍 Global
        </button>
        {currentCountry && (
          <>
            <span className="text-gray-400">→</span>
            <span className="px-3 py-1 bg-blue-600 text-white rounded">
              {currentCountry.name}
            </span>
          </>
        )}
      </div>

      {/* Map container */}
      <div className="w-full h-96 rounded-lg overflow-hidden border border-gray-300">
        <MapContainer
          key={currentCountry?.code || 'global'} // Force re-render when country changes
          center={mapCenter}
          zoom={mapZoom}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {!currentCountry ? (
            // Global view - show countries
            countries.map((country) => (
              <Marker
                key={country.code}
                position={country.coordinates}
                eventHandlers={{
                  click: () => handleCountryClick(country)
                }}
              >
                <Popup>
                  <div className="text-center">
                    <h3 className="font-bold text-lg">{country.name}</h3>
                    <p className="text-sm text-gray-600">{country.regions.length} regiões</p>
                    <button 
                      className="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                      onClick={() => handleCountryClick(country)}
                    >
                      Ver Regiões
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))
          ) : (
            // Country view - show regions
            currentCountry.regions.map((region) => (
              <Marker
                key={region.code}
                position={region.coordinates}
                eventHandlers={{
                  click: () => handleRegionClick(currentCountry, region)
                }}
              >
                <Popup>
                  <div className="text-center">
                    <h3 className="font-bold text-lg">{region.name}</h3>
                    <p className="text-sm text-gray-600">
                      {region.type.charAt(0).toUpperCase() + region.type.slice(1)}
                    </p>
                    <button 
                      className="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                      onClick={() => handleRegionClick(currentCountry, region)}
                    >
                      Ver Protestos
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))
          )}
        </MapContainer>
      </div>

      {/* Instructions */}
      <div className="mt-4 text-sm text-gray-600">
        {!currentCountry ? (
          <p>📍 Clique em um país para ver suas regiões</p>
        ) : (
          <p>📍 Clique em uma região para ver os protestos locais</p>
        )}
      </div>
    </div>
  );
}