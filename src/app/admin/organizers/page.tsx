'use client'

import { useState, useEffect } from 'react'
import {
  UsersIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CheckBadgeIcon,
  ClockIcon,
  XCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  EyeIcon,
  PencilIcon
} from '@heroicons/react/24/outline'

interface Organizer {
  id: string
  name: string
  email: string
  phone?: string
  city: string
  state: string
  verified: boolean
  eventsCount: number
  joinDate: string
  status: 'verified' | 'pending' | 'rejected'
  lastLogin: string
}

export default function OrganizersPage() {
  const [organizers, setOrganizers] = useState<Organizer[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'verified' | 'pending' | 'rejected'>('all')
  const [selectedOrganizer, setSelectedOrganizer] = useState<Organizer | null>(null)

  useEffect(() => {
    // Mock organizers data
    setOrganizers([
      {
        id: '1',
        name: 'João Silva Santos',
        email: 'joao.santos@email.com',
        phone: '+55 11 99999-1234',
        city: 'São Paulo',
        state: 'SP',
        verified: true,
        eventsCount: 5,
        joinDate: '2024-01-15',
        status: 'verified',
        lastLogin: '2024-07-20'
      },
      {
        id: '2',
        name: 'Maria Fernanda Lima',
        email: 'maria.lima@email.com',
        phone: '+55 21 98888-5678',
        city: 'Rio de Janeiro',
        state: 'RJ',
        verified: false,
        eventsCount: 2,
        joinDate: '2024-03-10',
        status: 'pending',
        lastLogin: '2024-07-18'
      },
      {
        id: '3',
        name: 'Carlos Eduardo Rocha',
        email: 'carlos.rocha@email.com',
        phone: '+55 31 97777-9876',
        city: 'Belo Horizonte',
        state: 'MG',
        verified: true,
        eventsCount: 8,
        joinDate: '2023-11-20',
        status: 'verified',
        lastLogin: '2024-07-22'
      },
      {
        id: '4',
        name: 'Ana Paula Costa',
        email: 'ana.costa@email.com',
        city: 'Porto Alegre',
        state: 'RS',
        verified: false,
        eventsCount: 0,
        joinDate: '2024-07-01',
        status: 'pending',
        lastLogin: '2024-07-15'
      }
    ])
  }, [])

  const filteredOrganizers = organizers.filter(organizer => {
    const matchesSearch = organizer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         organizer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         organizer.city.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = statusFilter === 'all' || organizer.status === statusFilter
    return matchesSearch && matchesFilter
  })

  const getStatusBadge = (status: string) => {
    const badges = {
      verified: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      rejected: 'bg-red-100 text-red-800'
    }
    const labels = {
      verified: 'Verificado',
      pending: 'Pendente',
      rejected: 'Rejeitado'
    }
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${badges[status as keyof typeof badges]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    )
  }

  const handleVerifyOrganizer = (id: string, action: 'verify' | 'reject') => {
    setOrganizers(prev => prev.map(org => 
      org.id === id 
        ? { ...org, status: action === 'verify' ? 'verified' : 'rejected', verified: action === 'verify' }
        : org
    ))
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <UsersIcon className="h-8 w-8 text-blue-600" />
          Gerenciar Organizadores
        </h1>
        <p className="text-gray-600 mt-2">Verificação e administração de organizadores de eventos</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-700 text-sm font-medium">Verificados</p>
              <p className="text-2xl font-bold text-green-600">
                {organizers.filter(o => o.status === 'verified').length}
              </p>
            </div>
            <CheckBadgeIcon className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-700 text-sm font-medium">Pendentes</p>
              <p className="text-2xl font-bold text-yellow-600">
                {organizers.filter(o => o.status === 'pending').length}
              </p>
            </div>
            <ClockIcon className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-700 text-sm font-medium">Total de Eventos</p>
              <p className="text-2xl font-bold text-blue-600">
                {organizers.reduce((sum, org) => sum + org.eventsCount, 0)}
              </p>
            </div>
            <CalendarIcon className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-700 text-sm font-medium">Organizadores Ativos</p>
              <p className="text-2xl font-bold text-purple-600">
                {organizers.filter(o => o.eventsCount > 0).length}
              </p>
            </div>
            <UsersIcon className="h-8 w-8 text-purple-600" />
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
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <FunnelIcon className="h-5 w-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todos os Status</option>
              <option value="verified">Verificados</option>
              <option value="pending">Pendentes</option>
              <option value="rejected">Rejeitados</option>
            </select>
          </div>
        </div>
      </div>

      {/* Organizers Table */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Lista de Organizadores ({filteredOrganizers.length})
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Organizador
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Localização
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Eventos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Último Login
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrganizers.map((organizer) => (
                <tr key={organizer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                        {organizer.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{organizer.name}</div>
                        <div className="text-sm text-gray-500">{organizer.email}</div>
                        {organizer.phone && (
                          <div className="text-xs text-gray-400">{organizer.phone}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <MapPinIcon className="h-4 w-4 text-gray-400 mr-1" />
                      {organizer.city}, {organizer.state}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(organizer.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <CalendarIcon className="h-4 w-4 text-gray-400 mr-1" />
                      {organizer.eventsCount} eventos
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(organizer.lastLogin).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedOrganizer(organizer)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded"
                        title="Ver detalhes"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      
                      {organizer.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleVerifyOrganizer(organizer.id, 'verify')}
                            className="text-green-600 hover:text-green-900 p-1 rounded"
                            title="Verificar"
                          >
                            <CheckBadgeIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleVerifyOrganizer(organizer.id, 'reject')}
                            className="text-red-600 hover:text-red-900 p-1 rounded"
                            title="Rejeitar"
                          >
                            <XCircleIcon className="h-4 w-4" />
                          </button>
                        </>
                      )}

                      <a
                        href={`mailto:${organizer.email}`}
                        className="text-gray-600 hover:text-gray-900 p-1 rounded"
                        title="Enviar email"
                      >
                        <EnvelopeIcon className="h-4 w-4" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Organizer Detail Modal */}
      {selectedOrganizer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Detalhes do Organizador</h3>
                <button
                  onClick={() => setSelectedOrganizer(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-semibold">
                  {selectedOrganizer.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900">{selectedOrganizer.name}</h4>
                  <p className="text-gray-600">{selectedOrganizer.email}</p>
                  {getStatusBadge(selectedOrganizer.status)}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h5 className="font-medium text-gray-900">Informações de Contato</h5>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <EnvelopeIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{selectedOrganizer.email}</span>
                    </div>
                    {selectedOrganizer.phone && (
                      <div className="flex items-center gap-2">
                        <PhoneIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{selectedOrganizer.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <MapPinIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{selectedOrganizer.city}, {selectedOrganizer.state}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h5 className="font-medium text-gray-900">Estatísticas</h5>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{selectedOrganizer.eventsCount} eventos organizados</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ClockIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">Membro desde {new Date(selectedOrganizer.joinDate).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <EyeIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">Último login: {new Date(selectedOrganizer.lastLogin).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {selectedOrganizer.status === 'pending' && (
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      handleVerifyOrganizer(selectedOrganizer.id, 'verify')
                      setSelectedOrganizer(null)
                    }}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                  >
                    <CheckBadgeIcon className="h-5 w-5" />
                    Verificar Organizador
                  </button>
                  <button
                    onClick={() => {
                      handleVerifyOrganizer(selectedOrganizer.id, 'reject')
                      setSelectedOrganizer(null)
                    }}
                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"
                  >
                    <XCircleIcon className="h-5 w-5" />
                    Rejeitar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}