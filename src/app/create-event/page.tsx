'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/ui/Navigation'
import { useAuth } from '@/contexts/AuthContext'
import { createEvent } from '@/lib/supabase'
import { saveDemoEvent } from '@/lib/demo-events'
import { 
  DocumentTextIcon,
  CalendarIcon,
  PhoneIcon,
  ExclamationTriangleIcon,
  HandRaisedIcon,
  MapPinIcon,
  TruckIcon,
  BuildingLibraryIcon,
  RocketLaunchIcon,
  PaperAirplaneIcon,
  PhotoIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

export default function CreateEventPage() {
  const { user, userProfile } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'manifestacao' as 'manifestacao' | 'marcha' | 'caminhoneiros' | 'carreata' | 'motociata' | 'tratorada' | 'assembleia',
    date: '',
    time: '',
    meeting_point: '',
    final_destination: '',
    city: '',
    state: '',
    expected_attendance: '',
    whatsapp_contact: '',
    isNational: false
  })

  const [thumbnail, setThumbnail] = useState<string | null>(null)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)

  const protestTypes = [
    { value: 'manifestacao', label: 'Manifestação', icon: HandRaisedIcon },
    { value: 'marcha', label: 'Marcha', icon: MapPinIcon },
    { value: 'caminhoneiros', label: 'Caminhoneiros', icon: TruckIcon },
    { value: 'carreata', label: 'Carreata', icon: TruckIcon },
    { value: 'motociata', label: 'Motociata', icon: MapPinIcon },
    { value: 'tratorada', label: 'Tratorada', icon: TruckIcon },
    { value: 'assembleia', label: 'Assembleia', icon: BuildingLibraryIcon }
  ]

  const brazilianStates = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 
    'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ]

  const brazilianCapitals = [
    { state: 'AC', capital: 'Rio Branco' },
    { state: 'AL', capital: 'Maceió' },
    { state: 'AP', capital: 'Macapá' },
    { state: 'AM', capital: 'Manaus' },
    { state: 'BA', capital: 'Salvador' },
    { state: 'CE', capital: 'Fortaleza' },
    { state: 'DF', capital: 'Brasília' },
    { state: 'ES', capital: 'Vitória' },
    { state: 'GO', capital: 'Goiânia' },
    { state: 'MA', capital: 'São Luís' },
    { state: 'MT', capital: 'Cuiabá' },
    { state: 'MS', capital: 'Campo Grande' },
    { state: 'MG', capital: 'Belo Horizonte' },
    { state: 'PA', capital: 'Belém' },
    { state: 'PB', capital: 'João Pessoa' },
    { state: 'PR', capital: 'Curitiba' },
    { state: 'PE', capital: 'Recife' },
    { state: 'PI', capital: 'Teresina' },
    { state: 'RJ', capital: 'Rio de Janeiro' },
    { state: 'RN', capital: 'Natal' },
    { state: 'RS', capital: 'Porto Alegre' },
    { state: 'RO', capital: 'Porto Velho' },
    { state: 'RR', capital: 'Boa Vista' },
    { state: 'SC', capital: 'Florianópolis' },
    { state: 'SP', capital: 'São Paulo' },
    { state: 'SE', capital: 'Aracaju' },
    { state: 'TO', capital: 'Palmas' }
  ]

  // Check if we're in demo mode
  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true' || !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co'

  useEffect(() => {
    // In demo mode, allow access without authentication
    if (isDemoMode) {
      setLoading(false)
      return
    }

    if (!user) {
      router.push('/login')
      return
    }

    if (!userProfile || userProfile.role !== 'organizer') {
      if (userProfile?.role === 'organizer-pending') {
        router.push('/')
        return
      } else if (userProfile?.role === 'user') {
        router.push('/criar-perfil')
        return
      }
    }
  }, [user, userProfile, router, isDemoMode])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setMessage('Por favor, selecione apenas arquivos de imagem.')
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage('A imagem deve ter no máximo 5MB.')
        return
      }

      setThumbnailFile(file)
      
      // Create preview URL
      const reader = new FileReader()
      reader.onload = (event) => {
        setThumbnail(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeThumbnail = () => {
    setThumbnail(null)
    setThumbnailFile(null)
    // Reset file input
    const fileInput = document.getElementById('thumbnail') as HTMLInputElement
    if (fileInput) fileInput.value = ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setLoading(true)
    setMessage('')

    try {
      // In demo mode, save event to localStorage
      if (isDemoMode) {
        await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate network delay
        
        // Save the demo event(s) with thumbnail
        const savedEvents = saveDemoEvent({ ...formData, thumbnail });
        
        if (formData.isNational) {
          setMessage(`Eventos criados com sucesso! (Modo Demo - ${savedEvents.length} manifestações criadas em todas as capitais)`)
        } else {
          setMessage(`Evento criado com sucesso! (Modo Demo - ${savedEvents[0].title})`)
        }
        
        // Reset form
        setFormData({
          title: '',
          description: '',
          type: 'manifestacao',
          date: '',
          time: '',
          meeting_point: '',
          final_destination: '',
          city: '',
          state: '',
          expected_attendance: '',
          whatsapp_contact: '',
          isNational: false
        })
        setThumbnail(null)
        setThumbnailFile(null)

        // Don't auto-redirect in demo mode - let user see the success message
        return
      }

      if (!user) return

      const eventData = {
        creator_id: user.id,
        ...formData,
        expected_attendance: formData.expected_attendance ? parseInt(formData.expected_attendance) : null,
        status: 'pending' as const,
        is_international: false,
        country: null
      }

      const { data, error } = await createEvent(eventData)
      if (error) throw error

      setMessage('Evento criado com sucesso! Aguarde aprovação dos moderadores.')
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        type: 'manifestacao',
        date: '',
        time: '',
        meeting_point: '',
        final_destination: '',
        city: '',
        state: '',
        expected_attendance: '',
        whatsapp_contact: '',
        isNational: false
      })
      setThumbnail(null)
      setThumbnailFile(null)

      // Redirect after 3 seconds
      setTimeout(() => {
        router.push('/')
      }, 3000)

    } catch (error: any) {
      setMessage(error.message || 'Erro ao criar evento')
    } finally {
      setLoading(false)
    }
  }

  // In demo mode, show loading until ready, then allow access
  if (!isDemoMode && (!user || !userProfile)) {
    return <div>Carregando...</div>
  }

  if (!isDemoMode && userProfile?.role !== 'organizer') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-blue-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-yellow-200">
            <div className="text-4xl mb-4">⏳</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Aguardando Aprovação</h1>
            <p className="text-gray-600">
              {userProfile.role === 'organizer-pending' 
                ? 'Seu perfil de organizador está sendo revisado pelos moderadores. Você receberá um email quando for aprovado.'
                : 'Você precisa criar um perfil de organizador para criar eventos.'
              }
            </p>
            {userProfile.role === 'user' && (
              <button
                onClick={() => router.push('/criar-perfil')}
                className="mt-4 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg font-bold hover:from-green-700 hover:to-green-800 transition-all duration-200"
              >
                Criar Perfil de Organizador
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-blue-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-green-200">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
              <HandRaisedIcon className="h-8 w-8 text-green-600" />
              Criar Nova Manifestação
            </h1>
            <p className="text-lg text-gray-600">
              Organize uma manifestação pacífica em defesa da democracia
            </p>
            <div className="mt-2 text-sm text-blue-600">
              {isDemoMode ? (
                <span><strong>Modo Demo</strong> - Teste a criação de eventos</span>
              ) : (
                <>Organizador: <strong>{userProfile?.public_name}</strong></>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="bg-green-50 rounded-lg p-6 border border-green-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <DocumentTextIcon className="h-6 w-6 text-green-600" />
                Informações Básicas
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título da Manifestação *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Ex: Marcha pela Liberdade de Expressão"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Manifestação *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  >
                    {protestTypes.map(type => {
                      const IconComponent = type.icon;
                      return (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Descreva os objetivos e propósitos da manifestação..."
                  required
                />
              </div>

              {/* Thumbnail Upload */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Imagem de Destaque (opcional)
                </label>
                
                {!thumbnail ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <label htmlFor="thumbnail" className="cursor-pointer">
                      <span className="text-sm text-gray-600">
                        Clique para adicionar uma imagem ou arraste aqui
                      </span>
                      <input
                        id="thumbnail"
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailChange}
                        className="hidden"
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-2">
                      PNG, JPG ou GIF até 5MB
                    </p>
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={thumbnail}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg border border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={removeThumbnail}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                    <div className="mt-2 text-sm text-gray-600">
                      {thumbnailFile?.name} ({((thumbnailFile?.size || 0) / 1024 / 1024).toFixed(1)}MB)
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Date and Location */}
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CalendarIcon className="h-6 w-6 text-blue-600" />
                Data e Local
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Horário *
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Localização *
                  </label>
                  
                  {/* National Event Toggle */}
                  <div className="mb-4 p-4 bg-green-100 border border-green-300 rounded-lg">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isNational}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          isNational: e.target.checked,
                          state: e.target.checked ? '' : prev.state,
                          city: e.target.checked ? '' : prev.city
                        }))}
                        className="h-4 w-4 text-green-600 border-green-300 rounded focus:ring-green-500"
                      />
                      <span className="text-sm font-medium text-green-800">
                        🇧🇷 Evento Nacional - Todas as Capitais Brasileiras
                      </span>
                    </label>
                    {formData.isNational && (
                      <p className="text-xs text-green-700 mt-2">
                        Criará automaticamente 27 eventos simultâneos (uma manifestação em cada capital)
                      </p>
                    )}
                  </div>

                  {!formData.isNational && (
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Selecione o estado</option>
                      {brazilianStates.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  )}

                  {formData.isNational && (
                    <div className="w-full px-3 py-2 bg-green-50 border border-green-300 rounded-md text-green-800 font-medium">
                      Todas as 27 capitais brasileiras
                    </div>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mt-4">
                {!formData.isNational && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cidade *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: São Paulo"
                      required={!formData.isNational}
                    />
                  </div>
                )}

                <div className={formData.isNational ? "md:col-span-2" : ""}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {formData.isNational ? 'Ponto de Encontro Base (opcional)' : 'Ponto de Encontro *'}
                  </label>
                  <input
                    type="text"
                    name="meeting_point"
                    value={formData.meeting_point}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={formData.isNational 
                      ? "Ex: Centro da cidade (será aplicado a todas as capitais)" 
                      : "Ex: Avenida Paulista, em frente ao MASP"
                    }
                    required={!formData.isNational}
                  />
                  {formData.isNational && (
                    <p className="text-xs text-gray-600 mt-1">
                      Se não especificado, será usado "Centro de [Capital]" para cada cidade
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Destino Final <span className="text-gray-500">(opcional)</span>
                </label>
                <input
                  type="text"
                  name="final_destination"
                  value={formData.final_destination}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Congresso Nacional, Palácio do Planalto"
                />
              </div>
            </div>

            {/* Contact and Details */}
            <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <PhoneIcon className="h-6 w-6 text-yellow-600" />
                Contato e Detalhes
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    WhatsApp para Verificação * <span className="text-xs text-gray-500">(não público)</span>
                  </label>
                  <input
                    type="tel"
                    name="whatsapp_contact"
                    value={formData.whatsapp_contact}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="(11) 99999-9999"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimativa de Participantes <span className="text-gray-500">(opcional)</span>
                  </label>
                  <input
                    type="number"
                    name="expected_attendance"
                    value={formData.expected_attendance}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="Ex: 500"
                    min="1"
                  />
                </div>
              </div>
            </div>

            {/* Guidelines */}
            <div className="bg-red-50 rounded-lg p-6 border border-red-200">
              <h3 className="text-lg font-bold text-red-800 mb-3 flex items-center gap-2">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                Diretrizes Importantes
              </h3>
              <div className="text-sm text-red-700 space-y-2">
                <p>• <strong>Manifestação Pacífica:</strong> Todos os eventos devem ser pacíficos e ordenados</p>
                <p>• <strong>Respeito às Leis:</strong> Cumpra todas as normas de trânsito e regulamentações locais</p>
                <p>• <strong>Neutralidade:</strong> Evite símbolos partidários ou violentos</p>
                <p>• <strong>Moderação:</strong> Todos os eventos são revisados antes da publicação</p>
                <p>• <strong>Responsabilidade:</strong> O organizador é responsável pela conduta dos participantes</p>
              </div>
            </div>

            {message && (
              <div className={`p-4 rounded-md text-sm ${
                message.includes('sucesso') 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {message}
              </div>
            )}

            {/* Submit */}
            <div className="text-center">
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-green-700 hover:to-green-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <PaperAirplaneIcon className="h-6 w-6" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <RocketLaunchIcon className="h-6 w-6" />
                    Criar Manifestação
                  </>
                )}
              </button>
              <p className="text-sm text-gray-600 mt-3">
                Seu evento será revisado pelos moderadores antes da publicação
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}