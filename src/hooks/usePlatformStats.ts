'use client';

import { useState, useEffect } from 'react';
import { getDemoEvents, isDemoMode } from '@/lib/demo-events';

export interface PlatformStats {
  totalEvents: number;
  confirmedParticipants: number;
  totalVideos: number;
  verifiedOrganizers: number;
  totalDonations: number;
  activeCities: number;
}

export function usePlatformStats(): PlatformStats {
  const [stats, setStats] = useState<PlatformStats>({
    totalEvents: 0,
    confirmedParticipants: 0,
    totalVideos: 0,
    verifiedOrganizers: 0,
    totalDonations: 0,
    activeCities: 0
  });

  useEffect(() => {
    const fetchStats = () => {
      if (isDemoMode()) {
        // Em modo demo, contar eventos do localStorage + baseline
        const demoEvents = getDemoEvents();
        
        // Baseline real numbers
        const BASELINE_EVENTS = 63;
        const BASELINE_PARTICIPANTS = 254000;
        const BASELINE_CITIES = 39;
        
        // Contar RSVPs tradicionais + confirmed_participants do crescimento automático
        const traditionalRSVPs = demoEvents.reduce((sum, event) => {
          if (event.rsvps) {
            return sum + Object.values(event.rsvps).reduce((total, count) => total + count, 0);
          }
          return sum;
        }, 0);
        
        const confirmedParticipants = demoEvents.reduce((sum, event) => sum + (event.confirmed_participants || 0), 0);
        
        // Cidades únicas dos eventos demo
        const uniqueCities = new Set(demoEvents.map(event => event.city).filter(Boolean));
        
        // Calcular totais: baseline + demo events
        const totalEvents = BASELINE_EVENTS + demoEvents.length;
        const totalParticipants = BASELINE_PARTICIPANTS + traditionalRSVPs + confirmedParticipants;
        
        // Para cidades, usar o maior valor entre baseline e cidades únicas dos eventos
        // Isso evita que o número de cidades seja menor que o número de eventos
        const totalCities = Math.max(BASELINE_CITIES, uniqueCities.size, Math.min(totalEvents, 50)); // Cap at 50 cities max
        
        setStats({
          totalEvents: totalEvents,
          confirmedParticipants: totalParticipants,
          totalVideos: 0, // Sem vídeos no demo
          verifiedOrganizers: Math.max(1, Math.floor(totalEvents / 3)), // ~1 organizer per 3 events
          totalDonations: 0, // Sem doações no demo
          activeCities: totalCities
        });
      } else {
        // Em produção, isso seria uma chamada à API real
        // TODO: Implementar quando tiver Supabase configurado
        setStats({
          totalEvents: 0,
          confirmedParticipants: 0,
          totalVideos: 0,
          verifiedOrganizers: 0,
          totalDonations: 0,
          activeCities: 0
        });
      }
    };

    fetchStats();
    
    // Atualizar stats a cada 30 segundos
    const interval = setInterval(fetchStats, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return stats;
}