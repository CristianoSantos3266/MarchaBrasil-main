'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { globalProtests } from '@/data/globalProtests';
import { getDemoEvents, isDemoMode, addDemoEventRSVP, getThumbnail } from '@/lib/demo-events';
import { ParticipantType, ConvoyJoinLocation } from '@/types';
import RSVPModal from '@/components/protest/RSVPModal';
import ProtestResults from '@/components/results/ProtestResults';
import { getFilteredRSVPCounts } from '@/lib/event-participants';
import { updateUserParticipation, updateChamaDoPovoData, getMilestoneNotification } from '@/lib/gamification';
import { useMilestoneNotification } from '@/components/gamification/MilestoneNotification';
import ChamaDoPovoIndicator from '@/components/gamification/ChamaDoPovoIndicator';
import MutualConnections from '@/components/social/MutualConnections';
import SocialShare from '@/components/social/SocialShare';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarDaysIcon, ClockIcon, MapPinIcon, BuildingOffice2Icon, HandRaisedIcon, SpeakerWaveIcon } from '@heroicons/react/24/outline';
import Footer from '@/components/ui/Footer';

const ConvoyRouteMap = dynamic(() => import('@/components/map/ConvoyRouteMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
      <p className="text-gray-600">Carregando mapa da rota...</p>
    </div>
  )
});

const participantIcons = {
  caminhoneiros: '🚛',
  motociclistas: '🏍️',
  carros: '🚗',
  produtoresRurais: '🌾',
  comerciantes: '🛍️',
  populacaoGeral: '👥'
};

const participantLabels = {
  caminhoneiros: 'Caminhoneiros',
  motociclistas: 'Motociclistas',
  carros: 'Carros',
  produtoresRurais: 'Produtores Rurais',
  comerciantes: 'Comerciantes',
  populacaoGeral: 'População Geral'
};

const protestTypeLabels = {
  marcha: 'Marcha',
  motociata: 'Motociata',
  carreata: 'Carreata',
  caminhoneiros: 'Caminhoneiros',
  assembleia: 'Assembleia',
  manifestacao: 'Manifestação',
  outro: 'Outro'
};

export default function ProtestDetailPage() {
  const params = useParams();
  const protestId = params.id as string;
  
  const [rsvpModal, setRsvpModal] = useState<{ isOpen: boolean; protestId: string; protestTitle: string; isConvoy: boolean }>({
    isOpen: false,
    protestId: '',
    protestTitle: '',
    isConvoy: false
  });
  
  const [refreshCounter, setRefreshCounter] = useState(0);
  const { showNotification, NotificationComponent } = useMilestoneNotification();

  // Find protest in static data or demo events (refresh when refreshCounter changes)
  let protest = globalProtests.find(p => p.id === protestId);
  
  // If not found in static data and in demo mode, check demo events
  if (!protest && isDemoMode()) {
    const demoEvents = getDemoEvents();
    protest = demoEvents.find(p => p.id === protestId);
  }

  if (!protest) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Protesto não encontrado</h1>
          <p className="text-gray-600">O protesto que você está procurando não existe.</p>
        </div>
      </div>
    );
  }

  const filteredRSVPs = getFilteredRSVPCounts(protest.type, protest.rsvps);
  const totalRSVPs = Object.values(filteredRSVPs).reduce((sum, count) => sum + count, 0);

  // Get event thumbnail
  const eventThumbnail = getThumbnail(protestId);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } catch {
      return dateString;
    }
  };

  const handleRSVP = () => {
    setRsvpModal({
      isOpen: true,
      protestId: protest.id,
      protestTitle: protest.title,
      isConvoy: !!protest.convoy
    });
  };

  const handleRSVPSubmit = (participantType: ParticipantType, joinLocation?: ConvoyJoinLocation, verification?: { email?: string; phone?: string }) => {
    // Handle demo events
    if (protestId.startsWith('demo-') && isDemoMode()) {
      const success = addDemoEventRSVP(protestId, participantType, verification);
      
      if (success) {
        // Gamification: Update user participation and check for badges
        const userId = 'demo-user-' + Date.now(); // In real app, get from auth context
        const { newBadges } = updateUserParticipation(userId, 'attend', protest.city, protest.state);
        
        // Update Chama do Povo data
        const previousTotal = Object.values(protest.rsvps || {}).reduce((sum, count) => sum + count, 0);
        const updatedChama = updateChamaDoPovoData(protestId, 'confirm');
        const currentTotal = previousTotal + 1;
        
        // Check for milestone notifications
        const milestoneMessage = getMilestoneNotification(protestId, currentTotal, previousTotal);
        
        // Show gamification notifications
        if (newBadges.length > 0 || milestoneMessage) {
          showNotification(milestoneMessage, newBadges);
        }
        
        const verificationText = verification && (verification.email || verification.phone) ? ' como Patriota Verificado' : ' anonimamente';
        const joinText = joinLocation ? ` (${joinLocation})` : '';
        
        // Create a more user-friendly participant type label
        const participantLabels: Record<string, string> = {
          'caminhoneiro': 'Caminhoneiro',
          'motociclista': 'Motociclista',
          'carro': 'Carro Particular',
          'produtor_rural': 'Produtor Rural',
          'comerciante': 'Comerciante',
          'populacao_geral': 'População Geral'
        };
        
        if (!newBadges.length && !milestoneMessage) {
          alert(`✅ RSVP confirmado${verificationText}!\n\nEvento: ${protest.title}\nParticipando como: ${participantLabels[participantType] || participantType}${joinText}\n\n🎉 Sua presença foi registrada com sucesso!`);
        }
        
        // Force refresh the page data by updating the counter
        setRefreshCounter(prev => prev + 1);
      } else {
        alert('❌ Erro ao confirmar RSVP. Tente novamente.');
      }
    } else {
      // Handle regular events (future implementation)
      const verificationText = verification && (verification.email || verification.phone) ? ' como Patriota Verificado' : ' anonimamente';
      const joinText = joinLocation ? ` (${joinLocation})` : '';
      alert(`✅ RSVP confirmado${verificationText} para "${protest.title}"${joinText}!`);
    }
    setRsvpModal(prev => ({ ...prev, isOpen: false }));
  };

  const handleResultsUpdate = (protestId: string, updates: Record<string, unknown>) => {
    // In a real app, this would update the backend/database
    console.log('Updating protest results:', protestId, updates);
    // For demo purposes, we'll just log the update
    // In production, this would call an API endpoint
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.history.back()}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              ← Voltar
            </button>
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
              {protestTypeLabels[protest.type]}
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main protest info */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8 border-l-4 border-green-500">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <span className="text-4xl">🇧🇷</span>
                {protest.title}
              </h1>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                  {protestTypeLabels[protest.type]}
                </span>
                <span>•</span>
                <span>{protest.city}, {protest.state}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="text-2xl font-bold text-blue-600">{totalRSVPs.toLocaleString('pt-BR')}</div>
                <div className="text-xs text-blue-600 font-medium">Confirmados</div>
              </div>
              
              <div className="flex flex-col gap-3">
                <ChamaDoPovoIndicator 
                  eventId={protestId}
                  size="medium"
                />
                <SocialShare
                  eventId={protestId}
                  eventTitle={protest.title}
                  eventDescription={protest.description}
                  eventDate={formatDate(protest.date)}
                  eventLocation={`${protest.city}, ${protest.state}`}
                  participantCount={totalRSVPs}
                  imageUrl={eventThumbnail}
                />
              </div>
            </div>
          </div>

          {/* Event Image */}
          {eventThumbnail && (
            <div className="mb-6">
              <img
                src={eventThumbnail}
                alt={protest.title}
                className="w-full h-64 md:h-80 object-cover rounded-lg shadow-md"
              />
            </div>
          )}
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CalendarDaysIcon className="h-5 w-5 text-gray-600" />
                Informações do Evento
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CalendarDaysIcon className="h-5 w-5 text-gray-600" />
                  <div>
                    <strong className="text-gray-900">Data:</strong>
                    <span className="text-gray-700 ml-2">{formatDate(protest.date)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <ClockIcon className="h-5 w-5 text-gray-600" />
                  <div>
                    <strong className="text-gray-900">Horário:</strong>
                    <span className="text-gray-700 ml-2">{protest.time}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPinIcon className="h-5 w-5 text-gray-600" />
                  <div>
                    <strong className="text-gray-900">Local:</strong>
                    <span className="text-gray-700 ml-2">{protest.location}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <BuildingOffice2Icon className="h-5 w-5 text-gray-600" />
                  <div>
                    <strong className="text-gray-900">Cidade:</strong>
                    <span className="text-gray-700 ml-2">{protest.city}, {protest.state}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-xl">👥</span>
                Confirmações ({totalRSVPs.toLocaleString('pt-BR')})
              </h3>
              <div className="space-y-3">
                {Object.entries(filteredRSVPs).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between bg-white rounded-lg p-3">
                    <span className="flex items-center gap-3">
                      <span className="text-xl">{participantIcons[type as keyof typeof participantIcons]}</span>
                      <span className="text-gray-900 font-medium">{participantLabels[type as keyof typeof participantLabels]}</span>
                    </span>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold">
                      {count.toLocaleString('pt-BR')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Descrição</h3>
            <div className="prose prose-gray max-w-none">
              {protest.description.split('\n').map((paragraph, index) => {
                if (paragraph.trim() === '') return null;
                
                // Check if it's a title/header (starts with certain words or emojis)
                if (paragraph.includes('🇧🇷') || paragraph.includes('REAJA BRASIL') || paragraph.includes('Brasil')) {
                  return (
                    <h4 key={index} className="text-xl font-bold text-green-700 mb-3 mt-4 flex items-center gap-2">
                      {paragraph.includes('🇧🇷') && <span className="text-2xl">🇧🇷</span>}
                      {paragraph.replace('🇧🇷', '').trim()}
                    </h4>
                  );
                }
                
                // Check if it's a question or important line
                if (paragraph.includes('?') || paragraph.includes('Quando?') || paragraph.includes('Como?')) {
                  return (
                    <p key={index} className="text-lg font-semibold text-blue-800 mb-2 mt-3">
                      {paragraph}
                    </p>
                  );
                }
                
                // Check if it's an event info line
                if (paragraph.includes('Evento Nacional') || paragraph.includes('Simultâneo')) {
                  return (
                    <div key={index} className="bg-green-100 border-l-4 border-green-500 p-4 mb-4 rounded-r-lg">
                      <p className="text-green-800 font-medium flex items-center gap-2">
                        <span className="text-xl">🌟</span>
                        {paragraph}
                      </p>
                    </div>
                  );
                }
                
                return (
                  <p key={index} className="text-gray-700 mb-3 leading-relaxed">
                    {paragraph}
                  </p>
                );
              })}
            </div>
          </div>

          {/* Social Proof Section */}
          <div className="border-t border-gray-200 pt-6">
            <MutualConnections 
              eventId={protestId}
              className="mb-4"
            />
          </div>

          <div className="flex justify-center pt-4 border-t border-gray-200">
            <button
              onClick={handleRSVP}
              className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 font-medium text-lg shadow-md hover:shadow-lg transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <HandRaisedIcon className="h-5 w-5" />
              Confirmar Presença
            </button>
          </div>
        </div>

        {/* Convoy information */}
        {protest.convoy && (
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Informações da Rota</h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Detalhes do Percurso</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Ponto de Partida:</strong> {protest.convoy.startLocation}</p>
                  <p><strong>Horário de Saída:</strong> {protest.convoy.departureTime}</p>
                  <p><strong>Destino:</strong> {protest.convoy.destination}</p>
                  {protest.convoy.description && (
                    <p><strong>Descrição da Rota:</strong> {protest.convoy.description}</p>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Instruções</h3>
                <div className="text-sm text-gray-600 space-y-2">
                  <p>• Chegue com antecedência ao ponto de partida</p>
                  <p>• Mantenha distância segura durante o percurso</p>
                  <p>• Respeite as leis de trânsito</p>
                  <p>• Use proteção adequada (capacetes, cintos)</p>
                  <p>• Mantenha-se pacífico e ordeiro</p>
                </div>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-4">Mapa da Rota</h3>
            <ConvoyRouteMap convoy={protest.convoy} className="w-full h-96" />
          </div>
        )}

        {/* Safety guidelines */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-3">
            ⚠️ Diretrizes de Segurança e Conduta
          </h3>
          <div className="text-sm text-yellow-700 space-y-2">
            <p>• <strong>Manifestação Pacífica:</strong> Mantenha sempre a ordem e o respeito</p>
            <p>• <strong>Segurança:</strong> Use equipamentos de proteção adequados</p>
            <p>• <strong>Leis de Trânsito:</strong> Respeite todas as normas de circulação</p>
            <p>• <strong>Autoridades:</strong> Coopere com as forças da ordem</p>
            <p>• <strong>Meio Ambiente:</strong> Não deixe lixo nem danifique propriedades</p>
            <p>• <strong>Neutralidade:</strong> Evite simbolos ou manifestações partidárias</p>
          </div>
        </div>

        {/* Protest Results - Only shows after protest ends */}
        <ProtestResults 
          protest={protest} 
          onUpdateResults={handleResultsUpdate}
        />
      </div>

      <RSVPModal
        isOpen={rsvpModal.isOpen}
        onClose={() => setRsvpModal(prev => ({ ...prev, isOpen: false }))}
        onSubmit={handleRSVPSubmit}
        protestTitle={rsvpModal.protestTitle}
        protestType={protest.type}
        isConvoy={rsvpModal.isConvoy}
      />

      {/* Milestone Notifications */}
      {NotificationComponent}
      
      <Footer />
    </div>
  );
}