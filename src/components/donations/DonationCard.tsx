'use client';

import { useState } from 'react';
import { DonationTier } from '@/types/donations';
import { CheckIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

interface DonationCardProps {
  tier: DonationTier;
  onDonate: (tier: DonationTier, isMonthly?: boolean) => void;
  isPopular?: boolean;
  isMonthly?: boolean;
}

export default function DonationCard({ tier, onDonate, isPopular = false, isMonthly = false }: DonationCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`relative bg-white rounded-lg shadow-md border-2 transition-all duration-300 ${
        isPopular 
          ? 'border-blue-500 transform scale-105' 
          : 'border-gray-200 hover:border-blue-300'
      } ${isHovered ? 'shadow-lg' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
            Mais Popular
          </span>
        </div>
      )}

      <div className="p-6">
        <div className="text-center mb-4">
          <div className="text-4xl mb-2">{tier.icon}</div>
          <h3 className="text-xl font-bold text-gray-900">{tier.name}</h3>
          <div className="mt-2">
            <span className="text-3xl font-bold text-blue-600">
              R${tier.amount}
            </span>
            <span className="text-gray-600 ml-1">
              {isMonthly ? '/mês' : 'única'}
            </span>
          </div>
          {isMonthly && tier.badge && (
            <div className="mt-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <ShieldCheckIcon className="h-3 w-3 mr-1" />
                {tier.badge}
              </span>
            </div>
          )}
        </div>

        <p className="text-gray-600 text-center mb-6 text-sm">
          {tier.description}
        </p>

        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3 text-sm">
            {isMonthly ? 'Benefícios mensais:' : 'O que você apoia:'}
          </h4>
          <ul className="space-y-2">
            {(isMonthly && tier.monthlyBenefits ? tier.monthlyBenefits : tier.benefits).map((benefit, index) => (
              <li key={index} className="flex items-start text-sm text-gray-600">
                <CheckIcon className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={() => onDonate(tier, isMonthly)}
          className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
            isPopular
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300'
          }`}
        >
          {isMonthly ? 'Apoiar Mensalmente' : 'Apoiar Plataforma'}
        </button>
      </div>
    </div>
  );
}