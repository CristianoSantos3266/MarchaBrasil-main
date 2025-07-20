'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { brazilStates } from '@/data/brazilStates';
import { BrazilState } from '@/types';

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

interface BrazilMapProps {
  onStateSelect: (state: BrazilState) => void;
  selectedState?: string;
}

export default function BrazilMap({ onStateSelect, selectedState }: BrazilMapProps) {
  const [mapReady, setMapReady] = useState(false);

  const handleStateClick = (state: BrazilState) => {
    onStateSelect(state);
  };

  if (typeof window === 'undefined') {
    return (
      <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
        <p className="text-gray-600">Carregando mapa...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden border border-gray-300">
      <MapContainer
        center={[-14.2350, -51.9253]}
        zoom={4}
        style={{ height: '100%', width: '100%' }}
        whenReady={() => setMapReady(true)}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {brazilStates.map((state) => (
          <Marker
            key={state.code}
            position={state.coordinates}
            eventHandlers={{
              click: () => handleStateClick(state)
            }}
          >
            <Popup>
              <div className="text-center">
                <h3 className="font-bold text-lg">{state.name}</h3>
                <p className="text-sm text-gray-600">{state.code}</p>
                <button 
                  className="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                  onClick={() => handleStateClick(state)}
                >
                  Ver Protestos
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}