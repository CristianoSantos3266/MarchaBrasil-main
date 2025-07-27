'use client';

import { useState, useEffect } from 'react';
import { 
  ExclamationTriangleIcon, 
  CloudIcon, 
  MapPinIcon, 
  ClockIcon,
  MegaphoneIcon,
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

export interface LiveUpdate {
  id: string;
  type: 'weather' | 'delay' | 'route_change' | 'announcement' | 'safety' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
  location?: string;
  organizer?: string;
  weather_data?: {
    temperature: number;
    condition: string;
    wind_speed: number;
    precipitation: number;
  };
}

interface LiveEventUpdatesProps {
  protestId: string;
  className?: string;
}

export default function LiveEventUpdates({ protestId, className = '' }: LiveEventUpdatesProps) {
  const [updates, setUpdates] = useState<LiveUpdate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Demo data - in real app would come from WebSocket/SSE
  const demoUpdates: LiveUpdate[] = [
    {
      id: '1',
      type: 'weather',
      title: 'Condições Climáticas Atualizadas',
      message: 'Tempo parcialmente nublado, temperatura agradável para a manifestação. Sem previsão de chuva.',
      timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 min ago
      severity: 'low',
      weather_data: {
        temperature: 24,
        condition: 'Parcialmente nublado',
        wind_speed: 12,
        precipitation: 0
      }
    },
    {
      id: '2',
      type: 'announcement',
      title: 'Concentração Iniciada',
      message: 'Manifestantes começaram a se concentrar na Praça da Sé. Ambiente pacífico e ordeiro.',
      timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 min ago
      severity: 'medium',
      location: 'Praça da Sé, São Paulo',
      organizer: 'Coordenação SP'
    },
    {
      id: '3',
      type: 'safety',
      title: 'Orientações de Segurança',
      message: 'Mantenham-se hidratados e sigam as orientações dos coordenadores. Manifestação 100% pacífica.',
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 min ago
      severity: 'medium',
      organizer: 'Equipe de Segurança'
    }
  ];

  useEffect(() => {
    // Simulate loading demo data
    const timer = setTimeout(() => {
      setUpdates(demoUpdates);
      setIsLoading(false);
    }, 1000);

    // Simulate real-time updates every 30 seconds
    const updateInterval = setInterval(() => {
      setLastUpdate(new Date());
      // In real app, this would trigger a fetch for new updates
    }, 30000);

    return () => {
      clearTimeout(timer);
      clearInterval(updateInterval);
    };
  }, [protestId]);

  const getUpdateIcon = (type: LiveUpdate['type']) => {
    switch (type) {
      case 'weather':
        return <CloudIcon className="h-5 w-5" />;
      case 'delay':
        return <ClockIcon className="h-5 w-5" />;
      case 'route_change':
        return <MapPinIcon className="h-5 w-5" />;
      case 'announcement':
        return <MegaphoneIcon className="h-5 w-5" />;
      case 'safety':
        return <ExclamationTriangleIcon className="h-5 w-5" />;
      default:
        return <InformationCircleIcon className="h-5 w-5" />;
    }
  };

  const getSeverityStyles = (severity: LiveUpdate['severity']) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'high':
        return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'medium':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-green-50 border-green-200 text-green-800';
    }
  };

  const getTypeLabel = (type: LiveUpdate['type']) => {
    const labels = {
      weather: 'Clima',
      delay: 'Atraso',
      route_change: 'Rota',
      announcement: 'Anúncio',
      safety: 'Segurança',
      info: 'Informação'
    };
    return labels[type];
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Agora mesmo';
    if (diffMinutes < 60) return `${diffMinutes}min atrás`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h atrás`;
    return timestamp.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg shadow-md border border-gray-200 p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 bg-gray-300 rounded"></div>
            <div className="h-6 bg-gray-300 rounded w-48"></div>
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-300 rounded w-full"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-md border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
            </div>
            <h3 className="text-lg font-bold">Atualizações em Tempo Real</h3>
          </div>
          <div className="text-sm text-blue-100">
            Última atualização: {formatTimestamp(lastUpdate)}
          </div>
        </div>
      </div>

      {/* Updates List */}
      <div className="p-4">
        {updates.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <InformationCircleIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>Nenhuma atualização no momento</p>
            <p className="text-sm">Acompanhe aqui as informações em tempo real do evento</p>
          </div>
        ) : (
          <div className="space-y-4">
            {updates.map((update) => (
              <div
                key={update.id}
                className={`p-4 rounded-lg border-l-4 ${getSeverityStyles(update.severity)}`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-current">
                    {getUpdateIcon(update.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-current/10">
                        {getTypeLabel(update.type)}
                      </span>
                      <span className="text-xs text-current/70">
                        {formatTimestamp(update.timestamp)}
                      </span>
                    </div>
                    
                    <h4 className="font-semibold text-current mb-1">
                      {update.title}
                    </h4>
                    
                    <p className="text-current/80 text-sm leading-relaxed">
                      {update.message}
                    </p>

                    {/* Weather Data */}
                    {update.weather_data && (
                      <div className="mt-3 p-3 bg-white/50 rounded-lg">
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <span className="font-medium">Temperatura:</span> {update.weather_data.temperature}°C
                          </div>
                          <div>
                            <span className="font-medium">Vento:</span> {update.weather_data.wind_speed} km/h
                          </div>
                          <div>
                            <span className="font-medium">Condição:</span> {update.weather_data.condition}
                          </div>
                          <div>
                            <span className="font-medium">Chuva:</span> {update.weather_data.precipitation}%
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Location and Organizer */}
                    <div className="mt-2 flex flex-wrap gap-4 text-xs text-current/60">
                      {update.location && (
                        <div className="flex items-center gap-1">
                          <MapPinIcon className="h-3 w-3" />
                          <span>{update.location}</span>
                        </div>
                      )}
                      {update.organizer && (
                        <div className="flex items-center gap-1">
                          <span>Por: {update.organizer}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Auto-refresh indicator */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Atualizações automáticas ativas</span>
          </div>
        </div>
      </div>
    </div>
  );
}