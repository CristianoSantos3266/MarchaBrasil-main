'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { countries, Country, Region } from '@/data/countries';
import { globalProtests } from '@/data/globalProtests';
import { getDemoEvents, isDemoMode, onDemoEventsUpdate } from '@/lib/demo-events';
import { Protest } from '@/types';

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
  const [allProtests, setAllProtests] = useState<Protest[]>([]);

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

  const loadProtests = () => {
    let protests = [...globalProtests];
    if (isDemoMode()) {
      const demoEvents = getDemoEvents();
      protests = [...globalProtests, ...demoEvents];
    }
    
    
    setAllProtests(protests);
  };

  useEffect(() => {
    loadProtests();
    
    // Listen for demo events updates
    let cleanup: (() => void) | undefined;
    if (isDemoMode()) {
      cleanup = onDemoEventsUpdate(loadProtests);
    }

    return cleanup;
  }, []);

  if (typeof window === 'undefined') {
    return (
      <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
        <p className="text-gray-600">Carregando mapa...</p>
      </div>
    );
  }

  // Determine map view based on available events
  const brazilianEvents = allProtests.filter(p => p.country === 'BR');
  const internationalEvents = allProtests.filter(p => p.country !== 'BR');
  
  // Default to Brazil-focused view since most events are Brazilian
  const mapCenter: [number, number] = currentCountry ? currentCountry.coordinates : [-15.7801, -47.9292]; // Center of Brazil
  const mapZoom = currentCountry ? currentCountry.zoom : brazilianEvents.length > 10 ? 4 : 5; // Zoom based on event density
  
  // Show events based on current view
  const protestsToShow = currentCountry 
    ? allProtests.filter(p => p.country === currentCountry.code)
    : allProtests;

  return (
    <div className="w-full">
      {/* Map controls */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-gray-600">
            <strong>{protestsToShow.length}</strong> manifestações encontradas
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setCurrentCountry(null)}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${!currentCountry ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              🇧🇷 Brasil ({brazilianEvents.length})
            </button>
            {internationalEvents.length > 0 && (
              <button 
                onClick={() => {
                  // Zoom out to show all events globally
                  const mapInstance = document.querySelector('.leaflet-container')?._leaflet_map;
                  if (mapInstance) {
                    mapInstance.setView([20, 0], 2);
                  }
                }}
                className="px-3 py-1 text-xs rounded-full bg-blue-200 text-blue-700 hover:bg-blue-300 transition-colors"
              >
                🌍 Global ({internationalEvents.length})
              </button>
            )}
          </div>
        </div>
        
        {internationalEvents.length > 0 && (
          <div className="text-xs text-gray-500 flex items-center gap-4">
            <span>🇧🇷 Eventos nacionais: {brazilianEvents.length}</span>
            <span>🌍 Diáspora internacional: {internationalEvents.length}</span>
          </div>
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
          
          {/* Show protest markers */}
          {protestsToShow.map((protest) => {
            if (!protest.coordinates) return null;
            
            const totalRSVPs = Object.values(protest.rsvps).reduce((sum, count) => sum + count, 0);
            
            return (
              <Marker
                key={protest.id}
                position={protest.coordinates}
                eventHandlers={{
                  click: () => {
                    // Navigate to protest detail page
                    window.location.href = `/protest/${protest.id}`;
                  }
                }}
              >
                <Popup>
                  <div className="text-center max-w-xs">
                    <div className="flex items-center gap-2 mb-2">
                      {protest.country === 'BR' ? '🇧🇷' : protest.country === 'US' ? '🇺🇸' : protest.country === 'FR' ? '🇫🇷' : protest.country === 'CA' ? '🇨🇦' : protest.country === 'AR' ? '🇦🇷' : '🌍'}
                      <h3 className="font-bold text-lg">{protest.title}</h3>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>📍</strong> {protest.city}, {protest.region}</p>
                      <p><strong>📅</strong> {protest.date} às {protest.time}</p>
                      <p><strong>👥</strong> {totalRSVPs.toLocaleString()} participantes</p>
                      <p><strong>📢</strong> {protest.type.charAt(0).toUpperCase() + protest.type.slice(1)}</p>
                      {protest.country !== 'BR' && (
                        <p><strong>🌍</strong> Evento Internacional</p>
                      )}
                    </div>
                    <button 
                      className={`mt-3 px-4 py-2 text-white rounded text-sm hover:opacity-90 w-full transition-colors ${
                        protest.country === 'BR' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                      onClick={() => window.location.href = `/protest/${protest.id}`}
                    >
                      Ver Detalhes
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* Instructions */}
      <div className="mt-4 text-sm text-gray-600 text-center">
        <p>🗺️ Manifestações em tempo real • Clique nos marcadores para mais detalhes</p>
        {protestsToShow.length === 0 && (
          <p className="text-gray-500 mt-2">Nenhuma manifestação programada no momento</p>
        )}
      </div>
    </div>
  );
}