'use client'

import { useState } from 'react'
import Navigation from '@/components/ui/Navigation'
import Footer from '@/components/ui/Footer'
import NucleoCreation from '@/components/community/NucleoCreation'
import {
  UsersIcon,
  BuildingLibraryIcon,
  StarIcon,
  MapPinIcon,
  TagIcon,
  EyeIcon,
  UserPlusIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'

interface CommunityOrganizer {
  id: string
  name: string
  bio: string
  followersCount: number
  eventsCount: number
  rating: number
  location: string
  tags: string[]
  isVerified: boolean
}

interface CommunityNucleo {
  id: string
  name: string
  description: string
  memberCount: number
  city: string
  state: string
  category: string
  tags: string[]
  isPrivate: boolean
  createdAt: string
}

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<'discover' | 'organizers' | 'nucleos' | 'create'>('discover')
  const [searchQuery, setSearchQuery] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')

  // Demo data for organizers
  const organizers: CommunityOrganizer[] = [
    {
      id: '1',
      name: 'Coordenação SP',
      bio: 'Organizamos manifestações pela democracia e direitos civis em São Paulo há mais de 5 anos.',
      followersCount: 1247,
      eventsCount: 23,
      rating: 4.8,
      location: 'São Paulo, SP',
      tags: ['democracia', 'direitos civis', 'manifestações'],
      isVerified: true
    },
    {
      id: '2',
      name: 'Sindicato dos Caminhoneiros',
      bio: 'Defendemos os direitos dos transportadores e organizamos carreatas nacionais.',
      followersCount: 892,
      eventsCount: 15,
      rating: 4.6,
      location: 'Brasília, DF',
      tags: ['caminhoneiros', 'transporte', 'carreatas'],
      isVerified: true
    },
    {
      id: '3',
      name: 'Movimento Estudantil Livre',
      bio: 'Estudantes universitários organizando pela educação pública e de qualidade.',
      followersCount: 543,
      eventsCount: 8,
      rating: 4.5,
      location: 'Rio de Janeiro, RJ',
      tags: ['educação', 'estudantes', 'universidade'],
      isVerified: false
    }
  ]

  // Demo data for nucleos
  const nucleos: CommunityNucleo[] = [
    {
      id: '1',
      name: 'Núcleo Democrático Paulista',
      description: 'Cidadãos de São Paulo unidos pela defesa da democracia e transparência.',
      memberCount: 89,
      city: 'São Paulo',
      state: 'SP',
      category: 'geral',
      tags: ['democracia', 'transparência', 'cidadania'],
      isPrivate: false,
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Caminhoneiros Unidos RJ',
      description: 'Núcleo de caminhoneiros do Rio de Janeiro para defesa da categoria.',
      memberCount: 156,
      city: 'Rio de Janeiro',
      state: 'RJ',
      category: 'caminhoneiros',
      tags: ['caminhoneiros', 'transporte', 'sindical'],
      isPrivate: false,
      createdAt: '2024-02-01'
    },
    {
      id: '3',
      name: 'Produtores Rurais do Cerrado',
      description: 'Agricultores e pecuaristas do cerrado organizados pela sustentabilidade.',
      memberCount: 234,
      city: 'Goiânia',
      state: 'GO',
      category: 'produtores',
      tags: ['agricultura', 'sustentabilidade', 'cerrado'],
      isPrivate: true,
      createdAt: '2024-01-20'
    }
  ]

  const filteredOrganizers = organizers.filter(organizer => {
    const matchesSearch = organizer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         organizer.bio.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesLocation = !locationFilter || organizer.location.toLowerCase().includes(locationFilter.toLowerCase())
    return matchesSearch && matchesLocation
  })

  const filteredNucleos = nucleos.filter(nucleo => {
    const matchesSearch = nucleo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         nucleo.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesLocation = !locationFilter || `${nucleo.city}, ${nucleo.state}`.toLowerCase().includes(locationFilter.toLowerCase())
    const matchesCategory = !categoryFilter || nucleo.category === categoryFilter
    return matchesSearch && matchesLocation && matchesCategory
  })

  const categories = [
    { value: '', label: 'Todas as Categorias' },
    { value: 'geral', label: 'Mobilização Geral' },
    { value: 'caminhoneiros', label: 'Caminhoneiros' },
    { value: 'produtores', label: 'Produtores Rurais' },
    { value: 'comerciantes', label: 'Comerciantes' },
    { value: 'estudantes', label: 'Estudantes' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white p-8 mb-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">Comunidade Cívica</h1>
            <p className="text-blue-100 text-lg mb-6">
              Conecte-se com organizadores, participe de núcleos locais e fortaleça a democracia participativa
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar organizadores, núcleos ou temas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-white focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="flex">
            {[
              { id: 'discover', label: 'Descobrir', icon: StarIcon },
              { id: 'organizers', label: 'Organizadores', icon: UsersIcon },
              { id: 'nucleos', label: 'Núcleos', icon: BuildingLibraryIcon },
              { id: 'create', label: 'Criar Núcleo', icon: UserPlusIcon }
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

        {/* Filters */}
        {(activeTab === 'organizers' || activeTab === 'nucleos') && (
          <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-64">
                <input
                  type="text"
                  placeholder="Filtrar por localização..."
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              {activeTab === 'nucleos' && (
                <div className="min-w-48">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {categories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Content */}
        <div>
          {activeTab === 'discover' && (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Featured Organizers */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <UsersIcon className="w-5 h-5" />
                    Organizadores em Destaque
                  </h2>
                </div>
                <div className="p-6 space-y-4">
                  {organizers.slice(0, 3).map(organizer => (
                    <div key={organizer.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <UsersIcon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-gray-900">{organizer.name}</h3>
                          {organizer.isVerified && (
                            <span className="text-blue-500" title="Verificado">✓</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{organizer.location}</p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                          <span>{organizer.followersCount} seguidores</span>
                          <span>{organizer.eventsCount} eventos</span>
                          <div className="flex items-center gap-1">
                            <StarIcon className="w-3 h-3 text-yellow-500" />
                            {organizer.rating}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Featured Nucleos */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <BuildingLibraryIcon className="w-5 h-5" />
                    Núcleos Ativos
                  </h2>
                </div>
                <div className="p-6 space-y-4">
                  {nucleos.slice(0, 3).map(nucleo => (
                    <div key={nucleo.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-gray-900">{nucleo.name}</h3>
                            {nucleo.isPrivate && <EyeIcon className="w-4 h-4 text-gray-400" />}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{nucleo.description}</p>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <UsersIcon className="w-3 h-3" />
                              {nucleo.memberCount} membros
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPinIcon className="w-3 h-3" />
                              {nucleo.city}, {nucleo.state}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {nucleo.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                            <TagIcon className="w-2 h-2" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'organizers' && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOrganizers.map(organizer => (
                <div key={organizer.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                        <UsersIcon className="w-8 h-8 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-gray-900">{organizer.name}</h3>
                          {organizer.isVerified && (
                            <span className="text-blue-500 text-lg" title="Verificado">✓</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{organizer.location}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <StarIcon className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm font-medium">{organizer.rating}</span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{organizer.bio}</p>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {organizer.tags.map(tag => (
                        <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                          <TagIcon className="w-2 h-2" />
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                      <span>{organizer.followersCount} seguidores</span>
                      <span>{organizer.eventsCount} eventos</span>
                    </div>
                    
                    <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      Seguir Organizador
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'nucleos' && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNucleos.map(nucleo => (
                <div key={nucleo.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-bold text-gray-900 line-clamp-2">{nucleo.name}</h3>
                      {nucleo.isPrivate && (
                        <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                          Privado
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{nucleo.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <span className="flex items-center gap-1">
                        <UsersIcon className="w-4 h-4" />
                        {nucleo.memberCount} membros
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPinIcon className="w-4 h-4" />
                        {nucleo.city}, {nucleo.state}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {nucleo.tags.map(tag => (
                        <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                          <TagIcon className="w-2 h-2" />
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <p className="text-xs text-gray-400 mb-4">
                      Criado em {new Date(nucleo.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                    
                    <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors">
                      {nucleo.isPrivate ? 'Solicitar Convite' : 'Participar do Núcleo'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'create' && <NucleoCreation />}
        </div>
      </div>
      
      <Footer />
    </div>
  )
}