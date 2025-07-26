'use client'

import { useState, useEffect } from 'react'
import {
  CalendarIcon,
  MapPinIcon,
  UserIcon,
  EyeIcon,
  CheckIcon,
  XMarkIcon,
  PencilIcon,
  FlagIcon,
  ClockIcon,
  PhoneIcon,
  EnvelopeIcon,
  TrashIcon
} from '@heroicons/react/24/outline'
import { getDemoEvents, deleteDemoEvent } from '@/lib/demo-events'

interface Event {
  id: string
  title: string
  type: string
  date: string
  time: string
  city: string
  region: string
  meetingPoint: string
  description: string
  organizer: string
  organizerEmail: string
  organizerPhone: string
  participants: number
  status: 'approved' | 'pending' | 'rejected'
  createdAt: string
  flagged?: boolean
}

export default function EventsManagement() {
  const [events, setEvents] = useState<Event[]>([])
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending' | 'rejected' | 'flagged'>('all')
  const [search, setSearch] = useState('')
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

  useEffect(() => {
    // Load demo events and transform data
    const demoEvents = getDemoEvents()
    const transformedEvents: Event[] = demoEvents.map(event => ({
      id: event.id,
      title: event.title,
      type: event.type,
      date: event.date,
      time: event.time,
      city: event.city,
      region: event.region,
      meetingPoint: event.meetingPoint,
      description: event.description,
      organizer: event.organizer || 'Organizador Demo',
      organizerEmail: 'organizer@example.com',
      organizerPhone: '+55 11 99999-9999',
      participants: Object.values(event.rsvps).reduce((sum: number, count: number) => sum + count, 0),
      status: (event.status as 'approved' | 'pending' | 'rejected') || 'pending',
      createdAt: event.createdAt,
      flagged: Math.random() > 0.8 // Random flagging for demo
    }))
    setEvents(transformedEvents)
  }, [])

  const filteredEvents = events.filter(event => {
    const matchesFilter = filter === 'all' || 
      (filter === 'flagged' ? event.flagged : event.status === filter)
    const matchesSearch = search === '' || 
      event.title.toLowerCase().includes(search.toLowerCase()) ||
      event.organizer.toLowerCase().includes(search.toLowerCase()) ||
      event.city.toLowerCase().includes(search.toLowerCase())
    
    return matchesFilter && matchesSearch
  })

  const getStatusBadge = (status: string, flagged?: boolean) => {
    if (flagged) {
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">🚩 Sinalizado</span>
    }
    
    const badges = {
      approved: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      rejected: 'bg-red-100 text-red-800'
    }
    const labels = {
      approved: '✅ Aprovado',
      pending: '⏳ Pendente',
      rejected: '❌ Rejeitado'
    }
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${badges[status as keyof typeof badges]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    )
  }

  const handleStatusChange = (eventId: string, newStatus: 'approved' | 'rejected') => {
    setEvents(events.map(event => 
      event.id === eventId ? { ...event, status: newStatus } : event
    ))
    
    // Show success message
    const action = newStatus === 'approved' ? 'aprovado' : 'rejeitado'
    alert(`Evento ${action} com sucesso!`)
  }

  const handleFlag = (eventId: string) => {
    setEvents(events.map(event => 
      event.id === eventId ? { ...event, flagged: !event.flagged } : event
    ))
  }

  const handleDelete = (eventId: string) => {
    if (confirm('Tem certeza que deseja excluir este evento permanentemente? Esta ação não pode ser desfeita.')) {
      // Delete from demo events (persists the deletion)
      const success = deleteDemoEvent(eventId)
      
      if (success) {
        // Update local state
        setEvents(events.filter(event => event.id !== eventId))
        
        // Close modal if deleting the selected event
        if (selectedEvent?.id === eventId) {
          setSelectedEvent(null)
        }
        
        alert('Evento excluído com sucesso!')
      } else {
        alert('Erro ao excluir evento. Tente novamente.')
      }
    }
  }

  const contactOrganizer = (type: 'email' | 'whatsapp', contact: string, eventTitle: string) => {
    if (type === 'email') {
      window.open(`mailto:${contact}?subject=Sobre o evento: ${eventTitle}`)
    } else {
      const message = `Olá! Entrando em contato sobre o evento: ${eventTitle}`
      window.open(`https://wa.me/${contact.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Eventos</h1>
        <p className="text-gray-600 mt-2">Aprovação, moderação e monitoramento de eventos</p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'Todos', count: events.length },
              { key: 'pending', label: 'Pendentes', count: events.filter(e => e.status === 'pending').length },
              { key: 'approved', label: 'Aprovados', count: events.filter(e => e.status === 'approved').length },
              { key: 'rejected', label: 'Rejeitados', count: events.filter(e => e.status === 'rejected').length },
              { key: 'flagged', label: 'Sinalizados', count: events.filter(e => e.flagged).length },
            ].map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setFilter(key as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === key
                    ? 'bg-blue-100 text-blue-700 border border-blue-300'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {label} ({count})
              </button>
            ))}
          </div>
          
          <div className="w-full lg:w-80">
            <input
              type="text"
              placeholder="Buscar por título, organizador ou cidade..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Evento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Organizador
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data/Local
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Participantes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEvents.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{event.title}</div>
                      <div className="text-sm text-gray-500 capitalize">{event.type}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{event.organizer}</div>
                      <div className="text-sm text-gray-500">{event.organizerEmail}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm text-gray-900">
                        {new Date(event.date).toLocaleDateString('pt-BR')} às {event.time}
                      </div>
                      <div className="text-sm text-gray-500">{event.city}, {event.region}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{event.participants.toLocaleString('pt-BR')}</div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(event.status, event.flagged)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedEvent(event)}
                        className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                        title="Ver detalhes"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      
                      {event.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(event.id, 'approved')}
                            className="p-1 text-green-600 hover:text-green-800 transition-colors"
                            title="Aprovar"
                          >
                            <CheckIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleStatusChange(event.id, 'rejected')}
                            className="p-1 text-red-600 hover:text-red-800 transition-colors"
                            title="Rejeitar"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      
                      <button
                        onClick={() => handleFlag(event.id)}
                        className={`p-1 transition-colors ${
                          event.flagged 
                            ? 'text-red-600 hover:text-red-800' 
                            : 'text-gray-400 hover:text-red-600'
                        }`}
                        title={event.flagged ? 'Remover sinalização' : 'Sinalizar'}
                      >
                        <FlagIcon className="h-4 w-4" />
                      </button>
                      
                      <button
                        onClick={() => contactOrganizer('email', event.organizerEmail, event.title)}
                        className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                        title="Enviar email"
                      >
                        <EnvelopeIcon className="h-4 w-4" />
                      </button>
                      
                      <button
                        onClick={() => contactOrganizer('whatsapp', event.organizerPhone, event.title)}
                        className="p-1 text-green-600 hover:text-green-800 transition-colors"
                        title="WhatsApp"
                      >
                        <PhoneIcon className="h-4 w-4" />
                      </button>
                      
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="p-1 text-red-600 hover:text-red-800 transition-colors"
                        title="Excluir evento"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum evento encontrado</h3>
            <p className="text-gray-500">Tente ajustar os filtros de busca</p>
          </div>
        )}
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Detalhes do Evento</h3>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">{selectedEvent.title}</h4>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="capitalize">{selectedEvent.type}</span>
                    {getStatusBadge(selectedEvent.status, selectedEvent.flagged)}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2">📅 Data e Horário</h5>
                    <p className="text-gray-700">
                      {new Date(selectedEvent.date).toLocaleDateString('pt-BR')} às {selectedEvent.time}
                    </p>
                  </div>
                  
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2">📍 Local</h5>
                    <p className="text-gray-700">{selectedEvent.city}, {selectedEvent.region}</p>
                    <p className="text-sm text-gray-600 mt-1">{selectedEvent.meetingPoint}</p>
                  </div>
                  
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2">👤 Organizador</h5>
                    <p className="text-gray-700">{selectedEvent.organizer}</p>
                    <p className="text-sm text-gray-600">{selectedEvent.organizerEmail}</p>
                    <p className="text-sm text-gray-600">{selectedEvent.organizerPhone}</p>
                  </div>
                  
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2">👥 Participantes</h5>
                    <p className="text-gray-700">{selectedEvent.participants.toLocaleString('pt-BR')} confirmados</p>
                    <p className="text-sm text-gray-600">
                      Criado em {new Date(selectedEvent.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
                
                <div>
                  <h5 className="font-semibold text-gray-900 mb-2">📝 Descrição</h5>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedEvent.description}</p>
                </div>
                
                <div className="flex gap-4 pt-4 border-t border-gray-200">
                  {selectedEvent.status === 'pending' && (
                    <>
                      <button
                        onClick={() => {
                          handleStatusChange(selectedEvent.id, 'approved')
                          setSelectedEvent(null)
                        }}
                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        ✅ Aprovar Evento
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Tem certeza que deseja rejeitar este evento?')) {
                            handleStatusChange(selectedEvent.id, 'rejected')
                            setSelectedEvent(null)
                          }
                        }}
                        className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        ❌ Rejeitar Evento
                      </button>
                    </>
                  )}
                  
                  <button
                    onClick={() => handleDelete(selectedEvent.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                  >
                    <TrashIcon className="h-4 w-4" />
                    Excluir Permanentemente
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}