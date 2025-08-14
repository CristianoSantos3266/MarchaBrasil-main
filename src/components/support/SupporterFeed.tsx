'use client';

import { useState, useEffect } from 'react';
import { DevicePhoneMobileIcon, CreditCardIcon, ShareIcon, HandRaisedIcon, ChartBarIcon, ShieldCheckIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

interface SupporterActivity {
  id: string;
  type: 'contribution' | 'share' | 'signup';
  amount?: number;
  method?: 'pix' | 'card' | 'crypto';
  location: string;
  timeAgo: string;
  anonymous: boolean;
}

const mockActivities: SupporterActivity[] = [
  {
    id: '1',
    type: 'contribution',
    amount: 50,
    method: 'pix',
    location: 'São Paulo, SP',
    timeAgo: '2 min',
    anonymous: false
  },
  {
    id: '2',
    type: 'share',
    location: 'Rio de Janeiro, RJ',
    timeAgo: '5 min',
    anonymous: true
  },
  {
    id: '3',
    type: 'contribution',
    amount: 25,
    method: 'card',
    location: 'Belo Horizonte, MG',
    timeAgo: '8 min',
    anonymous: false
  },
  {
    id: '4',
    type: 'signup',
    location: 'Porto Alegre, RS',
    timeAgo: '12 min',
    anonymous: true
  },
  {
    id: '5',
    type: 'contribution',
    amount: 100,
    method: 'crypto',
    location: 'Brasília, DF',
    timeAgo: '15 min',
    anonymous: false
  },
  {
    id: '6',
    type: 'share',
    location: 'Salvador, BA',
    timeAgo: '18 min',
    anonymous: true
  },
  {
    id: '7',
    type: 'contribution',
    amount: 10,
    method: 'pix',
    location: 'Recife, PE',
    timeAgo: '22 min',
    anonymous: false
  },
  {
    id: '8',
    type: 'contribution',
    amount: 75,
    method: 'card',
    location: 'Fortaleza, CE',
    timeAgo: '28 min',
    anonymous: true
  }
];

export default function SupporterFeed() {
  const [activities, setActivities] = useState<SupporterActivity[]>(mockActivities);

  const getActivityIcon = (activity: SupporterActivity) => {
    if (activity.type === 'contribution') {
      if (activity.method === 'pix') return <DevicePhoneMobileIcon className="h-5 w-5 text-green-600" />;
      if (activity.method === 'card') return <CreditCardIcon className="h-5 w-5 text-blue-600" />;
      if (activity.method === 'crypto') return <span className="text-purple-600 font-bold">₿</span>;
    }
    if (activity.type === 'share') return <ShareIcon className="h-5 w-5 text-blue-600" />;
    if (activity.type === 'signup') return <HandRaisedIcon className="h-5 w-5 text-green-600" />;
    return <HandRaisedIcon className="h-5 w-5 text-green-600" />;
  };

  const getActivityMessage = (activity: SupporterActivity) => {
    const name = activity.anonymous ? 'Apoiador anônimo' : 'Brasileiro';
    
    if (activity.type === 'contribution') {
      return `${name} contribuiu R$ ${activity.amount} via ${activity.method?.toUpperCase()}`;
    }
    if (activity.type === 'share') {
      return `${name} compartilhou a plataforma`;
    }
    if (activity.type === 'signup') {
      return `${name} se juntou à mobilização`;
    }
    return `${name} apoiou a causa`;
  };

  // Simulate new activities
  useEffect(() => {
    const interval = setInterval(() => {
      const newActivity: SupporterActivity = {
        id: Date.now().toString(),
        type: Math.random() > 0.7 ? 'contribution' : Math.random() > 0.5 ? 'share' : 'signup',
        amount: Math.random() > 0.5 ? [10, 25, 50, 100][Math.floor(Math.random() * 4)] : undefined,
        method: Math.random() > 0.6 ? 'pix' : Math.random() > 0.5 ? 'card' : 'crypto',
        location: [
          'São Paulo, SP', 'Rio de Janeiro, RJ', 'Belo Horizonte, MG', 
          'Porto Alegre, RS', 'Salvador, BA', 'Brasília, DF',
          'Fortaleza, CE', 'Recife, PE', 'Curitiba, PR'
        ][Math.floor(Math.random() * 9)],
        timeAgo: 'agora',
        anonymous: Math.random() > 0.6
      };

      setActivities(prev => [newActivity, ...prev.slice(0, 7)]);
    }, 15000); // New activity every 15 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6">
        <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
          <ChartBarIcon className="h-6 w-6 text-green-100" />
          Atividade em Tempo Real
        </h2>
        <p className="text-green-100">
          Veja outros brasileiros apoiando nossa causa neste momento
        </p>
      </div>

      {/* Activity Feed */}
      <div className="p-6">
        <div className="space-y-4 max-h-80 overflow-y-auto">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 flex items-center justify-center">{getActivityIcon(activity)}</div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {getActivityMessage(activity)}
                </p>
                <p className="text-xs text-gray-500">
                  {activity.location} • {activity.timeAgo}
                </p>
              </div>
              {activity.type === 'contribution' && activity.amount && (
                <div className="text-right">
                  <p className="text-sm font-bold text-green-600">
                    R$ {activity.amount}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Social Proof Footer */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2 flex items-center justify-center gap-2">
              <ChartBarIcon className="h-4 w-4 text-blue-600" />
              <strong>Mais de 1.247 brasileiros</strong> apoiaram hoje
            </p>
            <div className="flex justify-center items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <span className="text-yellow-500">⭐</span>
                4.8/5 confiança
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <ShieldCheckIcon className="h-3 w-3 text-green-600" />
                100% seguro
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <GlobeAltIcon className="h-3 w-3 text-blue-600" />
                Brasileiro
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}