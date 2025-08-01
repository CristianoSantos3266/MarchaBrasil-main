'use client'

import { useState, useEffect } from 'react'
import {
  CalendarIcon,
  UsersIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  CheckBadgeIcon,
  ClockIcon,
  XCircleIcon,
  MapPinIcon,
  TrendingUpIcon,
  EyeIcon
} from '@heroicons/react/24/outline'
import OrganizerLeaderboard from '@/components/admin/OrganizerLeaderboard'

interface DashboardStats {
  totalEvents: number
  pendingEvents: number
  approvedEvents: number
  rejectedEvents: number
  totalParticipants: number
  verifiedOrganizers: number
  totalDonations: number
  flaggedItems: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalEvents: 0,
    pendingEvents: 0,
    approvedEvents: 0,
    rejectedEvents: 0,
    totalParticipants: 0,
    verifiedOrganizers: 0,
    totalDonations: 0,
    flaggedItems: 0
  })

  const [recentEvents, setRecentEvents] = useState<any[]>([])
  const [recentVideos, setRecentVideos] = useState<any[]>([])

  useEffect(() => {
    // Load demo data and calculate stats
    // Temporary static data to avoid hydration issues
    setStats({
      totalEvents: 0,
      pendingEvents: 0,
      approvedEvents: 0,
      rejectedEvents: 0,
      totalParticipants: 0,
      verifiedOrganizers: 0,
      totalDonations: 0,
      flaggedItems: 0
    })

    // No events or videos yet - fresh start
    setRecentEvents([])
    setRecentVideos([])
  }, [])

  const statCards = [
    {
      title: 'Eventos Confirmados',
      value: stats.approvedEvents,
      icon: CheckBadgeIcon,
      color: 'green',
      change: '0%'
    },
    {
      title: 'Eventos Pendentes',
      value: stats.pendingEvents,
      icon: ClockIcon,
      color: 'yellow',
      change: '0'
    },
    {
      title: 'Participantes Confirmados',
      value: stats.totalParticipants.toLocaleString('pt-BR'),
      icon: UserGroupIcon,
      color: 'blue',
      change: '0%'
    },
    {
      title: 'Organizadores Verificados',
      value: stats.verifiedOrganizers,
      icon: UsersIcon,
      color: 'purple',
      change: '0'
    },
    {
      title: 'Doações (R$)',
      value: `R$ ${stats.totalDonations.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: CurrencyDollarIcon,
      color: 'green',
      change: '0%'
    },
    {
      title: 'Itens Sinalizados',
      value: stats.flaggedItems,
      icon: ExclamationTriangleIcon,
      color: 'red',
      change: '0'
    }
  ]

  const getColorClasses = (color: string) => {
    const colors = {
      green: 'bg-green-50 text-green-700 border-green-200',
      yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      blue: 'bg-blue-50 text-blue-700 border-blue-200',
      purple: 'bg-purple-50 text-purple-700 border-purple-200',
      red: 'bg-red-50 text-red-700 border-red-200'
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  const getStatusBadge = (status: string) => {
    const badges = {
      approved: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      rejected: 'bg-red-100 text-red-800'
    }
    const labels = {
      approved: 'Aprovado',
      pending: 'Pendente',
      rejected: 'Rejeitado'
    }
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${badges[status as keyof typeof badges]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrativo</h1>
        <p className="text-gray-600 mt-2">Visão geral da plataforma Marcha Brasil</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon
          return (
            <div key={index} className={`p-6 rounded-lg border-2 ${getColorClasses(card.color)}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium opacity-75">{card.title}</p>
                  <p className="text-2xl font-bold mt-1">{card.value}</p>
                  <p className="text-sm mt-1 opacity-75">
                    <span className="font-medium">{card.change}</span> vs. mês anterior
                  </p>
                </div>
                <Icon className="h-10 w-10 opacity-75" />
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Events */}
        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Eventos Recentes</h2>
              <CalendarIcon className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 text-sm">{event.title}</h3>
                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-600">
                      <span className="flex items-center gap-1">
                        <MapPinIcon className="h-3 w-3" />
                        {event.city}, {event.region}
                      </span>
                      <span>{new Date(event.date).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(event.status || 'pending')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Videos */}
        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Vídeos Recentes</h2>
              <EyeIcon className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentVideos.map((video) => (
                <div key={video.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 text-sm">{video.title}</h3>
                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-600">
                      <span className="capitalize">{video.category}</span>
                      <span>{video.views} visualizações</span>
                      <span>{video.likes} curtidas</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(video.status)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Ações Rápidas</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg transition-colors">
              <CheckBadgeIcon className="h-6 w-6 text-green-600" />
              <div className="text-left">
                <div className="font-medium text-green-900">Aprovar Eventos</div>
                <div className="text-sm text-green-600">{stats.pendingEvents} pendentes</div>
              </div>
            </button>
            
            <button className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors">
              <UsersIcon className="h-6 w-6 text-blue-600" />
              <div className="text-left">
                <div className="font-medium text-blue-900">Verificar Organizadores</div>
                <div className="text-sm text-blue-600">0 aguardando</div>
              </div>
            </button>
            
            <button className="flex items-center gap-3 p-4 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
              <div className="text-left">
                <div className="font-medium text-red-900">Revisar Sinalizações</div>
                <div className="text-sm text-red-600">{stats.flaggedItems} itens</div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Organizer Leaderboard */}
      <div className="mt-8">
        <OrganizerLeaderboard showTop={10} timeframe="month" />
      </div>
    </div>
  )
}