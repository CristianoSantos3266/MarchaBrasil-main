import { Protest, ParticipantType } from '@/types';
import { getCountryByCode, getRegionByCode } from '@/data/countries';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ProtestCardProps {
  protest: Protest;
  onRSVP: (protestId: string, participantType: ParticipantType) => void;
  onViewDetails: (protestId: string) => void;
}

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

const protestTypeIcons = {
  marcha: '📍',
  motociata: '🏍️',
  carreata: '🚗',
  caminhoneiros: '🚛',
  assembleia: '🏛️',
  manifestacao: '✊',
  outro: '📢'
};

export default function ProtestCard({ protest, onRSVP, onViewDetails }: ProtestCardProps) {
  const totalRSVPs = Object.values(protest.rsvps).reduce((sum, count) => sum + count, 0);
  const country = getCountryByCode(protest.country);
  const region = getRegionByCode(protest.country, protest.region);
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-gradient-to-br from-white via-green-50/30 to-yellow-50/30 rounded-xl shadow-lg p-6 border-2 border-green-200/50 hover:shadow-xl hover:border-green-300 transition-all duration-300 hover:scale-[1.02]">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{protestTypeIcons[protest.type]}</span>
            <h3 className="text-xl font-bold text-gray-900">{protest.title}</h3>
          </div>
          <p className="text-sm text-gray-600">
            {protestTypeLabels[protest.type]} • {protest.city}, {region?.name}, {country?.name}
          </p>
        </div>
        <span className="bg-gradient-to-r from-green-100 to-yellow-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 border border-green-200">
          <span>{protestTypeIcons[protest.type]}</span>
          {protestTypeLabels[protest.type]}
        </span>
      </div>

      <div className="mb-4">
        <p className="text-gray-700 text-sm mb-2">{protest.description}</p>
        <div className="text-sm text-gray-600">
          <p><strong>Data:</strong> {formatDate(protest.date)} às {protest.time}</p>
          <p><strong>Local:</strong> {protest.location}</p>
        </div>
      </div>

      <div className="mb-4 bg-white/60 rounded-lg p-3 border border-green-100">
        <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
          🇧🇷 Confirmações ({totalRSVPs.toLocaleString('pt-BR')} brasileiros)
        </h4>
        <div className="grid grid-cols-2 gap-3 text-xs">
          {Object.entries(protest.rsvps).map(([type, count]) => (
            <div key={type} className="flex items-center gap-2 bg-white/80 rounded-md px-2 py-1">
              <span>{participantIcons[type as keyof typeof participantIcons]}</span>
              <span className="text-gray-700">
                {participantLabels[type as keyof typeof participantLabels]}: {count.toLocaleString('pt-BR')}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => onViewDetails(protest.id)}
          className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 text-sm font-bold shadow-md hover:shadow-lg transform hover:scale-105"
        >
          📋 Ver Detalhes
        </button>
        <button
          onClick={() => onRSVP(protest.id, 'populacao_geral')}
          className="px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 text-sm font-bold shadow-md hover:shadow-lg transform hover:scale-105"
        >
          ✊ Participar
        </button>
      </div>
    </div>
  );
}