'use client'

import { useState, useEffect } from 'react'
import {
  Cog6ToothIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  BellIcon,
  CurrencyDollarIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  MapIcon,
  UserGroupIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XMarkIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

interface Settings {
  general: {
    siteName: string
    siteDescription: string
    siteUrl: string
    adminEmail: string
    language: string
    timezone: string
  }
  security: {
    enableTwoFactor: boolean
    sessionTimeout: number
    maxLoginAttempts: number
    passwordMinLength: number
    requireEmailVerification: boolean
  }
  notifications: {
    emailNotifications: boolean
    smsNotifications: boolean
    pushNotifications: boolean
    reportNotifications: boolean
    eventApprovalNotifications: boolean
  }
  payments: {
    enableDonations: boolean
    pixEnabled: boolean
    creditCardEnabled: boolean
    bankTransferEnabled: boolean
    minimumDonation: number
    maximumDonation: number
  }
  content: {
    enableComments: boolean
    enableReviews: boolean
    autoModeration: boolean
    contentApproval: boolean
    maxEventDuration: number
  }
  legal: {
    privacyPolicyUrl: string
    termsOfServiceUrl: string
    cookiePolicyUrl: string
    contactEmail: string
    companyName: string
  }
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    general: {
      siteName: 'Marcha Brasil',
      siteDescription: 'Plataforma de coordenação para manifestações pacíficas e democráticas no Brasil',
      siteUrl: 'https://marchabrasil.com',
      adminEmail: 'admin@marchabrasil.com',
      language: 'pt-BR',
      timezone: 'America/Sao_Paulo'
    },
    security: {
      enableTwoFactor: true,
      sessionTimeout: 120,
      maxLoginAttempts: 5,
      passwordMinLength: 8,
      requireEmailVerification: true
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      reportNotifications: true,
      eventApprovalNotifications: true
    },
    payments: {
      enableDonations: true,
      pixEnabled: true,
      creditCardEnabled: true,
      bankTransferEnabled: false,
      minimumDonation: 5.00,
      maximumDonation: 10000.00
    },
    content: {
      enableComments: true,
      enableReviews: true,
      autoModeration: true,
      contentApproval: false,
      maxEventDuration: 24
    },
    legal: {
      privacyPolicyUrl: '/privacy',
      termsOfServiceUrl: '/terms',
      cookiePolicyUrl: '/cookies',
      contactEmail: 'contato@marchabrasil.com',
      companyName: 'Marcha Brasil Ltda.'
    }
  })

  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'notifications' | 'payments' | 'content' | 'legal'>('general')
  const [hasChanges, setHasChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const updateSetting = (category: keyof Settings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }))
    setHasChanges(true)
  }

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
    setHasChanges(false)
    alert('Configurações salvas com sucesso!')
  }

  const tabs = [
    { id: 'general', name: 'Geral', icon: GlobeAltIcon, color: 'blue' },
    { id: 'security', name: 'Segurança', icon: ShieldCheckIcon, color: 'red' },
    { id: 'notifications', name: 'Notificações', icon: BellIcon, color: 'yellow' },
    { id: 'payments', name: 'Pagamentos', icon: CurrencyDollarIcon, color: 'green' },
    { id: 'content', name: 'Conteúdo', icon: DocumentTextIcon, color: 'purple' },
    { id: 'legal', name: 'Legal', icon: UserGroupIcon, color: 'gray' }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Cog6ToothIcon className="h-8 w-8 text-blue-600" />
          Configurações do Sistema
        </h1>
        <p className="text-gray-600 mt-2">Gerencie as configurações da plataforma Marcha Brasil</p>
      </div>

      {/* Save Bar */}
      {hasChanges && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ExclamationTriangleIcon className="h-5 w-5 text-blue-600" />
            <span className="text-blue-800 font-medium">Você tem alterações não salvas</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setHasChanges(false)}
              className="px-4 py-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
            >
              Descartar
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Salvando...
                </>
              ) : (
                <>
                  <CheckCircleIcon className="h-4 w-4" />
                  Salvar Alterações
                </>
              )}
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Navigation Tabs */}
        <div className="lg:w-64">
          <nav className="space-y-2">
            {tabs.map((tab) => {
              const TabIcon = tab.icon
              const isActive = activeTab === tab.id
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
                    isActive
                      ? `bg-${tab.color}-100 text-${tab.color}-700 border-2 border-${tab.color}-200`
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <TabIcon className={`h-5 w-5 ${isActive ? `text-${tab.color}-600` : 'text-gray-400'}`} />
                  <span className="font-medium">{tab.name}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow border border-gray-200">
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="p-6 space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <GlobeAltIcon className="h-6 w-6 text-blue-600" />
                  Configurações Gerais
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Site</label>
                    <input
                      type="text"
                      value={settings.general.siteName}
                      onChange={(e) => updateSetting('general', 'siteName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">URL do Site</label>
                    <input
                      type="url"
                      value={settings.general.siteUrl}
                      onChange={(e) => updateSetting('general', 'siteUrl', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Descrição do Site</label>
                    <textarea
                      value={settings.general.siteDescription}
                      onChange={(e) => updateSetting('general', 'siteDescription', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email do Administrador</label>
                    <input
                      type="email"
                      value={settings.general.adminEmail}
                      onChange={(e) => updateSetting('general', 'adminEmail', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Idioma</label>
                    <select
                      value={settings.general.language}
                      onChange={(e) => updateSetting('general', 'language', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="pt-BR">Português (Brasil)</option>
                      <option value="en-US">English (US)</option>
                      <option value="es-ES">Español</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="p-6 space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <ShieldCheckIcon className="h-6 w-6 text-red-600" />
                  Configurações de Segurança
                </h2>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Autenticação de Dois Fatores</h3>
                      <p className="text-sm text-gray-600">Requer verificação adicional para logins de admin</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.security.enableTwoFactor}
                        onChange={(e) => updateSetting('security', 'enableTwoFactor', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                    </label>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Timeout da Sessão (minutos)</label>
                      <input
                        type="number"
                        value={settings.security.sessionTimeout}
                        onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Máximo de Tentativas de Login</label>
                      <input
                        type="number"
                        value={settings.security.maxLoginAttempts}
                        onChange={(e) => updateSetting('security', 'maxLoginAttempts', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Settings */}
            {activeTab === 'notifications' && (
              <div className="p-6 space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <BellIcon className="h-6 w-6 text-yellow-600" />
                  Configurações de Notificações
                </h2>
                
                <div className="space-y-4">
                  {[
                    { key: 'emailNotifications', label: 'Notificações por Email', description: 'Receber notificações por email' },
                    { key: 'smsNotifications', label: 'Notificações por SMS', description: 'Receber notificações por SMS' },
                    { key: 'pushNotifications', label: 'Notificações Push', description: 'Notificações push no navegador' },
                    { key: 'reportNotifications', label: 'Notificações de Relatórios', description: 'Alertas sobre novos relatórios' },
                    { key: 'eventApprovalNotifications', label: 'Aprovação de Eventos', description: 'Notificações para aprovação de eventos' }
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900">{item.label}</h3>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.notifications[item.key as keyof typeof settings.notifications]}
                          onChange={(e) => updateSetting('notifications', item.key, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Payments Settings */}
            {activeTab === 'payments' && (
              <div className="p-6 space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
                  Configurações de Pagamentos
                </h2>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Habilitar Doações</h3>
                      <p className="text-sm text-gray-600">Permitir doações na plataforma</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.payments.enableDonations}
                        onChange={(e) => updateSetting('payments', 'enableDonations', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Doação Mínima (R$)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={settings.payments.minimumDonation}
                        onChange={(e) => updateSetting('payments', 'minimumDonation', parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Doação Máxima (R$)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={settings.payments.maximumDonation}
                        onChange={(e) => updateSetting('payments', 'maximumDonation', parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Content Settings */}
            {activeTab === 'content' && (
              <div className="p-6 space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <DocumentTextIcon className="h-6 w-6 text-purple-600" />
                  Configurações de Conteúdo
                </h2>
                
                <div className="space-y-4">
                  {[
                    { key: 'enableComments', label: 'Habilitar Comentários', description: 'Permitir comentários nos eventos' },
                    { key: 'enableReviews', label: 'Habilitar Avaliações', description: 'Permitir avaliações de eventos' },
                    { key: 'autoModeration', label: 'Moderação Automática', description: 'Filtro automático de conteúdo' },
                    { key: 'contentApproval', label: 'Aprovação de Conteúdo', description: 'Requer aprovação para novos conteúdos' }
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900">{item.label}</h3>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.content[item.key as keyof typeof settings.content]}
                          onChange={(e) => updateSetting('content', item.key, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Legal Settings */}
            {activeTab === 'legal' && (
              <div className="p-6 space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <UserGroupIcon className="h-6 w-6 text-gray-600" />
                  Configurações Legais
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nome da Empresa</label>
                    <input
                      type="text"
                      value={settings.legal.companyName}
                      onChange={(e) => updateSetting('legal', 'companyName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email de Contato</label>
                    <input
                      type="email"
                      value={settings.legal.contactEmail}
                      onChange={(e) => updateSetting('legal', 'contactEmail', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">URL da Política de Privacidade</label>
                    <input
                      type="url"
                      value={settings.legal.privacyPolicyUrl}
                      onChange={(e) => updateSetting('legal', 'privacyPolicyUrl', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">URL dos Termos de Serviço</label>
                    <input
                      type="url"
                      value={settings.legal.termsOfServiceUrl}
                      onChange={(e) => updateSetting('legal', 'termsOfServiceUrl', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}