'use client';

import { useState, useEffect } from 'react';
import { getDemoEvents, isDemoMode } from '@/lib/demo-events';

export interface PlatformStats {
  totalEvents: number;
  confirmedParticipants: number;
  totalVideos: number;
  verifiedOrganizers: number;
  totalDonations: number;
  activeStates: number;
}

export function usePlatformStats(): PlatformStats {
  const [stats, setStats] = useState<PlatformStats>({
    totalEvents: 0,
    confirmedParticipants: 0,
    totalVideos: 0,
    verifiedOrganizers: 0,
    totalDonations: 0,
    activeStates: 0
  });

  useEffect(() => {
    const fetchStats = () => {
      if (isDemoMode()) {
        // Em modo demo, contar eventos do localStorage
        const demoEvents = getDemoEvents();
        
        // Contar RSVPs tradicionais + confirmed_participants do crescimento automático
        const traditionalRSVPs = demoEvents.reduce((sum, event) => {
          if (event.rsvps) {
            return sum + Object.values(event.rsvps).reduce((total, count) => total + count, 0);
          }
          return sum;
        }, 0);
        
        const confirmedParticipants = demoEvents.reduce((sum, event) => sum + (event.confirmed_participants || 0), 0);
        
        // Estados únicos dos eventos demo
        const uniqueStates = new Set(demoEvents.map(event => event.region).filter(Boolean));
        
        setStats({
          totalEvents: demoEvents.length,
          confirmedParticipants: traditionalRSVPs + confirmedParticipants,
          totalVideos: 0, // Sem vídeos no demo
          verifiedOrganizers: 1, // Organizador demo
          totalDonations: 0, // Sem doações no demo
          activeStates: uniqueStates.size
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
          activeStates: 0
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