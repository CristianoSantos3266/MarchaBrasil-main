import { Protest } from '@/types';

export const sampleProtests: Protest[] = [
  {
    id: '1',
    title: 'Marcha pela Liberdade de Expressão',
    description: 'Manifestação pacífica em defesa da liberdade de expressão e direitos constitucionais.',
    city: 'São Paulo',
    state: 'SP',
    date: '2024-08-15',
    time: '14:00',
    location: 'Avenida Paulista, 1578 - MASP',
    type: 'marcha',
    coordinates: [-46.6558, -23.5614],
    rsvps: {
      caminhoneiros: 150,
      motociclistas: 300,
      carros: 800,
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
    state: 'DF',
    date: '2024-08-20',
    time: '08:00',
    location: 'Esplanada dos Ministérios',
    type: 'carreata',
    coordinates: [-47.8825, -15.7975],
    convoy: {
      startLocation: 'Terminal Rodoviário de Brasília',
      startCoordinates: [-47.8825, -15.7975],
      departureTime: '08:00',
      destination: 'Congresso Nacional',
      destinationCoordinates: [-47.8636, -15.7998],
      description: 'Saída do Terminal Rodoviário seguindo pela Eixão Sul até a Esplanada dos Ministérios'
    },
    rsvps: {
      caminhoneiros: 500,
      motociclistas: 100,
      carros: 200,
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
    state: 'RJ',
    date: '2024-08-25',
    time: '15:00',
    location: 'Praia de Copacabana',
    type: 'motociata',
    coordinates: [-43.1729, -22.9068],
    convoy: {
      startLocation: 'Aterro do Flamengo',
      startCoordinates: [-43.1755, -22.9068],
      departureTime: '15:00',
      destination: 'Praia de Copacabana',
      destinationCoordinates: [-43.1729, -22.9068],
      description: 'Percurso pelo Aterro do Flamengo até Copacabana'
    },
    rsvps: {
      caminhoneiros: 50,
      motociclistas: 800,
      carros: 300,
      produtoresRurais: 30,
      comerciantes: 100,
      populacaoGeral: 1200
    },
    createdAt: '2024-07-22T11:00:00Z',
    updatedAt: '2024-07-22T11:00:00Z'
  }
];

export const getProtestsByState = (stateCode: string): Protest[] => {
  return sampleProtests.filter(protest => protest.state === stateCode);
};