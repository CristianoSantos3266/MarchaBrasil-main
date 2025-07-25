'use client';

import { useState, useEffect } from 'react';
import { getRegionalImpact, calculateRegionalImpact } from '@/lib/gamification';
import { getDemoEvents } from '@/lib/demo-events';

interface RegionalImpactMeterProps {
  className?: string;
  showTopStates?: number;
}

export default function RegionalImpactMeter({ 
  className = '',
  showTopStates = 5
}: RegionalImpactMeterProps) {
  const [impactData, setImpactData] = useState<Record<string, any>>({});
  const [totalStats, setTotalStats] = useState({
    totalEvents: 0,
    totalConfirmations: 0,
    totalStates: 0
  });

  useEffect(() => {
    // Calculate regional impact from demo events
    const events = getDemoEvents();
    const calculatedImpact = calculateRegionalImpact(events);
    setImpactData(calculatedImpact);

    // Calculate totals
    const stats = Object.values(calculatedImpact).reduce(
      (acc, state: any) => ({
        totalEvents: acc.totalEvents + state.totalEvents,
        totalConfirmations: acc.totalConfirmations + state.totalConfirmations,
        totalStates: acc.totalStates + 1
      }),
      { totalEvents: 0, totalConfirmations: 0, totalStates: 0 }
    );
    setTotalStats(stats);
  }, []);

  // Get top states by confirmations
  const topStates = Object.values(impactData)
    .sort((a: any, b: any) => b.totalConfirmations - a.totalConfirmations)
    .slice(0, showTopStates);

  const getStateFlag = (state: string) => {
    // Brazilian state emojis/representations
    const stateFlags: Record<string, string> = {
      'SP': '🏙️', 'RJ': '🏖️', 'MG': '⛰️', 'BA': '🌴',
      'PR': '🌲', 'RS': '🐎', 'PE': '🦀', 'CE': '☀️',
      'PA': '🌊', 'SC': '🏊', 'GO': '🌾', 'MA': '🐠',
      'ES': '⚓', 'PB': '🥥', 'AL': '🌴', 'MT': '🐄',
      'MS': '🌿', 'DF': '🏛️', 'SE': '🦐', 'AM': '🦋',
      'RO': '🌳', 'AC': '🌿', 'AP': '🌊', 'RR': '🌄',
      'TO': '🌾', 'PI': '🌵', 'RN': '🏖️'
    };
    return stateFlags[state] || '🏛️';
  };

  const getMomentumLevel = (confirmations: number) => {
    if (confirmations >= 5000) return { level: 'Incendiando', color: 'red', intensity: 100 };
    if (confirmations >= 2000) return { level: 'Aquecendo', color: 'orange', intensity: 80 };
    if (confirmations >= 1000) return { level: 'Crescendo', color: 'yellow', intensity: 60 };
    if (confirmations >= 500) return { level: 'Mobilizando', color: 'green', intensity: 40 };
    return { level: 'Iniciando', color: 'blue', intensity: 20 };
  };

  return (
    <div className={`bg-white rounded-lg shadow-md border border-gray-200 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <span className="text-2xl">🇧🇷</span>
          Mobilização Nacional
        </h3>
        <div className="text-right">
          <div className="text-sm text-gray-600">Total</div>
          <div className="text-lg font-bold text-green-600">
            {totalStats.totalConfirmations.toLocaleString('pt-BR')} confirmações
          </div>
        </div>
      </div>

      {/* National Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{totalStats.totalEvents}</div>
          <div className="text-xs text-blue-700">Manifestações</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{totalStats.totalConfirmations.toLocaleString('pt-BR')}</div>
          <div className="text-xs text-green-700">Patriotas</div>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">{totalStats.totalStates}</div>
          <div className="text-xs text-purple-700">Estados</div>
        </div>
      </div>

      {/* Top States */}
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-900 mb-3">Estados Mais Mobilizados</h4>
        
        {topStates.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            <div className="text-4xl mb-2">📍</div>
            <div>Crie eventos para ver a mobilização por estado</div>
          </div>
        ) : (
          topStates.map((state: any, index: number) => {
            const momentum = getMomentumLevel(state.totalConfirmations);
            
            return (
              <div key={state.state} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                {/* Rank */}
                <div className="text-lg font-bold text-gray-600 w-6">
                  {index + 1}º
                </div>

                {/* State Info */}
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-2xl">{getStateFlag(state.state)}</span>
                  <div>
                    <div className="font-semibold text-gray-900">{state.state}</div>
                    <div className="text-xs text-gray-600">
                      {state.totalEvents} evento{state.totalEvents !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>

                {/* Momentum Indicator */}
                <div className="text-center">
                  <div className={`text-sm font-medium text-${momentum.color}-700`}>
                    {momentum.level}
                  </div>
                  <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className={`bg-${momentum.color}-500 h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${momentum.intensity}%` }}
                    ></div>
                  </div>
                </div>

                {/* Confirmations */}
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">
                    {state.totalConfirmations.toLocaleString('pt-BR')}
                  </div>
                  <div className="text-xs text-gray-600">confirmações</div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Call to Action */}
      <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg">
        <div className="text-center">
          <div className="text-sm font-medium text-green-800 mb-1">
            🚀 Fortaleça a mobilização no seu estado!
          </div>
          <div className="text-xs text-green-700">
            Crie eventos e convide patriotas para aumentar o impacto da sua região
          </div>
        </div>
      </div>
    </div>
  );
}