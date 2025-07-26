'use client';

import { useState, useEffect } from 'react';
import { getChamaDoPovoData, updateChamaDoPovoData, simulateHighEngagement, ChamaDoPovoData } from '@/lib/gamification';

interface ChamaDoPovoIndicatorProps {
  eventId: string;
  onShare?: () => void;
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

export default function ChamaDoPovoIndicator({ 
  eventId, 
  onShare, 
  className = '',
  size = 'medium'
}: ChamaDoPovoIndicatorProps) {
  const [chamaData, setChamaData] = useState<ChamaDoPovoData>({
    eventId,
    shares: 0,
    views: 0,
    confirmations: 0,
    intensity: 0,
    lastUpdated: new Date().toISOString()
  });

  useEffect(() => {
    // Load initial data
    const data = getChamaDoPovoData(eventId);
    setChamaData(data);

    // Track view when component mounts
    const updatedData = updateChamaDoPovoData(eventId, 'view');
    setChamaData(updatedData);
  }, [eventId]);

  const handleShare = () => {
    const updatedData = updateChamaDoPovoData(eventId, 'share');
    setChamaData(updatedData);
    if (onShare) {
      onShare();
    }
  };

  const getIntensityColor = (intensity: number) => {
    if (intensity >= 80) return '#dc2626'; // Red - Incendiando!
    if (intensity >= 60) return '#ea580c'; // Orange - Aquecendo
    if (intensity >= 40) return '#ca8a04'; // Yellow - Crescendo
    if (intensity >= 20) return '#16a34a'; // Green - Iniciando
    return '#6b7280'; // Gray - Começando
  };

  const getIntensityLabel = (intensity: number) => {
    if (intensity >= 80) return 'Viral! 🔥';
    if (intensity >= 60) return 'Alta Energia ⚡';
    if (intensity >= 40) return 'Crescendo 📈';
    if (intensity >= 20) return 'Ganhando Força 💪';
    return 'Começando 🌱';
  };

  const sizeClasses = {
    small: {
      container: 'w-16 h-16',
      text: 'text-xs',
      fireSize: 'text-lg',
      labelSize: 'text-xs'
    },
    medium: {
      container: 'w-20 h-20',
      text: 'text-sm',
      fireSize: 'text-xl',
      labelSize: 'text-sm'
    },
    large: {
      container: 'w-24 h-24',
      text: 'text-base',
      fireSize: 'text-2xl',
      labelSize: 'text-base'
    }
  };

  const currentSize = sizeClasses[size];

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`} style={{ background: 'none !important' }}>
      {/* Circular Fire Indicator */}
      <div 
        className={`relative ${currentSize.container} flex items-center justify-center`} 
        style={{ 
          background: 'none !important', 
          backgroundColor: 'transparent !important',
          boxShadow: 'none !important',
          border: 'none !important',
          backgroundImage: 'none !important',
          backgroundClip: 'initial !important'
        }}
      >
        {/* Progress ring */}
        <svg 
          className="absolute inset-0 w-full h-full transform -rotate-90" 
          viewBox="0 0 36 36"
          style={{ 
            background: 'none !important', 
            backgroundColor: 'transparent !important'
          }}
        >
          {/* Progress ring only - no background */}
          <path
            stroke={getIntensityColor(chamaData.intensity)}
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            strokeDasharray={`${chamaData.intensity}, 100`}
            d="M18 2.0845
               a 15.9155 15.9155 0 0 1 0 31.831
               a 15.9155 15.9155 0 0 1 0 -31.831"
            className="transition-all duration-500 ease-in-out"
            style={{
              filter: chamaData.intensity > 0 ? 'drop-shadow(0 0 6px currentColor)' : 'none'
            }}
          />
        </svg>
        
        {/* Activity icon in center */}
        <div className={`relative z-10 ${currentSize.fireSize} flex items-center justify-center`} style={{ background: 'none' }}>
          <svg 
            className={`${size === 'small' ? 'w-5 h-5' : size === 'medium' ? 'w-6 h-6' : 'w-7 h-7'}`} 
            fill="currentColor" 
            viewBox="0 0 20 20"
            style={{ color: getIntensityColor(chamaData.intensity), background: 'none' }}
          >
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
          </svg>
        </div>
        
        {/* Intensity percentage */}
        <div className={`absolute -bottom-1 -right-1 px-1.5 py-0.5 ${currentSize.text} font-bold`}
             style={{ color: getIntensityColor(chamaData.intensity), background: 'none', backgroundColor: 'transparent', boxShadow: 'none' }}>
          {chamaData.intensity}%
        </div>
      </div>

      {/* Label */}
      <div className={`text-center ${currentSize.labelSize}`}>
        <div className="font-semibold text-gray-900">
          Engajamento
        </div>
        <div className="text-gray-600 font-medium">
          {getIntensityLabel(chamaData.intensity)}
        </div>
        {size === 'large' && (
          <div className="text-xs text-gray-500 mt-1 max-w-36 leading-tight">
            Baseado em visualizações, compartilhamentos e confirmações
          </div>
        )}
      </div>

      {/* Engagement stats (for medium and large sizes) */}
      {size !== 'small' && (
        <div className="flex gap-6 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
            </svg>
            {chamaData.views}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"/>
            </svg>
            {chamaData.shares}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
            </svg>
            {chamaData.confirmations}
          </span>
        </div>
      )}

      {/* Demo buttons for testing - only in development and when specifically needed */}
      {process.env.NODE_ENV === 'development' && window.location.search.includes('debug=true') && (
        <div className="flex flex-wrap gap-2 text-xs">
          <button
            onClick={() => {
              const demoData = simulateHighEngagement(eventId, 1000000);
              setChamaData(demoData);
            }}
            className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-2 py-1 rounded-full hover:from-red-600 hover:to-orange-600 transition-colors font-bold shadow-lg"
          >
            🔥 1M
          </button>
          <button
            onClick={() => {
              const demoData = simulateHighEngagement(eventId, 100);
              setChamaData(demoData);
            }}
            className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full hover:bg-orange-200 transition-colors font-medium"
          >
            100
          </button>
          <button
            onClick={() => {
              const testData = {
                eventId,
                confirmations: 0,
                shares: 0,
                views: 0,
                intensity: 0,
                lastUpdated: new Date().toISOString()
              };
              setChamaData(testData);
            }}
            className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full hover:bg-gray-200 transition-colors font-medium"
          >
            Reset
          </button>
        </div>
      )}

      {/* Share button (optional) */}
      {onShare && (
        <button
          onClick={handleShare}
          className="text-xs bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full hover:bg-blue-200 transition-colors flex items-center gap-1 font-medium"
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"/>
          </svg>
          Compartilhar
        </button>
      )}
    </div>
  );
}