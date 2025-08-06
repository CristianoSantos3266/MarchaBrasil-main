import { ProtestType, ParticipantType } from '@/types';

// Map event types to their relevant participant types (using RSVP key names)
export const EVENT_PARTICIPANT_MAPPING: Record<string, string[]> = {
  // Manifestação: Only general population
  'manifestacao': ['populacaoGeral'],
  
  // Marcha: Only general population (walking protest)
  'marcha': ['populacaoGeral'],
  
  // Caminhoneiros: Truckers and general population
  'caminhoneiros': ['caminhoneiros', 'populacaoGeral'],
  
  // Tratorada: Tractors, cars, and general population
  'tratorada': ['tratores', 'carros', 'populacaoGeral'],
  
  // Motociata: Motorcycles, cars, and general population
  'motociata': ['motociclistas', 'carros', 'populacaoGeral'],
  
  // Carreata: Cars and general population
  'carreata': ['carros', 'populacaoGeral'],
  
  // Buzinaço: Only general population (pedestrians with flags and signs)
  'buzinaço': ['populacaoGeral'],
  
  // Assembleia: Only general population (meeting/assembly)
  'assembleia': ['populacaoGeral', 'comerciantes', 'produtoresRurais']
};

// Map RSVP keys to ParticipantType values for modal
export const RSVP_TO_PARTICIPANT_TYPE: Record<string, string> = {
  'caminhoneiros': 'caminhoneiro',
  'motociclistas': 'motociclista',
  'carros': 'carro',
  'tratores': 'trator',
  'produtoresRurais': 'produtor_rural',
  'comerciantes': 'comerciante',
  'populacaoGeral': 'populacao_geral'
};

// Get relevant participant types for an event
export function getRelevantParticipantTypes(eventType: string): string[] {
  return EVENT_PARTICIPANT_MAPPING[eventType] || ['populacaoGeral'];
}

// Check if a participant type is relevant for an event type
export function isParticipantTypeRelevant(eventType: string, participantType: string): boolean {
  const relevantTypes = getRelevantParticipantTypes(eventType);
  return relevantTypes.includes(participantType);
}

// Labels for participant types
export const PARTICIPANT_TYPE_LABELS: Record<string, string> = {
  'caminhoneiros': 'Caminhoneiros',
  'motociclistas': 'Motociclistas', 
  'carros': 'Carros',
  'tratores': 'Tratores',
  'produtoresRurais': 'Produtores Rurais',
  'comerciantes': 'Comerciantes',
  'populacaoGeral': 'População Geral'
};

// Icons for participant types
export const PARTICIPANT_TYPE_ICONS: Record<string, string> = {
  'caminhoneiros': '🚛',
  'motociclistas': '🏍️',
  'carros': '🚗',
  'tratores': '🚜',
  'produtoresRurais': '🌾',
  'comerciantes': '🛍️',
  'populacaoGeral': '👥'
};

// Get filtered RSVP counts for an event type
export function getFilteredRSVPCounts(
  eventType: string, 
  rsvpCounts: Record<string, number>
): Record<string, number> {
  const relevantTypes = getRelevantParticipantTypes(eventType);
  const filtered: Record<string, number> = {};
  
  relevantTypes.forEach(participantType => {
    if (rsvpCounts[participantType] !== undefined) {
      filtered[participantType] = rsvpCounts[participantType];
    }
  });
  
  return filtered;
}