'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navigation from '@/components/ui/Navigation';
import Footer from '@/components/ui/Footer';
import NucleoForumSection from '@/components/community/NucleoForumSection';
import {
  BuildingLibraryIcon,
  UsersIcon,
  MapPinIcon,
  TagIcon,
  CalendarIcon,
  EyeIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

interface CommunityNucleo {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  city: string;
  state: string;
  category: string;
  tags: string[];
  isPrivate: boolean;
  createdAt: string;
  fullDescription?: string;
}

export default function NucleoDetailPage() {
  const params = useParams();
  const nucleoId = params.id as string;
  const [nucleo, setNucleo] = useState<CommunityNucleo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Demo data - in real app, this would come from Supabase
  const demoNucleos: CommunityNucleo[] = [
    {
      id: '1',
      name: 'Núcleo Democrático Paulista',
      description: 'Cidadãos de São Paulo unidos pela defesa da democracia e transparência.',
      fullDescription: 'O Núcleo Democrático Paulista é uma organização de cidadãos paulistas comprometidos com a defesa dos valores democráticos, transparência governamental e participação cívica ativa. Fundado em 2024, nosso núcleo reúne pessoas de diferentes áreas profissionais e sociais que compartilham o interesse comum de fortalecer as instituições democráticas e promover uma sociedade mais justa e transparente.\n\nNossas atividades incluem debates, workshops sobre educação cívica, acompanhamento de políticas públicas locais e organização de manifestações pacíficas. Acreditamos que a democracia se fortalece através da participação ativa dos cidadãos e do diálogo construtivo entre diferentes perspectivas.',
      memberCount: 89,
      city: 'São Paulo',
      state: 'SP',
      category: 'geral',
      tags: ['democracia', 'transparência', 'cidadania'],
      isPrivate: false,
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Caminhoneiros Unidos RJ',
      description: 'Núcleo de caminhoneiros do Rio de Janeiro para defesa da categoria.',
      fullDescription: 'O Caminhoneiros Unidos RJ é uma organização que representa os interesses dos profissionais do transporte rodoviário no estado do Rio de Janeiro. Nosso núcleo trabalha pela defesa dos direitos trabalhistas, melhores condições de trabalho, e políticas públicas que beneficiem a categoria.\n\nParticipamos ativamente de discussões sobre frete, combustível, pedágios e infraestrutura rodoviária. Organizamos também ações de solidariedade entre caminhoneiros e iniciativas de capacitação profissional.',
      memberCount: 156,
      city: 'Rio de Janeiro',
      state: 'RJ',
      category: 'caminhoneiros',
      tags: ['caminhoneiros', 'transporte', 'sindical'],
      isPrivate: false,
      createdAt: '2024-02-01'
    },
    {
      id: '3',
      name: 'Produtores Rurais do Cerrado',
      description: 'Agricultores e pecuaristas do cerrado organizados pela sustentabilidade.',
      fullDescription: 'Nossa organização reúne produtores rurais da região do cerrado comprometidos com práticas sustentáveis de agricultura e pecuária. Trabalhamos pela valorização do agronegócio responsável, preservação ambiental e desenvolvimento econômico sustentável.\n\nPromovemos troca de experiências, capacitação técnica e representação política dos interesses dos produtores rurais junto aos órgãos governamentais.',
      memberCount: 234,
      city: 'Goiânia',
      state: 'GO',
      category: 'produtores',
      tags: ['agricultura', 'sustentabilidade', 'cerrado'],
      isPrivate: true,
      createdAt: '2024-01-20'
    }
  ];

  useEffect(() => {
    // Simulate API call - in real app, fetch from Supabase
    setIsLoading(true);
    setTimeout(() => {
      const foundNucleo = demoNucleos.find(n => n.id === nucleoId);
      setNucleo(foundNucleo || null);
      setIsLoading(false);
    }, 500);
  }, [nucleoId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/3 mb-4"></div>
            <div className="h-64 bg-gray-300 rounded mb-6"></div>
            <div className="h-32 bg-gray-300 rounded"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!nucleo) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <BuildingLibraryIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Núcleo não encontrado</h1>
            <p className="text-gray-600 mb-6">O núcleo que você está procurando não existe ou foi removido.</p>
            <Link
              href="/community"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Voltar à Comunidade
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/community"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Voltar à Comunidade
          </Link>
        </div>

        {/* Nucleo Header */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <BuildingLibraryIcon className="h-8 w-8 text-blue-600" />
                <h1 className="text-3xl font-bold text-gray-900">{nucleo.name}</h1>
                {nucleo.isPrivate && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm flex items-center gap-1">
                    <EyeIcon className="h-4 w-4" />
                    Privado
                  </span>
                )}
              </div>
              
              <p className="text-lg text-gray-600 mb-4">{nucleo.description}</p>
              
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-4">
                <span className="flex items-center gap-1">
                  <UsersIcon className="h-4 w-4" />
                  {nucleo.memberCount} membros
                </span>
                <span className="flex items-center gap-1">
                  <MapPinIcon className="h-4 w-4" />
                  {nucleo.city}, {nucleo.state}
                </span>
                <span className="flex items-center gap-1">
                  <CalendarIcon className="h-4 w-4" />
                  Criado em {new Date(nucleo.createdAt).toLocaleDateString('pt-BR')}
                </span>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {nucleo.tags.map(tag => (
                  <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    <TagIcon className="h-3 w-3" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="ml-8">
              <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                {nucleo.isPrivate ? 'Solicitar Convite' : 'Participar do Núcleo'}
              </button>
            </div>
          </div>
        </div>

        {/* Nucleo Description */}
        {nucleo.fullDescription && (
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Sobre o Núcleo</h2>
            <div className="prose max-w-none text-gray-700">
              {nucleo.fullDescription.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-4 last:mb-0">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Forum Section */}
        <NucleoForumSection nucleoId={nucleo.id} nucleoName={nucleo.name} />
      </div>
      
      <Footer />
    </div>
  );
}