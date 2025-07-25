'use client'

import React, { useState, useEffect } from 'react'
import {
  ChartBarIcon,
  CalendarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  UsersIcon,
  EyeIcon,
  MapPinIcon,
  ClockIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline'

interface AnalyticsData {
  overview: {
    totalUsers: number
    activeUsers: number
    totalEvents: number
    totalPageViews: number
    bounceRate: number
    avgSessionDuration: number
  }
  trends: {
    userGrowth: number
    eventGrowth: number
    engagementGrowth: number
  }
  geographic: {
    topStates: Array<{ name: string; users: number; percentage: number }>
    topCities: Array<{ name: string; users: number; percentage: number }>
  }
  devices: {
    mobile: number
    desktop: number
    tablet: number
  }
  traffic: {
    organic: number
    direct: number
    social: number
    referral: number
  }
  engagement: {
    avgTimeOnPage: number
    pagesPerSession: number
    returnVisitorRate: number
    newVisitorRate: number
  }
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData>({
    overview: {
      totalUsers: 45672,
      activeUsers: 8934,
      totalEvents: 156,
      totalPageViews: 234567,
      bounceRate: 34.5,
      avgSessionDuration: 4.2
    },
    trends: {
      userGrowth: 23.5,
      eventGrowth: 18.2,
      engagementGrowth: 12.8
    },
    geographic: {
      topStates: [
        { name: 'São Paulo', users: 15234, percentage: 33.3 },
        { name: 'Rio de Janeiro', users: 9876, percentage: 21.6 },
        { name: 'Minas Gerais', users: 6543, percentage: 14.3 },
        { name: 'Bahia', users: 4321, percentage: 9.5 },
        { name: 'Paraná', users: 3210, percentage: 7.0 }
      ],
      topCities: [
        { name: 'São Paulo', users: 12345, percentage: 27.0 },
        { name: 'Rio de Janeiro', users: 8765, percentage: 19.2 },
        { name: 'Belo Horizonte', users: 4567, percentage: 10.0 },
        { name: 'Salvador', users: 3456, percentage: 7.6 },
        { name: 'Brasília', users: 2345, percentage: 5.1 }
      ]
    },
    devices: {
      mobile: 68.4,
      desktop: 25.1,
      tablet: 6.5
    },
    traffic: {
      organic: 45.2,
      direct: 28.1,
      social: 18.3,
      referral: 8.4
    },
    engagement: {
      avgTimeOnPage: 3.4,
      pagesPerSession: 4.7,
      returnVisitorRate: 42.3,
      newVisitorRate: 57.7
    }
  })

  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d')

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toLocaleString()
  }

  const formatPercentage = (num: number) => {
    return `${num > 0 ? '+' : ''}${num.toFixed(1)}%`
  }

  const getTrendIcon = (value: number) => {
    return value > 0 ? ArrowTrendingUpIcon : ArrowTrendingDownIcon
  }

  const getTrendColor = (value: number) => {
    return value > 0 ? 'text-green-600' : 'text-red-600'
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <ChartBarIcon className="h-8 w-8 text-purple-600" />
            Analytics & Estatísticas
          </h1>
          <p className="text-gray-600 mt-2">Análise detalhada do desempenho da plataforma</p>
        </div>
        
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-gray-400" />
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="7d">Últimos 7 dias</option>
            <option value="30d">Últimos 30 dias</option>
            <option value="90d">Últimos 90 dias</option>
            <option value="1y">Último ano</option>
          </select>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Usuários Totais</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(data.overview.totalUsers)}</p>
              <div className="flex items-center mt-1">
                {React.createElement(getTrendIcon(data.trends.userGrowth), {
                  className: `h-4 w-4 ${getTrendColor(data.trends.userGrowth)}`
                })}
                <span className={`text-sm ml-1 ${getTrendColor(data.trends.userGrowth)}`}>
                  {formatPercentage(data.trends.userGrowth)}
                </span>
              </div>
            </div>
            <UsersIcon className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Usuários Ativos</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(data.overview.activeUsers)}</p>
              <div className="flex items-center mt-1">
                {React.createElement(getTrendIcon(data.trends.engagementGrowth), {
                  className: `h-4 w-4 ${getTrendColor(data.trends.engagementGrowth)}`
                })}
                <span className={`text-sm ml-1 ${getTrendColor(data.trends.engagementGrowth)}`}>
                  {formatPercentage(data.trends.engagementGrowth)}
                </span>
              </div>
            </div>
            <ArrowTrendingUpIcon className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Eventos</p>
              <p className="text-2xl font-bold text-gray-900">{data.overview.totalEvents}</p>
              <div className="flex items-center mt-1">
                {React.createElement(getTrendIcon(data.trends.eventGrowth), {
                  className: `h-4 w-4 ${getTrendColor(data.trends.eventGrowth)}`
                })}
                <span className={`text-sm ml-1 ${getTrendColor(data.trends.eventGrowth)}`}>
                  {formatPercentage(data.trends.eventGrowth)}
                </span>
              </div>
            </div>
            <CalendarIcon className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Visualizações</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(data.overview.totalPageViews)}</p>
              <div className="flex items-center mt-1">
                <EyeIcon className="h-4 w-4 text-orange-600" />
                <span className="text-sm text-orange-600 ml-1">+15.2%</span>
              </div>
            </div>
            <EyeIcon className="h-8 w-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Taxa de Rejeição</p>
              <p className="text-2xl font-bold text-gray-900">{data.overview.bounceRate}%</p>
              <div className="flex items-center mt-1">
                <ArrowTrendingDownIcon className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-600 ml-1">-2.1%</span>
              </div>
            </div>
            <ClockIcon className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tempo Médio</p>
              <p className="text-2xl font-bold text-gray-900">{data.overview.avgSessionDuration}min</p>
              <div className="flex items-center mt-1">
                <ArrowTrendingUpIcon className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-600 ml-1">+8.3%</span>
              </div>
            </div>
            <ClockIcon className="h-8 w-8 text-indigo-600" />
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Geographic Distribution */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MapPinIcon className="h-5 w-5 text-blue-600" />
            Distribuição Geográfica
          </h3>
          
          <div className="space-y-4">
            <h4 className="font-medium text-gray-700">Estados com Mais Usuários</h4>
            {data.geographic.topStates.map((state, index) => (
              <div key={state.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">{index + 1}.</span>
                  <span className="text-sm text-gray-700">{state.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{width: `${state.percentage}%`}}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-12 text-right">
                    {formatNumber(state.users)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Device Breakdown */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <DevicePhoneMobileIcon className="h-5 w-5 text-green-600" />
            Dispositivos
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2">
                <DevicePhoneMobileIcon className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-gray-900">Mobile</span>
              </div>
              <span className="text-xl font-bold text-blue-600">{data.devices.mobile}%</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <ComputerDesktopIcon className="h-5 w-5 text-gray-600" />
                <span className="font-medium text-gray-900">Desktop</span>
              </div>
              <span className="text-xl font-bold text-gray-600">{data.devices.desktop}%</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-2">
                <ComputerDesktopIcon className="h-5 w-5 text-purple-600" />
                <span className="font-medium text-gray-900">Tablet</span>
              </div>
              <span className="text-xl font-bold text-purple-600">{data.devices.tablet}%</span>
            </div>
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <GlobeAltIcon className="h-5 w-5 text-orange-600" />
            Fontes de Tráfego
          </h3>
          
          <div className="space-y-3">
            {[
              { label: 'Busca Orgânica', value: data.traffic.organic, color: 'green' },
              { label: 'Direto', value: data.traffic.direct, color: 'blue' },
              { label: 'Redes Sociais', value: data.traffic.social, color: 'purple' },
              { label: 'Referências', value: data.traffic.referral, color: 'orange' }
            ].map((source) => (
              <div key={source.label} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{source.label}</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`bg-${source.color}-600 h-2 rounded-full`} 
                      style={{width: `${source.value}%`}}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-10">
                    {source.value}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Engagement Metrics */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <ArrowTrendingUpIcon className="h-5 w-5 text-green-600" />
            Métricas de Engajamento
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{data.engagement.avgTimeOnPage}min</p>
              <p className="text-sm text-green-700">Tempo Médio na Página</p>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{data.engagement.pagesPerSession}</p>
              <p className="text-sm text-blue-700">Páginas por Sessão</p>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">{data.engagement.returnVisitorRate}%</p>
              <p className="text-sm text-purple-700">Visitantes Recorrentes</p>
            </div>
            
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <p className="text-2xl font-bold text-orange-600">{data.engagement.newVisitorRate}%</p>
              <p className="text-sm text-orange-700">Novos Visitantes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo de Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">Excelente</div>
            <div className="text-sm text-gray-600">Crescimento de usuários está 23.5% acima da meta</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">Boa</div>
            <div className="text-sm text-gray-600">Engajamento cresceu 12.8% no período</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">Atenção</div>
            <div className="text-sm text-gray-600">Taxa de rejeição ainda pode melhorar</div>
          </div>
        </div>
      </div>
    </div>
  )
}