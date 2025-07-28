'use client';

import { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { globalProtests } from '@/data/globalProtests';
import { getDemoEvents, isDemoMode, onDemoEventsUpdate } from '@/lib/demo-events';
import { Protest } from '@/types';

// Mapbox access token
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

interface MapboxGlobalMapProps {
  selectedCountry?: string;
  onProtestSelect?: (protest: Protest) => void;
  className?: string;
}

export default function MapboxGlobalMap({ 
  selectedCountry, 
  onProtestSelect,
  className = '' 
}: MapboxGlobalMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [allProtests, setAllProtests] = useState<Protest[]>([]);
  const [viewMode, setViewMode] = useState<'brazil' | 'global'>('brazil');
  const markersRef = useRef<mapboxgl.Marker[]>([]);

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

  useEffect(() => {
    if (!mapContainer.current) return;

    // Set Mapbox access token
    mapboxgl.accessToken = MAPBOX_TOKEN;

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12', // More detailed style for global view
      center: viewMode === 'brazil' ? [-51.9253, -14.2350] : [0, 20], // Brazil center or world center
      zoom: viewMode === 'brazil' ? 4 : 2,
      attributionControl: false
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add fullscreen control
    map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right');

    // Wait for map to load
    map.current.on('load', () => {
      setMapLoaded(true);
      addProtestMarkers();
    });

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  // Update markers when protests change
  useEffect(() => {
    if (mapLoaded) {
      clearMarkers();
      addProtestMarkers();
    }
  }, [allProtests, mapLoaded, viewMode]);

  const clearMarkers = () => {
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
  };

  const addProtestMarkers = () => {
    if (!map.current) return;

    const protestsToShow = selectedCountry 
      ? allProtests.filter(p => p.country === selectedCountry)
      : allProtests;

    protestsToShow.forEach((protest) => {
      if (!protest.coordinates) return;

      const totalRSVPs = Object.values(protest.rsvps || {}).reduce((sum, count) => sum + count, 0);
      const isBrazilian = protest.country === 'BR';
      
      // Create custom marker based on event size and type
      const markerSize = totalRSVPs > 1000 ? 'large' : totalRSVPs > 100 ? 'medium' : 'small';
      const markerColor = isBrazilian ? 'green' : 'blue';
      
      const markerElement = document.createElement('div');
      markerElement.className = 'mapbox-protest-marker';
      markerElement.innerHTML = `
        <div class="${getMarkerClasses(markerSize, markerColor)}">
          <div class="flex flex-col items-center justify-center h-full">
            <span class="text-xs font-bold text-white">${getEventIcon(protest.type)}</span>
            ${totalRSVPs > 0 ? `<span class="text-xs text-white">${formatNumber(totalRSVPs)}</span>` : ''}
          </div>
        </div>
      `;

      // Add click handler
      markerElement.addEventListener('click', () => {
        if (onProtestSelect) {
          onProtestSelect(protest);
        } else {
          // Default navigation to protest detail
          window.location.href = `/protest/${protest.id}`;
        }
      });

      // Create marker
      const marker = new mapboxgl.Marker(markerElement)
        .setLngLat(protest.coordinates)
        .addTo(map.current!);

      // Create detailed popup
      const popup = new mapboxgl.Popup({
        offset: 25,
        className: 'mapbox-protest-popup',
        maxWidth: '300px'
      }).setHTML(createPopupContent(protest, totalRSVPs));

      marker.setPopup(popup);
      markersRef.current.push(marker);

      // Show popup for selected protest
      if (selectedCountry && protest.country === selectedCountry) {
        popup.addTo(map.current!);
      }
    });
  };

  const getMarkerClasses = (size: string, color: string) => {
    const baseClasses = 'rounded-full border-2 border-white shadow-lg cursor-pointer hover:shadow-xl transition-all duration-200 hover:scale-110';
    const sizeClasses = {
      small: 'w-8 h-8',
      medium: 'w-10 h-10',
      large: 'w-12 h-12'
    };
    const colorClasses = {
      green: 'bg-green-600 hover:bg-green-700',
      blue: 'bg-blue-600 hover:bg-blue-700'
    };
    
    return `${baseClasses} ${sizeClasses[size as keyof typeof sizeClasses]} ${colorClasses[color as keyof typeof colorClasses]}`;
  };

  const getEventIcon = (type: string) => {
    const icons: Record<string, string> = {
      manifestacao: '✊',
      marcha: '🚶',
      motociata: '🏍️',
      carreata: '🚗',
      caminhoneiros: '🚛',
      tratorada: '🚜',
      assembleia: '🏛️'
    };
    return icons[type] || '📢';
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const createPopupContent = (protest: Protest, totalRSVPs: number) => {
    const flag = protest.country === 'BR' ? '🇧🇷' : 
                 protest.country === 'US' ? '🇺🇸' : 
                 protest.country === 'CA' ? '🇨🇦' : 
                 protest.country === 'FR' ? '🇫🇷' : 
                 protest.country === 'AR' ? '🇦🇷' : '🌍';

    return `
      <div class="p-4 text-center max-w-xs">
        <div class="flex items-center gap-2 mb-3 justify-center">
          <span class="text-2xl">${flag}</span>
          <h3 class="font-bold text-lg text-gray-900 truncate">${protest.title}</h3>
        </div>
        <div class="text-sm text-gray-600 space-y-2 text-left">
          <div class="flex items-center gap-2">
            <span>📍</span>
            <span><strong>Local:</strong> ${protest.city}, ${protest.region}</span>
          </div>
          <div class="flex items-center gap-2">
            <span>📅</span>
            <span><strong>Data:</strong> ${protest.date}</span>
          </div>
          <div class="flex items-center gap-2">
            <span>🕐</span>
            <span><strong>Horário:</strong> ${protest.time}</span>
          </div>
          <div class="flex items-center gap-2">
            <span>👥</span>
            <span><strong>Participantes:</strong> ${totalRSVPs.toLocaleString('pt-BR')}</span>
          </div>
          <div class="flex items-center gap-2">
            <span>📢</span>
            <span><strong>Tipo:</strong> ${protest.type.charAt(0).toUpperCase() + protest.type.slice(1)}</span>
          </div>
          ${protest.country !== 'BR' ? '<div class="text-blue-600 font-medium mt-2">🌍 Evento Internacional</div>' : ''}
        </div>
        <button 
          onclick="window.location.href='/protest/${protest.id}'"
          class="mt-4 w-full px-4 py-2 ${protest.country === 'BR' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-lg text-sm font-medium transition-colors"
        >
          Ver Detalhes Completos
        </button>
      </div>
    `;
  };

  const switchView = (mode: 'brazil' | 'global') => {
    setViewMode(mode);
    if (map.current) {
      if (mode === 'brazil') {
        map.current.flyTo({
          center: [-51.9253, -14.2350],
          zoom: 4,
          duration: 2000
        });
      } else {
        map.current.flyTo({
          center: [0, 20],
          zoom: 2,
          duration: 2000
        });
      }
    }
  };

  const brazilianEvents = allProtests.filter(p => p.country === 'BR');
  const internationalEvents = allProtests.filter(p => p.country !== 'BR');

  if (typeof window === 'undefined') {
    return (
      <div className={`w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Carregando mapa global...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* View Controls */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm text-gray-600">
            <strong>{allProtests.length}</strong> manifestações encontradas
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => switchView('brazil')}
              className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors ${
                viewMode === 'brazil' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              🇧🇷 Brasil ({brazilianEvents.length})
            </button>
            {internationalEvents.length > 0 && (
              <button 
                onClick={() => switchView('global')}
                className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors ${
                  viewMode === 'global' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
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

      {/* Map Container */}
      <div 
        ref={mapContainer} 
        className="w-full h-96 rounded-lg overflow-hidden border border-gray-300 shadow-md"
      />
      
      {!mapLoaded && (
        <div className="absolute inset-0 bg-gray-200 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Carregando mapa global...</p>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute top-4 left-4 bg-white bg-opacity-95 rounded-lg p-3 shadow-md max-w-xs">
        <h4 className="font-semibold text-sm text-gray-900 mb-2">🗺️ Manifestações em Tempo Real</h4>
        <div className="text-xs text-gray-600 space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-600 rounded-full"></div>
            <span>Eventos no Brasil</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            <span>Eventos Internacionais</span>
          </div>
          <div className="border-t pt-1 mt-2">
            <span>Tamanho = Número de participantes</span>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-4 text-sm text-gray-600 text-center">
        <p>🗺️ Clique nos marcadores para ver detalhes • Use os controles para navegar</p>
        {allProtests.length === 0 && (
          <p className="text-gray-500 mt-2">Nenhuma manifestação programada no momento</p>
        )}
      </div>
    </div>
  );
}