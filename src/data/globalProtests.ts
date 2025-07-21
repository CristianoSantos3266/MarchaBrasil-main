import { Protest } from '@/types';

export const globalProtests: Protest[] = [
  // Brazil
  {
    id: '1',
    title: 'Marcha pela Liberdade de Expressão',
    description: 'Manifestação pacífica em defesa da liberdade de expressão e direitos constitucionais.',
    city: 'São Paulo',
    region: 'SP',
    country: 'BR',
    date: '2024-08-15',
    time: '14:00',
    location: 'Avenida Paulista, 1578 - MASP',
    type: 'marcha',
    coordinates: [-23.5614, -46.6558],
    rsvps: {
      caminhoneiros: 150,
      motociclistas: 300,
      carros: 800,
      tratores: 0,
      produtoresRurais: 200,
      comerciantes: 450,
      populacaoGeral: 2500
    },
    createdAt: '2024-07-20T10:00:00Z',
    updatedAt: '2024-07-20T10:00:00Z'
  },
  {
    id: '2',
    title: 'Carreata dos Caminhoneiros',
    description: 'Carreata pacífica dos caminhoneiros brasileiros em defesa de seus direitos trabalhistas.',
    city: 'Brasília',
    region: 'DF',
    country: 'BR',
    date: '2024-08-20',
    time: '08:00',
    location: 'Esplanada dos Ministérios',
    type: 'carreata',
    coordinates: [-15.7975, -47.8825],
    convoy: {
      startLocation: 'Terminal Rodoviário de Brasília',
      startCoordinates: [-15.7975, -47.8825],
      departureTime: '08:00',
      destination: 'Congresso Nacional',
      destinationCoordinates: [-15.7998, -47.8636],
      description: 'Saída do Terminal Rodoviário seguindo pela Eixão Sul até a Esplanada dos Ministérios'
    },
    rsvps: {
      caminhoneiros: 500,
      motociclistas: 100,
      carros: 200,
      tratores: 0,
      produtoresRurais: 80,
      comerciantes: 150,
      populacaoGeral: 300
    },
    createdAt: '2024-07-21T09:00:00Z',
    updatedAt: '2024-07-21T09:00:00Z'
  },
  {
    id: '3',
    title: 'Motociata da Resistência',
    description: 'Motociata pacífica em apoio à democracia e ao estado de direito.',
    city: 'Rio de Janeiro',
    region: 'RJ',
    country: 'BR',
    date: '2024-08-25',
    time: '15:00',
    location: 'Praia de Copacabana',
    type: 'motociata',
    coordinates: [-22.9068, -43.1729],
    convoy: {
      startLocation: 'Aterro do Flamengo',
      startCoordinates: [-22.9068, -43.1755],
      departureTime: '15:00',
      destination: 'Praia de Copacabana',
      destinationCoordinates: [-22.9068, -43.1729],
      description: 'Percurso pelo Aterro do Flamengo até Copacabana'
    },
    rsvps: {
      caminhoneiros: 50,
      motociclistas: 800,
      carros: 300,
      tratores: 0,
      produtoresRurais: 30,
      comerciantes: 100,
      populacaoGeral: 1200
    },
    createdAt: '2024-07-22T11:00:00Z',
    updatedAt: '2024-07-22T11:00:00Z'
  },

  // Argentina
  {
    id: '4',
    title: 'Marcha por la Libertad',
    description: 'Manifestación pacífica por los derechos civiles y la libertad democrática.',
    city: 'Buenos Aires',
    region: 'C',
    country: 'AR',
    date: '2024-08-18',
    time: '16:00',
    location: 'Plaza de Mayo',
    type: 'marcha',
    coordinates: [-34.6037, -58.3816],
    rsvps: {
      caminhoneiros: 80,
      motociclistas: 200,
      carros: 400,
      tratores: 0,
      produtoresRurais: 150,
      comerciantes: 300,
      populacaoGeral: 1800
    },
    createdAt: '2024-07-23T12:00:00Z',
    updatedAt: '2024-07-23T12:00:00Z'
  },

  // United States
  {
    id: '5',
    title: 'Freedom Rally',
    description: 'Peaceful demonstration for constitutional rights and civil liberties.',
    city: 'Washington',
    region: 'DC',
    country: 'US',
    date: '2024-08-22',
    time: '12:00',
    location: 'National Mall',
    type: 'manifestacao',
    coordinates: [38.897438, -77.026817],
    rsvps: {
      caminhoneiros: 300,
      motociclistas: 500,
      carros: 1200,
      tratores: 0,
      produtoresRurais: 400,
      comerciantes: 800,
      populacaoGeral: 5000
    },
    createdAt: '2024-07-24T14:00:00Z',
    updatedAt: '2024-07-24T14:00:00Z'
  },

  // France
  {
    id: '6',
    title: 'Manifestation pour la Liberté',
    description: 'Manifestation pacifique pour la défense des droits civiques et de la démocratie.',
    city: 'Paris',
    region: 'IDF',
    country: 'FR',
    date: '2024-08-26',
    time: '14:30',
    location: 'Place de la République',
    type: 'manifestacao',
    coordinates: [48.8566, 2.3522],
    rsvps: {
      caminhoneiros: 120,
      motociclistas: 180,
      carros: 600,
      tratores: 0,
      produtoresRurais: 90,
      comerciantes: 400,
      populacaoGeral: 2200
    },
    createdAt: '2024-07-25T15:00:00Z',
    updatedAt: '2024-07-25T15:00:00Z'
  },

  // Canada
  {
    id: '7',
    title: 'Freedom Convoy',
    description: 'Peaceful convoy demonstration for workers\' rights and democratic freedoms.',
    city: 'Ottawa',
    region: 'ON',
    country: 'CA',
    date: '2024-08-28',
    time: '10:00',
    location: 'Parliament Hill',
    type: 'carreata',
    coordinates: [45.4215, -75.6919],
    convoy: {
      startLocation: 'Confederation Park',
      startCoordinates: [45.4215, -75.6919],
      departureTime: '10:00',
      destination: 'Parliament Hill',
      destinationCoordinates: [45.4235, -75.6999],
      description: 'Route through downtown Ottawa to Parliament Hill'
    },
    rsvps: {
      caminhoneiros: 400,
      motociclistas: 150,
      carros: 800,
      tratores: 0,
      produtoresRurais: 200,
      comerciantes: 350,
      populacaoGeral: 1500
    },
    createdAt: '2024-07-26T16:00:00Z',
    updatedAt: '2024-07-26T16:00:00Z'
  },

  // Past protest with results (for demo)
  {
    id: '8',
    title: 'Marcha pela Constituição - Concluída',
    description: 'Manifestação pacífica em defesa dos direitos constitucionais - evento já realizado.',
    city: 'São Paulo',
    region: 'SP',
    country: 'BR',
    date: '2024-07-15',
    time: '14:00',
    location: 'Avenida Paulista - Vão do MASP',
    type: 'marcha',
    coordinates: [-23.5614, -46.6558],
    rsvps: {
      caminhoneiros: 89,
      motociclistas: 234,
      carros: 567,
      tratores: 0,
      produtoresRurais: 123,
      comerciantes: 345,
      populacaoGeral: 1890
    },
    results: {
      estimatedTurnout: {
        rsvpBased: 3248,
        communityReported: 4500,
        confidenceLevel: 'high',
        source: 'Community verifications and photo analysis'
      },
      verifications: {
        iwasthere: 89,
        uniqueVerifications: 89,
        lastVerification: '2024-07-15T18:30:00Z'
      },
      communityImages: [
        {
          id: 'img1',
          originalUrl: '/demo/protest1-original.jpg',
          blurredUrl: '/demo/protest1-blurred.jpg', 
          thumbnailUrl: '/demo/protest1-thumb.jpg',
          uploadedAt: '2024-07-15T16:15:00Z',
          status: 'approved',
          reportedCount: 0,
          upvotes: 23,
          tags: ['faces', 'people', 'signs']
        },
        {
          id: 'img2',
          originalUrl: '/demo/protest2-original.jpg',
          blurredUrl: '/demo/protest2-blurred.jpg',
          thumbnailUrl: '/demo/protest2-thumb.jpg', 
          uploadedAt: '2024-07-15T17:20:00Z',
          status: 'approved',
          reportedCount: 0,
          upvotes: 34,
          tags: ['crowd', 'flags']
        }
      ],
      testimonials: [
        {
          id: 'test1',
          content: 'Foi emocionante ver tantas pessoas unidas pela democracia. A marcha foi pacífica e organizada, mostrando que o povo brasileiro sabe se manifestar com civilidade.',
          participantType: 'populacao_geral',
          location: 'Centro',
          timestamp: '2024-07-15T19:00:00Z',
          status: 'approved',
          upvotes: 12,
          reportedCount: 0
        },
        {
          id: 'test2', 
          content: 'Como caminhoneiro, foi importante estar presente defendendo nossos direitos. A organização foi excelente e todos se comportaram de forma respeitosa.',
          participantType: 'caminhoneiro',
          timestamp: '2024-07-15T20:15:00Z',
          status: 'approved',
          upvotes: 8,
          reportedCount: 0
        }
      ],
      lastUpdated: '2024-07-15T21:00:00Z'
    },
    createdAt: '2024-07-10T10:00:00Z',
    updatedAt: '2024-07-15T21:00:00Z'
  },

  // Tratoradas
  {
    id: '9',
    title: 'Tratorada do Agronegócio - MT',
    description: 'Manifestação dos produtores rurais de Mato Grosso em defesa do agronegócio e contra impostos abusivos sobre fertilizantes.',
    city: 'Cuiabá',
    region: 'MT',
    country: 'BR',
    date: '2024-09-05',
    time: '07:00',
    location: 'Arena Pantanal - Estacionamento',
    type: 'tratorada',
    coordinates: [-15.6014, -56.1277],
    convoy: {
      startLocation: 'Arena Pantanal',
      startCoordinates: [-15.6014, -56.1277],
      departureTime: '07:00',
      destination: 'Centro Geodésico da América do Sul',
      destinationCoordinates: [-15.6014, -56.0975],
      description: 'Percurso pela Avenida Miguel Sutil até o Centro Geodésico, passando pelo centro da cidade'
    },
    rsvps: {
      caminhoneiros: 80,
      motociclistas: 45,
      carros: 120,
      tratores: 150,
      produtoresRurais: 380,
      comerciantes: 90,
      populacaoGeral: 200
    },
    createdAt: '2024-07-27T08:00:00Z',
    updatedAt: '2024-07-27T08:00:00Z'
  },
  {
    id: '10',
    title: 'Tratorada Goiana pela Agricultura',
    description: 'Mobilização dos agricultores de Goiás contra a interferência excessiva do governo federal no agronegócio.',
    city: 'Goiânia',
    region: 'GO',
    country: 'BR',
    date: '2024-09-12',
    time: '06:30',
    location: 'Estádio Serra Dourada',
    type: 'tratorada',
    coordinates: [-16.6869, -49.2167],
    convoy: {
      startLocation: 'Estádio Serra Dourada',
      startCoordinates: [-16.6869, -49.2167],
      departureTime: '06:30',
      destination: 'Palácio das Esmeraldas',
      destinationCoordinates: [-16.6869, -49.2654],
      description: 'Concentração no Serra Dourada seguindo pela Marginal Botafogo até o centro de Goiânia'
    },
    rsvps: {
      caminhoneiros: 65,
      motociclistas: 30,
      carros: 95,
      tratores: 200,
      produtoresRurais: 450,
      comerciantes: 75,
      populacaoGeral: 180
    },
    createdAt: '2024-07-28T09:00:00Z',
    updatedAt: '2024-07-28T09:00:00Z'
  },
  {
    id: '11',
    title: 'Tratorada dos Pampas - RS',
    description: 'Protesto dos produtores rurais gaúchos contra as políticas ambientais restritivas e em defesa da pecuária tradicional.',
    city: 'Porto Alegre',
    region: 'RS',
    country: 'BR',
    date: '2024-09-18',
    time: '08:00',
    location: 'Parque da Redenção',
    type: 'tratorada',
    coordinates: [-30.0346, -51.2065],
    convoy: {
      startLocation: 'Parque da Redenção',
      startCoordinates: [-30.0346, -51.2065],
      departureTime: '08:00',
      destination: 'Palácio Piratini',
      destinationCoordinates: [-30.0277, -51.2287],
      description: 'Concentração na Redenção com deslocamento pela Borges de Medeiros até o centro histórico'
    },
    rsvps: {
      caminhoneiros: 120,
      motociclistas: 60,
      carros: 180,
      tratores: 180,
      produtoresRurais: 520,
      comerciantes: 110,
      populacaoGeral: 250
    },
    createdAt: '2024-07-29T10:00:00Z',
    updatedAt: '2024-07-29T10:00:00Z'
  }
];

export const getProtestsByCountryAndRegion = (countryCode: string, regionCode: string): Protest[] => {
  return globalProtests.filter(protest => 
    protest.country === countryCode && protest.region === regionCode
  );
};

export const getProtestsByCountry = (countryCode: string): Protest[] => {
  return globalProtests.filter(protest => protest.country === countryCode);
};