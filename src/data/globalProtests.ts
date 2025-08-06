import { Protest } from '@/types';

export const globalProtests: Protest[] = [
  // Sample completed events for testing
  {
    id: 'completed-1',
    title: 'Manifestação pela Transparência - São Paulo',
    description: 'Grande mobilização cívica em defesa da transparência nas instituições públicas e combate à corrupção.',
    date: '2024-07-15',
    time: '14:00',
    location: 'Avenida Paulista, 1000',
    city: 'São Paulo',
    state: 'SP',
    country: 'BR',
    type: 'manifestacao',
    organizer: 'Comitê Cívico SP',
    rsvps: {
      populacaoGeral: 1250,
      comerciantes: 340,
      produtoresRurais: 180,
      caminhoneiros: 420,
      motociclistas: 160,
      carros: 280
    }
  },
  {
    id: 'completed-2',
    title: 'Marcha pela Democracia - Rio de Janeiro',
    description: 'Ato cívico em defesa das instituições democráticas na cidade maravilhosa.',
    date: '2024-07-20',
    time: '15:30',
    location: 'Copacabana - Posto 4',
    city: 'Rio de Janeiro',
    state: 'RJ',
    country: 'BR',
    type: 'marcha',
    organizer: 'Movimento Cívico RJ',
    rsvps: {
      populacaoGeral: 890,
      comerciantes: 220,
      produtoresRurais: 120,
      caminhoneiros: 310,
      motociclistas: 95,
      carros: 180
    }
  },
  {
    id: 'completed-3',
    title: 'Protesto Pacífico - Brasília',
    description: 'Concentração cívica na capital federal em defesa dos direitos constitucionais.',
    date: '2024-07-25',
    time: '16:00',
    location: 'Esplanada dos Ministérios',
    city: 'Brasília',
    state: 'DF',
    country: 'BR',
    type: 'manifestacao',
    organizer: 'Coordenação Brasília',
    rsvps: {
      populacaoGeral: 2100,
      comerciantes: 480,
      produtoresRurais: 340,
      caminhoneiros: 650,
      motociclistas: 290,
      carros: 420
    }
  },
  {
    id: 'completed-4',
    title: 'Ato Cívico Internacional - Lisboa',
    description: 'Brasileiros em Portugal demonstram apoio às manifestações democráticas.',
    date: '2024-07-22',
    time: '11:00',
    location: 'Praça do Comércio',
    city: 'Lisboa',
    region: 'Lisboa',
    country: 'PT',
    type: 'manifestacao',
    organizer: 'Brasileiros em Portugal',
    rsvps: {
      populacaoGeral: 450,
      comerciantes: 120,
      produtoresRurais: 80,
      caminhoneiros: 60,
      motociclistas: 40,
      carros: 90
    }
  },
  {
    id: 'completed-5',
    title: 'Carreata pela Transparência - Belo Horizonte',
    description: 'Mobilização em veículos pelas ruas de BH em defesa da transparência pública.',
    date: '2024-07-18',
    time: '13:00',
    location: 'Praça da Liberdade',
    city: 'Belo Horizonte',
    state: 'MG',
    country: 'BR',
    type: 'carreata',
    organizer: 'Movimento MG',
    rsvps: {
      populacaoGeral: 680,
      comerciantes: 180,
      produtoresRurais: 150,
      caminhoneiros: 240,
      motociclistas: 110,
      carros: 320
    }
  },
  // Future events for upcoming section
  {
    id: 'upcoming-1',
    title: 'Manifestação Nacional - São Paulo',
    description: 'Grande manifestação cívica programada para o próximo mês.',
    date: '2024-09-15',
    time: '14:00',
    location: 'Avenida Paulista, 1000',
    city: 'São Paulo',
    state: 'SP',
    country: 'BR',
    type: 'manifestacao',
    organizer: 'Comitê Nacional SP',
    rsvps: {
      populacaoGeral: 320,
      comerciantes: 85,
      produtoresRurais: 45,
      caminhoneiros: 120,
      motociclistas: 60,
      carros: 90
    }
  }
];

// Helper function to get protests by country and region
export function getProtestsByCountryAndRegion(country?: string, region?: string): Protest[] {
  if (!country) return globalProtests;
  
  return globalProtests.filter(protest => {
    if (protest.country !== country) return false;
    if (region && protest.region !== region) return false;
    return true;
  });
}