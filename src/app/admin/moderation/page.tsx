'use client'

import { useState, useEffect } from 'react'
import {
  ShieldCheckIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  UserIcon,
  CalendarIcon,
  NoSymbolIcon,
  LockClosedIcon,
  ChatBubbleLeftRightIcon,
  PhotoIcon
} from '@heroicons/react/24/outline'

interface ModerationItem {
  id: string
  type: 'user' | 'event' | 'comment' | 'image'
  title: string
  description: string
  reportedBy: string
  reportedAt: string
  status: 'pending' | 'approved' | 'rejected' | 'banned'
  severity: 'low' | 'medium' | 'high' | 'critical'
  content?: string
  imageUrl?: string
  userId?: string
  userName?: string
  userEmail?: string
}

export default function ModerationPage() {
  const [items, setItems] = useState<ModerationItem[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | 'user' | 'event' | 'comment' | 'image'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'banned'>('all')
  const [selectedItem, setSelectedItem] = useState<ModerationItem | null>(null)

  useEffect(() => {
    // Mock moderation data
    setItems([
      {
        id: '1',
        type: 'user',
        title: 'Usuário Suspeito - João Silva',
        description: 'Múltiplas denúncias por comportamento agressivo e spam',
        reportedBy: 'Sistema Automático',
        reportedAt: '2024-07-22T10:30:00Z',
        status: 'pending',
        severity: 'high',
        userId: 'usr123',
        userName: 'João Silva',
        userEmail: 'joao.silva@email.com'
      },
      {
        id: '2',
        type: 'event',
        title: 'Evento com Conteúdo Questionável',
        description: 'Evento reportado por conter linguagem ofensiva na descrição',
        reportedBy: 'Ana Maria Santos',
        reportedAt: '2024-07-21T14:15:00Z',
        status: 'pending',
        severity: 'medium',
        content: 'Manifestação contra os corruptos do governo...'
      },
      {
        id: '3',
        type: 'comment',
        title: 'Comentário Ofensivo',
        description: 'Comentário com linguagem inadequada e ataques pessoais',
        reportedBy: 'Carlos Eduardo',
        reportedAt: '2024-07-20T16:45:00Z',
        status: 'rejected',
        severity: 'critical',
        content: 'Este comentário contém linguagem muito ofensiva...',
        userId: 'usr456',
        userName: 'Pedro Alves'
      },
      {
        id: '4',
        type: 'image',
        title: 'Imagem Inapropriada',
        description: 'Imagem reportada por conteúdo potencialmente ofensivo',
        reportedBy: 'Maria Fernanda',
        reportedAt: '2024-07-19T11:20:00Z',
        status: 'approved',
        severity: 'low',
        imageUrl: '/placeholder-image.jpg'
      },
      {
        id: '5',
        type: 'user',
        title: 'Conta Fake Detectada',
        description: 'Perfil suspeito de ser conta falsa com informações inconsistentes',
        reportedBy: 'Sistema Anti-Fraude',
        reportedAt: '2024-07-18T09:10:00Z',
        status: 'banned',
        severity: 'critical',
        userId: 'usr789',
        userName: 'Fake Account',
        userEmail: 'fake@temp.com'
      }
    ])
  }, [])

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.reportedBy.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = typeFilter === 'all' || item.type === typeFilter
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter
    
    return matchesSearch && matchesType && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      banned: 'bg-gray-900 text-white'
    }
    const labels = {
      pending: 'Pendente',
      approved: 'Aprovado',
      rejected: 'Rejeitado',
      banned: 'Banido'
    }
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${badges[status as keyof typeof badges]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    )
  }

  const getSeverityBadge = (severity: string) => {
    const badges = {
      low: 'bg-blue-100 text-blue-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800'
    }
    const labels = {
      low: 'Baixa',
      medium: 'Média',
      high: 'Alta',
      critical: 'Crítica'
    }
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${badges[severity as keyof typeof badges]}`}>
        {labels[severity as keyof typeof labels]}
      </span>
    )
  }

  const getTypeIcon = (type: string) => {
    const icons = {
      user: UserIcon,
      event: CalendarIcon,
      comment: ChatBubbleLeftRightIcon,
      image: PhotoIcon
    }
    return icons[type as keyof typeof icons] || ExclamationTriangleIcon
  }

  const handleModerateItem = (itemId: string, action: 'approve' | 'reject' | 'ban') => {
    setItems(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, status: action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'banned' }
        : item
    ))
    setSelectedItem(null)
  }

  // Calculate stats
  const pendingCount = items.filter(i => i.status === 'pending').length
  const criticalCount = items.filter(i => i.severity === 'critical').length
  const bannedCount = items.filter(i => i.status === 'banned').length
  const totalCount = items.length

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <ShieldCheckIcon className="h-8 w-8 text-red-600" />
          Ferramentas de Moderação
        </h1>
        <p className="text-gray-600 mt-2">Revisão e moderação de conteúdo da plataforma</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-700 text-sm font-medium">Pendentes</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
            </div>
            <ExclamationTriangleIcon className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-700 text-sm font-medium">Críticos</p>
              <p className="text-2xl font-bold text-red-600">{criticalCount}</p>
            </div>
            <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-700 text-sm font-medium">Banidos</p>
              <p className="text-2xl font-bold text-gray-600">{bannedCount}</p>
            </div>
            <NoSymbolIcon className="h-8 w-8 text-gray-600" />
          </div>
        </div>

        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-700 text-sm font-medium">Total</p>
              <p className="text-2xl font-bold text-blue-600">{totalCount}</p>
            </div>
            <ShieldCheckIcon className="h-8 w-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por título, descrição ou denunciante..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <FunnelIcon className="h-5 w-5 text-gray-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="all">Todos os Tipos</option>
              <option value="user">Usuários</option>
              <option value="event">Eventos</option>
              <option value="comment">Comentários</option>
              <option value="image">Imagens</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <CheckCircleIcon className="h-5 w-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="all">Todos os Status</option>
              <option value="pending">Pendentes</option>
              <option value="approved">Aprovados</option>
              <option value="rejected">Rejeitados</option>
              <option value="banned">Banidos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Moderation Table */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Itens para Moderação ({filteredItems.length})
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Severidade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reportado Por
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredItems.map((item) => {
                const TypeIcon = getTypeIcon(item.type)
                
                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.title}</div>
                        <div className="text-sm text-gray-500 max-w-xs truncate">{item.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <TypeIcon className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="capitalize">{item.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getSeverityBadge(item.severity)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(item.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.reportedBy}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(item.reportedAt).toLocaleDateString('pt-BR')}
                      <div className="text-xs text-gray-400">
                        {new Date(item.reportedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => setSelectedItem(item)}
                        className="text-red-600 hover:text-red-900 p-1 rounded"
                        title="Ver detalhes"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Moderation Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Revisão de Moderação</h3>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {getSeverityBadge(selectedItem.severity)}
                  {getStatusBadge(selectedItem.status)}
                </div>
                <div className="text-sm text-gray-500">
                  ID: {selectedItem.id}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Informações do Item</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">Título:</span>
                      <span className="text-sm text-gray-900">{selectedItem.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">Tipo:</span>
                      <span className="text-sm text-gray-900 capitalize">{selectedItem.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">Reportado por:</span>
                      <span className="text-sm text-gray-900">{selectedItem.reportedBy}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">Data:</span>
                      <span className="text-sm text-gray-900">
                        {new Date(selectedItem.reportedAt).toLocaleString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </div>

                {selectedItem.userName && (
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Informações do Usuário</h4>
                    <div className="bg-blue-50 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-600">Nome:</span>
                        <span className="text-sm text-gray-900">{selectedItem.userName}</span>
                      </div>
                      {selectedItem.userEmail && (
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-gray-600">Email:</span>
                          <span className="text-sm text-gray-900">{selectedItem.userEmail}</span>
                        </div>
                      )}
                      {selectedItem.userId && (
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-gray-600">ID:</span>
                          <span className="text-sm text-gray-900 font-mono">{selectedItem.userId}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Descrição</h4>
                <div className="bg-yellow-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700">{selectedItem.description}</p>
                </div>
              </div>

              {selectedItem.content && (
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Conteúdo</h4>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm text-gray-700">{selectedItem.content}</p>
                  </div>
                </div>
              )}

              {selectedItem.imageUrl && (
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Imagem</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                      <PhotoIcon className="h-12 w-12 text-gray-400" />
                      <span className="ml-2 text-gray-500">Imagem: {selectedItem.imageUrl}</span>
                    </div>
                  </div>
                </div>
              )}

              {selectedItem.status === 'pending' && (
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleModerateItem(selectedItem.id, 'approve')}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                  >
                    <CheckCircleIcon className="h-5 w-5" />
                    Aprovar
                  </button>
                  <button
                    onClick={() => handleModerateItem(selectedItem.id, 'reject')}
                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"
                  >
                    <XCircleIcon className="h-5 w-5" />
                    Rejeitar
                  </button>
                  <button
                    onClick={() => handleModerateItem(selectedItem.id, 'ban')}
                    className="flex-1 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 flex items-center justify-center gap-2"
                  >
                    <NoSymbolIcon className="h-5 w-5" />
                    Banir
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