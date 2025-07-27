'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import {
  ShieldCheckIcon,
  TrophyIcon,
  CalendarIcon,
  UsersIcon,
  StarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  ChartBarIcon,
  FireIcon
} from '@heroicons/react/24/outline'

interface TrustMetrics {
  trustScore: number
  verificationLevel: 'unverified' | 'basic' | 'enhanced' | 'premium'
  peacefulEventCount: number
  totalEventCount: number
  successfulEventCount: number
  participantSatisfaction: number
  communityEndorsements: number
  platformTenure: number // days
  violationCount: number
  lastViolationDate?: string
}

interface EventOutcome {
  eventId: string
  eventTitle: string
  date: string
  wasSuccessful: boolean
  wasPeaceful: boolean
  attendanceCount: number
  participantRating: number
  incidentReports: number
  mediaPresence: boolean
  publicSafety: 'excellent' | 'good' | 'fair' | 'poor'
  organizationQuality: 'excellent' | 'good' | 'fair' | 'poor'
  notes?: string
}

interface TrustBadge {
  id: string
  name: string
  description: string
  icon: string
  requirements: string[]
  earned: boolean
  earnedDate?: string
}

export default function TrustReputationSystem({ organizerId }: { organizerId: string }) {
  const { user } = useAuth()
  const [trustMetrics, setTrustMetrics] = useState<TrustMetrics>({
    trustScore: 0,
    verificationLevel: 'unverified',
    peacefulEventCount: 0,
    totalEventCount: 0,
    successfulEventCount: 0,
    participantSatisfaction: 0,
    communityEndorsements: 0,
    platformTenure: 0,
    violationCount: 0
  })
  const [eventHistory, setEventHistory] = useState<EventOutcome[]>([])
  const [badges, setBadges] = useState<TrustBadge[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (organizerId) {
      loadTrustData()
    }
  }, [organizerId])

  const loadTrustData = async () => {
    try {
      // In production, this would fetch from your database
      const demoData = generateDemoTrustData(organizerId)
      setTrustMetrics(demoData.metrics)
      setEventHistory(demoData.eventHistory)
      setBadges(demoData.badges)
    } catch (error) {
      console.error('Error loading trust data:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateDemoTrustData = (id: string) => {
    // Generate realistic demo data based on organizer ID
    const seed = id.split('').reduce((a, b) => a + b.charCodeAt(0), 0)
    const random = (min: number, max: number) => min + ((seed * 37) % (max - min + 1))

    const totalEvents = random(5, 25)
    const peacefulEvents = Math.max(totalEvents - random(0, 2), 0)
    const successfulEvents = Math.max(totalEvents - random(0, 1), 0)
    const violations = random(0, 2)
    const tenure = random(30, 730) // 30 days to 2 years

    const baseScore = 500 // Starting score
    const peacefulBonus = peacefulEvents * 50
    const successBonus = successfulEvents * 30
    const tenureBonus = Math.min(tenure * 0.5, 100)
    const violationPenalty = violations * 150
    const endorsementBonus = random(0, 10) * 25

    const trustScore = Math.max(300, Math.min(1000, 
      baseScore + peacefulBonus + successBonus + tenureBonus + endorsementBonus - violationPenalty
    ))

    const getVerificationLevel = (score: number, events: number): TrustMetrics['verificationLevel'] => {
      if (score >= 900 && events >= 15) return 'premium'
      if (score >= 750 && events >= 8) return 'enhanced'
      if (score >= 600 && events >= 3) return 'basic'
      return 'unverified'
    }

    const metrics: TrustMetrics = {
      trustScore,
      verificationLevel: getVerificationLevel(trustScore, peacefulEvents),
      peacefulEventCount: peacefulEvents,
      totalEventCount: totalEvents,
      successfulEventCount: successfulEvents,
      participantSatisfaction: random(75, 95),
      communityEndorsements: random(5, 50),
      platformTenure: tenure,
      violationCount: violations,
      lastViolationDate: violations > 0 ? new Date(Date.now() - random(30, 180) * 24 * 60 * 60 * 1000).toISOString() : undefined
    }

    // Generate event history
    const eventHistory: EventOutcome[] = []
    for (let i = 0; i < totalEvents; i++) {
      const daysAgo = random(7, tenure)
      const isPeaceful = i < peacefulEvents
      const isSuccessful = i < successfulEvents
      
      eventHistory.push({
        eventId: `event_${i + 1}`,
        eventTitle: `Manifestação ${i + 1}`,
        date: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString(),
        wasSuccessful: isSuccessful,
        wasPeaceful: isPeaceful,
        attendanceCount: random(50, 2000),
        participantRating: random(3.5, 5.0),
        incidentReports: isPeaceful ? 0 : random(1, 3),
        mediaPresence: random(0, 1) === 1,
        publicSafety: isPeaceful ? (random(0, 1) === 1 ? 'excellent' : 'good') : 'fair',
        organizationQuality: isSuccessful ? (random(0, 1) === 1 ? 'excellent' : 'good') : 'fair'
      })
    }

    // Generate badges
    const availableBadges: TrustBadge[] = [
      {
        id: 'peaceful_organizer',
        name: 'Organizador Pacífico',
        description: '10+ eventos sem incidentes',
        icon: '🕊️',
        requirements: ['10 eventos pacíficos', 'Zero violações graves'],
        earned: peacefulEvents >= 10 && violations === 0,
        earnedDate: peacefulEvents >= 10 ? new Date(Date.now() - random(30, 200) * 24 * 60 * 60 * 1000).toISOString() : undefined
      },
      {
        id: 'community_leader',
        name: 'Líder Comunitário',
        description: '25+ endossos da comunidade',
        icon: '👥',
        requirements: ['25+ endossos', '5+ eventos bem-sucedidos'],
        earned: metrics.communityEndorsements >= 25 && successfulEvents >= 5,
        earnedDate: metrics.communityEndorsements >= 25 ? new Date(Date.now() - random(60, 300) * 24 * 60 * 60 * 1000).toISOString() : undefined
      },
      {
        id: 'veteran_organizer',
        name: 'Organizador Veterano',
        description: '1+ ano na plataforma',
        icon: '🏆',
        requirements: ['365+ dias na plataforma', '15+ eventos'],
        earned: tenure >= 365 && totalEvents >= 15,
        earnedDate: tenure >= 365 ? new Date(Date.now() - random(100, 400) * 24 * 60 * 60 * 1000).toISOString() : undefined
      },
      {
        id: 'highly_rated',
        name: 'Altamente Avaliado',
        description: '95%+ satisfação dos participantes',
        icon: '⭐',
        requirements: ['95%+ avaliação média', '10+ eventos'],
        earned: metrics.participantSatisfaction >= 95 && totalEvents >= 10,
        earnedDate: metrics.participantSatisfaction >= 95 ? new Date(Date.now() - random(50, 250) * 24 * 60 * 60 * 1000).toISOString() : undefined
      },
      {
        id: 'safety_champion',
        name: 'Campeão da Segurança',
        description: 'Zero incidentes de segurança',
        icon: '🛡️',
        requirements: ['Zero incidentes', '5+ eventos'],
        earned: peacefulEvents === totalEvents && totalEvents >= 5,
        earnedDate: peacefulEvents === totalEvents && totalEvents >= 5 ? new Date(Date.now() - random(30, 180) * 24 * 60 * 60 * 1000).toISOString() : undefined
      }
    ]

    return {
      metrics,
      eventHistory: eventHistory.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
      badges: availableBadges
    }
  }

  const getTrustScoreColor = (score: number) => {
    if (score >= 900) return 'text-green-600'
    if (score >= 750) return 'text-blue-600'
    if (score >= 600) return 'text-yellow-600'
    if (score >= 400) return 'text-orange-600'
    return 'text-red-600'
  }

  const getTrustScoreBackground = (score: number) => {
    if (score >= 900) return 'bg-green-50 border-green-200'
    if (score >= 750) return 'bg-blue-50 border-blue-200'
    if (score >= 600) return 'bg-yellow-50 border-yellow-200'
    if (score >= 400) return 'bg-orange-50 border-orange-200'
    return 'bg-red-50 border-red-200'
  }

  const getTrustLevel = (score: number) => {
    if (score >= 900) return 'Excelente'
    if (score >= 750) return 'Muito Bom'
    if (score >= 600) return 'Bom'
    if (score >= 400) return 'Regular'
    return 'Baixo'
  }

  const getVerificationBadge = (level: TrustMetrics['verificationLevel']) => {
    const badges = {
      unverified: { label: 'Não Verificado', color: 'bg-gray-100 text-gray-600', icon: '' },
      basic: { label: 'Verificação Básica', color: 'bg-blue-100 text-blue-600', icon: '✓' },
      enhanced: { label: 'Verificação Avançada', color: 'bg-purple-100 text-purple-600', icon: '✓✓' },
      premium: { label: 'Verificação Premium', color: 'bg-gold-100 text-gold-600', icon: '👑' }
    }
    return badges[level]
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Trust Score Overview */}
      <div className={`rounded-lg border p-6 ${getTrustScoreBackground(trustMetrics.trustScore)}`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <ShieldCheckIcon className="w-6 h-6" />
              Sistema de Confiança
            </h2>
            <p className="text-gray-600 mt-1">
              Baseado em histórico de eventos pacíficos e feedback da comunidade
            </p>
          </div>
          
          <div className="text-right">
            <div className={`text-3xl font-bold ${getTrustScoreColor(trustMetrics.trustScore)}`}>
              {trustMetrics.trustScore}
            </div>
            <div className="text-sm text-gray-600">
              {getTrustLevel(trustMetrics.trustScore)}
            </div>
          </div>
        </div>

        <div className="mt-4 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-3 border">
            <div className="text-sm text-gray-600">Eventos Pacíficos</div>
            <div className="text-lg font-bold text-green-600">
              {trustMetrics.peacefulEventCount}/{trustMetrics.totalEventCount}
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-3 border">
            <div className="text-sm text-gray-600">Taxa de Sucesso</div>
            <div className="text-lg font-bold text-blue-600">
              {Math.round((trustMetrics.successfulEventCount / trustMetrics.totalEventCount) * 100) || 0}%
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-3 border">
            <div className="text-sm text-gray-600">Satisfação</div>
            <div className="text-lg font-bold text-purple-600">
              {trustMetrics.participantSatisfaction}%
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-3 border">
            <div className="text-sm text-gray-600">Endossos</div>
            <div className="text-lg font-bold text-orange-600">
              {trustMetrics.communityEndorsements}
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Verification Status */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <CheckCircleIcon className="w-5 h-5" />
              Status de Verificação
            </h3>
          </div>
          
          <div className="p-6">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getVerificationBadge(trustMetrics.verificationLevel).color}`}>
              <span>{getVerificationBadge(trustMetrics.verificationLevel).icon}</span>
              {getVerificationBadge(trustMetrics.verificationLevel).label}
            </div>
            
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Tempo na Plataforma:</span>
                <span className="font-medium">{Math.floor(trustMetrics.platformTenure / 30)} meses</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Violações:</span>
                <span className={`font-medium ${trustMetrics.violationCount === 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {trustMetrics.violationCount}
                </span>
              </div>
              {trustMetrics.lastViolationDate && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Última Violação:</span>
                  <span className="font-medium text-red-600">
                    {new Date(trustMetrics.lastViolationDate).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <TrophyIcon className="w-5 h-5" />
              Conquistas e Badges
            </h3>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-2 gap-3">
              {badges.map(badge => (
                <div
                  key={badge.id}
                  className={`p-3 rounded-lg border text-center transition-colors ${
                    badge.earned 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-gray-50 border-gray-200 opacity-60'
                  }`}
                >
                  <div className="text-2xl mb-1">{badge.icon}</div>
                  <div className={`text-xs font-medium ${badge.earned ? 'text-green-900' : 'text-gray-500'}`}>
                    {badge.name}
                  </div>
                  {badge.earned && badge.earnedDate && (
                    <div className="text-xs text-green-600 mt-1">
                      {new Date(badge.earnedDate).toLocaleDateString('pt-BR')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Event History */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <ChartBarIcon className="w-5 h-5" />
            Histórico de Eventos
          </h3>
        </div>
        
        <div className="p-6">
          {eventHistory.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CalendarIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>Nenhum evento encontrado no histórico.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {eventHistory.slice(0, 5).map(event => (
                <div key={event.eventId} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{event.eventTitle}</h4>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                      <span>{new Date(event.date).toLocaleDateString('pt-BR')}</span>
                      <span className="flex items-center gap-1">
                        <UsersIcon className="w-3 h-3" />
                        {event.attendanceCount} pessoas
                      </span>
                      <span className="flex items-center gap-1">
                        <StarIcon className="w-3 h-3" />
                        {event.participantRating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {event.wasPeaceful ? (
                      <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                        <CheckCircleIcon className="w-3 h-3" />
                        Pacífico
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded text-xs">
                        <ExclamationTriangleIcon className="w-3 h-3" />
                        Incidentes
                      </span>
                    )}
                    
                    {event.wasSuccessful ? (
                      <span className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                        <CheckCircleIcon className="w-3 h-3" />
                        Sucesso
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        <XCircleIcon className="w-3 h-3" />
                        Problemas
                      </span>
                    )}
                  </div>
                </div>
              ))}
              
              {eventHistory.length > 5 && (
                <div className="text-center">
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Ver todos os {eventHistory.length} eventos
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Trust Score Explanation */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
          <FireIcon className="w-5 h-5" />
          Como funciona o Sistema de Confiança
        </h3>
        <div className="text-sm text-blue-800 space-y-2">
          <p>• <strong>Eventos Pacíficos (+50 pontos cada):</strong> Eventos sem incidentes de violência</p>
          <p>• <strong>Eventos Bem-sucedidos (+30 pontos cada):</strong> Eventos com alta participação e organização</p>
          <p>• <strong>Tempo na Plataforma (+0.5 pontos/dia):</strong> Máximo de 100 pontos por antiguidade</p>
          <p>• <strong>Endossos da Comunidade (+25 pontos cada):</strong> Avaliações positivas de participantes</p>
          <p>• <strong>Violações (-150 pontos cada):</strong> Penalidades por desrespeitar diretrizes</p>
          <p className="pt-2 font-medium">Pontuação mínima: 300 | Pontuação máxima: 1000</p>
        </div>
      </div>
    </div>
  )
}