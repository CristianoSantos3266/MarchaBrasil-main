'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import {
  DocumentTextIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  ClockIcon,
  PhoneIcon,
  MapPinIcon,
  UsersIcon
} from '@heroicons/react/24/outline'

interface OrganizerVerificationData {
  // Contact Information
  phone: string
  whatsapp: string
  email: string
  
  // Location Information  
  city: string
  state: string
  
  // Organization Information
  organizationName: string
  organizationType: 'individual' | 'ngo' | 'union' | 'association' | 'community_group'
  organizationDescription: string
  previousExperience: string
  
  // Terms and Agreements
  termsAccepted: boolean
  peacefulCommitment: boolean
  transparencyAgreement: boolean
  
  // Verification Status
  submissionDate?: string
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected'
  reviewNotes?: string
}

export default function OrganizerVerification() {
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)

  const [verificationData, setVerificationData] = useState<OrganizerVerificationData>({
    phone: '',
    whatsapp: '',
    email: user?.email || '',
    city: '',
    state: '',
    organizationName: '',
    organizationType: 'individual',
    organizationDescription: '',
    previousExperience: '',
    termsAccepted: false,
    peacefulCommitment: false,
    transparencyAgreement: false,
    status: 'draft'
  })

  const organizationTypes = [
    { value: 'individual', label: 'Pessoa Física / Organizador Individual' },
    { value: 'community_group', label: 'Grupo Comunitário' },
    { value: 'ngo', label: 'ONG/Organização Social' },
    { value: 'union', label: 'Sindicato' },
    { value: 'association', label: 'Associação' }
  ]

  const brazilianStates = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 
    'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ]

  const handleInputChange = (field: keyof OrganizerVerificationData, value: any) => {
    setVerificationData(prev => ({ ...prev, [field]: value }))
  }


  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(
          verificationData.phone &&
          verificationData.city &&
          verificationData.state
        )
      case 2:
        return !!(
          verificationData.organizationName &&
          verificationData.organizationType &&
          verificationData.organizationDescription
        )
      case 3:
        return !!(
          verificationData.termsAccepted &&
          verificationData.peacefulCommitment &&
          verificationData.transparencyAgreement
        )
      default:
        return false
    }
  }

  const submitVerification = async () => {
    setLoading(true)
    try {
      // In production, this would submit for community review
      const submissionData = {
        ...verificationData,
        submissionDate: new Date().toISOString(),
        status: 'submitted'
      }

      // Save to localStorage for demo
      localStorage.setItem(`organizer_verification_${user?.id}`, JSON.stringify(submissionData))
      
      setVerificationData(prev => ({ ...prev, status: 'submitted' }))
      
      alert('Verificação enviada com sucesso! Aguarde a análise administrativa.')
    } catch (error) {
      console.error('Error submitting verification:', error)
      alert('Erro ao enviar verificação. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const formatPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4,5})(\d{4})$/, '$1-$2')
  }

  if (verificationData.status === 'submitted') {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <ClockIcon className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-blue-900 mb-2">
            Verificação em Análise Administrativa
          </h2>
          <p className="text-blue-700 mb-4">
            Sua solicitação foi enviada para análise administrativa. O processo é baseado apenas nas informações fornecidas.
          </p>
          <div className="bg-white rounded-lg p-4 text-sm text-gray-600">
            <p><strong>Próximos passos:</strong></p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Análise das informações de contato e organização</li>
              <li>Verificação de compromisso com manifestações pacíficas</li>
              <li>Aprovação final e ativação da conta de organizador</li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-6 rounded-t-lg">
          <div className="flex items-center gap-3">
            <ShieldCheckIcon className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">Verificação Simplificada de Organizador</h1>
              <p className="text-blue-100">
                Processo simples de verificação - apenas informações básicas, sem documentos ou referências
              </p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3].map(step => (
              <div
                key={step}
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 font-medium ${
                  step <= currentStep
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-gray-100 text-gray-400 border-gray-300'
                }`}
              >
                {step}
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step Content */}
        <div className="p-6">
          {/* Step 1: Contact Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <PhoneIcon className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900">Informações de Contato</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={verificationData.phone}
                    onChange={(e) => handleInputChange('phone', formatPhone(e.target.value))}
                    placeholder="(11) 99999-9999"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    WhatsApp (opcional)
                  </label>
                  <input
                    type="tel"
                    value={verificationData.whatsapp}
                    onChange={(e) => handleInputChange('whatsapp', formatPhone(e.target.value))}
                    placeholder="(11) 99999-9999"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cidade *
                  </label>
                  <input
                    type="text"
                    required
                    value={verificationData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado *
                  </label>
                  <select
                    required
                    value={verificationData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Selecione o estado</option>
                    {brazilianStates.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={verificationData.email}
                    disabled
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email vinculado à sua conta</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Organization Information */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <DocumentTextIcon className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900">Informações da Organização</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome da Organização/Movimento *
                  </label>
                  <input
                    type="text"
                    required
                    value={verificationData.organizationName}
                    onChange={(e) => handleInputChange('organizationName', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Organização *
                  </label>
                  <select
                    required
                    value={verificationData.organizationType}
                    onChange={(e) => handleInputChange('organizationType', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {organizationTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição da Organização *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={verificationData.organizationDescription}
                    onChange={(e) => handleInputChange('organizationDescription', e.target.value)}
                    placeholder="Descreva os objetivos, missão e valores da organização..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experiência Anterior em Organização Comunitária
                  </label>
                  <textarea
                    rows={3}
                    value={verificationData.previousExperience}
                    onChange={(e) => handleInputChange('previousExperience', e.target.value)}
                    placeholder="Descreva sua experiência anterior organizando eventos comunitários, manifestações ou atividades cívicas..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Terms and Agreements */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <DocumentTextIcon className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900">Termos e Compromissos</h2>
              </div>

              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={verificationData.termsAccepted}
                      onChange={(e) => handleInputChange('termsAccepted', e.target.checked)}
                      className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div className="text-sm">
                      <span className="font-medium text-blue-900">
                        Aceito os Termos de Uso e Política de Privacidade *
                      </span>
                      <p className="text-blue-700 mt-1">
                        Li e concordo com os termos de uso da plataforma e política de privacidade. 
                        Entendo que nenhum documento pessoal será solicitado ou armazenado.
                      </p>
                    </div>
                  </label>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={verificationData.peacefulCommitment}
                      onChange={(e) => handleInputChange('peacefulCommitment', e.target.checked)}
                      className="mt-1 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <div className="text-sm">
                      <span className="font-medium text-green-900">
                        Compromisso com Manifestações Pacíficas *
                      </span>
                      <p className="text-green-700 mt-1">
                        Comprometo-me a organizar apenas manifestações pacíficas, respeitando as leis e a ordem pública.
                        Qualquer incitação à violência resultará no banimento da plataforma.
                      </p>
                    </div>
                  </label>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={verificationData.transparencyAgreement}
                      onChange={(e) => handleInputChange('transparencyAgreement', e.target.checked)}
                      className="mt-1 w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                    />
                    <div className="text-sm">
                      <span className="font-medium text-yellow-900">
                        Compromisso com a Transparência *
                      </span>
                      <p className="text-yellow-700 mt-1">
                        Comprometo-me a manter transparência sobre objetivos e responsáveis pelos eventos organizados,
                        respeitando sempre o anonimato e privacidade dos participantes.
                      </p>
                    </div>
                  </label>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <ShieldCheckIcon className="w-5 h-5 text-gray-600 mt-0.5" />
                    <div className="text-sm text-gray-700">
                      <p className="font-medium">Proteção de Privacidade:</p>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        <li>Não solicitamos nem armazenamos documentos pessoais</li>
                        <li>A verificação é baseada apenas nas informações fornecidas</li>
                        <li>Suas informações pessoais são mantidas em sigilo</li>
                        <li>O processo é totalmente privado e seguro</li>
                        <li>Você pode revogar sua participação a qualquer momento</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Voltar
            </button>

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!validateStep(currentStep)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Próximo
              </button>
            ) : (
              <button
                type="button"
                onClick={submitVerification}
                disabled={!validateStep(currentStep) || loading}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Enviando...
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="w-5 h-5" />
                    Enviar para Verificação Administrativa
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}