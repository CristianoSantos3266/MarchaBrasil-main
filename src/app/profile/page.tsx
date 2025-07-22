'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/ui/Navigation'
import { useAuth } from '@/contexts/AuthContext'
import { updateUserProfile } from '@/lib/supabase'
import { 
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline'

export default function ProfilePage() {
  const { user, userProfile, loading, refreshProfile } = useAuth()
  const router = useRouter()
  
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  
  // Form fields
  const [formData, setFormData] = useState({
    public_name: '',
    name: '',
    phone: '',
    city: '',
    state: '',
    bio: '',
    whatsapp: ''
  })

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  // Load profile data when available
  useEffect(() => {
    if (userProfile) {
      setFormData({
        public_name: userProfile.public_name || '',
        name: userProfile.name || '',
        phone: userProfile.phone || '',
        city: userProfile.city || '',
        state: userProfile.state || '',
        bio: userProfile.bio || '',
        whatsapp: userProfile.whatsapp || ''
      })
    }
  }, [userProfile])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    if (!user) return
    
    setSaving(true)
    setMessage('')
    
    try {
      const { data, error } = await updateUserProfile(user.id, formData)
      
      if (error) {
        throw error
      }
      
      // In demo mode, just update localStorage
      if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
        const demoUser = localStorage.getItem('demo-user')
        if (demoUser) {
          const userData = JSON.parse(demoUser)
          const updatedProfile = {
            ...userData,
            ...formData,
            updated_at: new Date().toISOString()
          }
          localStorage.setItem('demo-user', JSON.stringify(updatedProfile))
        }
      }
      
      await refreshProfile()
      setIsEditing(false)
      setMessage('✅ Perfil atualizado com sucesso!')
      
      setTimeout(() => setMessage(''), 3000)
    } catch (error: any) {
      console.error('Error updating profile:', error)
      setMessage('❌ Erro ao atualizar perfil: ' + (error.message || 'Tente novamente'))
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    if (userProfile) {
      setFormData({
        public_name: userProfile.public_name || '',
        name: userProfile.name || '',
        phone: userProfile.phone || '',
        city: userProfile.city || '',
        state: userProfile.state || '',
        bio: userProfile.bio || '',
        whatsapp: userProfile.whatsapp || ''
      })
    }
    setIsEditing(false)
    setMessage('')
  }

  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]?.toUpperCase()).slice(0, 2).join('')
  }

  const getUserDisplayName = () => {
    return userProfile?.public_name || userProfile?.name || user?.email?.split('@')[0] || 'Usuário'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-blue-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando perfil...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-blue-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-xl shadow-lg border-2 border-green-200">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-t-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-2xl font-bold">
                    {getUserInitials(getUserDisplayName())}
                  </div>
                  {/* Online Status */}
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 border-4 border-white rounded-full"></div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{getUserDisplayName()}</h1>
                  <p className="text-green-100">{user.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm">Online</span>
                  </div>
                  {userProfile?.role === 'admin' && (
                    <span className="inline-block mt-2 px-3 py-1 text-xs bg-red-500 text-white rounded-full">
                      <ShieldCheckIcon className="inline h-3 w-3 mr-1" />
                      Administrador
                    </span>
                  )}
                </div>
              </div>
              
              <div>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-white/20 backdrop-blur text-white px-4 py-2 rounded-lg font-medium hover:bg-white/30 transition-all flex items-center gap-2"
                  >
                    <PencilIcon className="h-4 w-4" />
                    Editar Perfil
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 disabled:bg-gray-400"
                    >
                      <CheckIcon className="h-4 w-4" />
                      {saving ? 'Salvando...' : 'Salvar'}
                    </button>
                    <button
                      onClick={handleCancel}
                      className="bg-white/20 backdrop-blur text-white px-4 py-2 rounded-lg font-medium hover:bg-white/30 transition-all flex items-center gap-2"
                    >
                      <XMarkIcon className="h-4 w-4" />
                      Cancelar
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {message && (
              <div className={`mb-6 p-4 rounded-lg border ${
                message.includes('✅') 
                  ? 'bg-green-50 text-green-700 border-green-200' 
                  : 'bg-red-50 text-red-700 border-red-200'
              }`}>
                {message}
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <UserCircleIcon className="h-5 w-5" />
                  Informações Básicas
                </h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Público *
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.public_name}
                      onChange={(e) => handleInputChange('public_name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Como você gostaria de ser chamado"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">{formData.public_name || 'Não informado'}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">Este nome será exibido publicamente em manifestações que você organizar</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Completo
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Seu nome completo"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">{formData.name || 'Não informado'}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">Usado para verificação interna, não será público</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <EnvelopeIcon className="h-4 w-4" />
                    Email
                  </label>
                  <p className="text-gray-900 py-2 bg-gray-50 px-3 rounded-md">{user.email}</p>
                  <p className="text-xs text-gray-500 mt-1">Email não pode ser alterado aqui</p>
                </div>
              </div>

              {/* Contact & Location */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <PhoneIcon className="h-5 w-5" />
                  Contato & Localização
                </h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    WhatsApp
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.whatsapp}
                      onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="(11) 99999-9999"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">{formData.whatsapp || 'Não informado'}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">Para comunicação sobre manifestações que você organizar</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="(11) 99999-9999"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">{formData.phone || 'Não informado'}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cidade
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="São Paulo"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{formData.city || 'Não informado'}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estado
                    </label>
                    {isEditing ? (
                      <select
                        value={formData.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="">Selecione</option>
                        <option value="AC">Acre</option>
                        <option value="AL">Alagoas</option>
                        <option value="AP">Amapá</option>
                        <option value="AM">Amazonas</option>
                        <option value="BA">Bahia</option>
                        <option value="CE">Ceará</option>
                        <option value="DF">Distrito Federal</option>
                        <option value="ES">Espírito Santo</option>
                        <option value="GO">Goiás</option>
                        <option value="MA">Maranhão</option>
                        <option value="MT">Mato Grosso</option>
                        <option value="MS">Mato Grosso do Sul</option>
                        <option value="MG">Minas Gerais</option>
                        <option value="PA">Pará</option>
                        <option value="PB">Paraíba</option>
                        <option value="PR">Paraná</option>
                        <option value="PE">Pernambuco</option>
                        <option value="PI">Piauí</option>
                        <option value="RJ">Rio de Janeiro</option>
                        <option value="RN">Rio Grande do Norte</option>
                        <option value="RS">Rio Grande do Sul</option>
                        <option value="RO">Rondônia</option>
                        <option value="RR">Roraima</option>
                        <option value="SC">Santa Catarina</option>
                        <option value="SP">São Paulo</option>
                        <option value="SE">Sergipe</option>
                        <option value="TO">Tocantins</option>
                      </select>
                    ) : (
                      <p className="text-gray-900 py-2">{formData.state || 'Não informado'}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Bio Section */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPinIcon className="h-5 w-5" />
                Sobre Você
              </h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Biografia / Apresentação
                </label>
                {isEditing ? (
                  <textarea
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Conte um pouco sobre você, seus valores e por que se juntou à plataforma..."
                  />
                ) : (
                  <p className="text-gray-900 py-2 whitespace-pre-wrap">{formData.bio || 'Nenhuma biografia adicionada ainda.'}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">Esta informação pode ser mostrada quando você organizar manifestações</p>
              </div>
            </div>

            {/* Privacy Notice */}
            <div className="mt-6 pt-6 border-t border-gray-200 bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 text-sm mb-2 flex items-center gap-2">
                <ShieldCheckIcon className="h-4 w-4" />
                🔒 Privacidade
              </h3>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• Apenas o Nome Público é exibido quando você organiza manifestações</li>
                <li>• Dados de contato são usados apenas para comunicação administrativa</li>
                <li>• Você tem controle total sobre quais informações compartilhar</li>
                <li>• Seus dados nunca são vendidos ou compartilhados com terceiros</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}