'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import {
  CalendarIcon,
  MapPinIcon,
  UsersIcon,
  TrophyIcon,
  HandRaisedIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

interface ParticipationEvent {
  id: string
  title: string
  type: string
  date: string
  location: string
  city: string
  rsvpType: string
  status: 'confirmed' | 'attended' | 'missed'
  organizerName: string
  attendanceCount?: number
}

interface ParticipationStats {
  totalEvents: number
  eventsAttended: number
  favoriteCategory: string
  streakDays: number
  firstEventDate: string
}

export default function ParticipationHistory() {
  const { user } = useAuth()
  const [history, setHistory] = useState<ParticipationEvent[]>([])
  const [stats, setStats] = useState<ParticipationStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'attended' | 'confirmed' | 'missed'>('all')

  useEffect(() => {
    if (user) {
      loadParticipationHistory()
    }
  }, [user])

  const loadParticipationHistory = async () => {
    try {
      // In production, this would fetch from your database
      const savedHistory = localStorage.getItem(`participation_${user?.id}`)
      const participationData = savedHistory ? JSON.parse(savedHistory) : generateDemoHistory()
      
      setHistory(participationData.events || [])
      setStats(participationData.stats || calculateStats(participationData.events || []))
      
      // Save demo data if none exists
      if (!savedHistory) {
        localStorage.setItem(`participation_${user?.id}`, JSON.stringify(participationData))
      }
    } catch (error) {
      console.error('Error loading participation history:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateDemoHistory = () => {
    const events: ParticipationEvent[] = [
      {
        id: '1',
        title: 'Manifestação pela Liberdade de Expressão',
        type: 'manifestacao',
        date: '2024-01-15',
        location: 'Praça da Sé',
        city: 'São Paulo',
        rsvpType: 'populacaoGeral',
        status: 'attended',
        organizerName: 'Coordenação SP',
        attendanceCount: 5000
      },
      {
        id: '2',
        title: 'Carreata dos Caminhoneiros',
        type: 'caminhoneiros',
        date: '2024-02-20',
        location: 'Rodovia Presidente Dutra',
        city: 'São Paulo',
        rsvpType: 'caminhoneiros',
        status: 'attended',
        organizerName: 'Sindicato dos Caminhoneiros',
        attendanceCount: 1200
      },
      {
        id: '3',
        title: 'Assembleia Municipal',
        type: 'assembleia',
        date: '2024-03-10',
        location: 'Câmara Municipal',
        city: 'São Paulo',
        rsvpType: 'populacaoGeral',
        status: 'confirmed',
        organizerName: 'Vereador João Silva'
      },
      {
        id: '4',
        title: 'Motociata pela Segurança',
        type: 'motociata',
        date: '2024-01-30',
        location: 'Marginal Tietê',
        city: 'São Paulo',
        rsvpType: 'motociclistas',
        status: 'missed',
        organizerName: 'Clube dos Motociclistas',
        attendanceCount: 800
      },
      {
        id: '5',
        title: 'Tratorada dos Produtores Rurais',
        type: 'tratorada',
        date: '2024-02-05',
        location: 'Esplanada dos Ministérios',
        city: 'Brasília',
        rsvpType: 'produtoresRurais',
        status: 'attended',
        organizerName: 'Federação Rural',
        attendanceCount: 3000
      }
    ]

    const stats = calculateStats(events)
    return { events, stats }
  }

  const calculateStats = (events: ParticipationEvent[]): ParticipationStats => {
    const attended = events.filter(e => e.status === 'attended')
    const typeCount = events.reduce((acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + 1
      return acc
    }, {} as { [key: string]: number })
    
    const favoriteCategory = Object.keys(typeCount).reduce((a, b) => 
      typeCount[a] > typeCount[b] ? a : b, Object.keys(typeCount)[0] || 'manifestacao'
    )

    return {
      totalEvents: events.length,
      eventsAttended: attended.length,
      favoriteCategory,
      streakDays: 45, // Demo streak
      firstEventDate: events[events.length - 1]?.date || new Date().toISOString()
    }
  }

  const filteredHistory = history.filter(event => {
    if (filter === 'all') return true
    return event.status === filter
  })

  const getEventIcon = (type: string) => {
    const icons: { [key: string]: any } = {
      manifestacao: HandRaisedIcon,
      assembleia: UsersIcon,
      caminhoneiros: MapPinIcon,
      motociata: MapPinIcon,
      tratorada: MapPinIcon,
      carreata: MapPinIcon
    }
    return icons[type] || HandRaisedIcon
  }

  const getStatusColor = (status: string) => {
    const colors = {
      attended: 'text-green-600 bg-green-50 border-green-200',
      confirmed: 'text-blue-600 bg-blue-50 border-blue-200',
      missed: 'text-red-600 bg-red-50 border-red-200'
    }
    return colors[status as keyof typeof colors] || colors.confirmed
  }

  const getStatusText = (status: string) => {
    const texts = {
      attended: 'Participou',
      confirmed: 'Confirmado',
      missed: 'Não Compareceu'
    }
    return texts[status as keyof typeof texts] || 'Confirmado'
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      {stats && (
        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center gap-3">
              <CalendarIcon className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-blue-900">{stats.totalEvents}</p>
                <p className="text-sm text-blue-600">Eventos Totais</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center gap-3">
              <CheckCircleIcon className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-green-900">{stats.eventsAttended}</p>
                <p className="text-sm text-green-600">Participações</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <div className="flex items-center gap-3">
              <TrophyIcon className="w-8 h-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold text-yellow-900">{stats.streakDays}</p>
                <p className="text-sm text-yellow-600">Dias Ativo</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center gap-3">
              <HandRaisedIcon className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-lg font-bold text-purple-900 capitalize">{stats.favoriteCategory}</p>
                <p className="text-sm text-purple-600">Categoria Favorita</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History Section */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-900">Histórico de Participação</h3>
            
            <div className="flex gap-2">
              {(['all', 'attended', 'confirmed', 'missed'] as const).map((filterType) => (
                <button
                  key={filterType}
                  onClick={() => setFilter(filterType)}
                  className={`
                    px-3 py-1 rounded-full text-sm font-medium transition-colors
                    ${filter === filterType 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }
                  `}
                >
                  {filterType === 'all' && 'Todos'}
                  {filterType === 'attended' && 'Participou'}
                  {filterType === 'confirmed' && 'Confirmados'}
                  {filterType === 'missed' && 'Não Compareceu'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-8">
              <ClockIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum evento encontrado para este filtro.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredHistory.map((event) => {
                const EventIcon = getEventIcon(event.type)
                
                return (
                  <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <EventIcon className="w-6 h-6 text-blue-600" />
                        </div>
                        
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">{event.title}</h4>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                            <div className="flex items-center gap-1">
                              <CalendarIcon className="w-4 h-4" />
                              {new Date(event.date).toLocaleDateString('pt-BR')}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPinIcon className="w-4 h-4" />
                              {event.location}, {event.city}
                            </div>
                            {event.attendanceCount && (
                              <div className="flex items-center gap-1">
                                <UsersIcon className="w-4 h-4" />
                                {event.attendanceCount.toLocaleString()} pessoas
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">
                            Organizado por {event.organizerName}
                          </p>
                        </div>
                      </div>
                      
                      <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(event.status)}`}>
                        {getStatusText(event.status)}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}