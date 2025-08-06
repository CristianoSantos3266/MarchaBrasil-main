'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { CalendarIcon, MapPinIcon, UsersIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { Protest } from '@/types';
import { globalProtests } from '@/data/globalProtests';
import { getCountryByCode, getRegionByCode } from '@/data/countries';
import { getDemoEvents, isDemoMode, getThumbnail } from '@/lib/demo-events';
import { SkeletonCard } from '@/components/ui/LoadingSpinner';
import MutualConnections from '@/components/social/MutualConnections';

interface CompletedProtestsFeedProps {
  onProtestSelect?: (protestId: string) => void;
  countryFilter?: 'BR' | 'INTERNATIONAL' | 'ALL';
  hideTitle?: boolean;
}

function formatDateToBrazilian(date: string): string {
  if (!date) return '';
  if (date.includes('-') && date.length === 10) {
    const parts = date.split('-');
    if (parts.length === 3 && parts[0].length === 4) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
  }
  return date;
}

// Function to get color-coded background for protest type ribbon
const getProtestTypeColor = (type: string) => {
  const colorMap: Record<string, string> = {
    marcha: 'bg-green-600',
    carreata: 'bg-blue-600',
    motociata: 'bg-orange-500',
    tratorada: 'bg-amber-700',
    assembleia: 'bg-gray-600',
    buzinaço: 'bg-red-600',
    manifestacao: 'bg-neutral-600',
    outro: 'bg-neutral-600'
  };
  return colorMap[type] || 'bg-neutral-600';
};

const protestTypeLabels: Record<string, string> = {
  marcha: 'Marcha',
  motociata: 'Motociata',
  carreata: 'Carreata',
  caminhoneiros: 'Caminhoneiros',
  tratorada: 'Tratorada',
  assembleia: 'Assembleia',
  manifestacao: 'Manifestação',
  buzinaço: 'Buzinaço',
  outro: 'Outro'
};

export default function CompletedProtestsFeed({ 
  onProtestSelect, 
  countryFilter = 'ALL',
  hideTitle = false 
}: CompletedProtestsFeedProps) {
  const [completedProtests, setCompletedProtests] = useState<Protest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadCompletedProtests = () => {
    setIsLoading(true);
    
    // Simulate loading delay for better UX
    setTimeout(() => {
      // Combine static protests with demo events
      let allProtests = [...globalProtests];
      if (isDemoMode()) {
        const demoEvents = getDemoEvents();
        allProtests = [...globalProtests, ...demoEvents];
      }

      // Filter and sort protests by date (completed events - past dates)
      const now = new Date();
      let completed = allProtests
        .filter(protest => {
          const protestDate = new Date(`${protest.date} ${protest.time}`);
          const isCompleted = protestDate <= now;
          
          // Apply country filter
          if (countryFilter === 'BR') {
            return isCompleted && protest.country === 'BR';
          } else if (countryFilter === 'INTERNATIONAL') {
            return isCompleted && protest.country !== 'BR';
          }
          return isCompleted; // ALL
        })
        .sort((a, b) => {
          // Sort by most recent first (descending order)
          const dateA = new Date(`${a.date} ${a.time}`);
          const dateB = new Date(`${b.date} ${b.time}`);
          return dateB.getTime() - dateA.getTime();
        })
        .slice(0, 50); // Show top 50 recent completed

      setCompletedProtests(completed);
      setIsLoading(false);
    }, 500);
  };

  useEffect(() => {
    loadCompletedProtests();
  }, [countryFilter]);

  const getParticipantCount = (protest: Protest): number => {
    // Calculate total confirmed attendees from RSVP data
    if (protest.rsvps) {
      return Object.values(protest.rsvps).reduce((sum, count) => sum + count, 0);
    }
    return 0;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {!hideTitle && (
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Eventos Encerrados</h2>
        )}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (completedProtests.length === 0) {
    return (
      <div className="text-center py-12">
        {!hideTitle && (
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Eventos Encerrados</h2>
        )}
        <CheckCircleIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum evento encerrado encontrado</h3>
        <p className="text-gray-600">
          {countryFilter === 'BR' 
            ? 'Não há eventos encerrados no Brasil ainda.' 
            : countryFilter === 'INTERNATIONAL'
            ? 'Não há eventos internacionais encerrados ainda.'
            : 'Não há eventos encerrados ainda.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {!hideTitle && (
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <CheckCircleIcon className="w-6 h-6 text-green-600" />
            Eventos Encerrados ({completedProtests.length})
          </h2>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {completedProtests.map((protest) => {
          const thumbnail = getThumbnail(protest.id);
          const participantCount = getParticipantCount(protest);
          
          return (
            <div
              key={protest.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-200"
              onClick={() => onProtestSelect && onProtestSelect(protest.id)}
            >
              {/* Event Image with Attendance Badge */}
              <div className="relative h-48 bg-gradient-to-r from-gray-400 to-gray-600">
                {thumbnail ? (
                  <Image 
                    src={thumbnail} 
                    alt={protest.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center text-white">
                      <CalendarIcon className="w-12 h-12 mx-auto mb-2 opacity-80" />
                      <p className="text-sm font-medium">{protest.city}</p>
                      <p className="text-xs opacity-75">{protest.state || protest.region}</p>
                    </div>
                  </div>
                )}
                
                {/* Attendance Count Badge */}
                {participantCount > 0 && (
                  <div className="absolute top-3 right-3 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                    <UsersIcon className="w-4 h-4 inline mr-1" />
                    {participantCount.toLocaleString('pt-BR')}
                  </div>
                )}
                
                {/* Completed Badge */}
                <div className="absolute top-3 left-3 bg-gray-800 bg-opacity-80 text-white px-2 py-1 rounded-full text-xs font-medium">
                  <CheckCircleIcon className="w-3 h-3 inline mr-1" />
                  Encerrado
                </div>
                
                {/* Country Flag */}
                <div className="absolute bottom-3 left-3">
                  {protest.country === 'BR' ? (
                    <span className="text-2xl" title="Brasil">🇧🇷</span>
                  ) : (
                    <span className="text-sm bg-blue-600 text-white px-2 py-1 rounded">
                      {getCountryByCode(protest.country)?.name || protest.country}
                    </span>
                  )}
                </div>
                
                {/* Type Ribbon */}
                <div className={`absolute bottom-2 right-2 ${getProtestTypeColor(protest.type)} text-white text-xs font-bold px-2 py-1 rounded bg-opacity-80`}>
                  {protestTypeLabels[protest.type] || protest.type}
                </div>
              </div>

              {/* Event Content */}
              <div className="p-4">
                <div className="mb-3">
                  <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 leading-tight">
                    {protest.title}
                  </h3>
                  
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <CalendarIcon className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{formatDateToBrazilian(protest.date)} às {protest.time}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600 mb-3">
                    <MapPinIcon className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="truncate">{protest.city}, {protest.state || getRegionByCode(protest.region || '')?.name}</span>
                  </div>
                </div>

                {/* Social Proof */}
                <div className="mb-3">
                  <MutualConnections 
                    eventId={protest.id}
                    maxDisplay={3}
                    size="small"
                  />
                </div>

                {/* Event Stats */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-green-600">
                    <UsersIcon className="w-4 h-4 mr-1" />
                    <span className="font-medium">
                      {participantCount > 0 
                        ? `${participantCount.toLocaleString('pt-BR')} confirmaram presença`
                        : 'Sem confirmações'}
                    </span>
                  </div>
                  
                  <div className="text-gray-500 text-xs">
                    {protest.type === 'marcha' && '🚶 Marcha'}
                    {protest.type === 'motociata' && '🏍️ Motociata'}
                    {protest.type === 'carreata' && '🚗 Carreata'}
                    {protest.type === 'buzinaço' && '📢 Buzinaço'}
                    {protest.type === 'assembleia' && '🏛️ Assembleia'}
                    {protest.type === 'manifestacao' && '📢 Manifestação'}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {completedProtests.length >= 50 && (
        <div className="text-center pt-6">
          <p className="text-gray-600 text-sm">
            Mostrando os 50 eventos mais recentes
          </p>
        </div>
      )}
    </div>
  );
}