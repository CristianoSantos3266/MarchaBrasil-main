'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import {
  ShieldCheckIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  UserIcon,
  EyeIcon,
  ChatBubbleLeftRightIcon,
  PhoneIcon,
  MapPinIcon,
  IdentificationIcon,
  CameraIcon
} from '@heroicons/react/24/outline'

interface VerificationSubmission {
  id: string
  userId: string
  submittedAt: string
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'requires_info'
  reviewedBy?: string
  reviewedAt?: string
  reviewNotes?: string
  contactInfo: {
    phone: string
    whatsapp: string
    email: string
    city: string
    state: string
  }
  organizationInfo: {
    organizationName: string
    organizationType: string
    organizationDescription: string
    previousExperience: string
  }
  riskAssessment?: {
    score: number
    flags: string[]
    recommendation: 'approve' | 'reject' | 'manual_review'
  }
  adminActions?: {
    timestamp: string
    action: string
    adminId: string
    notes: string
  }[]
}

export default function OrganizerApprovalWorkflow() {
  const { user, userProfile } = useAuth()
  const [submissions, setSubmissions] = useState<VerificationSubmission[]>([])
  const [selectedSubmission, setSelectedSubmission] = useState<VerificationSubmission | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [reviewNotes, setReviewNotes] = useState('')

  useEffect(() => {
    if (userProfile?.role === 'admin') {
      loadSubmissions()
    }
  }, [userProfile])

  const loadSubmissions = async () => {
    try {
      // In production, this would fetch from your database
      const demoSubmissions = generateDemoSubmissions()
      setSubmissions(demoSubmissions)
    } catch (error) {
      console.error('Error loading submissions:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateDemoSubmissions = (): VerificationSubmission[] => {
    return [
      {
        id: 'sub_001',
        userId: 'user_001',
        submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
        contactInfo: {
          phone: '(11) 98765-4321',
          whatsapp: '(11) 98765-4321',
          email: 'joao.silva@email.com',
          city: 'São Paulo',
          state: 'SP'
        },
        organizationInfo: {
          organizationName: 'Movimento Cidadão SP',
          organizationType: 'individual',
          organizationDescription: 'Movimento focado na defesa dos direitos civis e participação democrática em São Paulo.',
          previousExperience: 'Organizei 3 manifestações pacíficas nos últimos 2 anos, todas com mais de 500 participantes.'
        },
        riskAssessment: {
          score: 85,
          flags: [],
          recommendation: 'approve'
        }
      },
      {
        id: 'sub_002',
        userId: 'user_002',
        submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'under_review',
        reviewedBy: 'admin_001',
        contactInfo: {
          phone: '(21) 99876-5432',
          whatsapp: '(21) 99876-5432',
          email: 'maria.oliveira@email.com',
          city: 'Rio de Janeiro',
          state: 'RJ'
        },
        organizationInfo: {
          organizationName: 'Coletivo Mulheres RJ',
          organizationType: 'ngo',
          organizationDescription: 'ONG dedicada à defesa dos direitos das mulheres e igualdade de gênero.',
          previousExperience: 'Liderança em organizações feministas há 10 anos, experiência em coordenação de eventos para mais de 1000 pessoas.'
        },
        riskAssessment: {
          score: 92,
          flags: [],
          recommendation: 'approve'
        }
      },
      {
        id: 'sub_003',
        userId: 'user_003',
        submittedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'requires_info',
        reviewedBy: 'admin_002',
        reviewedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        reviewNotes: 'Informações da organização requerem esclarecimentos adicionais.',
        contactInfo: {
          phone: '(31) 97654-3210',
          whatsapp: '(31) 97654-3210',
          email: 'carlos.ferreira@email.com',
          city: 'Belo Horizonte',
          state: 'MG'
        },
        organizationInfo: {
          organizationName: 'Juventude Ativa BH',
          organizationType: 'association',
          organizationDescription: 'Associação de jovens focada em mobilização estudantil e participação política.',
          previousExperience: 'Presidente do grêmio estudantil, organizei 2 passeatas estudantis com média de 300 participantes.'
        },
        riskAssessment: {
          score: 78,
          flags: ['additional_info_needed'],
          recommendation: 'manual_review'
        }
      }
    ]
  }

  const handleApproval = async (submissionId: string, action: 'approve' | 'reject' | 'request_info') => {
    if (!reviewNotes.trim() && action !== 'approve') {
      alert('Adicione observações sobre a decisão')
      return
    }

    setActionLoading(true)
    try {
      // In production, this would make an API call
      const updatedSubmissions = submissions.map(sub => {
        if (sub.id === submissionId) {
          const updatedSubmission = {
            ...sub,
            status: action === 'approve' ? 'approved' as const : 
                   action === 'reject' ? 'rejected' as const : 
                   'requires_info' as const,
            reviewedBy: user?.id,
            reviewedAt: new Date().toISOString(),
            reviewNotes: reviewNotes.trim(),
            adminActions: [
              ...(sub.adminActions || []),
              {
                timestamp: new Date().toISOString(),
                action,
                adminId: user?.id || 'admin',
                notes: reviewNotes.trim()
              }
            ]
          }
          return updatedSubmission
        }
        return sub
      })

      setSubmissions(updatedSubmissions)
      setSelectedSubmission(null)
      setReviewNotes('')

      // Send notification to user (in production)
      console.log(`Organizer verification ${action}ed for submission ${submissionId}`)
      
    } catch (error) {
      console.error('Error processing approval:', error)
      alert('Erro ao processar aprovação')
    } finally {
      setActionLoading(false)
    }
  }

  const getRiskLevelColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50 border-green-200'
    if (score >= 75) return 'text-blue-600 bg-blue-50 border-blue-200'
    if (score >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    return 'text-red-600 bg-red-50 border-red-200'
  }

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      under_review: 'text-blue-600 bg-blue-50 border-blue-200',
      approved: 'text-green-600 bg-green-50 border-green-200',
      rejected: 'text-red-600 bg-red-50 border-red-200',
      requires_info: 'text-orange-600 bg-orange-50 border-orange-200'
    }
    return colors[status as keyof typeof colors] || colors.pending
  }

  const getStatusText = (status: string) => {
    const texts = {
      pending: 'Pendente',
      under_review: 'Em Análise',
      approved: 'Aprovado',
      rejected: 'Rejeitado',
      requires_info: 'Aguarda Informações'
    }
    return texts[status as keyof typeof texts] || 'Pendente'
  }

  const getStatusIcon = (status: string) => {
    const icons = {
      pending: ClockIcon,
      under_review: EyeIcon,
      approved: CheckCircleIcon,
      rejected: XCircleIcon,
      requires_info: ExclamationTriangleIcon
    }
    return icons[status as keyof typeof icons] || ClockIcon
  }

  const filteredSubmissions = submissions.filter(sub => 
    filterStatus === 'all' || sub.status === filterStatus
  )

  if (userProfile?.role !== 'admin') {
    return (
      <div className="text-center py-8">
        <ShieldCheckIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Acesso Restrito</h2>
        <p className="text-gray-600">Apenas administradores podem acessar este painel.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-lg shadow-sm border p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <ShieldCheckIcon className="w-7 h-7" />
                Aprovação de Organizadores
              </h1>
              <p className="text-gray-600 mt-1">
                Gerencie solicitações de verificação de organizadores
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todos os Status</option>
                <option value="pending">Pendentes</option>
                <option value="under_review">Em Análise</option>
                <option value="requires_info">Aguarda Info</option>
                <option value="approved">Aprovados</option>
                <option value="rejected">Rejeitados</option>
              </select>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {submissions.filter(s => s.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-500">Pendentes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {submissions.filter(s => s.status === 'under_review').length}
              </div>
              <div className="text-sm text-gray-500">Em Análise</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {submissions.filter(s => s.status === 'requires_info').length}
              </div>
              <div className="text-sm text-gray-500">Aguarda Info</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {submissions.filter(s => s.status === 'approved').length}
              </div>
              <div className="text-sm text-gray-500">Aprovados</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {submissions.filter(s => s.status === 'rejected').length}
              </div>
              <div className="text-sm text-gray-500">Rejeitados</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Submissions List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">
                Solicitações ({filteredSubmissions.length})
              </h2>
            </div>
            
            <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
              {filteredSubmissions.map(submission => {
                const StatusIcon = getStatusIcon(submission.status)
                return (
                  <button
                    key={submission.id}
                    onClick={() => setSelectedSubmission(submission)}
                    className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                      selectedSubmission?.id === submission.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">
                          {submission.organizationInfo.organizationName}
                        </h3>
                        <p className="text-sm text-gray-600 truncate">
                          {submission.contactInfo.city}, {submission.contactInfo.state}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(submission.status)}`}>
                            <StatusIcon className="w-3 h-3" />
                            {getStatusText(submission.status)}
                          </span>
                          {submission.riskAssessment && (
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRiskLevelColor(submission.riskAssessment.score)}`}>
                              Risk: {submission.riskAssessment.score}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      {new Date(submission.submittedAt).toLocaleDateString('pt-BR')}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Submission Details */}
        <div className="lg:col-span-2">
          {selectedSubmission ? (
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {selectedSubmission.organizationInfo.organizationName}
                    </h2>
                    <p className="text-gray-600">{selectedSubmission.contactInfo.city}, {selectedSubmission.contactInfo.state}</p>
                  </div>
                  
                  <div className="text-right">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedSubmission.status)}`}>
                      {React.createElement(getStatusIcon(selectedSubmission.status), { className: "w-4 h-4" })}
                      {getStatusText(selectedSubmission.status)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Contact Information */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <PhoneIcon className="w-5 h-5" />
                    Informações de Contato
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Email:</span>
                      <span className="ml-2 font-medium">{selectedSubmission.contactInfo.email}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Telefone:</span>
                      <span className="ml-2 font-medium">{selectedSubmission.contactInfo.phone}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">WhatsApp:</span>
                      <span className="ml-2 font-medium">{selectedSubmission.contactInfo.whatsapp || 'Não informado'}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Localização:</span>
                      <span className="ml-2 font-medium">{selectedSubmission.contactInfo.city}, {selectedSubmission.contactInfo.state}</span>
                    </div>
                  </div>
                </div>

                {/* Organization Information */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <DocumentTextIcon className="w-5 h-5" />
                    Informações da Organização
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-gray-600">Tipo:</span>
                      <span className="ml-2 font-medium capitalize">{selectedSubmission.organizationInfo.organizationType}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Descrição:</span>
                      <p className="mt-1 text-gray-900">{selectedSubmission.organizationInfo.organizationDescription}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Experiência Anterior:</span>
                      <p className="mt-1 text-gray-900">{selectedSubmission.organizationInfo.previousExperience}</p>
                    </div>
                  </div>
                </div>

                {/* Risk Assessment */}
                {selectedSubmission.riskAssessment && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <ShieldCheckIcon className="w-5 h-5" />
                      Avaliação de Risco
                    </h3>
                    <div className={`p-4 rounded-lg border ${getRiskLevelColor(selectedSubmission.riskAssessment.score)}`}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Score de Risco:</span>
                        <span className="font-bold text-lg">{selectedSubmission.riskAssessment.score}/100</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Recomendação: </span>
                        <span className="capitalize">{selectedSubmission.riskAssessment.recommendation.replace('_', ' ')}</span>
                      </div>
                      {selectedSubmission.riskAssessment.flags.length > 0 && (
                        <div className="mt-2">
                          <span className="font-medium text-sm">Alertas:</span>
                          <ul className="list-disc list-inside text-sm mt-1">
                            {selectedSubmission.riskAssessment.flags.map(flag => (
                              <li key={flag}>{flag}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}


                {/* Previous Reviews */}
                {selectedSubmission.reviewNotes && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <ChatBubbleLeftRightIcon className="w-5 h-5" />
                      Observações da Análise
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-700">{selectedSubmission.reviewNotes}</p>
                      {selectedSubmission.reviewedAt && (
                        <p className="text-xs text-gray-500 mt-2">
                          Revisado em {new Date(selectedSubmission.reviewedAt).toLocaleString('pt-BR')}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Section */}
                {(selectedSubmission.status === 'pending' || selectedSubmission.status === 'under_review') && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Ações</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Observações da Revisão
                        </label>
                        <textarea
                          value={reviewNotes}
                          onChange={(e) => setReviewNotes(e.target.value)}
                          rows={3}
                          placeholder="Adicione observações sobre a análise..."
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleApproval(selectedSubmission.id, 'approve')}
                          disabled={actionLoading}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                          <CheckCircleIcon className="w-4 h-4" />
                          Aprovar
                        </button>
                        
                        <button
                          onClick={() => handleApproval(selectedSubmission.id, 'request_info')}
                          disabled={actionLoading}
                          className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50"
                        >
                          <ExclamationTriangleIcon className="w-4 h-4" />
                          Solicitar Info
                        </button>
                        
                        <button
                          onClick={() => handleApproval(selectedSubmission.id, 'reject')}
                          disabled={actionLoading}
                          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                        >
                          <XCircleIcon className="w-4 h-4" />
                          Rejeitar
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-12 text-center">
                <DocumentTextIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Selecione uma Solicitação
                </h3>
                <p className="text-gray-600">
                  Escolha uma solicitação de verificação na lista ao lado para visualizar os detalhes.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}