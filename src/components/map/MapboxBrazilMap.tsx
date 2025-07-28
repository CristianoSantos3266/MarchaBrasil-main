'use client';

import { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { BrazilState } from '@/types';
import { brazilStates } from '@/data/brazilStates';

// Mapbox access token - in production, this should be in environment variables
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

interface MapboxBrazilMapProps {
  onStateSelect: (state: BrazilState) => void;
  selectedState?: string;
  className?: string;
}

export default function MapboxBrazilMap({ 
  onStateSelect, 
  selectedState, 
  className = '' 
}: MapboxBrazilMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Set Mapbox access token
    mapboxgl.accessToken = MAPBOX_TOKEN;

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11', // Clean, professional style
      center: [-51.9253, -14.2350], // Center of Brazil
      zoom: 4,
      attributionControl: false // Remove attribution to clean up UI
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Wait for map to load
    map.current.on('load', () => {
      setMapLoaded(true);
      addStateMarkers();
    });

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  const addStateMarkers = () => {
    if (!map.current) return;

    brazilStates.forEach((state) => {
      // Create custom marker element
      const markerElement = document.createElement('div');
      markerElement.className = 'mapbox-marker';
      markerElement.innerHTML = `
        <div class="w-8 h-8 bg-green-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center cursor-pointer hover:bg-green-700 transition-colors">
          <span class="text-white text-xs font-bold">${state.code}</span>
        </div>
      `;

      // Add click handler
      markerElement.addEventListener('click', () => {
        onStateSelect(state);
        
        // Fly to state with animation
        map.current?.flyTo({
          center: state.coordinates,
          zoom: 6,
          duration: 1500
        });
      });

      // Create marker
      const marker = new mapboxgl.Marker(markerElement)
        .setLngLat(state.coordinates)
        .addTo(map.current!);

      // Create popup for state info
      const popup = new mapboxgl.Popup({
        offset: 25,
        className: 'mapbox-popup'
      }).setHTML(`
        <div class="p-3 text-center">
          <h3 class="font-bold text-lg text-gray-900">${state.name}</h3>
          <p class="text-sm text-gray-600 mb-2">${state.code}</p>
          <button 
            onclick="window.dispatchEvent(new CustomEvent('selectState', { detail: '${state.code}' }))"
            class="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
          >
            Ver Manifestações
          </button>
        </div>
      `);

      marker.setPopup(popup);

      // Highlight selected state
      if (selectedState === state.code) {
        markerElement.querySelector('div')?.classList.add('bg-blue-600', 'hover:bg-blue-700');
        markerElement.querySelector('div')?.classList.remove('bg-green-600', 'hover:bg-green-700');
        popup.addTo(map.current!);
      }
    });

    // Listen for custom state selection events
    window.addEventListener('selectState', (event: any) => {
      const stateCode = event.detail;
      const state = brazilStates.find(s => s.code === stateCode);
      if (state) {
        onStateSelect(state);
      }
    });
  };

  // Handle selected state changes
  useEffect(() => {
    if (mapLoaded && selectedState) {
      const state = brazilStates.find(s => s.code === selectedState);
      if (state && map.current) {
        map.current.flyTo({
          center: state.coordinates,
          zoom: 6,
          duration: 1500
        });
      }
    }
  }, [selectedState, mapLoaded]);

  if (typeof window === 'undefined') {
    return (
      <div className={`w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Carregando mapa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div 
        ref={mapContainer} 
        className="w-full h-96 rounded-lg overflow-hidden border border-gray-300 shadow-md"
      />
      
      {!mapLoaded && (
        <div className="absolute inset-0 bg-gray-200 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Carregando mapa do Brasil...</p>
          </div>
        </div>
      )}

      {/* Map legend */}
      <div className="absolute top-4 left-4 bg-white bg-opacity-95 rounded-lg p-3 shadow-md">
        <h4 className="font-semibold text-sm text-gray-900 mb-2">🇧🇷 Estados do Brasil</h4>
        <div className="text-xs text-gray-600 space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-600 rounded-full"></div>
            <span>Clique para ver manifestações</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            <span>Estado selecionado</span>
          </div>
        </div>
      </div>

      {/* Controls info */}
      <div className="absolute bottom-4 right-4 bg-white bg-opacity-95 rounded-lg p-2 shadow-md">
        <p className="text-xs text-gray-600">🗺️ Use +/- para zoom • Arraste para navegar</p>
      </div>
    </div>
  );
}