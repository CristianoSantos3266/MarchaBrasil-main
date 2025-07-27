'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import {
  UsersIcon,
  MapPinIcon,
  DocumentTextIcon,
  TagIcon,
  CalendarIcon,
  PlusIcon,
  XMarkIcon,
  BuildingLibraryIcon,
  HandRaisedIcon,
  TruckIcon
} from '@heroicons/react/24/outline'

interface NucleoFormData {
  name: string
  description: string
  city: string
  state: string
  category: string
  meetingFrequency: string
  maxMembers: number
  isPrivate: boolean
  tags: string[]
  rules: string[]
}

export default function NucleoCreation() {
  const { user } = useAuth()
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<NucleoFormData>({
    name: '',
    description: '',
    city: '',
    state: '',
    category: 'geral',
    meetingFrequency: 'monthly',
    maxMembers: 50,
    isPrivate: false,
    tags: [],
    rules: ['Respeito mútuo entre todos os membros', 'Participação ativa nas atividades', 'Compromisso com os valores democráticos']
  })
  const [newTag, setNewTag] = useState('')
  const [newRule, setNewRule] = useState('')

  const categories = [
    { value: 'geral', label: 'Mobilização Geral', icon: HandRaisedIcon },
    { value: 'caminhoneiros', label: 'Caminhoneiros', icon: TruckIcon },
    { value: 'produtores', label: 'Produtores Rurais', icon: MapPinIcon },
    { value: 'comerciantes', label: 'Comerciantes', icon: BuildingLibraryIcon },
    { value: 'estudantes', label: 'Estudantes', icon: UsersIcon },
    { value: 'profissionais', label: 'Profissionais Liberais', icon: DocumentTextIcon }
  ]

  const frequencies = [
    { value: 'weekly', label: 'Semanal' },
    { value: 'biweekly', label: 'Quinzenal' },
    { value: 'monthly', label: 'Mensal' },
    { value: 'quarterly', label: 'Trimestral' },
    { value: 'asneeded', label: 'Conforme Necessário' }
  ]

  const brazilianStates = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 
    'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    try {
      const nucleoData = {
        ...formData,
        id: `nucleo_${Date.now()}`,
        createdBy: user.id,
        createdAt: new Date().toISOString(),
        memberCount: 1,
        status: 'active',
        members: [user.id]
      }

      // In production, this would save to your database
      const savedNucleos = localStorage.getItem(`nucleos_${user.id}`)
      const nucleos = savedNucleos ? JSON.parse(savedNucleos) : []
      nucleos.push(nucleoData)
      localStorage.setItem(`nucleos_${user.id}`, JSON.stringify(nucleos))

      console.log('Núcleo created:', nucleoData)
      alert('Núcleo criado com sucesso!')
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        city: '',
        state: '',
        category: 'geral',
        meetingFrequency: 'monthly',
        maxMembers: 50,
        isPrivate: false,
        tags: [],
        rules: ['Respeito mútuo entre todos os membros', 'Participação ativa nas atividades', 'Compromisso com os valores democráticos']
      })
      setShowForm(false)
    } catch (error) {
      console.error('Error creating núcleo:', error)
      alert('Erro ao criar núcleo. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const addRule = () => {
    if (newRule.trim() && !formData.rules.includes(newRule.trim())) {
      setFormData(prev => ({
        ...prev,
        rules: [...prev.rules, newRule.trim()]
      }))
      setNewRule('')
    }
  }

  const removeRule = (ruleToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      rules: prev.rules.filter(rule => rule !== ruleToRemove)
    }))
  }

  if (!user) {
    return (
      <div className="text-center py-8">
        <UsersIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Faça login para criar um núcleo local.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {!showForm ? (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-8 text-center">
          <BuildingLibraryIcon className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Crie um Núcleo Local
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Organize sua comunidade criando um núcleo local para mobilização cívica. 
            Reúna pessoas da sua região, organize encontros regulares e fortaleça a participação democrática.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
          >
            <PlusIcon className="w-5 h-5" />
            Criar Núcleo
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Criar Novo Núcleo</h3>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Núcleo *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Núcleo Democrático de São Paulo"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoria *
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Location */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cidade *
                </label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  placeholder="Ex: São Paulo"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado *
                </label>
                <select
                  required
                  value={formData.state}
                  onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecione o estado</option>
                  {brazilianStates.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição *
              </label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descreva os objetivos e propósito do núcleo..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Settings */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Frequência de Encontros
                </label>
                <select
                  value={formData.meetingFrequency}
                  onChange={(e) => setFormData(prev => ({ ...prev, meetingFrequency: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {frequencies.map(freq => (
                    <option key={freq.value} value={freq.value}>
                      {freq.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Máximo de Membros
                </label>
                <input
                  type="number"
                  min="5"
                  max="500"
                  value={formData.maxMembers}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxMembers: parseInt(e.target.value) }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Privacy */}
            <div>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.isPrivate}
                  onChange={(e) => setFormData(prev => ({ ...prev, isPrivate: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Núcleo Privado (apenas por convite)
                </span>
              </label>
              <p className="text-sm text-gray-500 ml-7">
                Se marcado, apenas pessoas convidadas poderão participar do núcleo.
              </p>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags de Interesse
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Ex: direitos humanos, educação..."
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <PlusIcon className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                  >
                    <TagIcon className="w-3 h-3" />
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <XMarkIcon className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Rules */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Regras do Núcleo
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newRule}
                  onChange={(e) => setNewRule(e.target.value)}
                  placeholder="Adicione uma regra..."
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRule())}
                />
                <button
                  type="button"
                  onClick={addRule}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <PlusIcon className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-2">
                {formData.rules.map((rule, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <DocumentTextIcon className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <span className="flex-1 text-sm text-gray-700">{rule}</span>
                    <button
                      type="button"
                      onClick={() => removeRule(rule)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Criando...
                  </>
                ) : (
                  <>
                    <BuildingLibraryIcon className="w-5 h-5" />
                    Criar Núcleo
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}