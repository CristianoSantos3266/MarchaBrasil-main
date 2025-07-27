'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import {
  UsersIcon,
  MapPinIcon,
  CalendarIcon,
  CogIcon,
  UserPlusIcon,
  UserMinusIcon,
  ExclamationTriangleIcon,
  BuildingLibraryIcon,
  TagIcon,
  ClockIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline'

interface Nucleo {
  id: string
  name: string
  description: string
  city: string
  state: string
  category: string
  meetingFrequency: string
  maxMembers: number
  isPrivate: boolean
  tags: string[]
  rules: string[]
  createdBy: string
  createdAt: string
  memberCount: number
  status: 'active' | 'inactive' | 'suspended'
  members: string[]
  pendingRequests?: string[]
}

interface Member {
  id: string
  name: string
  email: string
  joinedAt: string
  role: 'admin' | 'moderator' | 'member'
}

export default function NucleoManagement() {
  const { user } = useAuth()
  const [nucleos, setNucleos] = useState<Nucleo[]>([])
  const [selectedNucleo, setSelectedNucleo] = useState<Nucleo | null>(null)
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'settings'>('overview')

  useEffect(() => {
    if (user) {
      loadNucleos()
    }
  }, [user])

  const loadNucleos = async () => {
    try {
      // Load user's created nucleos
      const savedNucleos = localStorage.getItem(`nucleos_${user?.id}`)
      const userNucleos = savedNucleos ? JSON.parse(savedNucleos) : []
      
      // Load nucleos where user is a member
      const allNucleos = localStorage.getItem('all_nucleos') || '[]'
      const allNucleosData = JSON.parse(allNucleos)
      const memberNucleos = allNucleosData.filter((nucleo: Nucleo) => 
        nucleo.members.includes(user?.id || '') && nucleo.createdBy !== user?.id
      )

      const combinedNucleos = [...userNucleos, ...memberNucleos]
      setNucleos(combinedNucleos)
      
      if (combinedNucleos.length > 0) {
        setSelectedNucleo(combinedNucleos[0])
        loadMembers(combinedNucleos[0])
      }
    } catch (error) {
      console.error('Error loading nucleos:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadMembers = async (nucleo: Nucleo) => {
    try {
      // In production, this would fetch real member data
      const demoMembers: Member[] = [
        {
          id: user?.id || 'user1',
          name: user?.user_metadata?.full_name || 'Você',
          email: user?.email || 'seu@email.com',
          joinedAt: nucleo.createdAt,
          role: nucleo.createdBy === user?.id ? 'admin' : 'member'
        },
        {
          id: 'member2',
          name: 'Maria Silva',
          email: 'maria@example.com',
          joinedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          role: 'moderator'
        },
        {
          id: 'member3',
          name: 'João Santos',
          email: 'joao@example.com',
          joinedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          role: 'member'
        }
      ]

      setMembers(demoMembers.slice(0, nucleo.memberCount))
    } catch (error) {
      console.error('Error loading members:', error)
    }
  }

  const updateNucleoStatus = async (nucleoId: string, status: 'active' | 'inactive' | 'suspended') => {
    try {
      const updatedNucleos = nucleos.map(nucleo => 
        nucleo.id === nucleoId ? { ...nucleo, status } : nucleo
      )
      setNucleos(updatedNucleos)
      
      if (selectedNucleo?.id === nucleoId) {
        setSelectedNucleo({ ...selectedNucleo, status })
      }

      // Update in localStorage
      const savedNucleos = localStorage.getItem(`nucleos_${user?.id}`)
      if (savedNucleos) {
        const userNucleos = JSON.parse(savedNucleos)
        const updated = userNucleos.map((nucleo: Nucleo) => 
          nucleo.id === nucleoId ? { ...nucleo, status } : nucleo
        )
        localStorage.setItem(`nucleos_${user?.id}`, JSON.stringify(updated))
      }

      console.log(`Núcleo ${nucleoId} status updated to ${status}`)
    } catch (error) {
      console.error('Error updating nucleo status:', error)
    }
  }

  const removeMember = async (memberId: string) => {
    if (!selectedNucleo) return
    
    try {
      const updatedMembers = members.filter(member => member.id !== memberId)
      setMembers(updatedMembers)
      
      const updatedNucleo = {
        ...selectedNucleo,
        memberCount: selectedNucleo.memberCount - 1,
        members: selectedNucleo.members.filter(id => id !== memberId)
      }
      setSelectedNucleo(updatedNucleo)
      
      console.log(`Member ${memberId} removed from núcleo ${selectedNucleo.id}`)
    } catch (error) {
      console.error('Error removing member:', error)
    }
  }

  const changeMemberRole = async (memberId: string, newRole: 'admin' | 'moderator' | 'member') => {
    try {
      const updatedMembers = members.map(member => 
        member.id === memberId ? { ...member, role: newRole } : member
      )
      setMembers(updatedMembers)
      
      console.log(`Member ${memberId} role changed to ${newRole}`)
    } catch (error) {
      console.error('Error changing member role:', error)
    }
  }

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'text-green-600 bg-green-50 border-green-200',
      inactive: 'text-gray-600 bg-gray-50 border-gray-200',
      suspended: 'text-red-600 bg-red-50 border-red-200'
    }
    return colors[status as keyof typeof colors] || colors.active
  }

  const getRoleColor = (role: string) => {
    const colors = {
      admin: 'text-purple-600 bg-purple-50 border-purple-200',
      moderator: 'text-blue-600 bg-blue-50 border-blue-200',
      member: 'text-gray-600 bg-gray-50 border-gray-200'
    }
    return colors[role as keyof typeof colors] || colors.member
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

  if (nucleos.length === 0) {
    return (
      <div className="text-center py-12">
        <BuildingLibraryIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum núcleo encontrado</h3>
        <p className="text-gray-500 mb-6">Você ainda não criou ou participou de nenhum núcleo.</p>
      </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Nucleos List */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Seus Núcleos</h3>
          </div>
          
          <div className="divide-y divide-gray-100">
            {nucleos.map(nucleo => (
              <button
                key={nucleo.id}
                onClick={() => {
                  setSelectedNucleo(nucleo)
                  loadMembers(nucleo)
                  setActiveTab('overview')
                }}
                className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                  selectedNucleo?.id === nucleo.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">{nucleo.name}</h4>
                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                      <MapPinIcon className="w-3 h-3" />
                      {nucleo.city}, {nucleo.state}
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                      <UsersIcon className="w-3 h-3" />
                      {nucleo.memberCount} membros
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {nucleo.isPrivate && <EyeSlashIcon className="w-4 h-4 text-gray-400" />}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(nucleo.status)}`}>
                      {nucleo.status === 'active' && 'Ativo'}
                      {nucleo.status === 'inactive' && 'Inativo'}
                      {nucleo.status === 'suspended' && 'Suspenso'}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Nucleo Details */}
      {selectedNucleo && (
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedNucleo.name}</h2>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <MapPinIcon className="w-4 h-4" />
                      {selectedNucleo.city}, {selectedNucleo.state}
                    </div>
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="w-4 h-4" />
                      Criado em {new Date(selectedNucleo.createdAt).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {selectedNucleo.isPrivate && (
                    <span className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm">
                      <EyeSlashIcon className="w-3 h-3" />
                      Privado
                    </span>
                  )}
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedNucleo.status)}`}>
                    {selectedNucleo.status === 'active' && 'Ativo'}
                    {selectedNucleo.status === 'inactive' && 'Inativo'}
                    {selectedNucleo.status === 'suspended' && 'Suspenso'}
                  </span>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 mt-6">
                {(['overview', 'members', 'settings'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === tab 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {tab === 'overview' && 'Visão Geral'}
                    {tab === 'members' && 'Membros'}
                    {tab === 'settings' && 'Configurações'}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Descrição</h3>
                    <p className="text-gray-600">{selectedNucleo.description}</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Detalhes</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Categoria:</span>
                          <span className="font-medium capitalize">{selectedNucleo.category}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Frequência:</span>
                          <span className="font-medium">{selectedNucleo.meetingFrequency}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Membros:</span>
                          <span className="font-medium">{selectedNucleo.memberCount}/{selectedNucleo.maxMembers}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedNucleo.tags.map(tag => (
                          <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                            <TagIcon className="w-3 h-3" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Regras do Núcleo</h4>
                    <div className="space-y-2">
                      {selectedNucleo.rules.map((rule, index) => (
                        <div key={index} className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="text-blue-600 font-medium">{index + 1}.</span>
                          <span>{rule}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'members' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-gray-900">
                      Membros ({members.length})
                    </h3>
                    {selectedNucleo.createdBy === user?.id && (
                      <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <UserPlusIcon className="w-4 h-4" />
                        Convidar Membro
                      </button>
                    )}
                  </div>

                  <div className="space-y-3">
                    {members.map(member => (
                      <div key={member.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <UsersIcon className="w-5 h-5 text-gray-500" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{member.name}</h4>
                            <p className="text-sm text-gray-500">{member.email}</p>
                            <p className="text-xs text-gray-400">
                              Membro desde {new Date(member.joinedAt).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRoleColor(member.role)}`}>
                            {member.role === 'admin' && 'Administrador'}
                            {member.role === 'moderator' && 'Moderador'}
                            {member.role === 'member' && 'Membro'}
                          </span>

                          {selectedNucleo.createdBy === user?.id && member.id !== user?.id && (
                            <div className="flex gap-1">
                              <select
                                value={member.role}
                                onChange={(e) => changeMemberRole(member.id, e.target.value as any)}
                                className="text-xs border border-gray-300 rounded px-2 py-1"
                              >
                                <option value="member">Membro</option>
                                <option value="moderator">Moderador</option>
                                <option value="admin">Admin</option>
                              </select>
                              <button
                                onClick={() => removeMember(member.id)}
                                className="p-1 text-red-600 hover:bg-red-50 rounded"
                                title="Remover membro"
                              >
                                <UserMinusIcon className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'settings' && selectedNucleo.createdBy === user?.id && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-4">Status do Núcleo</h3>
                    <div className="flex gap-3">
                      <button
                        onClick={() => updateNucleoStatus(selectedNucleo.id, 'active')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          selectedNucleo.status === 'active'
                            ? 'bg-green-600 text-white'
                            : 'bg-green-50 text-green-600 hover:bg-green-100'
                        }`}
                      >
                        Ativar
                      </button>
                      <button
                        onClick={() => updateNucleoStatus(selectedNucleo.id, 'inactive')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          selectedNucleo.status === 'inactive'
                            ? 'bg-gray-600 text-white'
                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        Pausar
                      </button>
                      <button
                        onClick={() => updateNucleoStatus(selectedNucleo.id, 'suspended')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          selectedNucleo.status === 'suspended'
                            ? 'bg-red-600 text-white'
                            : 'bg-red-50 text-red-600 hover:bg-red-100'
                        }`}
                      >
                        Suspender
                      </button>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="font-medium text-red-900 mb-2 flex items-center gap-2">
                      <ExclamationTriangleIcon className="w-5 h-5" />
                      Zona de Perigo
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Excluir este núcleo é uma ação permanente e não pode ser desfeita.
                    </p>
                    <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                      Excluir Núcleo
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}