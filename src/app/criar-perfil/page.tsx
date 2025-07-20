'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/ui/Navigation'
import { useAuth } from '@/contexts/AuthContext'
import { updateUserProfile } from '@/lib/supabase'

export default function CreateProfilePage() {
  const { user, userProfile, refreshProfile } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    public_name: '',
    state: '',
    city: '',
    whatsapp: '',
    motivation: '',
    social_link: ''
  })

  const brazilianStates = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 
    'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ]

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    if (userProfile && (userProfile.role === 'organizer' || userProfile.role === 'organizer-pending')) {
      router.push('/')
      return
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
      const { data, error } = await updateUserProfile(user.id, {
        ...formData,
        role: 'organizer-pending',
        updated_at: new Date().toISOString()
      })

      if (error) throw error

      await refreshProfile()
      setMessage('Perfil criado com sucesso! Aguarde aprovação dos moderadores.')
      
      // Redirect after 3 seconds
      setTimeout(() => {
        router.push('/')
      }, 3000)

    } catch (error: any) {
      setMessage(error.message || 'Erro ao criar perfil')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return <div>Redirecionando...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-blue-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-green-200">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              👤 Criar Perfil de Organizador
            </h1>
            <p className="text-lg text-gray-600">
              Para organizar manifestações, você precisa criar um perfil que será revisado pelos moderadores
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="bg-green-50 rounded-lg p-6 border border-green-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">📋 Informações Pessoais</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Completo * <span className="text-xs text-gray-500">(não público)</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Seu nome completo"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Público ou Grupo * <span className="text-xs text-gray-500">(será exibido nos eventos)</span>
                  </label>
                  <input
                    type="text"
                    name="public_name"
                    value={formData.public_name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Ex: João Silva ou Grupo Patriotas SP"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado *
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="">Selecione o estado</option>
                    {brazilianStates.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cidade *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Ex: São Paulo"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">📞 Contato</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    WhatsApp * <span className="text-xs text-gray-500">(para verificação, não público)</span>
                  </label>
                  <input
                    type="tel"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="(11) 99999-9999"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rede Social <span className="text-xs text-gray-500">(opcional)</span>
                  </label>
                  <input
                    type="url"
                    name="social_link"
                    value={formData.social_link}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://instagram.com/seuusuario"
                  />
                </div>
              </div>
            </div>

            {/* Motivation */}
            <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">✊ Motivação</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Por que você quer organizar manifestações? *
                </label>
                <textarea
                  name="motivation"
                  value={formData.motivation}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Explique brevemente suas motivações para organizar manifestações pacíficas..."
                  required
                />
              </div>
            </div>

            {/* Guidelines */}
            <div className="bg-red-50 rounded-lg p-6 border border-red-200">
              <h3 className="text-lg font-bold text-red-800 mb-3">⚠️ Diretrizes para Organizadores</h3>
              <div className="text-sm text-red-700 space-y-2">
                <p>• <strong>Manifestações Pacíficas:</strong> Todos os eventos devem ser pacíficos e ordenados</p>
                <p>• <strong>Neutralidade:</strong> Evite símbolos partidários ou mensagens de ódio</p>
                <p>• <strong>Responsabilidade:</strong> Você é responsável pela conduta dos participantes</p>
                <p>• <strong>Moderação:</strong> Todos os perfis e eventos passam por revisão</p>
                <p>• <strong>Transparência:</strong> Forneça informações verdadeiras e completas</p>
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
                {loading ? '📤 Enviando...' : '🚀 Criar Perfil de Organizador'}
              </button>
              <p className="text-sm text-gray-600 mt-3">
                Seu perfil será revisado pelos moderadores em até 48 horas
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}