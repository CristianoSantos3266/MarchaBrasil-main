'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/ui/Navigation'
import { useAuth } from '@/contexts/AuthContext'
import { createEvent } from '@/lib/supabase'

export default function CreateEventPage() {
  const { user, userProfile } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'caminhada' as 'caminhada' | 'caminhoneiros' | 'carreata' | 'motociata' | 'vigilia',
    date: '',
    time: '',
    meeting_point: '',
    final_destination: '',
    city: '',
    state: '',
    expected_attendance: '',
    whatsapp_contact: ''
  })

  const protestTypes = [
    { value: 'caminhada', label: '🚶 Caminhada', icon: '🚶' },
    { value: 'caminhoneiros', label: '🚛 Caminhoneiros', icon: '🚛' },
    { value: 'carreata', label: '🚗 Carreata', icon: '🚗' },
    { value: 'motociata', label: '🏍️ Motociata', icon: '🏍️' },
    { value: 'vigilia', label: '🕯️ Vigília', icon: '🕯️' }
  ]

  const brazilianStates = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 
    'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ]

  useEffect(() => {
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
  }, [user, userProfile, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    setMessage('')

    try {
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

      setMessage('🎉 Evento criado com sucesso! Aguarde aprovação dos moderadores.')
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        type: 'caminhada',
        date: '',
        time: '',
        meeting_point: '',
        final_destination: '',
        city: '',
        state: '',
        expected_attendance: '',
        whatsapp_contact: ''
      })

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

  if (!user || !userProfile) {
    return <div>Carregando...</div>
  }

  if (userProfile.role !== 'organizer') {
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
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              📢 Criar Nova Manifestação
            </h1>
            <p className="text-lg text-gray-600">
              Organize uma manifestação pacífica em defesa da democracia
            </p>
            <div className="mt-2 text-sm text-blue-600">
              Organizador: <strong>{userProfile.public_name}</strong>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="bg-green-50 rounded-lg p-6 border border-green-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">📋 Informações Básicas</h2>
              
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
                    {protestTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
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
            </div>

            {/* Date and Location */}
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">📅 Data e Local</h2>
              
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
                    Estado *
                  </label>
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
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mt-4">
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
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ponto de Encontro *
                  </label>
                  <input
                    type="text"
                    name="meeting_point"
                    value={formData.meeting_point}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: Avenida Paulista, em frente ao MASP"
                    required
                  />
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
              <h2 className="text-xl font-bold text-gray-900 mb-4">📞 Contato e Detalhes</h2>
              
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
              <h3 className="text-lg font-bold text-red-800 mb-3">⚠️ Diretrizes Importantes</h3>
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
                className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-green-700 hover:to-green-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                {loading ? '📤 Enviando...' : '🚀 Criar Manifestação'}
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