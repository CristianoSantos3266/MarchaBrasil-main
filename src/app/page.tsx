'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { usePlatformStats } from '@/hooks/usePlatformStats';
import { 
  HeartIcon, 
  MapPinIcon, 
  TruckIcon, 
  ChartBarIcon,
  ShieldCheckIcon,
  HandRaisedIcon,
  EnvelopeIcon,
  FilmIcon,
  ArrowRightIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { 
  CheckBadgeIcon 
} from '@heroicons/react/24/solid';
import RegionalImpactMeter from '@/components/gamification/RegionalImpactMeter';
import { LeaderboardWidget } from '@/components/social/Leaderboards';
import { Protest, ParticipantType, ConvoyJoinLocation } from '@/types';
import { getProtestsByCountryAndRegion } from '@/data/globalProtests';
import { getDemoEvents, isDemoMode, addDemoEventRSVP, fixTorontoEvents, forceRegenerateCoordinates } from '@/lib/demo-events';
import { Country, Region, getCountryByCode, getRegionByCode } from '@/data/countries';
import ProtestCard from '@/components/protest/ProtestCard';
import RSVPModal from '@/components/protest/RSVPModal';
import CensorshipAlert from '@/components/ui/CensorshipAlert';
import AntiCensorshipWidget from '@/components/ui/AntiCensorshipWidget';
import TrendingEvents from '@/components/analytics/TrendingEvents';
import PlatformStats from '@/components/analytics/PlatformStats';
import Navigation from '@/components/ui/Navigation';
import UpcomingProtestsFeed from '@/components/protest/UpcomingProtestsFeed';
import CompletedProtestsFeed from '@/components/protest/CompletedProtestsFeed';
import VideoFeed from '@/components/video/VideoFeed';
import { getPublishedNews } from '@/lib/supabase';
import { NewsPost } from '@/types/news';
import { DONATE_URL, APOIAR_URL } from "@/lib/links";
// ...
<Link href={DONATE_URL} className="...">Apoiar Plataforma</Link>

// Temporarily disabled - causing hydration issues
// const SmartMapboxGlobal = dynamic(() => import('@/components/map/SmartMapboxGlobal'), {
//   ssr: false,
//   loading: () => (
//     <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center animate-pulse">
//       <div className="text-center">
//         <div className="w-8 h-8 bg-blue-600 rounded-full mx-auto mb-2 animate-bounce"></div>
//         <p className="text-gray-600">Carregando mapa...</p>
//       </div>
//     </div>
//   )
// });

export default function Home() {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [protests, setProtests] = useState<Protest[]>([]);
  const [latestNews, setLatestNews] = useState<NewsPost[]>([]);
  const platformStats = usePlatformStats();
  const [rsvpModal, setRsvpModal] = useState<{ isOpen: boolean; protestId: string; protestTitle: string; isConvoy: boolean }>({
    isOpen: false,
    protestId: '',
    protestTitle: '',
    isConvoy: false
  });

  // Fix existing demo events on page load
  useEffect(() => {
    if (isDemoMode()) {
      fixTorontoEvents();
      forceRegenerateCoordinates(); // Fix coordinate format issues
    }
  }, []);

  // Load latest news
  useEffect(() => {
    const loadNews = async () => {
      try {
        const { data, error } = await getPublishedNews(3);
        if (!error && data) {
          setLatestNews(data);
        }
      } catch (error) {
        console.error('Error loading news:', error);
      }
    };
    loadNews();
  }, []);

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setSelectedRegion(null);
    setProtests([]);
  };

  const handleRegionSelect = (country: Country, region: Region) => {
    setSelectedCountry(country);
    setSelectedRegion(region);
    
    // Get static protests for the region
    const regionProtests = getProtestsByCountryAndRegion(country.code, region.code);
    
    // In demo mode, also include demo events for the same region
    let allProtests = regionProtests;
    if (isDemoMode()) {
      const demoEvents = getDemoEvents();
      const regionDemoEvents = demoEvents.filter(event => 
        event.country === country.code && event.region === region.code
      );
      allProtests = [...regionProtests, ...regionDemoEvents];
    }
    
    setProtests(allProtests);
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

  const handleRSVPSubmit = (participantType: ParticipantType, joinLocation?: ConvoyJoinLocation, verification?: { email?: string; phone?: string }) => {
    // Handle demo events
    if (rsvpModal.protestId.startsWith('demo-') && isDemoMode()) {
      const success = addDemoEventRSVP(rsvpModal.protestId, participantType, verification);
      
      if (success) {
        const verificationText = verification && (verification.email || verification.phone) ? ' como Patriota Verificado' : ' anonimamente';
        const joinText = joinLocation ? ` (${joinLocation})` : '';
        alert(`✅ RSVP confirmado${verificationText} para "${rsvpModal.protestTitle}" como ${participantType}${joinText}!\n\nSua participação foi registrada com sucesso!`);
        
        // Refresh the protests list to show updated RSVP counts
        if (selectedCountry && selectedRegion) {
          handleRegionSelect(selectedCountry, selectedRegion);
        }
      } else {
        alert('❌ Erro ao confirmar RSVP. Tente novamente.');
      }
    } else {
      // Handle regular events (future implementation)
      const verificationText = verification && (verification.email || verification.phone) ? ' como Patriota Verificado' : ' anonimamente';
      const joinText = joinLocation ? ` (${joinLocation})` : '';
      alert(`✅ RSVP confirmado${verificationText} para "${rsvpModal.protestTitle}" como ${participantType}${joinText}!`);
    }
  };

  const handleViewDetails = (protestId: string) => {
    window.location.href = `/protest/${protestId}`;
  };

  const handleEmailAlert = (protestId: string, protestTitle: string) => {
    const email = prompt('Digite seu email para receber alertas sobre este evento:');
    if (email && email.includes('@')) {
      // In a real app, this would subscribe the user to email alerts
      alert(`✅ Alerta configurado!\n\nVocê receberá notificações por email sobre:\n"${protestTitle}"\n\nEmail: ${email}`);
    } else if (email) {
      alert('Por favor, digite um email válido.');
    }
  };


  return (
    <>
      <CensorshipAlert />
      <AntiCensorshipWidget />
      <Navigation />
      <main className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-blue-50">
      <header className="shadow-lg" style={{backgroundColor: '#002776'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white drop-shadow-lg">
              Marcha Brasil
            </h1>
            <p className="mt-2 text-xl text-white/90 drop-shadow">
              Plataforma para manifestações pacíficas e democráticas
            </p>
            <p className="mt-1 text-lg text-white/80">
              "Ordem e Progresso" - Unidos pela Democracia
            </p>
            <div className="mt-4">
              <Link 
                href={APOIAR_URL} 
                className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur text-white border-2 border-white/30 rounded-lg hover:bg-white/30 transition-all text-lg font-bold shadow-lg"
              >
                <HeartIcon className="h-6 w-6 mr-2" />
                Apoiar Plataforma
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Brazilian Flag Background */}
      <section 
        className="relative py-20 overflow-hidden"
        style={{
          backgroundImage: 'url(/images/brazilian-flag-hero.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: 'brightness(1.2) contrast(1.1) saturate(1.2)'
        }}
      >
        <div className="absolute inset-0 bg-black/55"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white drop-shadow-lg mb-4">
              O Povo Unido Jamais Será Vencido
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow">
              Junte-se a milhares de brasileiros que defendem a democracia, a liberdade e os direitos constitucionais. 
              Protestos pacíficos são um direito garantido pela Constituição de 1988.
            </p>
          </div>
          
          {/* Stats with Brazilian colors */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/15 backdrop-blur rounded-lg p-6 border border-white/30 shadow-lg">
              <div className="text-3xl font-bold text-white drop-shadow">
                {platformStats.confirmedParticipants.toLocaleString('pt-BR')}
              </div>
              <div className="text-white/90 drop-shadow">Brasileiros Mobilizados</div>
            </div>
            <div className="bg-white/15 backdrop-blur rounded-lg p-6 border border-white/30 shadow-lg">
              <div className="text-3xl font-bold text-white drop-shadow">
                {platformStats.activeCities}
              </div>
              <div className="text-white/90 drop-shadow">Cidades Ativas</div>
            </div>
            <div className="bg-white/15 backdrop-blur rounded-lg p-6 border border-white/30 shadow-lg">
              <div className="text-3xl font-bold text-white drop-shadow">
                {platformStats.totalEvents.toLocaleString('pt-BR')}
              </div>
              <div className="text-white/90 drop-shadow">Protestos Registrados</div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Regional Impact Meter */}
        <section className="mb-8">
          <RegionalImpactMeter showTopStates={5} />
        </section>

        {/* National Events Feed */}
        <section className="mb-8">
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg shadow-md p-6 border border-green-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <span className="text-3xl">🇧🇷</span>
                Protestos Nacionais
              </h2>
              <span className="text-sm text-green-700 bg-green-200 px-3 py-1 rounded-full font-medium">
                Brasil
              </span>
            </div>
            <UpcomingProtestsFeed 
              onProtestSelect={handleViewDetails} 
              countryFilter="BR"
              hideTitle={true}
            />
          </div>
        </section>

        {/* International Events Feed */}
        <section className="mb-8">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg shadow-md p-6 border border-blue-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <span className="text-3xl">🌍</span>
                Diáspora Brasileira
              </h2>
              <span className="text-sm text-blue-700 bg-blue-200 px-3 py-1 rounded-full font-medium">
                Internacional
              </span>
            </div>
            <UpcomingProtestsFeed 
              onProtestSelect={handleViewDetails} 
              countryFilter="INTERNATIONAL"
              hideTitle={true}
            />
          </div>
        </section>

        {/* Completed Events Feed */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <CheckCircleIcon className="h-7 w-7 text-green-600" />
                Eventos Encerrados
              </h2>
              <span className="text-sm text-gray-700 bg-gray-200 px-3 py-1 rounded-full font-medium">
                Histórico
              </span>
            </div>
            <CompletedProtestsFeed 
              onProtestSelect={handleViewDetails} 
              countryFilter="ALL"
              hideTitle={true}
            />
          </div>
        </section>

        {/* Interactive Map Section */}
        <section className="mb-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center">
              <MapPinIcon className="h-8 w-8 mr-3 text-green-600" />
              Escolha Seu Estado e Região
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Descubra manifestações pacíficas em sua região. Clique no mapa para ver os eventos em sua cidade.
            </p>
          </div>
{/* Safe dynamic import with error boundary */}
          <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
            <div className="text-center">
              <div className="text-4xl mb-4">🗺️</div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Mapa Interativo</h3>
              <p className="text-gray-500 mb-4">Explore manifestações por região</p>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Visualizar Mapa
              </button>
            </div>
          </div>
        </section>

        {selectedRegion && (
          <section className="mb-8">
            <div className="bg-gradient-to-r from-green-50 via-yellow-50 to-blue-50 border-2 border-green-200 rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <MapPinIcon className="h-6 w-6 text-green-600" />
                <h3 className="text-xl font-bold text-gray-900">
                  {selectedRegion.name}, {selectedCountry?.name}
                </h3>
              </div>
              <p className="text-gray-700 text-lg">
                {protests.length === 0 
                  ? 'Nenhuma manifestação encontrada nesta região. Seja o primeiro a organizar!' 
                  : `${protests.length} manifestação(ões) pacífica(s) encontrada(s) em sua região.`
                }
              </p>
              {protests.length > 0 && (
                <div className="mt-4 flex items-center gap-2 text-sm text-green-700">
                  <span className="font-semibold">Participe da democracia!</span>
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
                Protestos em {selectedRegion?.name}
              </h2>
              <p className="text-lg text-gray-600">
                Protestos pacíficos organizados por cidadãos brasileiros em defesa da democracia
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {protests.map((protest) => (
                <ProtestCard
                  key={protest.id}
                  protest={protest}
                  onRSVP={handleRSVP}
                  onViewDetails={handleViewDetails}
                  onEmailAlert={handleEmailAlert}
                />
              ))}
            </div>
          </section>
        )}

        {/* Search Bar */}
        <section className="mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Buscar Protestos
              </h2>
              <p className="text-gray-600">
                Encontre eventos por título, cidade, estado ou tipo de manifestação
              </p>
            </div>
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Digite sua busca..."
                  className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                />
                <svg
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <div className="flex flex-wrap gap-2 mt-4 justify-center">
                <span className="text-sm text-gray-500">Buscas populares:</span>
                <button className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full hover:bg-blue-200 transition-colors">
                  São Paulo
                </button>
                <button className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full hover:bg-green-200 transition-colors">
                  Manifestação
                </button>
                <button className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full hover:bg-purple-200 transition-colors">
                  Caminhoneiros
                </button>
                <button className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm rounded-full hover:bg-yellow-200 transition-colors">
                  Rio de Janeiro
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Video Feed Section */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg shadow-md p-6 border border-purple-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <FilmIcon className="h-7 w-7 text-purple-600" />
                Vídeos
              </h2>
              <Link 
                href="/videos/upload" 
                className="text-purple-600 hover:text-purple-700 font-medium text-sm flex items-center gap-2 transition-colors"
              >
                Enviar Vídeo
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
            <VideoFeed showSearchFilters={false} maxVideos={6} />
            <div className="mt-4 text-center">
              <Link 
                href="/videos" 
                className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium transition-colors"
              >
                Ver todos os vídeos
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Latest News Section */}
        {latestNews.length > 0 && (
          <section className="mb-8">
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg shadow-md p-6 border border-orange-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <span className="text-3xl">📰</span>
                  Últimas Notícias
                </h2>
                <Link 
                  href="/news" 
                  className="text-orange-600 hover:text-orange-700 font-medium text-sm flex items-center gap-2 transition-colors"
                >
                  Ver todas
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                {latestNews.map((post) => (
                  <article key={post.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    {/* Featured Image/Video */}
                    <div className="relative aspect-video bg-gray-900">
                      {post.image_url ? (
                        <Image
                          src={post.image_url}
                          alt={post.title}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none'
                          }}
                        />
                      ) : post.video_url && post.video_url.includes('youtube.com') ? (
                        <div className="relative w-full h-full">
                          <Image
                            src={`https://i.ytimg.com/vi/${post.video_url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1]}/maxresdefault.jpg`}
                            alt={post.title}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                            <div className="bg-red-600 rounded-full p-2">
                              <FilmIcon className="h-6 w-6 text-white" />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                          <div className="text-center text-white">
                            <EnvelopeIcon className="h-12 w-12 mx-auto mb-2 opacity-80" />
                            <p className="text-sm font-medium">Marcha Brasil</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="p-4">
                      <div className="text-xs text-gray-500 mb-2">
                        {new Date(post.published_at || post.created_at).toLocaleDateString('pt-BR')}
                      </div>
                      <h3 className="font-bold text-gray-900 text-sm mb-2 line-clamp-2 leading-tight">
                        <Link href={`/news/${post.slug}`} className="hover:text-orange-600 transition-colors">
                          {post.title}
                        </Link>
                      </h3>
                      <p className="text-gray-600 text-xs line-clamp-2 mb-3">
                        {post.excerpt || post.content.replace(/[#*`]/g, '').substring(0, 100) + '...'}
                      </p>
                      
                      {/* Tags */}
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex gap-1 mb-2">
                          {post.tags.slice(0, 2).map((tag) => (
                            <span key={tag} className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full">
                              #{tag.replace(/\s/g, '')}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      <Link
                        href={`/news/${post.slug}`}
                        className="inline-flex items-center text-orange-600 hover:text-orange-800 font-medium text-xs transition-colors"
                      >
                        Ler mais →
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

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
                      <MapPinIcon className="h-8 w-8 text-green-600 mt-1" />
                      <div>
                        <p className="font-bold text-gray-900">Escolha sua região</p>
                        <p className="text-gray-600">Clique no mapa para ver manifestações em seu estado</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <HandRaisedIcon className="h-8 w-8 text-blue-600 mt-1" />
                      <div>
                        <p className="font-bold text-gray-900">Confirme presença</p>
                        <p className="text-gray-600">Participe como caminhoneiro, motociclista ou cidadão</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <TruckIcon className="h-8 w-8 text-yellow-600 mt-1" />
                      <div>
                        <p className="font-bold text-gray-900">Coordene comboios</p>
                        <p className="text-gray-600">Organize carreatas e motociatas com rotas seguras</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <ChartBarIcon className="h-8 w-8 text-purple-600 mt-1" />
                      <div>
                        <p className="font-bold text-gray-900">Acompanhe crescimento</p>
                        <p className="text-gray-600">Veja o número de participantes em tempo real</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-8 p-4 bg-white/60 rounded-lg border border-green-200">
                  <p className="text-sm text-gray-700 flex items-center gap-2">
                    <ShieldCheckIcon className="h-5 w-5 text-green-600" />
                    <strong>Manifestação Pacífica:</strong> Todos os eventos devem seguir os princípios da não-violência e respeito às leis.
                  </p>
                </div>
              </div>
            </section>
          </>
        )}
      </div>

      <footer className="text-white py-12 mt-16" style={{backgroundColor: '#009639'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-4xl mb-4">🇧🇷</div>
            <h3 className="text-2xl font-bold mb-4">Ordem e Progresso</h3>
            <p className="text-xl text-white/90 mb-6 max-w-3xl mx-auto">
              Plataforma democrática para coordenação de manifestações pacíficas no Brasil
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 text-center mb-8">
              <div>
                <h4 className="font-bold text-lg mb-2 flex items-center justify-center gap-2">
                  <ShieldCheckIcon className="h-6 w-6" />
                  Direitos Constitucionais
                </h4>
                <p className="text-white/80 text-sm">Art. 5º, XVI - Direito de reunião pacífica</p>
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2 flex items-center justify-center gap-2">
                  <CheckBadgeIcon className="h-6 w-6" />
                  Democracia
                </h4>
                <p className="text-white/80 text-sm">Participação cidadã e liberdade de expressão</p>
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2 flex items-center justify-center gap-2">
                  <HandRaisedIcon className="h-6 w-6" />
                  Paz
                </h4>
                <p className="text-white/80 text-sm">Protestos pacíficos e ordeiros</p>
              </div>
            </div>
            
            {/* Legal Links */}
            <div className="border-t border-white/20 pt-6">
              <div className="flex flex-wrap justify-center gap-6 mb-4">
                <a 
                  href="/termos" 
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  Termos de Uso
                </a>
                <a 
                  href="/politica-privacidade" 
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  Política de Privacidade (LGPD)
                </a>
                <a 
                  href="/privacidade" 
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  Segurança & Anti-Censura
                </a>
              </div>
              
              <p className="text-sm text-white/70 mb-4">
                "A soberania popular se exerce pelo sufrágio universal e pelo voto direto e secreto, 
                e pelos direitos de petição, plebiscito, referendo e iniciativa popular." - CF/88
              </p>
              
              {/* Peace Disclaimer */}
              <div className="bg-white/10 border border-white/20 rounded-lg p-3 mb-4">
                <p className="text-sm text-white font-medium">
                  ✌️ A Marcha Brasil apoia EXCLUSIVAMENTE manifestações pacíficas e democráticas
                </p>
              </div>
              
              <p className="text-xs text-white/60">
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
