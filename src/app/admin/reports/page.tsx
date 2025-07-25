'use client'

import { useState, useEffect } from 'react'
import {
  DocumentTextIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  FlagIcon,
  ClockIcon,
  ShieldExclamationIcon
} from '@heroicons/react/24/outline'

interface Report {
  id: string
  reporterName: string
  reporterEmail: string
  targetType: 'event' | 'user' | 'content'
  targetId: string
  targetTitle: string
  category: 'inappropriate_content' | 'harassment' | 'fake_information' | 'violence' | 'spam' | 'other'
  description: string
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  createdAt: string
  reviewedAt?: string
  reviewedBy?: string
  resolution?: string
  evidence?: string[]
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'reviewed' | 'resolved' | 'dismissed'>('all')
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'urgent' | 'high' | 'medium' | 'low'>('all')
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)

  useEffect(() => {
    // Mock reports data
    setReports([
      {
        id: '1',
        reporterName: 'Ana Silva Martins',
        reporterEmail: 'ana.martins@email.com',
        targetType: 'event',
        targetId: 'evt1',
        targetTitle: 'Manifestação pela Democracia - SP',
        category: 'inappropriate_content',
        description: 'O evento contém linguagem ofensiva e conteúdo que pode incitar conflitos.',
        status: 'pending',
        priority: 'high',
        createdAt: '2024-07-20T10:30:00Z',
        evidence: ['screenshot1.jpg', 'screenshot2.jpg']
      },
      {
        id: '2',
        reporterName: 'Carlos Eduardo Santos',
        reporterEmail: 'carlos.santos@email.com',
        targetType: 'user',
        targetId: 'usr123',
        targetTitle: 'João Silva (Organizador)',
        category: 'harassment',
        description: 'O usuário está enviando mensagens agressivas e intimidatórias para outros participantes.',
        status: 'reviewed',
        priority: 'urgent',
        createdAt: '2024-07-19T14:15:00Z',
        reviewedAt: '2024-07-19T16:30:00Z',
        reviewedBy: 'Admin',
        resolution: 'Usuário foi advertido e está sendo monitorado.'
      },
      {
        id: '3',
        reporterName: 'Maria Fernanda Lima',
        reporterEmail: 'maria.lima@email.com',
        targetType: 'content',
        targetId: 'post456',
        targetTitle: 'Postagem: "Verdade sobre os fatos"',
        category: 'fake_information',
        description: 'A postagem contém informações falsas e pode enganar outros usuários.',
        status: 'resolved',
        priority: 'medium',
        createdAt: '2024-07-18T09:45:00Z',
        reviewedAt: '2024-07-18T11:20:00Z',
        reviewedBy: 'Admin',
        resolution: 'Conteúdo removido e usuário notificado sobre políticas de desinformação.'
      },
      {
        id: '4',
        reporterName: 'Roberto Oliveira Costa',
        reporterEmail: 'roberto.costa@email.com',
        targetType: 'event',
        targetId: 'evt2',
        targetTitle: 'Carreata Patriótica - RJ',
        category: 'spam',
        description: 'Evento duplicado criado múltiplas vezes pelo mesmo organizador.',
        status: 'dismissed',
        priority: 'low',
        createdAt: '2024-07-17T16:20:00Z',
        reviewedAt: '2024-07-17T18:00:00Z',
        reviewedBy: 'Moderador',
        resolution: 'Eventos duplicados foram criados por erro técnico, não configurando spam.'
      },
      {
        id: '5',
        reporterName: 'Juliana Alves Souza',
        reporterEmail: 'juliana.souza@email.com',
        targetType: 'user',
        targetId: 'usr789',
        targetTitle: 'Pedro Santos (Participante)',
        category: 'violence',
        description: 'Usuário está fazendo ameaças de violência em comentários.',
        status: 'pending',
        priority: 'urgent',
        createdAt: '2024-07-21T13:10:00Z',
        evidence: ['comment_screenshot.png']
      }
    ])
  }, [])

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.reporterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.targetTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || report.priority === priorityFilter
    
    return matchesSearch && matchesStatus && matchesPriority
  })

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      reviewed: 'bg-blue-100 text-blue-800',
      resolved: 'bg-green-100 text-green-800',
      dismissed: 'bg-gray-100 text-gray-800'
    }
    const labels = {
      pending: 'Pendente',
      reviewed: 'Revisado',
      resolved: 'Resolvido',
      dismissed: 'Dispensado'
    }
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${badges[status as keyof typeof badges]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    )
  }

  const getPriorityBadge = (priority: string) => {
    const badges = {
      urgent: 'bg-red-100 text-red-800 border border-red-300',
      high: 'bg-orange-100 text-orange-800 border border-orange-300',
      medium: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
      low: 'bg-gray-100 text-gray-800 border border-gray-300'
    }
    const labels = {
      urgent: 'Urgente',
      high: 'Alto',
      medium: 'Médio',
      low: 'Baixo'
    }
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${badges[priority as keyof typeof badges]}`}>
        {labels[priority as keyof typeof labels]}
      </span>
    )
  }

  const getCategoryIcon = (category: string) => {
    const icons = {
      inappropriate_content: ExclamationTriangleIcon,
      harassment: ShieldExclamationIcon,
      fake_information: DocumentTextIcon,
      violence: ExclamationTriangleIcon,
      spam: FlagIcon,
      other: ExclamationTriangleIcon
    }
    return icons[category as keyof typeof icons] || ExclamationTriangleIcon
  }

  const getCategoryLabel = (category: string) => {
    const labels = {
      inappropriate_content: 'Conteúdo Inapropriado',
      harassment: 'Assédio',
      fake_information: 'Informação Falsa',
      violence: 'Violência',
      spam: 'Spam',
      other: 'Outro'
    }
    return labels[category as keyof typeof labels] || category
  }

  const handleUpdateStatus = (reportId: string, newStatus: string, resolution?: string) => {
    setReports(prev => prev.map(report => 
      report.id === reportId 
        ? { 
            ...report, 
            status: newStatus as any, 
            reviewedAt: new Date().toISOString(),
            reviewedBy: 'Admin',
            resolution: resolution || report.resolution
          }
        : report
    ))
    setSelectedReport(null)
  }

  // Calculate stats
  const pendingCount = reports.filter(r => r.status === 'pending').length
  const urgentCount = reports.filter(r => r.priority === 'urgent').length
  const resolvedCount = reports.filter(r => r.status === 'resolved').length
  const totalCount = reports.length

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <DocumentTextIcon className="h-8 w-8 text-orange-600" />
          Relatórios & Sinalizações
        </h1>
        <p className="text-gray-600 mt-2">Gerenciamento de relatórios e sinalizações da comunidade</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-700 text-sm font-medium">Pendentes</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
            </div>
            <ClockIcon className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-700 text-sm font-medium">Urgentes</p>
              <p className="text-2xl font-bold text-red-600">{urgentCount}</p>
            </div>
            <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-700 text-sm font-medium">Resolvidos</p>
              <p className="text-2xl font-bold text-green-600">{resolvedCount}</p>
            </div>
            <CheckCircleIcon className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-700 text-sm font-medium">Total</p>
              <p className="text-2xl font-bold text-blue-600">{totalCount}</p>
            </div>
            <FlagIcon className="h-8 w-8 text-blue-600" />
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
                placeholder="Buscar por denunciante, alvo ou descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <FunnelIcon className="h-5 w-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="all">Todos os Status</option>
              <option value="pending">Pendentes</option>
              <option value="reviewed">Revisados</option>
              <option value="resolved">Resolvidos</option>
              <option value="dismissed">Dispensados</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <ExclamationTriangleIcon className="h-5 w-5 text-gray-400" />
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="all">Todas as Prioridades</option>
              <option value="urgent">Urgente</option>
              <option value="high">Alto</option>
              <option value="medium">Médio</option>
              <option value="low">Baixo</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Lista de Relatórios ({filteredReports.length})
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Relatório
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Alvo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoria
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prioridade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
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
              {filteredReports.map((report) => {
                const CategoryIcon = getCategoryIcon(report.category)
                
                return (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center text-white font-semibold">
                          {report.reporterName.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{report.reporterName}</div>
                          <div className="text-sm text-gray-500">{report.reporterEmail}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{report.targetTitle}</div>
                      <div className="text-xs text-gray-500 capitalize">{report.targetType}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <CategoryIcon className="h-4 w-4 text-gray-400 mr-2" />
                        {getCategoryLabel(report.category)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getPriorityBadge(report.priority)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(report.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(report.createdAt).toLocaleDateString('pt-BR')}
                      <div className="text-xs text-gray-400">
                        {new Date(report.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => setSelectedReport(report)}
                        className="text-orange-600 hover:text-orange-900 p-1 rounded"
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

      {/* Report Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Detalhes do Relatório</h3>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {getPriorityBadge(selectedReport.priority)}
                  {getStatusBadge(selectedReport.status)}
                </div>
                <div className="text-sm text-gray-500">
                  ID: {selectedReport.id}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Informações do Denunciante</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">Nome:</span>
                      <span className="text-sm text-gray-900">{selectedReport.reporterName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">Email:</span>
                      <span className="text-sm text-gray-900">{selectedReport.reporterEmail}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">Data:</span>
                      <span className="text-sm text-gray-900">
                        {new Date(selectedReport.createdAt).toLocaleString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Alvo do Relatório</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">Tipo:</span>
                      <span className="text-sm text-gray-900 capitalize">{selectedReport.targetType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">Título:</span>
                      <span className="text-sm text-gray-900">{selectedReport.targetTitle}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">ID:</span>
                      <span className="text-sm text-gray-900 font-mono">{selectedReport.targetId}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Categoria e Descrição</h4>
                <div className="bg-orange-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm font-medium text-gray-900">Categoria:</span>
                    <span className="text-sm text-orange-700">{getCategoryLabel(selectedReport.category)}</span>
                  </div>
                  <div className="text-sm text-gray-700">
                    <span className="font-medium">Descrição:</span>
                    <p className="mt-1">{selectedReport.description}</p>
                  </div>
                </div>
              </div>

              {selectedReport.evidence && selectedReport.evidence.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Evidências</h4>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <ul className="space-y-1">
                      {selectedReport.evidence.map((evidence, index) => (
                        <li key={index} className="text-sm text-blue-700">
                          📎 {evidence}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {selectedReport.resolution && (
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Resolução</h4>
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="text-sm text-gray-700 space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">Revisado por:</span>
                        <span>{selectedReport.reviewedBy}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Data da revisão:</span>
                        <span>{selectedReport.reviewedAt && new Date(selectedReport.reviewedAt).toLocaleString('pt-BR')}</span>
                      </div>
                      <div className="border-t border-green-200 pt-2">
                        <span className="font-medium">Resolução:</span>
                        <p className="mt-1">{selectedReport.resolution}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedReport.status === 'pending' && (
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleUpdateStatus(selectedReport.id, 'resolved', 'Relatório resolvido pela administração.')}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                  >
                    <CheckCircleIcon className="h-5 w-5" />
                    Marcar como Resolvido
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedReport.id, 'dismissed', 'Relatório dispensado após análise.')}
                    className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center justify-center gap-2"
                  >
                    <XCircleIcon className="h-5 w-5" />
                    Dispensar
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