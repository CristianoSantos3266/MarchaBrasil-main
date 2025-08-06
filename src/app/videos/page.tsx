'use client';

import { useState } from 'react';
import Navigation from '@/components/ui/Navigation';
import Footer from '@/components/ui/Footer';
import VideoFeed from '@/components/video/VideoFeed';
import { FilmIcon, ArrowRightIcon, PlayIcon, TrophyIcon, EyeIcon, HeartIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function VideosPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'recent' | 'popular'>('recent');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-purple-50 to-blue-50">
      <Navigation />
      
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-white/20 backdrop-blur rounded-full p-4">
                <FilmIcon className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4">
              Vídeos das Manifestações
            </h1>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto mb-6">
              Veja como brasileiros de todo o país estão se mobilizando em defesa da democracia. 
              Compartilhe também seus vídeos e faça parte deste movimento.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/videos/upload"
                className="inline-flex items-center px-6 py-3 bg-white text-purple-600 rounded-lg font-bold hover:bg-purple-50 transition-colors"
              >
                <FilmIcon className="h-5 w-5 mr-2" />
                Enviar Vídeo
              </Link>
              <button className="inline-flex items-center px-6 py-3 bg-purple-500 text-white rounded-lg font-bold hover:bg-purple-400 transition-colors">
                <PlayIcon className="h-5 w-5 mr-2" />
                Assistir Destaques
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">6</div>
            <div className="text-gray-600">Vídeos Aprovados</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">0</div>
            <div className="text-gray-600">Visualizações Totais</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">6</div>
            <div className="text-gray-600">Estados Representados</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">6</div>
            <div className="text-gray-600">Cidades Ativas</div>
          </div>
        </section>

        {/* Featured Video Section */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl overflow-hidden shadow-lg">
            <div className="md:flex">
              <div className="md:w-1/2">
                <div className="aspect-video bg-purple-900 flex items-center justify-center">
                  <div className="text-center text-white">
                    <PlayIcon className="h-20 w-20 mx-auto mb-4 opacity-80" />
                    <p className="text-lg font-medium">Vídeo em Destaque</p>
                    <p className="text-sm opacity-80">Protesto Nacional - Brasília</p>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2 p-8 text-white">
                <div className="inline-block bg-yellow-500 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold mb-4 flex items-center gap-2">
                  <TrophyIcon className="h-4 w-4" />
                  DESTAQUE DA SEMANA
                </div>
                <h2 className="text-2xl font-bold mb-4">
                  Grande Protesto em Brasília Reúne 50 Mil Pessoas
                </h2>
                <p className="text-purple-100 mb-6">
                  Brasileiros de todo o país se reuniram na capital federal para defender a democracia 
                  e os valores constitucionais. Uma demonstração histórica de união nacional.
                </p>
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <div className="flex items-center gap-4 text-purple-200">
                      <span className="flex items-center gap-1">
                        <EyeIcon className="h-4 w-4" />
                        0 visualizações
                      </span>
                      <span className="flex items-center gap-1">
                        <HeartIcon className="h-4 w-4" />
                        0 curtidas
                      </span>
                      <span className="flex items-center gap-1">
                        <CalendarDaysIcon className="h-4 w-4" />
                        Recém adicionado
                      </span>
                    </div>
                  </div>
                  <button className="flex items-center gap-2 bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-purple-50 transition-colors">
                    Assistir
                    <ArrowRightIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Filter Tabs */}
        <section className="mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Todos os Vídeos
              </h2>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('recent')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'recent'
                      ? 'bg-white text-purple-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Mais Recentes
                </button>
                <button
                  onClick={() => setActiveTab('popular')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'popular'
                      ? 'bg-white text-purple-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Mais Populares
                </button>
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'all'
                      ? 'bg-white text-purple-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Todos
                </button>
              </div>
            </div>

            <VideoFeed showSearchFilters={true} />
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center py-12 bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl text-white">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-4">
              Participe do Movimento
            </h2>
            <p className="text-xl text-purple-100 mb-8">
              Sua voz importa! Compartilhe vídeos das manifestações em sua cidade e 
              ajude a documentar este momento histórico da democracia brasileira.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/videos/upload"
                className="inline-flex items-center px-8 py-4 bg-white text-purple-600 rounded-lg font-bold text-lg hover:bg-purple-50 transition-colors"
              >
                <FilmIcon className="h-6 w-6 mr-2" />
                Enviar Seu Vídeo
              </Link>
              <Link
                href="/create-event"
                className="inline-flex items-center px-8 py-4 bg-purple-500 text-white rounded-lg font-bold text-lg hover:bg-purple-400 transition-colors border-2 border-white/20"
              >
                Organizar Protesto
                <ArrowRightIcon className="h-6 w-6 ml-2" />
              </Link>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}