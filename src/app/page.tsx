'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Protest, ParticipantType, ConvoyJoinLocation } from '@/types';
import { getProtestsByCountryAndRegion } from '@/data/globalProtests';
import { Country, Region, getCountryByCode, getRegionByCode } from '@/data/countries';
import ProtestCard from '@/components/protest/ProtestCard';
import RSVPModal from '@/components/protest/RSVPModal';
import EmailSubscriptionForm from '@/components/email/EmailSubscriptionForm';
import CensorshipAlert from '@/components/ui/CensorshipAlert';
import AntiCensorshipWidget from '@/components/ui/AntiCensorshipWidget';
import TrendingEvents from '@/components/analytics/TrendingEvents';
import PlatformStats from '@/components/analytics/PlatformStats';
import Navigation from '@/components/ui/Navigation';

const GlobalMap = dynamic(() => import('@/components/map/GlobalMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
      <p className="text-gray-600">Carregando mapa...</p>
    </div>
  )
});

export default function Home() {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [protests, setProtests] = useState<Protest[]>([]);
  const [rsvpModal, setRsvpModal] = useState<{ isOpen: boolean; protestId: string; protestTitle: string; isConvoy: boolean }>({
    isOpen: false,
    protestId: '',
    protestTitle: '',
    isConvoy: false
  });

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setSelectedRegion(null);
    setProtests([]);
  };

  const handleRegionSelect = (country: Country, region: Region) => {
    setSelectedCountry(country);
    setSelectedRegion(region);
    const regionProtests = getProtestsByCountryAndRegion(country.code, region.code);
    setProtests(regionProtests);
  };

  const handleRSVP = (protestId: string, _participantType: ParticipantType) => {
    const protest = protests.find(p => p.id === protestId);
    if (protest) {
      setRsvpModal({
        isOpen: true,
        protestId,
        protestTitle: protest.title,
        isConvoy: !!protest.convoy
      });
    }
  };

  const handleRSVPSubmit = (participantType: ParticipantType, joinLocation?: ConvoyJoinLocation) => {
    alert(`RSVP confirmado para o protesto ${rsvpModal.protestId} como ${participantType}${joinLocation ? ` (${joinLocation})` : ''}`);
  };

  const handleViewDetails = (protestId: string) => {
    window.location.href = `/protest/${protestId}`;
  };

  const handleEmailSubscription = async (email: string, selectedStates: string[], selectedTypes: string[]) => {
    console.log('Email subscription:', { email, selectedStates, selectedTypes });
    return Promise.resolve();
  };

  return (
    <>
      <CensorshipAlert />
      <AntiCensorshipWidget />
      <Navigation />
      <main className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-blue-50">
      <header className="bg-gradient-to-r from-green-600 via-yellow-400 to-blue-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white drop-shadow-lg">
              🇧🇷 Mobilização Cívica Brasil
            </h1>
            <p className="mt-2 text-xl text-white/90 drop-shadow">
              Plataforma para manifestações pacíficas e democráticas
            </p>
            <p className="mt-1 text-lg text-white/80">
              "Ordem e Progresso" - Unidos pela Democracia 🇧🇷
            </p>
            <div className="mt-4">
              <a 
                href="/support" 
                className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur text-white border-2 border-white/30 rounded-lg hover:bg-white/30 transition-all text-lg font-bold shadow-lg"
              >
                💝 Support Platform
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Brazilian Imagery */}
      <section className="relative hero-bg-1 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <div className="text-6xl mb-4">🇧🇷</div>
            <h2 className="text-3xl font-bold text-white drop-shadow-lg mb-4">
              O Povo Unido Jamais Será Vencido
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Junte-se a milhares de brasileiros que defendem a democracia, a liberdade e os direitos constitucionais. 
              Manifestações pacíficas são um direito garantido pela Constituição de 1988.
            </p>
          </div>
          
          {/* Stats with Brazilian colors */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur rounded-lg p-6 border border-white/20">
              <div className="text-3xl font-bold text-white">127.3k+</div>
              <div className="text-white/80">Brasileiros Mobilizados</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-6 border border-white/20">
              <div className="text-3xl font-bold text-white">26</div>
              <div className="text-white/80">Estados + DF</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-6 border border-white/20">
              <div className="text-3xl font-bold text-white">847</div>
              <div className="text-white/80">Manifestações Realizadas</div>
            </div>
          </div>
        </div>
        
        {/* Brazilian flag pattern overlay */}
        <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
          <div className="w-full h-full bg-gradient-to-br from-green-500 via-yellow-400 to-blue-500 rounded-full"></div>
        </div>
        <div className="absolute bottom-0 left-0 w-48 h-48 opacity-10">
          <div className="w-full h-full bg-gradient-to-tr from-blue-500 via-yellow-400 to-green-500 rounded-full"></div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section className="mb-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              🗺️ Escolha Seu Estado e Região
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Descubra manifestações pacíficas em sua região. Clique no mapa para ver os eventos em sua cidade.
            </p>
          </div>
          <GlobalMap
            onCountrySelect={handleCountrySelect}
            onRegionSelect={handleRegionSelect}
            selectedCountry={selectedCountry?.code}
            selectedRegion={selectedRegion?.code}
          />
        </section>

        {selectedRegion && (
          <section className="mb-8">
            <div className="bg-gradient-to-r from-green-50 via-yellow-50 to-blue-50 border-2 border-green-200 rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">📍</span>
                <h3 className="text-xl font-bold text-gray-900">
                  {selectedRegion.name}, {selectedCountry?.name}
                </h3>
              </div>
              <p className="text-gray-700 text-lg">
                {protests.length === 0 
                  ? '🔍 Nenhuma manifestação encontrada nesta região. Seja o primeiro a organizar!' 
                  : `🇧🇷 ${protests.length} manifestação(ões) pacífica(s) encontrada(s) em sua região.`
                }
              </p>
              {protests.length > 0 && (
                <div className="mt-4 flex items-center gap-2 text-sm text-green-700">
                  <span className="font-semibold">✊ Participe da democracia!</span>
                  <span>Sua voz importa para o Brasil.</span>
                </div>
              )}
            </div>
          </section>
        )}

        {protests.length > 0 && (
          <section>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                🇧🇷 Manifestações em {selectedRegion?.name}
              </h2>
              <p className="text-lg text-gray-600">
                Manifestações pacíficas organizadas por cidadãos brasileiros em defesa da democracia
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {protests.map((protest) => (
                <ProtestCard
                  key={protest.id}
                  protest={protest}
                  onRSVP={handleRSVP}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          </section>
        )}

        {/* Email subscription section */}
        <section className="mb-8">
          <EmailSubscriptionForm onSubmit={handleEmailSubscription} />
        </section>

        {/* Analytics when no region selected */}
        {!selectedRegion && (
          <>
            <section className="grid lg:grid-cols-2 gap-8 mb-12">
              <TrendingEvents />
              <PlatformStats />
            </section>

            <section className="text-center py-12 bg-gradient-to-r from-green-50 via-yellow-50 to-blue-50 rounded-2xl">
              <div className="max-w-3xl mx-auto px-6">
                <div className="text-4xl mb-4">🇧🇷</div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Como Participar da Democracia Brasileira
                </h2>
                <div className="grid md:grid-cols-2 gap-6 text-left">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">🗺️</span>
                      <div>
                        <p className="font-bold text-gray-900">Escolha sua região</p>
                        <p className="text-gray-600">Clique no mapa para ver manifestações em seu estado</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">✋</span>
                      <div>
                        <p className="font-bold text-gray-900">Confirme presença</p>
                        <p className="text-gray-600">Participe como caminhoneiro, motociclista ou cidadão</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">🚛</span>
                      <div>
                        <p className="font-bold text-gray-900">Coordene comboios</p>
                        <p className="text-gray-600">Organize carreatas e motociatas com rotas seguras</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">📊</span>
                      <div>
                        <p className="font-bold text-gray-900">Acompanhe crescimento</p>
                        <p className="text-gray-600">Veja o número de participantes em tempo real</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-8 p-4 bg-white/60 rounded-lg border border-green-200">
                  <p className="text-sm text-gray-700">
                    <strong>🛡️ Manifestação Pacífica:</strong> Todos os eventos devem seguir os princípios da não-violência e respeito às leis.
                  </p>
                </div>
              </div>
            </section>
          </>
        )}
      </div>

      <footer className="bg-gradient-to-r from-green-800 via-yellow-600 to-blue-800 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-4xl mb-4">🇧🇷</div>
            <h3 className="text-2xl font-bold mb-4">Ordem e Progresso</h3>
            <p className="text-xl text-white/90 mb-6 max-w-3xl mx-auto">
              Plataforma democrática para coordenação de manifestações pacíficas no Brasil
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 text-center mb-8">
              <div>
                <h4 className="font-bold text-lg mb-2">🛡️ Direitos Constitucionais</h4>
                <p className="text-white/80 text-sm">Art. 5º, XVI - Direito de reunião pacífica</p>
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2">🗳️ Democracia</h4>
                <p className="text-white/80 text-sm">Participação cidadã e liberdade de expressão</p>
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2">☮️ Paz</h4>
                <p className="text-white/80 text-sm">Manifestações pacíficas e ordeiras</p>
              </div>
            </div>
            
            <div className="border-t border-white/20 pt-6">
              <p className="text-sm text-white/70">
                "A soberania popular se exerce pelo sufrágio universal e pelo voto direto e secreto, 
                e pelos direitos de petição, plebiscito, referendo e iniciativa popular." - CF/88
              </p>
              <p className="text-xs text-white/60 mt-3">
                Plataforma independente • Apartidarária • Pró-democracia
              </p>
            </div>
          </div>
        </div>
      </footer>

      <RSVPModal
        isOpen={rsvpModal.isOpen}
        onClose={() => setRsvpModal(prev => ({ ...prev, isOpen: false }))}
        onSubmit={handleRSVPSubmit}
        protestTitle={rsvpModal.protestTitle}
        isConvoy={rsvpModal.isConvoy}
      />
    </main>
    </>
  );
}
