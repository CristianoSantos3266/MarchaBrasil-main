'use client';

import { useState, useEffect } from 'react';
import { 
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface PlatformMetrics {
  totalEvents: number;
  totalRSVPs: number;
  activeCountries: number;
  dailyViews: number;
  weeklyGrowth: number;
  lastUpdated: string;
}

export default function PlatformStats() {
  const [metrics, setMetrics] = useState<PlatformMetrics>({
    totalEvents: 47,
    totalRSVPs: 23567,
    activeCountries: 12,
    dailyViews: 8934,
    weeklyGrowth: 23.5,
    lastUpdated: new Date().toISOString()
  });

  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d'>('7d');

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        dailyViews: prev.dailyViews + Math.floor(Math.random() * 50),
        totalRSVPs: prev.totalRSVPs + Math.floor(Math.random() * 10),
        lastUpdated: new Date().toISOString()
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toLocaleString();
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <ChartBarIcon className="h-6 w-6 text-blue-600" />
          Platform Analytics
        </h2>
        
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {(['24h', '7d', '30d'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setTimeframe(period)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                timeframe === period
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600 mb-1">
            {metrics.totalEvents}
          </div>
          <div className="text-sm text-blue-700">Active Events</div>
        </div>

        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600 mb-1">
            {formatNumber(metrics.totalRSVPs)}
          </div>
          <div className="text-sm text-green-700">Total RSVPs</div>
        </div>

        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600 mb-1">
            {metrics.activeCountries}
          </div>
          <div className="text-sm text-purple-700">Active Countries</div>
        </div>

        <div className="text-center p-4 bg-orange-50 rounded-lg">
          <div className="text-2xl font-bold text-orange-600 mb-1">
            {formatNumber(metrics.dailyViews)}
          </div>
          <div className="text-sm text-orange-700">Daily Views</div>
        </div>
      </div>

      {/* Growth indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">User Growth</span>
            <span className="text-green-600 text-sm font-medium flex items-center gap-1">
              <ArrowTrendingUpIcon className="h-4 w-4" />
              +{metrics.weeklyGrowth}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-500" 
              style={{width: `${Math.min(metrics.weeklyGrowth * 2, 100)}%`}}
            ></div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Event Activity</span>
            <span className="text-blue-600 text-sm font-medium flex items-center gap-1">
              <ArrowTrendingUpIcon className="h-4 w-4" />
              High
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full" style={{width: '78%'}}></div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Platform Health</span>
            <span className="text-green-600 text-sm font-medium flex items-center gap-1">
              <CheckCircleIcon className="h-4 w-4" />
              Excellent
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full" style={{width: '95%'}}></div>
          </div>
        </div>
      </div>

      {/* Regional breakdown */}
      <div className="border-t border-gray-200 pt-4">
        <h3 className="font-semibold text-gray-900 mb-3 text-sm">Top Regions by Activity</h3>
        <div className="space-y-2">
          {[
            { country: '🇧🇷 Brazil', percentage: 45 },
            { country: '🇺🇸 United States', percentage: 28 },
            { country: '🇦🇷 Argentina', percentage: 15 },
            { country: '🇫🇷 France', percentage: 8 },
            { country: '🇨🇦 Canada', percentage: 4 }
          ].map((region, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <span className="text-gray-700">{region.country}</span>
              <div className="flex items-center gap-2">
                <div className="w-16 bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-blue-500 h-1.5 rounded-full" 
                    style={{width: `${region.percentage}%`}}
                  ></div>
                </div>
                <span className="text-gray-500 text-xs w-8">{region.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 text-center text-xs text-gray-500">
        Last updated: {formatDate(metrics.lastUpdated)}
      </div>
    </div>
  );
}