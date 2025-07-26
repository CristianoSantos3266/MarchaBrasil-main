'use client';

import { useState } from 'react';
import Navigation from '@/components/ui/Navigation';
import Footer from '@/components/ui/Footer';
import UpcomingProtestsFeed from '@/components/protest/UpcomingProtestsFeed';
import { CalendarIcon, MapPinIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

export default function ManifestationsPage() {
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'BR' | 'INTERNATIONAL'>('BR');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50">
      <Navigation />
      
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-green-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-white/20 backdrop-blur rounded-full p-4">
                <CalendarIcon className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4">
              Manifestações Pacíficas
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Encontre e participe de manifestações cívicas organizadas em todo o Brasil e ao redor do mundo. 
              Fortaleça a democracia através da participação pacífica e organizada.
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Tabs */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <MapPinIcon className="h-6 w-6 text-green-600" />
                Todas as Manifestações
              </h2>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveFilter('BR')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                    activeFilter === 'BR'
                      ? 'bg-white text-green-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span className="text-lg">🇧🇷</span>
                  Brasil
                </button>
                <button
                  onClick={() => setActiveFilter('INTERNATIONAL')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                    activeFilter === 'INTERNATIONAL'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <GlobeAltIcon className="h-4 w-4" />
                  Internacional
                </button>
                <button
                  onClick={() => setActiveFilter('ALL')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeFilter === 'ALL'
                      ? 'bg-white text-purple-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Todas
                </button>
              </div>
            </div>

            {/* Info Cards */}
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🇧🇷</span>
                  <h3 className="font-bold text-green-800">Brasil</h3>
                </div>
                <p className="text-sm text-green-700">
                  Manifestações nacionais organizadas em todas as capitais e principais cidades do país.
                </p>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <GlobeAltIcon className="h-6 w-6 text-blue-600" />
                  <h3 className="font-bold text-blue-800">Internacional</h3>
                </div>
                <p className="text-sm text-blue-700">
                  Apoio internacional de brasileiros e simpatizantes em outros países.
                </p>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <CalendarIcon className="h-6 w-6 text-purple-600" />
                  <h3 className="font-bold text-purple-800">Programação</h3>
                </div>
                <p className="text-sm text-purple-700">
                  Eventos coordenados com horários sincronizados para máximo impacto.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Manifestations Feed */}
        <UpcomingProtestsFeed 
          countryFilter={activeFilter}
          hideTitle={true}
          onProtestSelect={(protestId) => {
            window.location.href = `/protest/${protestId}`;
          }}
        />

        {/* Call to Action */}
        <div className="mt-12 bg-gradient-to-r from-green-600 to-blue-600 rounded-xl text-white p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Organize uma Manifestação
          </h2>
          <p className="text-xl text-green-100 mb-6 max-w-2xl mx-auto">
            Não encontrou uma manifestação em sua cidade? Seja o primeiro a organizar um evento cívico em sua região!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/create-event"
              className="inline-flex items-center px-8 py-4 bg-white text-green-600 rounded-lg font-bold text-lg hover:bg-green-50 transition-colors"
            >
              <MapPinIcon className="h-6 w-6 mr-2" />
              Criar Manifestação
            </a>
            <a
              href="/como-agir"
              className="inline-flex items-center px-8 py-4 bg-green-500 text-white rounded-lg font-bold text-lg hover:bg-green-400 transition-colors border-2 border-white/20"
            >
              Como Participar
            </a>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}