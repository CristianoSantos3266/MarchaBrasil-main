'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { globalProtests } from '@/data/globalProtests';
import { getDemoEvents, isDemoMode, addDemoEventRSVP } from '@/lib/demo-events';
import { ParticipantType, ConvoyJoinLocation } from '@/types';
import RSVPModal from '@/components/protest/RSVPModal';
import ProtestResults from '@/components/results/ProtestResults';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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

  const totalRSVPs = Object.values(protest.rsvps).reduce((sum, count) => sum + count, 0);

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
        
        alert(`✅ RSVP confirmado${verificationText}!\n\nEvento: ${protest.title}\nParticipando como: ${participantLabels[participantType] || participantType}${joinText}\n\n🎉 Sua presença foi registrada com sucesso!`);
        
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
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{protest.title}</h1>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Informações do Evento</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Data:</strong> {formatDate(protest.date)}</p>
                <p><strong>Horário:</strong> {protest.time}</p>
                <p><strong>Local:</strong> {protest.location}</p>
                <p><strong>Cidade:</strong> {protest.city}, {protest.state}</p>
                <p><strong>Tipo:</strong> {protestTypeLabels[protest.type]}</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Confirmações ({totalRSVPs.toLocaleString('pt-BR')})
              </h3>
              <div className="space-y-2 text-sm">
                {Object.entries(protest.rsvps).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span>{participantIcons[type as keyof typeof participantIcons]}</span>
                      <span>{participantLabels[type as keyof typeof participantLabels]}</span>
                    </span>
                    <span className="font-medium">{count.toLocaleString('pt-BR')}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Descrição</h3>
            <p className="text-gray-700">{protest.description}</p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleRSVP}
              className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium"
            >
              Confirmar Presença
            </button>
            <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium">
              Compartilhar
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
        isConvoy={rsvpModal.isConvoy}
      />
    </div>
  );
}