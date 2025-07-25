'use client'

import { useState, useEffect } from 'react'
import {
  UserGroupIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CheckBadgeIcon,
  CalendarIcon,
  MapPinIcon,
  EyeIcon,
  UserIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline'

interface Participant {
  id: string
  name: string
  email: string
  city: string
  state: string
  joinDate: string
  eventsAttended: number
  lastActivity: string
  verified: boolean
  status: 'active' | 'inactive'
}

export default function ParticipantsPage() {
  const [participants, setParticipants] = useState<Participant[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null)

  useEffect(() => {
    // Mock participants data
    setParticipants([
      {
        id: '1',
        name: 'Pedro Henrique Silva',
        email: 'pedro.silva@email.com',
        city: 'São Paulo',
        state: 'SP',
        joinDate: '2024-02-15',
        eventsAttended: 3,
        lastActivity: '2024-07-20',
        verified: true,
        status: 'active'
      },
      {
        id: '2',
        name: 'Juliana Costa Santos',
        email: 'juliana.santos@email.com',
        city: 'Rio de Janeiro',
        state: 'RJ',
        joinDate: '2024-03-22',
        eventsAttended: 1,
        lastActivity: '2024-07-18',
        verified: true,
        status: 'active'
      },
      {
        id: '3',
        name: 'Roberto Carlos Oliveira',
        email: 'roberto.oliveira@email.com',
        city: 'Brasília',
        state: 'DF',
        joinDate: '2024-01-10',
        eventsAttended: 7,
        lastActivity: '2024-07-22',
        verified: true,
        status: 'active'
      },
      {
        id: '4',
        name: 'Amanda Ferreira Lima',
        email: 'amanda.lima@email.com',
        city: 'Salvador',
        state: 'BA',
        joinDate: '2024-04-05',
        eventsAttended: 2,
        lastActivity: '2024-06-15',
        verified: false,
        status: 'inactive'
      },
      {
        id: '5',
        name: 'Lucas Andrade Souza',
        email: 'lucas.souza@email.com',
        city: 'Fortaleza',
        state: 'CE',
        joinDate: '2024-05-12',
        eventsAttended: 4,
        lastActivity: '2024-07-19',
        verified: true,
        status: 'active'
      }
    ])
  }, [])

  const filteredParticipants = participants.filter(participant => {
    const matchesSearch = participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         participant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         participant.city.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = statusFilter === 'all' || participant.status === statusFilter
    return matchesSearch && matchesFilter
  })

  const getStatusBadge = (status: string) => {
    const badges = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800'
    }
    const labels = {
      active: 'Ativo',
      inactive: 'Inativo'
    }
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${badges[status as keyof typeof badges]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    )
  }

  // Calculate stats
  const totalParticipants = participants.length
  const activeParticipants = participants.filter(p => p.status === 'active').length
  const verifiedParticipants = participants.filter(p => p.verified).length
  const totalEvents = participants.reduce((sum, p) => sum + p.eventsAttended, 0)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <UserGroupIcon className="h-8 w-8 text-purple-600" />
          Monitorar Participantes
        </h1>
        <p className="text-gray-600 mt-2">Acompanhamento e estatísticas dos participantes da plataforma</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-700 text-sm font-medium">Total de Participantes</p>
              <p className="text-2xl font-bold text-blue-600">{totalParticipants}</p>
            </div>
            <UserGroupIcon className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-700 text-sm font-medium">Participantes Ativos</p>
              <p className="text-2xl font-bold text-green-600">{activeParticipants}</p>
            </div>
            <ArrowTrendingUpIcon className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-700 text-sm font-medium">Verificados</p>
              <p className="text-2xl font-bold text-purple-600">{verifiedParticipants}</p>
            </div>
            <CheckBadgeIcon className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-700 text-sm font-medium">Total de Participações</p>
              <p className="text-2xl font-bold text-orange-600">{totalEvents}</p>
            </div>
            <CalendarIcon className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nome, email ou cidade..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <FunnelIcon className="h-5 w-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="all">Todos os Status</option>
              <option value="active">Ativos</option>
              <option value="inactive">Inativos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Participants Table */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Lista de Participantes ({filteredParticipants.length})
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Participante
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Localização
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Participações
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Última Atividade
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredParticipants.map((participant) => (
                <tr key={participant.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center text-white font-semibold">
                        {participant.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                          {participant.name}
                          {participant.verified && (
                            <CheckBadgeIcon className="h-4 w-4 text-green-500" title="Verificado" />
                          )}
                        </div>
                        <div className="text-sm text-gray-500">{participant.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <MapPinIcon className="h-4 w-4 text-gray-400 mr-1" />
                      {participant.city}, {participant.state}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(participant.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <CalendarIcon className="h-4 w-4 text-gray-400 mr-1" />
                      {participant.eventsAttended} eventos
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(participant.lastActivity).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => setSelectedParticipant(participant)}
                      className="text-purple-600 hover:text-purple-900 p-1 rounded"
                      title="Ver detalhes"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Participant Detail Modal */}
      {selectedParticipant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Detalhes do Participante</h3>
                <button
                  onClick={() => setSelectedParticipant(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center text-white text-xl font-semibold">
                  {selectedParticipant.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    {selectedParticipant.name}
                    {selectedParticipant.verified && (
                      <CheckBadgeIcon className="h-5 w-5 text-green-500" />
                    )}
                  </h4>
                  <p className="text-gray-600">{selectedParticipant.email}</p>
                  {getStatusBadge(selectedParticipant.status)}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h5 className="font-medium text-gray-900">Informações Pessoais</h5>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPinIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{selectedParticipant.city}, {selectedParticipant.state}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <UserIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">Membro desde {new Date(selectedParticipant.joinDate).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h5 className="font-medium text-gray-900">Estatísticas de Participação</h5>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{selectedParticipant.eventsAttended} eventos participados</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ArrowTrendingUpIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">Última atividade: {new Date(selectedParticipant.lastActivity).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h5 className="font-medium text-gray-900 mb-2">Engajamento</h5>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Nível de Participação:</span>
                  <span className={`font-medium ${
                    selectedParticipant.eventsAttended >= 5 ? 'text-green-600' : 
                    selectedParticipant.eventsAttended >= 2 ? 'text-yellow-600' : 
                    'text-gray-600'
                  }`}>
                    {selectedParticipant.eventsAttended >= 5 ? 'Alto' : 
                     selectedParticipant.eventsAttended >= 2 ? 'Médio' : 
                     'Baixo'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}