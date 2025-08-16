'use client';

import { HeartIcon, ShareIcon, ShieldCheckIcon, ChartBarIcon, GlobeAltIcon } from '@heroicons/react/24/solid';

interface SupportHeroProps {
  onContribuir: () => void;
  onCompartilhar: () => void;
}

export default function SupportHero({ onContribuir, onCompartilhar }: SupportHeroProps) {
  return (
    <div className="bg-white py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left side - Content */}
          <div className="text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-gray-900">
              <GlobeAltIcon className="inline h-12 w-12 text-green-600 mr-3" />
              Apoie a <span className="text-green-600">Marcha Brasil</span>
            </h1>
            
            <p className="text-xl sm:text-2xl mb-8 text-gray-700 leading-relaxed">
              Junte-se a milhares de brasileiros que acreditam na <strong>coordenação cívica pacífica</strong>. 
              Cada apoio fortalece nossa voz coletiva por um Brasil melhor.
            </p>

            <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-200">
              <div className="grid sm:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-green-600">20.000</div>
                  <div className="text-sm text-gray-600">Meta de Apoiadores</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-blue-600">15.847</div>
                  <div className="text-sm text-gray-600">Já Participando</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-purple-600">79%</div>
                  <div className="text-sm text-gray-600">Da Meta Alcançada</div>
                </div>
              </div>
            </div>

            {/* Call to Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <button
                onClick={onContribuir}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
              >
                <HeartIcon className="h-6 w-6" />
                Contribuir Agora
              </button>
              
              <button
                onClick={onCompartilhar}
                className="bg-white hover:bg-gray-50 text-gray-900 font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border-2 border-gray-200 flex items-center justify-center gap-3"
              >
                <ShareIcon className="h-6 w-6" />
                Compartilhar
              </button>
            </div>

            <div className="flex justify-center sm:justify-start items-center gap-6 text-sm text-gray-600 flex-wrap">
              <span className="flex items-center gap-2">
                <ShieldCheckIcon className="h-5 w-5 text-green-600" />
                <strong>100% seguro</strong>
              </span>
              <span className="flex items-center gap-2">
                <GlobeAltIcon className="h-5 w-5 text-blue-600" />
                <strong>Apoio brasileiro</strong>
              </span>
              <span className="flex items-center gap-2">
                <ChartBarIcon className="h-5 w-5 text-purple-600" />
                <strong>Transparência total</strong>
              </span>
            </div>
          </div>

          {/* Right side - Image */}
          <div className="lg:order-last">
            <div 
              className="relative rounded-2xl overflow-hidden shadow-2xl h-80 sm:h-96 lg:h-[500px]"
              style={{
                backgroundImage: 'url(/images/brazilian-flag-hero.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              {/* Overlay for better aesthetics */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}