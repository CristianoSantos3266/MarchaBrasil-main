'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/ui/Navigation'
import Footer from '@/components/ui/Footer'
import { useAuth } from '@/contexts/AuthContext'
import { updateUserProfile } from '@/lib/supabase'
import ParticipationHistory from '@/components/community/ParticipationHistory'
import NucleoManagement from '@/components/community/NucleoManagement'
import { 
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  ShieldCheckIcon,
  UsersIcon,
  BuildingLibraryIcon,
  CalendarIcon,
  TrophyIcon,
  BellIcon,
  CogIcon,
  UserIcon
} from '@heroicons/react/24/outline'

interface UserStats {
  eventsAttended: number
  nucleosCreated: number
  followersCount: number
  followingCount: number
  totalContributions: number
}

interface FollowData {
  organizerId: string
  organizerName: string
  followedAt: string
  notifications: boolean
}

export default function ProfilePage() {
  const { user, userProfile, loading, refreshProfile } = useAuth()
  const router = useRouter()
  
  const [activeTab, setActiveTab] = useState<'overview' | 'profile' | 'history' | 'nucleos' | 'following' | 'settings'>('overview')
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [stats, setStats] = useState<UserStats>({
    eventsAttended: 0,
    nucleosCreated: 0,
    followersCount: 0,
    followingCount: 0,
    totalContributions: 0
  })
  const [following, setFollowing] = useState<FollowData[]>([])
  
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

  useEffect(() => {
    if (user) {
      loadUserStats()
      loadFollowing()
    }
  }, [user])

  const loadUserStats = async () => {
    try {
      // Load participation history
      const savedHistory = localStorage.getItem(`participation_${user?.id}`)
      const participationData = savedHistory ? JSON.parse(savedHistory) : { events: [] }
      const eventsAttended = participationData.events?.filter((e: any) => e.status === 'attended').length || 0

      // Load nucleos
      const savedNucleos = localStorage.getItem(`nucleos_${user?.id}`)
      const nucleos = savedNucleos ? JSON.parse(savedNucleos) : []
      const nucleosCreated = nucleos.length

      // Load follows for following count
      const savedFollows = localStorage.getItem(`follows_${user?.id}`)
      const follows = savedFollows ? JSON.parse(savedFollows) : {}
      const followingCount = Object.keys(follows).length

      // Demo followers count
      const followersCount = Math.floor(Math.random() * 50) + 5

      setStats({
        eventsAttended,
        nucleosCreated,
        followersCount,
        followingCount,
        totalContributions: eventsAttended + nucleosCreated
      })
    } catch (error) {
      console.error('Error loading user stats:', error)
    }
  }

  const loadFollowing = async () => {
    try {
      const savedFollows = localStorage.getItem(`follows_${user?.id}`)
      const follows = savedFollows ? JSON.parse(savedFollows) : {}
      
      const followingList = Object.entries(follows).map(([organizerId, data]: [string, any]) => ({
        organizerId,
        organizerName: data.organizerName,
        followedAt: data.followedAt,
        notifications: data.notifications !== false
      }))

      setFollowing(followingList)
    } catch (error) {
      console.error('Error loading following:', error)
    }
  }

  const unfollowOrganizer = async (organizerId: string) => {
    try {
      const savedFollows = localStorage.getItem(`follows_${user?.id}`)
      const follows = savedFollows ? JSON.parse(savedFollows) : {}
      
      delete follows[organizerId]
      localStorage.setItem(`follows_${user?.id}`, JSON.stringify(follows))
      
      setFollowing(prev => prev.filter(f => f.organizerId !== organizerId))
      setStats(prev => ({ ...prev, followingCount: prev.followingCount - 1 }))
    } catch (error) {
      console.error('Error unfollowing organizer:', error)
    }
  }

  const toggleNotifications = async (organizerId: string) => {
    try {
      const savedFollows = localStorage.getItem(`follows_${user?.id}`)
      const follows = savedFollows ? JSON.parse(savedFollows) : {}
      
      if (follows[organizerId]) {
        follows[organizerId].notifications = !follows[organizerId].notifications
        localStorage.setItem(`follows_${user?.id}`, JSON.stringify(follows))
        
        setFollowing(prev => prev.map(f => 
          f.organizerId === organizerId 
            ? { ...f, notifications: !f.notifications }
            : f
        ))
      }
    } catch (error) {
      console.error('Error toggling notifications:', error)
    }
  }

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
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="p-6">
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {getUserInitials(getUserDisplayName())}
              </div>
              
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {getUserDisplayName()}
                </h1>
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <EnvelopeIcon className="w-4 h-4" />
                    {user.email}
                  </div>
                  {userProfile?.phone && (
                    <div className="flex items-center gap-1">
                      <PhoneIcon className="w-4 h-4" />
                      {userProfile.phone}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="w-4 h-4" />
                    Membro desde {new Date(user.created_at || '').toLocaleDateString('pt-BR')}
                  </div>
                  {userProfile?.role === 'admin' && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-red-500 text-white rounded-full">
                      <ShieldCheckIcon className="w-3 h-3" />
                      Administrador
                    </span>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{stats.eventsAttended}</div>
                    <div className="text-sm text-gray-500">Eventos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{stats.nucleosCreated}</div>
                    <div className="text-sm text-gray-500">Núcleos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{stats.followingCount}</div>
                    <div className="text-sm text-gray-500">Seguindo</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{stats.followersCount}</div>
                    <div className="text-sm text-gray-500">Seguidores</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{stats.totalContributions}</div>
                    <div className="text-sm text-gray-500">Contribuições</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-t border-gray-200">
            <div className="flex">
              {[
                { id: 'overview', label: 'Visão Geral', icon: UserIcon },
                { id: 'profile', label: 'Perfil', icon: UserCircleIcon },
                { id: 'history', label: 'Histórico', icon: CalendarIcon },
                { id: 'nucleos', label: 'Núcleos', icon: BuildingLibraryIcon },
                { id: 'following', label: 'Seguindo', icon: UsersIcon },
                { id: 'settings', label: 'Configurações', icon: CogIcon }
              ].map(tab => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <TrophyIcon className="w-5 h-5 text-yellow-600" />
                  Conquistas Recentes
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                      <CalendarIcon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-green-900">Participação Ativa</p>
                      <p className="text-sm text-green-600">Participou de {stats.eventsAttended} eventos</p>
                    </div>
                  </div>
                  
                  {stats.nucleosCreated > 0 && (
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <BuildingLibraryIcon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-blue-900">Líder Comunitário</p>
                        <p className="text-sm text-blue-600">Criou {stats.nucleosCreated} núcleos</p>
                      </div>
                    </div>
                  )}

                  {stats.followingCount > 0 && (
                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                        <UsersIcon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-purple-900">Engajado</p>
                        <p className="text-sm text-purple-600">Segue {stats.followingCount} organizadores</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Atividade Recente</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                    <CalendarIcon className="w-4 h-4 text-blue-600" />
                    <span className="text-gray-600">Confirmou presença em evento próximo</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                    <UsersIcon className="w-4 h-4 text-green-600" />
                    <span className="text-gray-600">Começou a seguir novo organizador</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                    <BellIcon className="w-4 h-4 text-yellow-600" />
                    <span className="text-gray-600">Recebeu notificação de novo evento</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-gray-900">Informações do Perfil</h3>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <PencilIcon className="w-4 h-4" />
                      Editar Perfil
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                      >
                        <CheckIcon className="w-4 h-4" />
                        {saving ? 'Salvando...' : 'Salvar'}
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <XMarkIcon className="w-4 h-4" />
                        Cancelar
                      </button>
                    </div>
                  )}
                </div>
              </div>

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
          )}

          {activeTab === 'history' && <ParticipationHistory />}

          {activeTab === 'nucleos' && <NucleoManagement />}

          {activeTab === 'following' && (
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900">Organizadores que Você Segue</h3>
                <p className="text-gray-600 mt-1">Gerencie suas seguições e preferências de notificação.</p>
              </div>

              <div className="p-6">
                {following.length === 0 ? (
                  <div className="text-center py-8">
                    <UsersIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Você ainda não segue nenhum organizador.</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Comece a seguir organizadores para receber notificações de novos eventos!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {following.map(follow => (
                      <div key={follow.organizerId} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <UserIcon className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{follow.organizerName}</h4>
                            <p className="text-sm text-gray-500">
                              Seguindo desde {new Date(follow.followedAt).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => toggleNotifications(follow.organizerId)}
                            className={`p-2 rounded-lg transition-colors ${
                              follow.notifications
                                ? 'bg-green-50 text-green-600 hover:bg-green-100'
                                : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                            }`}
                            title={follow.notifications ? 'Desativar notificações' : 'Ativar notificações'}
                          >
                            <BellIcon className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => unfollowOrganizer(follow.organizerId)}
                            className="px-3 py-1 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm"
                          >
                            Deixar de Seguir
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900">Configurações da Conta</h3>
              </div>

              <div className="p-6">
                <div className="max-w-md">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome Completo
                      </label>
                      <input
                        type="text"
                        defaultValue={userProfile?.name || ''}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        defaultValue={user.email || ''}
                        disabled
                        className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Telefone
                      </label>
                      <input
                        type="tel"
                        defaultValue={userProfile?.phone || ''}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors">
                      Salvar Alterações
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  )
}