'use client';

import { RSVPCountsDetailed } from '@/types';
import { ShieldCheckIcon, EyeSlashIcon, UsersIcon } from '@heroicons/react/24/outline';

interface RSVPDisplayProps {
  rsvps: RSVPCountsDetailed;
  className?: string;
  showDetailed?: boolean;
}

const participantIcons = {
  caminhoneiros: '🚛',
  motociclistas: '🏍️',
  carros: '🚗',
  tratores: '🚜',
  produtoresRurais: '🌾',
  comerciantes: '🛍️',
  populacaoGeral: '👥'
};

const participantLabels = {
  caminhoneiros: 'Caminhoneiros',
  motociclistas: 'Motociclistas',
  carros: 'Carros',
  tratores: 'Tratores',
  produtoresRurais: 'Produtores Rurais',
  comerciantes: 'Comerciantes',
  populacaoGeral: 'População Geral'
};

export default function RSVPDisplay({ rsvps, className = '', showDetailed = false }: RSVPDisplayProps) {
  const totalAnonymous = Object.values(rsvps.anonymous).reduce((sum, count) => sum + count, 0);
  const totalVerified = Object.values(rsvps.verified).reduce((sum, count) => sum + count, 0);
  const totalAll = totalAnonymous + totalVerified;

  if (!showDetailed) {
    // Simple display for cards
    return (
      <div className={`bg-white/60 rounded-lg p-3 border border-green-100 ${className}`}>
        <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
          🇧🇷 Confirmações ({totalAll.toLocaleString('pt-BR')} brasileiros)
        </h4>
        
        <div className="flex justify-between items-center mb-3 text-xs">
          <div className="flex items-center gap-2 text-gray-600">
            <EyeSlashIcon className="h-4 w-4" />
            <span>Anônimos: {totalAnonymous.toLocaleString('pt-BR')}</span>
          </div>
          <div className="flex items-center gap-2 text-green-700">
            <ShieldCheckIcon className="h-4 w-4" />
            <span>Verificados: {totalVerified.toLocaleString('pt-BR')}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          {Object.entries(rsvps.total).map(([type, count]) => (
            <div key={type} className="flex items-center gap-2 bg-white/80 rounded-md px-2 py-1">
              <span>{participantIcons[type as keyof typeof participantIcons]}</span>
              <span className="text-gray-700">
                {participantLabels[type as keyof typeof participantLabels]}: {count.toLocaleString('pt-BR')}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Detailed display for protest detail pages
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Summary */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
        <div className="text-center mb-4">
          <h3 className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
            <UsersIcon className="h-8 w-8 text-green-600" />
            {totalAll.toLocaleString('pt-BR')} Brasileiros Confirmados
          </h3>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <EyeSlashIcon className="h-6 w-6 text-gray-600" />
              <h4 className="font-semibold text-gray-900">Apoio Anônimo</h4>
            </div>
            <div className="text-2xl font-bold text-gray-700">
              {totalAnonymous.toLocaleString('pt-BR')}
            </div>
            <div className="text-sm text-gray-600">
              Confirmações rápidas e privadas
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-green-200">
            <div className="flex items-center gap-3 mb-2">
              <ShieldCheckIcon className="h-6 w-6 text-green-600" />
              <h4 className="font-semibold text-green-900">Patriotas Verificados</h4>
            </div>
            <div className="text-2xl font-bold text-green-700">
              {totalVerified.toLocaleString('pt-BR')}
            </div>
            <div className="text-sm text-green-600">
              Dados confiáveis verificados
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">
          Breakdown por Categoria
        </h4>
        
        <div className="space-y-4">
          {Object.entries(rsvps.total).map(([type, totalCount]) => {
            const anonymous = rsvps.anonymous[type as keyof typeof rsvps.anonymous] || 0;
            const verified = rsvps.verified[type as keyof typeof rsvps.verified] || 0;
            
            if (totalCount === 0) return null;
            
            return (
              <div key={type} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {participantIcons[type as keyof typeof participantIcons]}
                    </span>
                    <h5 className="font-medium text-gray-900">
                      {participantLabels[type as keyof typeof participantLabels]}
                    </h5>
                  </div>
                  <div className="text-xl font-bold text-gray-900">
                    {totalCount.toLocaleString('pt-BR')}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center gap-2">
                      <EyeSlashIcon className="h-4 w-4" />
                      Anônimos
                    </span>
                    <span className="font-medium">{anonymous.toLocaleString('pt-BR')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-green-600 flex items-center gap-2">
                      <ShieldCheckIcon className="h-4 w-4" />
                      Verificados
                    </span>
                    <span className="font-medium text-green-700">{verified.toLocaleString('pt-BR')}</span>
                  </div>
                </div>
                
                {/* Trust Score */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Índice de Confiança</span>
                    <span className="font-medium text-blue-600">
                      {totalCount > 0 ? Math.round((verified / totalCount) * 100) : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-green-500 h-1.5 rounded-full" 
                      style={{width: `${totalCount > 0 ? (verified / totalCount) * 100 : 0}%`}}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}