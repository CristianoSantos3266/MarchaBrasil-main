'use client';

import { useState, useEffect } from 'react';

export default function ImpactBar() {
  const [currentAmount, setCurrentAmount] = useState(867);
  const targetAmount = 20000;
  const progressPercentage = (currentAmount / targetAmount) * 100;

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAmount(prev => {
        const increase = Math.random() * 50 + 10; // Random increase between 10-60
        return Math.min(prev + increase, targetAmount);
      });
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [targetAmount]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          🎯 Meta de Apoio Mensal
        </h2>
        <p className="text-gray-600">
          Ajude-nos a alcançar nossa meta para manter a plataforma funcionando
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Progresso</span>
          <span className="text-sm font-medium text-gray-700">
            {progressPercentage.toFixed(1)}%
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div 
            className="h-4 bg-gradient-to-r from-green-500 to-blue-500 rounded-full transition-all duration-1000 ease-out relative"
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          >
            {/* Animated shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Amount Display */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl sm:text-3xl font-bold text-green-600">
            {formatCurrency(currentAmount)}
          </div>
          <div className="text-sm text-gray-600">Arrecadado</div>
        </div>
        <div className="text-center">
          <div className="text-2xl sm:text-3xl font-bold text-blue-600">
            {formatCurrency(targetAmount)}
          </div>
          <div className="text-sm text-gray-600">Meta</div>
        </div>
      </div>

      {/* Remaining Amount */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 border border-orange-200 mb-6">
        <div className="text-center">
          <p className="text-sm text-gray-700 mb-1">
            Faltam apenas
          </p>
          <p className="text-xl font-bold text-orange-600">
            {formatCurrency(targetAmount - currentAmount)}
          </p>
          <p className="text-xs text-gray-600">
            para alcançarmos nossa meta mensal
          </p>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-3">
          💚 <strong>Ou compartilhe com 3 amigos</strong> — cada apoio conta
        </p>
        
        <div className="flex justify-center gap-2 text-xs text-gray-500">
          <span>🏆 426 apoiadores</span>
          <span>•</span>
          <span>⚡ Última doação: 3 min</span>
          <span>•</span>
          <span>🔄 {Math.floor(progressPercentage)}% da meta</span>
        </div>
      </div>
    </div>
  );
}