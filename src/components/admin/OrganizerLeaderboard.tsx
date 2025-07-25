'use client';

import { useState, useEffect } from 'react';
import { getDemoEvents } from '@/lib/demo-events';
import { 
  TrophyIcon,
  StarIcon,
  MapPinIcon,
  UsersIcon,
  CalendarIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

interface OrganizerStats {
  organizerId: string;
  organizerName: string;
  organizerEmail: string;
  totalEvents: number;
  totalParticipants: number;
  citiesReached: number;
  avgEventSize: number;
  rank: number;
  score: number;
}

interface OrganizerLeaderboardProps {
  className?: string;
  showTop?: number;
  timeframe?: 'week' | 'month' | 'quarter' | 'year' | 'all';
}

export default function OrganizerLeaderboard({ 
  className = '',
  showTop = 10,
  timeframe = 'month'
}: OrganizerLeaderboardProps) {
  const [organizers, setOrganizers] = useState<OrganizerStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    calculateOrganizerStats();
  }, [timeframe]);

  const calculateOrganizerStats = () => {
    setLoading(true);
    
    // Get all demo events
    const allEvents = getDemoEvents();
    
    // Filter by timeframe
    const cutoffDate = getTimeframeCutoff(timeframe);
    const filteredEvents = allEvents.filter(event => 
      new Date(event.createdAt || event.date) >= cutoffDate
    );

    // Group by organizer (using mock organizer data)
    const organizerMap = new Map<string, {
      name: string;
      email: string;
      events: any[];
      totalParticipants: number;
      cities: Set<string>;
    }>();

    // Mock organizer assignments for demo events
    const mockOrganizers = [
      { id: 'org1', name: 'João Silva', email: 'joao.silva@email.com' },
      { id: 'org2', name: 'Maria Santos', email: 'maria.santos@email.com' },
      { id: 'org3', name: 'Carlos Oliveira', email: 'carlos.oliveira@email.com' },
      { id: 'org4', name: 'Ana Costa', email: 'ana.costa@email.com' },
      { id: 'org5', name: 'Pedro Almeida', email: 'pedro.almeida@email.com' }
    ];

    filteredEvents.forEach((event, index) => {
      // Assign mock organizer based on event index
      const organizer = mockOrganizers[index % mockOrganizers.length];
      const organizerId = organizer.id;

      if (!organizerMap.has(organizerId)) {
        organizerMap.set(organizerId, {
          name: organizer.name,
          email: organizer.email,
          events: [],
          totalParticipants: 0,
          cities: new Set()
        });
      }

      const orgData = organizerMap.get(organizerId)!;
      orgData.events.push(event);
      
      // Calculate total participants for this event
      const eventParticipants = Object.values(event.rsvps || {}).reduce((sum: number, count: any) => sum + (count || 0), 0);
      orgData.totalParticipants += eventParticipants;
      orgData.cities.add(event.city);
    });

    // Convert to stats array and calculate scores
    const organizerStats: OrganizerStats[] = Array.from(organizerMap.entries()).map(([id, data]) => {
      const avgEventSize = data.events.length > 0 ? Math.round(data.totalParticipants / data.events.length) : 0;
      
      // Scoring algorithm (weighted)
      const eventWeight = 10;
      const participantWeight = 1;
      const cityWeight = 25;
      const sizeWeight = 2;
      
      const score = 
        (data.events.length * eventWeight) +
        (data.totalParticipants * participantWeight) +
        (data.cities.size * cityWeight) +
        (avgEventSize * sizeWeight);

      return {
        organizerId: id,
        organizerName: data.name,
        organizerEmail: data.email,
        totalEvents: data.events.length,
        totalParticipants: data.totalParticipants,
        citiesReached: data.cities.size,
        avgEventSize,
        rank: 0, // Will be set after sorting
        score
      };
    });

    // Sort by score and assign ranks
    organizerStats.sort((a, b) => b.score - a.score);
    organizerStats.forEach((org, index) => {
      org.rank = index + 1;
    });

    setOrganizers(organizerStats.slice(0, showTop));
    setLoading(false);
  };

  const getTimeframeCutoff = (timeframe: string): Date => {
    const now = new Date();
    switch (timeframe) {
      case 'week':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case 'month':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      case 'quarter':
        return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      case 'year':
        return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      default:
        return new Date(0); // All time
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <span className="text-2xl">🥇</span>;
      case 2:
        return <span className="text-2xl">🥈</span>;
      case 3:
        return <span className="text-2xl">🥉</span>;
      default:
        return <span className="text-lg font-bold text-gray-600">#{rank}</span>;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'from-yellow-100 to-yellow-200 border-yellow-300';
      case 2:
        return 'from-gray-100 to-gray-200 border-gray-300';
      case 3:
        return 'from-orange-100 to-orange-200 border-orange-300';
      default:
        return 'from-blue-50 to-blue-100 border-blue-200';
    }
  };

  const timeframeLabels = {
    week: 'Última Semana',
    month: 'Último Mês',
    quarter: 'Último Trimestre',
    year: 'Último Ano',
    all: 'Todo Período'
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-md border border-gray-200 p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-md border border-gray-200 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <TrophyIcon className="h-6 w-6 text-yellow-600" />
          Top Organizadores
        </h3>
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value as any)}
          className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {Object.entries(timeframeLabels).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      {/* Leaderboard */}
      {organizers.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <TrophyIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p>Nenhum organizador encontrado neste período</p>
        </div>
      ) : (
        <div className="space-y-3">
          {organizers.map((organizer) => (
            <div
              key={organizer.organizerId}
              className={`
                p-4 rounded-lg border-2 bg-gradient-to-r transition-all duration-200 hover:shadow-md
                ${getRankColor(organizer.rank)}
              `}
            >
              <div className="flex items-center gap-4">
                {/* Rank */}
                <div className="flex-shrink-0 w-12 text-center">
                  {getRankIcon(organizer.rank)}
                </div>

                {/* Organizer Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900 truncate">
                      {organizer.organizerName}
                    </h4>
                    {organizer.rank <= 3 && (
                      <StarIcon className="h-4 w-4 text-yellow-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {organizer.organizerEmail}
                  </p>
                </div>

                {/* Stats */}
                <div className="flex gap-6 text-sm">
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-blue-600">
                      <CalendarIcon className="h-4 w-4" />
                      <span className="font-bold">{organizer.totalEvents}</span>
                    </div>
                    <div className="text-xs text-gray-600">Eventos</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-green-600">
                      <UsersIcon className="h-4 w-4" />
                      <span className="font-bold">{organizer.totalParticipants.toLocaleString('pt-BR')}</span>
                    </div>
                    <div className="text-xs text-gray-600">Participantes</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-purple-600">
                      <MapPinIcon className="h-4 w-4" />
                      <span className="font-bold">{organizer.citiesReached}</span>
                    </div>
                    <div className="text-xs text-gray-600">Cidades</div>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center gap-1 text-orange-600">
                      <ChartBarIcon className="h-4 w-4" />
                      <span className="font-bold">{organizer.avgEventSize}</span>
                    </div>
                    <div className="text-xs text-gray-600">Média</div>
                  </div>
                </div>

                {/* Score */}
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">
                    {organizer.score.toLocaleString('pt-BR')}
                  </div>
                  <div className="text-xs text-gray-600">Pontos</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-200 text-center">
        <p className="text-xs text-gray-500">
          🏆 Rankings baseados em eventos criados, participantes mobilizados e alcance geográfico
        </p>
      </div>
    </div>
  );
}