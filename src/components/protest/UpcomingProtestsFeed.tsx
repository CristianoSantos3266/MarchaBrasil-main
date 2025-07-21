'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { CalendarIcon, MapPinIcon, UsersIcon, ClockIcon } from '@heroicons/react/24/outline';
import { Protest } from '@/types';
import { globalProtests } from '@/data/globalProtests';
import { getCountryByCode, getRegionByCode } from '@/data/countries';
import { getDemoEvents, isDemoMode, onDemoEventsUpdate } from '@/lib/demo-events';

interface UpcomingProtestsFeedProps {
  onProtestSelect?: (protestId: string) => void;
  countryFilter?: 'BR' | 'INTERNATIONAL' | 'ALL';
  hideTitle?: boolean;
}

export default function UpcomingProtestsFeed({ 
  onProtestSelect, 
  countryFilter = 'ALL',
  hideTitle = false 
}: UpcomingProtestsFeedProps) {
  const [upcomingProtests, setUpcomingProtests] = useState<Protest[]>([]);

  const loadUpcomingProtests = () => {
    // Combine static protests with demo events
    let allProtests = [...globalProtests];
    if (isDemoMode()) {
      const demoEvents = getDemoEvents();
      allProtests = [...globalProtests, ...demoEvents];
    }

    // Filter and sort protests by date (upcoming first)
    const now = new Date();
    let upcoming = allProtests
      .filter(protest => {
        const protestDate = new Date(`${protest.date} ${protest.time}`);
        const isUpcoming = protestDate > now;
        
        // Apply country filter
        if (countryFilter === 'BR') {
          return isUpcoming && protest.country === 'BR';
        } else if (countryFilter === 'INTERNATIONAL') {
          return isUpcoming && protest.country !== 'BR';
        }
        return isUpcoming; // ALL
      })
      .sort((a, b) => {
        const dateA = new Date(`${a.date} ${a.time}`);
        const dateB = new Date(`${b.date} ${b.time}`);
        return dateA.getTime() - dateB.getTime();
      })
      .slice(0, 50); // Show top 50 upcoming

    setUpcomingProtests(upcoming);
  };

  useEffect(() => {
    // Load initial protests
    loadUpcomingProtests();

    // Listen for demo events updates
    let cleanup: (() => void) | undefined;
    if (isDemoMode()) {
      cleanup = onDemoEventsUpdate(loadUpcomingProtests);
    }

    return cleanup;
  }, [countryFilter]);

  const formatDate = (date: string, time: string) => {
    const protestDate = new Date(`${date} ${time}`);
    const now = new Date();
    const diffTime = protestDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hoje';
    if (diffDays === 1) return 'Amanhã';
    if (diffDays < 7) return `Em ${diffDays} dias`;
    return protestDate.toLocaleDateString('pt-BR', { 
      day: 'numeric', 
      month: 'short',
      year: protestDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const getTotalParticipants = (rsvps: Record<string, number>) => {
    return Object.values(rsvps).reduce((sum, count) => sum + count, 0);
  };

  const getProtestThumbnail = (protestId: string) => {
    // Generate deterministic placeholder based on protest ID
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500', 'bg-yellow-500', 'bg-indigo-500'];
    const icons = ['🇧🇷', '✊', '📢', '🏛️', '⚖️', '🕊️'];
    
    const colorIndex = protestId.charCodeAt(0) % colors.length;
    const iconIndex = protestId.charCodeAt(1) % icons.length;
    
    return {
      color: colors[colorIndex],
      icon: icons[iconIndex]
    };
  };

  if (upcomingProtests.length === 0) {
    return (
      <div className={hideTitle ? "" : "bg-white rounded-lg shadow-md p-6"}>
        {!hideTitle && (
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <CalendarIcon className="h-6 w-6 text-blue-600" />
            Próximas Manifestações
          </h2>
        )}
        <div className="text-center py-8 text-gray-500">
          <CalendarIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p>
            {countryFilter === 'BR' 
              ? 'Nenhuma manifestação nacional agendada'
              : countryFilter === 'INTERNATIONAL'
              ? 'Nenhuma manifestação internacional agendada'
              : 'Nenhuma manifestação agendada no momento'
            }
          </p>
          <p className="text-sm mt-1">Seja o primeiro a organizar um evento!</p>
        </div>
      </div>
    );
  }

  return (
    <div className={hideTitle ? "" : "bg-white rounded-lg shadow-md p-6"}>
      {!hideTitle && (
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <CalendarIcon className="h-6 w-6 text-blue-600" />
            Próximas Manifestações
          </h2>
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {upcomingProtests.length} eventos
          </span>
        </div>
      )}

      {/* Horizontal scrolling container */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 w-max">
          {upcomingProtests.map((protest) => {
            const country = getCountryByCode(protest.country);
            const region = getRegionByCode(protest.country, protest.region);
            const thumbnail = getProtestThumbnail(protest.id);
            const totalParticipants = getTotalParticipants(protest.rsvps);

            return (
              <div
                key={protest.id}
                className="flex-shrink-0 w-80 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105"
                onClick={() => onProtestSelect?.(protest.id)}
              >
                {/* Thumbnail */}
                <div className="rounded-lg h-32 mb-4 relative overflow-hidden">
                  {protest.thumbnail ? (
                    <img 
                      src={protest.thumbnail} 
                      alt={protest.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className={`${thumbnail.color} w-full h-full flex items-center justify-center text-white`}>
                      <div className="text-center">
                        <div className="text-4xl mb-2">{thumbnail.icon}</div>
                        <div className="text-xs font-medium opacity-90">
                          {formatDate(protest.date, protest.time)}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Dark overlay for text readability */}
                  <div className="absolute inset-0 bg-black/20"></div>
                  
                  {/* Corner badge for urgency */}
                  <div className="absolute top-2 right-2 z-10">
                    {formatDate(protest.date, protest.time) === 'Hoje' && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse">
                        HOJE
                      </span>
                    )}
                    {formatDate(protest.date, protest.time) === 'Amanhã' && (
                      <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                        AMANHÃ
                      </span>
                    )}
                  </div>
                  
                  {/* Date overlay for custom thumbnails */}
                  {protest.thumbnail && (
                    <div className="absolute bottom-2 left-2 z-10">
                      <span className="bg-black/60 text-white text-xs px-2 py-1 rounded-full font-medium">
                        {formatDate(protest.date, protest.time)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <h3 className="font-bold text-gray-900 text-lg leading-tight line-clamp-2">
                    {protest.title}
                  </h3>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPinIcon className="h-4 w-4 text-green-600" />
                      <span className="truncate">
                        {protest.city}, {region?.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <ClockIcon className="h-4 w-4 text-blue-600" />
                      <span>{protest.time}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <UsersIcon className="h-4 w-4 text-purple-600" />
                      <span>
                        {totalParticipants.toLocaleString()} participantes confirmados
                      </span>
                    </div>
                  </div>

                  {/* Action button */}
                  <button className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    Ver Detalhes
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="flex justify-center mt-4">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>←</span>
          <span>Deslize para ver mais</span>
          <span>→</span>
        </div>
      </div>
    </div>
  );
}