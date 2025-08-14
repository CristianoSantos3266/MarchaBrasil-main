'use client';

interface SupportHeroProps {
  onContribuir: () => void;
  onCompartilhar: () => void;
}

export default function SupportHero({ onContribuir, onCompartilhar }: SupportHeroProps) {
  return (
    <div 
      className="relative min-h-[70vh] flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: 'url(/images/brazilian-flag-hero.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      
      {/* Hero Content */}
      <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
          🇧🇷 Apoie a <span className="text-green-400">Marcha Brasil</span>
        </h1>
        
        <p className="text-xl sm:text-2xl mb-8 text-gray-100 leading-relaxed">
          Junte-se a milhares de brasileiros que acreditam na <strong>coordenação cívica pacífica</strong>. 
          Cada apoio fortalece nossa voz coletiva por um Brasil melhor.
        </p>

        <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-2xl p-6 sm:p-8 mb-8 text-gray-900">
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
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={onContribuir}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-3 min-w-[200px]"
          >
            💚 Contribuir Agora
          </button>
          
          <button
            onClick={onCompartilhar}
            className="bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-900 font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-3 min-w-[200px]"
          >
            📱 Compartilhar
          </button>
        </div>

        <p className="mt-6 text-sm text-gray-200">
          🔒 <strong>100% seguro</strong> • 🇧🇷 <strong>Apoio brasileiro</strong> • 📊 <strong>Transparência total</strong>
        </p>
      </div>

      {/* Animated elements */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full opacity-75">
          <div className="w-1 h-3 bg-white rounded-full mx-auto mt-2 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}