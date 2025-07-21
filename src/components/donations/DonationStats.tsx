'use client';

import { useState, useEffect } from 'react';
import { DonationStats } from '@/types/donations';
import { ShieldCheckIcon, HeartIcon } from '@heroicons/react/24/outline';

export default function DonationStatsDisplay() {
  const [stats, setStats] = useState<DonationStats>({
    totalRaised: 12847,
    totalDonors: 156,
    currency: 'BRL',
    lastUpdated: new Date().toISOString()
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: stats.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('pt-BR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg p-6 mb-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
          <ShieldCheckIcon className="h-8 w-8 text-white" />
          Apoio à Infraestrutura Cívica
        </h2>
        <p className="text-blue-100 text-sm">
          Apoiando plataformas resistentes à censura para coordenação cívica pacífica
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="text-center">
          <div className="text-3xl font-bold mb-1">
            {formatCurrency(stats.totalRaised)}
          </div>
          <div className="text-blue-200 text-sm">Total Arrecadado</div>
        </div>
        
        <div className="text-center">
          <div className="text-3xl font-bold mb-1">
            {stats.totalDonors.toLocaleString()}
          </div>
          <div className="text-blue-200 text-sm">Patriotas Apoiando</div>
        </div>
      </div>

      <div className="text-center text-blue-200 text-xs">
        Última atualização: {formatDate(stats.lastUpdated)}
      </div>

      {/* Progress indicators */}
      <div className="mt-6 space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Infraestrutura de Servidores</span>
            <span>78%</span>
          </div>
          <div className="w-full bg-blue-800 rounded-full h-2">
            <div className="bg-white h-2 rounded-full" style={{width: '78%'}}></div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Segurança & Criptografia</span>
            <span>92%</span>
          </div>
          <div className="w-full bg-blue-800 rounded-full h-2">
            <div className="bg-white h-2 rounded-full" style={{width: '92%'}}></div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Domínios Espelho</span>
            <span>65%</span>
          </div>
          <div className="w-full bg-blue-800 rounded-full h-2">
            <div className="bg-white h-2 rounded-full" style={{width: '65%'}}></div>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-blue-100 text-xs flex items-center justify-center gap-2">
          <HeartIcon className="h-4 w-4 text-blue-100" />
          Obrigado por apoiar a liberdade digital e coordenação cívica pacífica
        </p>
      </div>
    </div>
  );
}