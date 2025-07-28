'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamic imports for both map types
const MapboxGlobalMap = dynamic(() => import('./MapboxGlobalMap'), { ssr: false });
const SimpleMapboxGlobal = dynamic(() => import('./SimpleMapboxGlobal'), { ssr: false });

interface SmartMapboxGlobalProps {
  selectedCountry?: string;
  onProtestSelect?: (protest: any) => void;
}

export default function SmartMapboxGlobal({ selectedCountry, onProtestSelect }: SmartMapboxGlobalProps) {
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
      <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center animate-pulse">
        <div className="text-center">
          <div className="w-8 h-8 bg-blue-600 rounded-full mx-auto mb-2 animate-bounce"></div>
          <p className="text-gray-600">Carregando mapa...</p>
        </div>
      </div>
    );
  }

  if (hasToken) {
    return (
      <MapboxGlobalMap
        selectedCountry={selectedCountry}
        onProtestSelect={onProtestSelect}
      />
    );
  }

  return <SimpleMapboxGlobal />;
}