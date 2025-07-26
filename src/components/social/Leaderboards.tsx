'use client';

import { useState, useEffect } from 'react';
import { getDemoEvents } from '@/lib/demo-events';
import { TrophyIcon, FireIcon, MapPinIcon, UsersIcon } from '@heroicons/react/24/outline';

interface LeaderboardEntry {
  id: string;
  name: string;
  state?: string;
  totalEvents: number;
  totalParticipants: number;
  recentGrowth: number;
  rank: number;
  flag?: string;
}

interface LeaderboardsProps {
  className?: string;
  type?: 'cities' | 'states' | 'both';
  showTop?: number;
  timeframe?: '7d' | '30d' | 'all';
}

export default function Leaderboards({
  className = '',
  type = 'both',
  showTop = 10,
  timeframe = '30d'
}: LeaderboardsProps) {
  const [cityLeaderboard, setCityLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [stateLeaderboard, setStateLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'cities' | 'states'>('cities');

  // Brazilian state flags/emojis
  const stateFlags: Record<string, string> = {
    'SP': '🏙️', 'RJ': '🏖️', 'MG': '⛰️', 'BA': '🌴',
    'PR': '🌲', 'RS': '🐎', 'PE': '🦀', 'CE': '☀️',
    'PA': '🌊', 'SC': '🏊', 'GO': '🌾', 'MA': '🐠',
    'ES': '⚓', 'PB': '🥥', 'AL': '🌴', 'MT': '🐄',
    'MS': '🌿', 'DF': '🏛️', 'SE': '🦐', 'AM': '🦋',
    'RO': '🌳', 'AC': '🌿', 'AP': '🌊', 'RR': '🌄',
    'TO': '🌾', 'PI': '🌵', 'RN': '🏖️'
  };

  useEffect(() => {
    const calculateLeaderboards = () => {
      const events = getDemoEvents();
      
      // Group by cities
      const cityStats: Record<string, { events: number; participants: number; state: string }> = {};
      const stateStats: Record<string, { events: number; participants: number }> = {};

      events.forEach(event => {
        const city = event.city;
        const state = event.region || event.state;
        const participants = Object.values(event.rsvps || {}).reduce((sum: number, count: number) => sum + count, 0);

        // City stats
        if (!cityStats[city]) {
          cityStats[city] = { events: 0, participants: 0, state };
        }
        cityStats[city].events += 1;
        cityStats[city].participants += participants;

        // State stats
        if (!stateStats[state]) {
          stateStats[state] = { events: 0, participants: 0 };
        }
        stateStats[state].events += 1;
        stateStats[state].participants += participants;
      });

      // Convert to leaderboard format and sort
      const cities: LeaderboardEntry[] = Object.entries(cityStats)
        .map(([city, stats], index) => ({
          id: city,
          name: city,
          state: stats.state,
          totalEvents: stats.events,
          totalParticipants: stats.participants,
          recentGrowth: Math.floor(Math.random() * 50), // Mock growth data
          rank: index + 1
        }))
        .sort((a, b) => b.totalParticipants - a.totalParticipants)
        .map((entry, index) => ({ ...entry, rank: index + 1 }))
        .slice(0, showTop);

      const states: LeaderboardEntry[] = Object.entries(stateStats)
        .map(([state, stats], index) => ({
          id: state,
          name: state,
          totalEvents: stats.events,
          totalParticipants: stats.participants,
          recentGrowth: Math.floor(Math.random() * 100), // Mock growth data
          rank: index + 1,
          flag: stateFlags[state] || '🏛️'
        }))
        .sort((a, b) => b.totalParticipants - a.totalParticipants)
        .map((entry, index) => ({ ...entry, rank: index + 1 }))
        .slice(0, showTop);

      setCityLeaderboard(cities);
      setStateLeaderboard(states);
      setLoading(false);
    };

    calculateLeaderboards();
  }, [showTop]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `${rank}º`;
    }
  };

  const getGrowthIndicator = (growth: number) => {
    if (growth > 25) return { icon: '🔥', color: 'text-red-600', label: 'Em alta' };
    if (growth > 10) return { icon: '📈', color: 'text-green-600', label: 'Crescendo' };
    if (growth > 0) return { icon: '↗️', color: 'text-blue-600', label: 'Subindo' };
    return { icon: '➡️', color: 'text-gray-500', label: 'Estável' };
  };

  const renderLeaderboard = (data: LeaderboardEntry[], title: string, icon: React.ReactNode) => (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        {icon}
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        <div className="ml-auto text-sm text-gray-500">
          Últimos {timeframe === '7d' ? '7 dias' : timeframe === '30d' ? '30 dias' : 'todos os tempos'}
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="animate-pulse flex items-center gap-4">
              <div className="w-8 h-8 bg-gray-300 rounded-full" />
              <div className="flex-1 h-4 bg-gray-300 rounded" />
              <div className="w-16 h-4 bg-gray-300 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {data.map((entry) => {
            const growth = getGrowthIndicator(entry.recentGrowth);
            return (
              <div
                key={entry.id}
                className={`flex items-center gap-4 p-3 rounded-lg border transition-colors ${
                  entry.rank <= 3 
                    ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200' 
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
              >
                {/* Rank */}
                <div className="text-lg font-bold min-w-[3rem] text-center">
                  {entry.rank <= 3 ? getRankIcon(entry.rank) : `${entry.rank}º`}
                </div>

                {/* Location Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {entry.flag && <span className="text-lg">{entry.flag}</span>}
                    <span className="font-semibold text-gray-900">{entry.name}</span>
                    {entry.state && entry.name !== entry.state && (
                      <span className="text-sm text-gray-500">({entry.state})</span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    {entry.totalEvents} evento{entry.totalEvents !== 1 ? 's' : ''} • {' '}
                    {entry.totalParticipants.toLocaleString('pt-BR')} participantes
                  </div>
                </div>

                {/* Growth Indicator */}
                <div className={`text-right ${growth.color}`}>
                  <div className="flex items-center gap-1 text-sm font-medium">
                    <span>{growth.icon}</span>
                    <span>{growth.label}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    +{entry.recentGrowth}% no período
                  </div>
                </div>

                {/* Participants Count */}
                <div className="text-right min-w-[4rem]">
                  <div className="text-lg font-bold text-green-600">
                    {entry.totalParticipants.toLocaleString('pt-BR')}
                  </div>
                  <div className="text-xs text-gray-500">confirmados</div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {data.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">📊</div>
          <div>Nenhum dado disponível ainda</div>
        </div>
      )}
    </div>
  );

  if (type === 'cities') {
    return (
      <div className={className}>
        {renderLeaderboard(cityLeaderboard, 'Cidades Mais Ativas', <MapPinIcon className="h-6 w-6 text-blue-600" />)}
      </div>
    );
  }

  if (type === 'states') {
    return (
      <div className={className}>
        {renderLeaderboard(stateLeaderboard, 'Estados Mais Mobilizados', <TrophyIcon className="h-6 w-6 text-yellow-600" />)}
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Tab Navigation */}
      <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('cities')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'cities'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <MapPinIcon className="h-4 w-4 inline mr-2" />
          Cidades
        </button>
        <button
          onClick={() => setActiveTab('states')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'states'
              ? 'bg-white text-yellow-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <TrophyIcon className="h-4 w-4 inline mr-2" />
          Estados
        </button>
      </div>

      {/* Active Leaderboard */}
      {activeTab === 'cities' 
        ? renderLeaderboard(cityLeaderboard, 'Ranking de Cidades', <MapPinIcon className="h-6 w-6 text-blue-600" />)
        : renderLeaderboard(stateLeaderboard, 'Ranking de Estados', <TrophyIcon className="h-6 w-6 text-yellow-600" />)
      }
    </div>
  );
}

// Compact leaderboard widget for sidebars
export function LeaderboardWidget({ 
  className = '',
  showTop = 5 
}: { 
  className?: string;
  showTop?: number;
}) {
  const [topStates, setTopStates] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    // Simplified version for widget
    const events = getDemoEvents();
    const stateStats: Record<string, number> = {};

    events.forEach(event => {
      const state = event.region || event.state;
      const participants = Object.values(event.rsvps || {}).reduce((sum: number, count: number) => sum + count, 0);
      stateStats[state] = (stateStats[state] || 0) + participants;
    });

    const sorted = Object.entries(stateStats)
      .map(([state, participants]) => ({
        id: state,
        name: state,
        totalEvents: 0,
        totalParticipants: participants,
        recentGrowth: 0,
        rank: 0,
        flag: stateFlags[state] || '🏛️'
      }))
      .sort((a, b) => b.totalParticipants - a.totalParticipants)
      .slice(0, showTop)
      .map((entry, index) => ({ ...entry, rank: index + 1 }));

    setTopStates(sorted);
  }, [showTop]);

  return (
    <div className={`bg-white rounded-lg shadow-md border border-gray-200 p-4 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <TrophyIcon className="h-5 w-5 text-yellow-600" />
        <h4 className="font-semibold text-gray-900">Top Estados</h4>
      </div>
      
      <div className="space-y-2">
        {topStates.map((state) => (
          <div key={state.id} className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-500 w-6">
              {state.rank}º
            </span>
            <span className="text-lg">{state.flag}</span>
            <span className="text-sm font-medium text-gray-900 flex-1">{state.name}</span>
            <span className="text-sm font-bold text-green-600">
              {state.totalParticipants.toLocaleString('pt-BR')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}