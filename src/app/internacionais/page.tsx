'use client'

import { useState } from 'react'
import Navigation from '@/components/ui/Navigation'

interface Embassy {
  country: string
  city: string
  flag: string
  address: string
  timezone: string
  communitySize: string
}

interface InternationalEvent {
  id: string
  title: string
  city: string
  country: string
  flag: string
  date: string
  time: string
  location: string
  description: string
  organizer: string
  participants: number
}

export default function InternationalPage() {
  const [selectedCountry, setSelectedCountry] = useState<string>('all')

  const embassies: Embassy[] = [
    {
      country: 'Estados Unidos',
      city: 'Washington DC',
      flag: '🇺🇸',
      address: '3006 Massachusetts Ave NW',
      timezone: 'UTC-5',
      communitySize: '~350,000 brasileiros'
    },
    {
      country: 'Estados Unidos',
      city: 'Nova York',
      flag: '🇺🇸',
      address: '1185 6th Ave, 21st Floor',
      timezone: 'UTC-5',
      communitySize: '~200,000 brasileiros'
    },
    {
      country: 'Estados Unidos',
      city: 'Miami',
      flag: '🇺🇸',
      address: '80 SW 8th St Suite 2600',
      timezone: 'UTC-5',
      communitySize: '~150,000 brasileiros'
    },
    {
      country: 'Portugal',
      city: 'Lisboa',
      flag: '🇵🇹',
      address: 'Estrada das Laranjeiras, 144',
      timezone: 'UTC+0',
      communitySize: '~250,000 brasileiros'
    },
    {
      country: 'Canadá',
      city: 'Toronto',
      flag: '🇨🇦',
      address: '77 Bloor St W, Suite 1109',
      timezone: 'UTC-5',
      communitySize: '~100,000 brasileiros'
    },
    {
      country: 'Reino Unido',
      city: 'Londres',
      flag: '🇬🇧',
      address: '14-16 Cockspur St',
      timezone: 'UTC+0',
      communitySize: '~80,000 brasileiros'
    },
    {
      country: 'Japão',
      city: 'Tóquio',
      flag: '🇯🇵',
      address: '2-11-12 Kita-Aoyama, Minato-ku',
      timezone: 'UTC+9',
      communitySize: '~200,000 brasileiros'
    },
    {
      country: 'Alemanha',
      city: 'Berlim',
      flag: '🇩🇪',
      address: 'Wallstraße 57',
      timezone: 'UTC+1',
      communitySize: '~120,000 brasileiros'
    }
  ]

  const events: InternationalEvent[] = [
    {
      id: '1',
      title: 'Manifestação pela Democracia Brasileira',
      city: 'Washington DC',
      country: 'Estados Unidos',
      flag: '🇺🇸',
      date: '2024-09-07',
      time: '14:00',
      location: 'Em frente à Embaixada do Brasil',
      description: 'Manifestação pacífica em defesa da democracia no Brasil. Concentração em frente à embaixada.',
      organizer: 'Brasileiros Unidos DC',
      participants: 127
    },
    {
      id: '2',
      title: 'Caminhada pela Liberdade',
      city: 'Lisboa',
      country: 'Portugal',
      flag: '🇵🇹',
      date: '2024-09-07',
      time: '15:00',
      location: 'Praça do Comércio',
      description: 'Caminhada pacífica da comunidade brasileira em Portugal em apoio aos direitos democráticos.',
      organizer: 'Comunidade Brasileira Lisboa',
      participants: 89
    },
    {
      id: '3',
      title: 'Vigília Cívica',
      city: 'Toronto',
      country: 'Canadá',
      flag: '🇨🇦',
      date: '2024-09-07',
      time: '16:00',
      location: 'Nathan Phillips Square',
      description: 'Vigília silenciosa em apoio à constituição brasileira e aos valores democráticos.',
      organizer: 'Brasileiros Toronto',
      participants: 45
    }
  ]

  const countries = Array.from(new Set(embassies.map(e => e.country)))
  const filteredEvents = selectedCountry === 'all' 
    ? events 
    : events.filter(event => event.country === selectedCountry)

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-blue-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🌍 Brasileiros no Exterior
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Manifestações e encontros da comunidade brasileira ao redor do mundo. 
            Brasileiros unidos pela democracia, independente da distância do país.
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 text-center border-2 border-green-200 shadow-lg">
            <div className="text-3xl font-bold text-green-600">4.5M+</div>
            <div className="text-gray-600">Brasileiros no Exterior</div>
          </div>
          <div className="bg-white rounded-lg p-6 text-center border-2 border-blue-200 shadow-lg">
            <div className="text-3xl font-bold text-blue-600">{embassies.length}</div>
            <div className="text-gray-600">Consulados Principais</div>
          </div>
          <div className="bg-white rounded-lg p-6 text-center border-2 border-yellow-200 shadow-lg">
            <div className="text-3xl font-bold text-yellow-600">{events.length}</div>
            <div className="text-gray-600">Eventos Planejados</div>
          </div>
          <div className="bg-white rounded-lg p-6 text-center border-2 border-purple-200 shadow-lg">
            <div className="text-3xl font-bold text-purple-600">
              {events.reduce((sum, event) => sum + event.participants, 0)}
            </div>
            <div className="text-gray-600">Participantes Confirmados</div>
          </div>
        </div>

        {/* Events Section */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg border-2 border-green-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">📅 Próximos Eventos</h2>
                  <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="all">Todos os países</option>
                    {countries.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="p-6">
                {filteredEvents.length > 0 ? (
                  <div className="space-y-6">
                    {filteredEvents.map((event) => (
                      <div key={event.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                            <div className="flex items-center gap-2 text-gray-600 mb-2">
                              <span className="text-lg">{event.flag}</span>
                              <span>{event.city}, {event.country}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-green-600">
                              {event.participants} participantes
                            </div>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <div className="text-sm font-medium text-gray-700">📅 Data e Horário</div>
                            <div className="text-gray-600">
                              {new Date(event.date).toLocaleDateString('pt-BR')} às {event.time}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-700">📍 Local</div>
                            <div className="text-gray-600">{event.location}</div>
                          </div>
                        </div>

                        <p className="text-gray-700 mb-4">{event.description}</p>

                        <div className="flex justify-between items-center">
                          <div className="text-sm text-gray-600">
                            Organizado por: <strong>{event.organizer}</strong>
                          </div>
                          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                            ✋ Confirmar Presença
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <div className="text-4xl mb-4">🔍</div>
                    <p>Nenhum evento encontrado para este país.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Create Event */}
            <div className="bg-green-50 rounded-xl border border-green-200 p-6">
              <h3 className="text-lg font-bold text-green-800 mb-3">📢 Organizar Evento</h3>
              <p className="text-green-700 text-sm mb-4">
                Quer organizar uma manifestação pacífica em sua cidade? 
                Entre em contato conosco!
              </p>
              <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                Solicitar Organização
              </button>
            </div>

            {/* Embassy Contact */}
            <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
              <h3 className="text-lg font-bold text-blue-800 mb-3">🏛️ Contatos Úteis</h3>
              <p className="text-blue-700 text-sm mb-4">
                Informações de consulados e embaixadas brasileiras para emergências.
              </p>
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                Ver Lista Completa
              </button>
            </div>

            {/* Community Groups */}
            <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-6">
              <h3 className="text-lg font-bold text-yellow-800 mb-3">👥 Grupos Comunitários</h3>
              <p className="text-yellow-700 text-sm mb-4">
                Conecte-se com outros brasileiros em sua região através de grupos locais.
              </p>
              <button className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors">
                Encontrar Grupos
              </button>
            </div>
          </div>
        </div>

        {/* Embassy Locations */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-green-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">🏛️ Principais Consulados e Embaixadas</h2>
            <p className="text-gray-600 mt-2">
              Localizações onde a comunidade brasileira costuma se reunir para manifestações.
            </p>
          </div>

          <div className="p-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {embassies.map((embassy, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{embassy.flag}</span>
                    <div>
                      <div className="font-bold text-gray-900">{embassy.city}</div>
                      <div className="text-sm text-gray-600">{embassy.country}</div>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">📍 Endereço:</span>
                      <div className="text-gray-600">{embassy.address}</div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">🕒 Fuso:</span>
                      <span className="text-gray-600 ml-1">{embassy.timezone}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">👥 Comunidade:</span>
                      <span className="text-gray-600 ml-1">{embassy.communitySize}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Important Notice */}
        <div className="mt-8 bg-red-50 rounded-xl border border-red-200 p-6">
          <h3 className="text-lg font-bold text-red-800 mb-3">⚠️ Importante para Manifestações no Exterior</h3>
          <div className="text-red-700 space-y-2">
            <p>• <strong>Leis locais:</strong> Respeite sempre as leis do país onde você está</p>
            <p>• <strong>Autorizações:</strong> Alguns locais podem exigir autorização prévia</p>
            <p>• <strong>Pacifismo:</strong> Mantenha sempre o caráter pacífico das manifestações</p>
            <p>• <strong>Embaixadas:</strong> Notifique o consulado brasileiro sobre eventos grandes</p>
            <p>• <strong>Documentação:</strong> Tenha sempre documentos de identidade em mãos</p>
          </div>
        </div>
      </div>
    </div>
  )
}