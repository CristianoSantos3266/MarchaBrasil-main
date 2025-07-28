'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamic imports for both map types
const MapboxConvoyMap = dynamic(() => import('./MapboxConvoyMap'), { ssr: false });
const SimpleConvoyMap = dynamic(() => import('./SimpleConvoyMap'), { ssr: false });

interface ConvoyRoute {
  startLocation: string;
  destination: string;
  departureTime: string;
  description?: string;
}

interface SmartConvoyMapProps {
  convoy: ConvoyRoute;
  className?: string;
}

export default function SmartConvoyMap({ convoy, className = '' }: SmartConvoyMapProps) {
  const [hasToken, setHasToken] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check for Mapbox token at runtime
    const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    const isValidToken = token && token !== 'your_mapbox_access_token_here' && token.startsWith('pk.');
    setHasToken(!!isValidToken);
    setIsLoaded(true);
  }, []);

  if (!isLoaded) {
    return (
      <div className={`w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Carregando rota...</p>
        </div>
      </div>
    );
  }

  if (hasToken) {
    return (
      <MapboxConvoyMap convoy={convoy} className={className} />
    );
  }

  return <SimpleConvoyMap convoy={convoy} className={className} />;
}