'use client';

import dynamic from 'next/dynamic';
import { ConvoyInfo } from '@/types';

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });
const Polyline = dynamic(() => import('react-leaflet').then(mod => mod.Polyline), { ssr: false });

interface ConvoyRouteMapProps {
  convoy: ConvoyInfo;
  className?: string;
}

export default function ConvoyRouteMap({ convoy, className = "w-full h-64" }: ConvoyRouteMapProps) {
  if (typeof window === 'undefined') {
    return (
      <div className={`${className} bg-gray-200 rounded-lg flex items-center justify-center`}>
        <p className="text-gray-600">Carregando mapa da rota...</p>
      </div>
    );
  }

  const routePoints = convoy.route 
    ? [convoy.startCoordinates, ...convoy.route.map(point => point.coordinates), convoy.destinationCoordinates]
    : [convoy.startCoordinates, convoy.destinationCoordinates];

  const centerPoint: [number, number] = [
    (convoy.startCoordinates[1] + convoy.destinationCoordinates[1]) / 2,
    (convoy.startCoordinates[0] + convoy.destinationCoordinates[0]) / 2
  ];

  return (
    <div className={`${className} rounded-lg overflow-hidden border border-gray-300`}>
      <MapContainer
        center={centerPoint}
        zoom={10}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Start point marker */}
        <Marker position={convoy.startCoordinates}>
          <Popup>
            <div className="text-center">
              <h4 className="font-bold text-green-600">🚀 Ponto de Partida</h4>
              <p className="text-sm">{convoy.startLocation}</p>
              <p className="text-xs text-gray-600">Saída: {convoy.departureTime}</p>
            </div>
          </Popup>
        </Marker>

        {/* Destination marker */}
        <Marker position={convoy.destinationCoordinates}>
          <Popup>
            <div className="text-center">
              <h4 className="font-bold text-red-600">🎯 Destino</h4>
              <p className="text-sm">{convoy.destination}</p>
            </div>
          </Popup>
        </Marker>

        {/* Route points markers */}
        {convoy.route?.map((point, index) => (
          <Marker key={index} position={point.coordinates}>
            <Popup>
              <div className="text-center">
                <h4 className="font-bold text-blue-600">📍 {point.name}</h4>
                {point.estimatedTime && (
                  <p className="text-xs text-gray-600">Previsão: {point.estimatedTime}</p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Route line */}
        <Polyline 
          positions={routePoints}
          color="#3B82F6"
          weight={4}
          opacity={0.8}
        />
      </MapContainer>
    </div>
  );
}