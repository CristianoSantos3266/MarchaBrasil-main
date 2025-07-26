'use client';

import Navigation from '@/components/ui/Navigation';
import Footer from '@/components/ui/Footer';
import Leaderboards, { LeaderboardWidget } from '@/components/social/Leaderboards';
import { TrophyIcon, MapPinIcon, UsersIcon, FireIcon } from '@heroicons/react/24/outline';

export default function RankingsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
      <Navigation />
      
      {/* Header */}
      <header className="bg-gradient-to-r from-yellow-600 to-orange-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-white/20 backdrop-blur rounded-full p-4">
                <TrophyIcon className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4">
              Rankings da Mobilização
            </h1>
            <p className="text-xl text-yellow-100 max-w-3xl mx-auto">
              Descubra as cidades e estados mais engajados na luta pela democracia. 
              Veja onde o movimento cívico está mais forte e inspire-se!
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 text-center">
            <div className="text-3xl text-blue-600 mb-2">🏆</div>
            <div className="text-2xl font-bold text-gray-900">27</div>
            <div className="text-sm text-gray-600">Estados Ativos</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 text-center">
            <div className="text-3xl text-green-600 mb-2">🏙️</div>
            <div className="text-2xl font-bold text-gray-900">142</div>
            <div className="text-sm text-gray-600">Cidades Mobilizadas</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 text-center">
            <div className="text-3xl text-purple-600 mb-2">👥</div>
            <div className="text-2xl font-bold text-gray-900">89.5K</div>
            <div className="text-sm text-gray-600">Patriotas Ativos</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 text-center">
            <div className="text-3xl text-red-600 mb-2">🔥</div>
            <div className="text-2xl font-bold text-gray-900">+23%</div>
            <div className="text-sm text-gray-600">Crescimento (30d)</div>
          </div>
        </div>

        {/* Main Leaderboards */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Rankings */}
          <div className="lg:col-span-2">
            <Leaderboards 
              type="both"
              showTop={15}
              timeframe="30d"
            />
          </div>

          {/* Sidebar Widgets */}
          <div className="space-y-6">
            <LeaderboardWidget showTop={8} />
            
            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-4">
                <FireIcon className="h-5 w-5 text-red-600" />
                <h4 className="font-semibold text-gray-900">Atividade Recente</h4>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                  <span className="text-gray-700">
                    <strong>São Paulo</strong> subiu para #1 em participação
                  </span>
                  <span className="text-gray-400 text-xs ml-auto">2h</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                  <span className="text-gray-700">
                    <strong>Rio de Janeiro</strong> organizou novo evento
                  </span>
                  <span className="text-gray-400 text-xs ml-auto">4h</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></div>
                  <span className="text-gray-700">
                    <strong>Minas Gerais</strong> atingiu 10K participantes
                  </span>
                  <span className="text-gray-400 text-xs ml-auto">6h</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0"></div>
                  <span className="text-gray-700">
                    <strong>Paraná</strong> entrou no top 10
                  </span>
                  <span className="text-gray-400 text-xs ml-auto">8h</span>
                </div>
              </div>
            </div>

            {/* Trending Regions */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="text-lg">📈</div>
                <h4 className="font-semibold text-gray-900">Em Alta</h4>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">Brasília (DF)</span>
                  <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">+45%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">Curitiba (PR)</span>
                  <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">+32%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">Salvador (BA)</span>
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">+28%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">Recife (PE)</span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">+24%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-xl text-white p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Coloque Sua Cidade no Ranking!
          </h2>
          <p className="text-xl text-yellow-100 mb-6 max-w-2xl mx-auto">
            Organize eventos, participe de manifestações e ajude sua região a subir no ranking da mobilização cívica!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/create-event"
              className="inline-flex items-center px-8 py-4 bg-white text-orange-600 rounded-lg font-bold text-lg hover:bg-orange-50 transition-colors"
            >
              <MapPinIcon className="h-6 w-6 mr-2" />
              Criar Evento
            </a>
            <a
              href="/manifestacoes"
              className="inline-flex items-center px-8 py-4 bg-orange-500 text-white rounded-lg font-bold text-lg hover:bg-orange-400 transition-colors border-2 border-white/20"
            >
              <UsersIcon className="h-6 w-6 mr-2" />
              Participar
            </a>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}