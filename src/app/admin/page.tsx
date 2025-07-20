'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/ui/Navigation'
import { useAuth } from '@/contexts/AuthContext'
import { getPendingUsers, getPendingEvents, approveUser, approveEvent, rejectEvent } from '@/lib/supabase'
import { User, Event } from '@/types/database'

export default function AdminPage() {
  const { user, userProfile } = useAuth()
  const router = useRouter()
  const [pendingUsers, setPendingUsers] = useState<User[]>([])
  const [pendingEvents, setPendingEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'users' | 'events'>('users')

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    if (!userProfile || userProfile.role !== 'admin') {
      router.push('/')
      return
    }

    loadData()
  }, [user, userProfile, router])

  const loadData = async () => {
    setLoading(true)
    try {
      const [usersResponse, eventsResponse] = await Promise.all([
        getPendingUsers(),
        getPendingEvents()
      ])

      if (usersResponse.data) setPendingUsers(usersResponse.data)
      if (eventsResponse.data) setPendingEvents(eventsResponse.data)
    } catch (error) {
      console.error('Error loading admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApproveUser = async (userId: string) => {
    try {
      const { error } = await approveUser(userId)
      if (error) throw error

      setPendingUsers(prev => prev.filter(u => u.id !== userId))
      alert('Organizador aprovado com sucesso!')
    } catch (error) {
      console.error('Error approving user:', error)
      alert('Erro ao aprovar organizador')
    }
  }

  const handleApproveEvent = async (eventId: string) => {
    try {
      const { error } = await approveEvent(eventId)
      if (error) throw error

      setPendingEvents(prev => prev.filter(e => e.id !== eventId))
      alert('Evento aprovado com sucesso!')
    } catch (error) {
      console.error('Error approving event:', error)
      alert('Erro ao aprovar evento')
    }
  }

  const handleRejectEvent = async (eventId: string) => {
    const reason = prompt('Motivo da rejeição:')
    if (!reason) return

    try {
      const { error } = await rejectEvent(eventId, reason)
      if (error) throw error

      setPendingEvents(prev => prev.filter(e => e.id !== eventId))
      alert('Evento rejeitado')
    } catch (error) {
      console.error('Error rejecting event:', error)
      alert('Erro ao rejeitar evento')
    }
  }

  if (!user || !userProfile || userProfile.role !== 'admin') {
    return <div>Acesso negado</div>
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-blue-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="text-xl">Carregando...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-blue-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg border-2 border-green-200">
          <div className="border-b border-gray-200 p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              🛠️ Painel Administrativo
            </h1>
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('users')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'users'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Organizadores Pendentes ({pendingUsers.length})
              </button>
              <button
                onClick={() => setActiveTab('events')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'events'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Eventos Pendentes ({pendingEvents.length})
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'users' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  👤 Organizadores Aguardando Aprovação
                </h2>
                
                {pendingUsers.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <div className="text-4xl mb-4">✅</div>
                    <p>Nenhum organizador pendente de aprovação</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {pendingUsers.map((user) => (
                      <div key={user.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <h3 className="font-bold text-lg text-gray-900">{user.public_name}</h3>
                            <p className="text-gray-600">Nome: {user.name}</p>
                            <p className="text-gray-600">Email: {user.email}</p>
                            <p className="text-gray-600">Localização: {user.city}, {user.state}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">WhatsApp: {user.whatsapp}</p>
                            {user.social_link && (
                              <p className="text-gray-600">
                                Rede Social: <a href={user.social_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Ver perfil</a>
                              </p>
                            )}
                            <p className="text-gray-600">Solicitado em: {new Date(user.created_at).toLocaleDateString('pt-BR')}</p>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <h4 className="font-semibold text-gray-900 mb-2">Motivação:</h4>
                          <p className="text-gray-700 bg-white p-3 rounded border">{user.motivation}</p>
                        </div>
                        
                        <div className="flex gap-4">
                          <button
                            onClick={() => handleApproveUser(user.id)}
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                          >
                            ✅ Aprovar Organizador
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Tem certeza que deseja rejeitar este organizador?')) {
                                // TODO: Implement reject user functionality
                              }
                            }}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                          >
                            ❌ Rejeitar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'events' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  📅 Eventos Aguardando Aprovação
                </h2>
                
                {pendingEvents.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <div className="text-4xl mb-4">✅</div>
                    <p>Nenhum evento pendente de aprovação</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {pendingEvents.map((event: any) => (
                      <div key={event.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <h3 className="font-bold text-lg text-gray-900">{event.title}</h3>
                            <p className="text-gray-600">Tipo: {event.type}</p>
                            <p className="text-gray-600">Data: {new Date(event.date).toLocaleDateString('pt-BR')} às {event.time}</p>
                            <p className="text-gray-600">Local: {event.meeting_point}</p>
                            <p className="text-gray-600">Cidade: {event.city}, {event.state}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Organizador: {event.users?.public_name}</p>
                            <p className="text-gray-600">Email: {event.users?.email}</p>
                            <p className="text-gray-600">WhatsApp: {event.users?.whatsapp}</p>
                            <p className="text-gray-600">Estimativa: {event.expected_attendance || 'Não informado'} pessoas</p>
                            <p className="text-gray-600">Criado em: {new Date(event.created_at).toLocaleDateString('pt-BR')}</p>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <h4 className="font-semibold text-gray-900 mb-2">Descrição:</h4>
                          <p className="text-gray-700 bg-white p-3 rounded border">{event.description}</p>
                        </div>

                        {event.final_destination && (
                          <div className="mb-4">
                            <h4 className="font-semibold text-gray-900 mb-2">Destino Final:</h4>
                            <p className="text-gray-700 bg-white p-3 rounded border">{event.final_destination}</p>
                          </div>
                        )}
                        
                        <div className="flex gap-4">
                          <button
                            onClick={() => handleApproveEvent(event.id)}
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                          >
                            ✅ Aprovar Evento
                          </button>
                          <button
                            onClick={() => handleRejectEvent(event.id)}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                          >
                            ❌ Rejeitar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}