'use client';

import { useState, useEffect } from 'react';
import { globalProtests } from '@/data/globalProtests';
import { getCountryByCode, getRegionByCode } from '@/data/countries';
import { Protest } from '@/types';

interface EventAnalytics {
  protestId: string;
  views: number;
  rsvps: number;
  growth: number;
  trend: 'up' | 'down' | 'stable';
}

export default function TrendingEvents() {
  const [trending, setTrending] = useState<Protest[]>([]);
  const [analytics, setAnalytics] = useState<EventAnalytics[]>([]);

  useEffect(() => {
    // Simulate analytics data
    const mockAnalytics: EventAnalytics[] = globalProtests.map(protest => ({
      protestId: protest.id,
      views: Math.floor(Math.random() * 5000) + 100,
      rsvps: Object.values(protest.rsvps).reduce((sum, count) => sum + count, 0),
      growth: Math.floor(Math.random() * 200) - 50, // -50 to +150
      trend: Math.random() > 0.3 ? 'up' : Math.random() > 0.5 ? 'stable' : 'down'
    }));

    setAnalytics(mockAnalytics);

    // Sort by trending score (views + rsvps + growth)
    const sortedProtests = globalProtests
      .map(protest => {
        const analytics = mockAnalytics.find(a => a.protestId === protest.id);
        return {
          ...protest,
          trendingScore: (analytics?.views || 0) + (analytics?.rsvps || 0) * 10 + (analytics?.growth || 0) * 5
        };
      })
      .sort((a, b) => b.trendingScore - a.trendingScore)
      .slice(0, 5);

    setTrending(sortedProtests);
  }, []);

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      case 'stable': return '➡️';
    }
  };

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return 'text-green-600';
    if (growth < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        🔥 Trending Events
      </h2>

      <div className="space-y-4">
        {trending.map((protest, index) => {
          const country = getCountryByCode(protest.country);
          const region = getRegionByCode(protest.country, protest.region);
          const protestAnalytics = analytics.find(a => a.protestId === protest.id);

          return (
            <div 
              key={protest.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl font-bold text-blue-600 w-8">
                  #{index + 1}
                </div>
                
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-sm">
                    {protest.title}
                  </h3>
                  <p className="text-xs text-gray-600">
                    {protest.city}, {region?.name}, {country?.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {protest.date} • {protest.time}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">
                    {getTrendIcon(protestAnalytics?.trend || 'stable')}
                  </span>
                  <span className={`text-sm font-medium ${getGrowthColor(protestAnalytics?.growth || 0)}`}>
                    {protestAnalytics?.growth && protestAnalytics.growth > 0 ? '+' : ''}
                    {protestAnalytics?.growth || 0}%
                  </span>
                </div>
                
                <div className="text-xs text-gray-500 space-y-1">
                  <div>👁️ {(protestAnalytics?.views || 0).toLocaleString()} views</div>
                  <div>✋ {(protestAnalytics?.rsvps || 0).toLocaleString()} RSVPs</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 text-center">
        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          View All Analytics →
        </button>
      </div>
    </div>
  );
}