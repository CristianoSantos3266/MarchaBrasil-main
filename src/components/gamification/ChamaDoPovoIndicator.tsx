'use client';

import { useState, useEffect } from 'react';
import { getChamaDoPovoData, updateChamaDoPovoData, ChamaDoPovoData } from '@/lib/gamification';

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
    if (intensity >= 80) return 'from-red-500 to-orange-500';
    if (intensity >= 60) return 'from-orange-500 to-yellow-500';
    if (intensity >= 40) return 'from-yellow-500 to-green-500';
    if (intensity >= 20) return 'from-green-500 to-blue-500';
    return 'from-blue-500 to-gray-400';
  };

  const getIntensityLabel = (intensity: number) => {
    if (intensity >= 80) return 'Incendiando!';
    if (intensity >= 60) return 'Aquecendo';
    if (intensity >= 40) return 'Crescendo';
    if (intensity >= 20) return 'Iniciando';
    return 'Começando';
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
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      {/* Circular Fire Indicator */}
      <div className={`relative ${currentSize.container} flex items-center justify-center`}>
        {/* Background circle */}
        <div className="absolute inset-0 rounded-full bg-gray-200"></div>
        
        {/* Progress ring */}
        <svg 
          className="absolute inset-0 w-full h-full transform -rotate-90" 
          viewBox="0 0 36 36"
        >
          <path
            className="text-gray-200"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            d="M18 2.0845
               a 15.9155 15.9155 0 0 1 0 31.831
               a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            className={`bg-gradient-to-r ${getIntensityColor(chamaData.intensity)} text-transparent bg-clip-text`}
            stroke="url(#fireGradient)"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            strokeDasharray={`${chamaData.intensity}, 100`}
            d="M18 2.0845
               a 15.9155 15.9155 0 0 1 0 31.831
               a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <defs>
            <linearGradient id="fireGradient" gradientUnits="objectBoundingBox">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="50%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#eab308" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Fire emoji in center */}
        <div className={`relative z-10 ${currentSize.fireSize}`}>
          🔥
        </div>
        
        {/* Intensity percentage */}
        <div className={`absolute bottom-1 right-1 bg-white rounded-full px-1 ${currentSize.text} font-bold text-gray-700`}>
          {chamaData.intensity}%
        </div>
      </div>

      {/* Label */}
      <div className={`text-center ${currentSize.labelSize}`}>
        <div className="font-semibold text-gray-900">
          Chama do Povo
        </div>
        <div className="text-gray-600">
          {getIntensityLabel(chamaData.intensity)}
        </div>
      </div>

      {/* Engagement stats (for medium and large sizes) */}
      {size !== 'small' && (
        <div className="flex gap-4 text-xs text-gray-500">
          <span>👁 {chamaData.views}</span>
          <span>📢 {chamaData.shares}</span>
          <span>✋ {chamaData.confirmations}</span>
        </div>
      )}

      {/* Share button (optional) */}
      {onShare && (
        <button
          onClick={handleShare}
          className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors"
        >
          🔥 Avivar Chama
        </button>
      )}
    </div>
  );
}