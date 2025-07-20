'use client';

import { useState } from 'react';
import { DonationTier } from '@/types/donations';

interface DonationCardProps {
  tier: DonationTier;
  onDonate: (tier: DonationTier) => void;
  isPopular?: boolean;
}

export default function DonationCard({ tier, onDonate, isPopular = false }: DonationCardProps) {
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
            Most Popular
          </span>
        </div>
      )}

      <div className="p-6">
        <div className="text-center mb-4">
          <div className="text-4xl mb-2">{tier.icon}</div>
          <h3 className="text-xl font-bold text-gray-900">{tier.name}</h3>
          <div className="mt-2">
            <span className="text-3xl font-bold text-blue-600">
              ${tier.amount}
            </span>
            <span className="text-gray-600 ml-1">{tier.currency}</span>
          </div>
        </div>

        <p className="text-gray-600 text-center mb-6 text-sm">
          {tier.description}
        </p>

        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3 text-sm">What you support:</h4>
          <ul className="space-y-2">
            {tier.benefits.map((benefit, index) => (
              <li key={index} className="flex items-start text-sm text-gray-600">
                <span className="text-green-500 mr-2 flex-shrink-0">✓</span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={() => onDonate(tier)}
          className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
            isPopular
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300'
          }`}
        >
          Support Platform
        </button>
      </div>
    </div>
  );
}