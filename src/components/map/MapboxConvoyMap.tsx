'use client';

import { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Mapbox access token
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

interface ConvoyRoute {
  startLocation: string;
  destination: string;
  departureTime: string;
  description?: string;
  waypoints?: Array<{
    name: string;
    coordinates: [number, number];
    estimatedTime?: string;
  }>;
  distance?: string;
  duration?: string;
}

interface MapboxConvoyMapProps {
  convoy: ConvoyRoute;
  className?: string;
}

export default function MapboxConvoyMap({ convoy, className = '' }: MapboxConvoyMapProps) {
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
      style: 'mapbox://styles/mapbox/navigation-day-v1', // Navigation-optimized style
      center: [-51.9253, -14.2350], // Default to Brazil center
      zoom: 10,
      attributionControl: false
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Wait for map to load
    map.current.on('load', () => {
      setMapLoaded(true);
      setupRoute();
    });

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [convoy]);

  const setupRoute = async () => {
    if (!map.current) return;

    try {
      // For demo purposes, we'll create a sample route
      // In production, you would geocode the start/end locations and use Mapbox Directions API
      const route = await createDemoRoute();
      
      if (route) {
        addRouteToMap(route);
        addWaypoints(route);
        fitMapToRoute(route);
      }
    } catch (error) {
      console.error('Error setting up route:', error);
      // Fallback to simple markers
      addSimpleMarkers();
    }
  };

  const createDemoRoute = async () => {
    // Demo route data - in production, use Mapbox Directions API
    const startCoords: [number, number] = [-46.6333, -23.5505]; // São Paulo
    const endCoords: [number, number] = [-47.8825, -15.7975]; // Brasília
    
    const route = {
      coordinates: [
        startCoords,
        [-46.8, -23.2], // Waypoint 1
        [-47.2, -22.8], // Waypoint 2
        [-47.5, -20.5], // Waypoint 3
        endCoords
      ],
      waypoints: convoy.waypoints || [
        { name: 'Ponto de Partida', coordinates: startCoords },
        { name: 'Parada 1 - Resto', coordinates: [-46.8, -23.2], estimatedTime: '2h' },
        { name: 'Parada 2 - Almoço', coordinates: [-47.2, -22.8], estimatedTime: '4h' },
        { name: 'Parada 3 - Combustível', coordinates: [-47.5, -20.5], estimatedTime: '6h' },
        { name: 'Destino Final', coordinates: endCoords }
      ]
    };

    return route;
  };

  const addRouteToMap = (route: any) => {
    if (!map.current) return;

    // Add route line
    map.current.addSource('route', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: route.coordinates
        }
      }
    });

    // Style the route line
    map.current.addLayer({
      id: 'route',
      type: 'line',
      source: 'route',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#1f9d55',
        'line-width': 6,
        'line-opacity': 0.8
      }
    });

    // Add route outline for better visibility
    map.current.addLayer({
      id: 'route-outline',
      type: 'line',
      source: 'route',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#ffffff',
        'line-width': 8,
        'line-opacity': 0.5
      }
    }, 'route');
  };

  const addWaypoints = (route: any) => {
    if (!map.current || !route.waypoints) return;

    route.waypoints.forEach((waypoint: any, index: number) => {
      const isStart = index === 0;
      const isEnd = index === route.waypoints.length - 1;
      
      // Create custom marker element
      const markerElement = document.createElement('div');
      markerElement.className = 'waypoint-marker';
      
      if (isStart) {
        markerElement.innerHTML = `
          <div class="w-10 h-10 bg-green-600 rounded-full border-3 border-white shadow-lg flex items-center justify-center">
            <span class="text-white text-lg">🚀</span>
          </div>
        `;
      } else if (isEnd) {
        markerElement.innerHTML = `
          <div class="w-10 h-10 bg-red-600 rounded-full border-3 border-white shadow-lg flex items-center justify-center">
            <span class="text-white text-lg">🏁</span>
          </div>
        `;
      } else {
        markerElement.innerHTML = `
          <div class="w-8 h-8 bg-blue-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
            <span class="text-white text-sm font-bold">${index}</span>
          </div>
        `;
      }

      // Create marker
      const marker = new mapboxgl.Marker(markerElement)
        .setLngLat(waypoint.coordinates)
        .addTo(map.current!);

      // Create popup
      const popup = new mapboxgl.Popup({
        offset: 25,
        className: 'waypoint-popup'
      }).setHTML(`
        <div class="p-3 text-center">
          <h3 class="font-bold text-sm text-gray-900 mb-1">${waypoint.name}</h3>
          ${waypoint.estimatedTime ? `<p class="text-xs text-gray-600">Tempo estimado: ${waypoint.estimatedTime}</p>` : ''}
          ${isStart ? '<p class="text-xs text-green-600 font-medium mt-1">Ponto de Partida</p>' : ''}
          ${isEnd ? '<p class="text-xs text-red-600 font-medium mt-1">Destino Final</p>' : ''}
        </div>
      `);

      marker.setPopup(popup);
    });
  };

  const addSimpleMarkers = () => {
    if (!map.current) return;

    // Fallback simple markers when route API fails
    const startCoords: [number, number] = [-46.6333, -23.5505];
    const endCoords: [number, number] = [-47.8825, -15.7975];

    // Start marker
    const startMarker = new mapboxgl.Marker({ color: '#16a34a' })
      .setLngLat(startCoords)
      .setPopup(new mapboxgl.Popup().setHTML(`
        <div class="p-3 text-center">
          <h3 class="font-bold text-sm">🚀 ${convoy.startLocation}</h3>
          <p class="text-xs text-gray-600">Saída: ${convoy.departureTime}</p>
        </div>
      `))
      .addTo(map.current);

    // End marker
    const endMarker = new mapboxgl.Marker({ color: '#dc2626' })
      .setLngLat(endCoords)
      .setPopup(new mapboxgl.Popup().setHTML(`
        <div class="p-3 text-center">
          <h3 class="font-bold text-sm">🏁 ${convoy.destination}</h3>
          <p class="text-xs text-gray-600">Destino Final</p>
        </div>
      `))
      .addTo(map.current);

    // Fit map to show both markers
    const bounds = new mapboxgl.LngLatBounds();
    bounds.extend(startCoords);
    bounds.extend(endCoords);
    map.current.fitBounds(bounds, { padding: 50 });
  };

  const fitMapToRoute = (route: any) => {
    if (!map.current || !route.coordinates) return;

    const bounds = new mapboxgl.LngLatBounds();
    route.coordinates.forEach((coord: [number, number]) => {
      bounds.extend(coord);
    });

    map.current.fitBounds(bounds, {
      padding: 50,
      duration: 1000
    });
  };

  if (typeof window === 'undefined') {
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
    <div className={`relative ${className}`}>
      <div 
        ref={mapContainer} 
        className="w-full h-64 rounded-lg overflow-hidden border border-gray-300 shadow-md"
      />
      
      {!mapLoaded && (
        <div className="absolute inset-0 bg-gray-200 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Carregando rota da manifestação...</p>
          </div>
        </div>
      )}

      {/* Route Info Panel */}
      <div className="absolute top-4 left-4 bg-white bg-opacity-95 rounded-lg p-3 shadow-md max-w-xs">
        <h4 className="font-semibold text-sm text-gray-900 mb-2">🛣️ Informações da Rota</h4>
        <div className="text-xs text-gray-600 space-y-1">
          <div><strong>Saída:</strong> {convoy.startLocation}</div>
          <div><strong>Destino:</strong> {convoy.destination}</div>
          <div><strong>Horário:</strong> {convoy.departureTime}</div>
          {convoy.distance && <div><strong>Distância:</strong> {convoy.distance}</div>}
          {convoy.duration && <div><strong>Duração:</strong> {convoy.duration}</div>}
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white bg-opacity-95 rounded-lg p-2 shadow-md">
        <div className="text-xs text-gray-600 space-y-1">
          <div class="flex items-center gap-2">
            <span class="text-sm">🚀</span>
            <span>Ponto de Partida</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm">🏁</span>
            <span>Destino</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-3 h-1 bg-green-600 rounded"></div>
            <span>Rota Planejada</span>
          </div>
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