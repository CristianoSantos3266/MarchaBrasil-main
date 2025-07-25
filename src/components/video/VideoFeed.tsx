'use client';

import { useState, useEffect } from 'react';
import { PlayIcon, EyeIcon, HeartIcon, CalendarIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { Video, VideoSearchFilters } from '@/types/video';

interface VideoFeedProps {
  showSearchFilters?: boolean;
  maxVideos?: number;
  protestId?: string; // Show only videos for specific protest
  state?: string; // Filter by state
}

// Demo videos for now
const demoVideos: Video[] = [
  {
    id: 'video-1',
    title: 'Manifestação pela Liberdade - São Paulo',
    description: 'Milhares de brasileiros se reuniram na Avenida Paulista em defesa da democracia e liberdade de expressão.',
    thumbnailUrl: '/images/video-thumbs/sp-manifestacao.jpg',
    videoUrl: 'https://example.com/video1.mp4',
    duration: 180,
    uploadedAt: '2024-01-15T14:30:00Z',
    protestId: 'demo-12345',
    protestTitle: 'Marcha pela Liberdade - São Paulo',
    city: 'São Paulo',
    state: 'SP',
    country: 'BR',
    uploaderName: 'Patriota Anônimo',
    status: 'approved',
    viewCount: 15420,
    likeCount: 1205,
    tags: ['manifestação', 'liberdade', 'democracia', 'são-paulo']
  },
  {
    id: 'video-2',
    title: 'Carreata de Caminhoneiros - Brasília',
    description: 'Caminhoneiros de todo o Brasil se uniram em uma grande carreata rumo à capital federal.',
    thumbnailUrl: '/images/video-thumbs/bsb-carreata.jpg',
    videoUrl: 'https://example.com/video2.mp4',
    duration: 240,
    uploadedAt: '2024-01-14T09:15:00Z',
    protestId: 'demo-54321',
    protestTitle: 'Carreata Nacional dos Caminhoneiros',
    city: 'Brasília',
    state: 'DF',
    country: 'BR',
    status: 'approved',
    viewCount: 28750,
    likeCount: 2340,
    tags: ['caminhoneiros', 'carreata', 'brasília', 'brasil']
  },
  {
    id: 'video-3',
    title: 'Motociata Rio de Janeiro',
    description: 'Centenas de motociclistas percorreram as principais vias do Rio em apoio à democracia.',
    thumbnailUrl: '/images/video-thumbs/rj-motociata.jpg',
    videoUrl: 'https://example.com/video3.mp4',
    duration: 156,
    uploadedAt: '2024-01-13T16:45:00Z',
    city: 'Rio de Janeiro',
    state: 'RJ',
    country: 'BR',
    status: 'approved',
    viewCount: 9830,
    likeCount: 756,
    tags: ['motociata', 'rio-de-janeiro', 'motociclistas', 'democracia']
  },
  {
    id: 'video-4',
    title: 'Manifestação Pacífica - Belo Horizonte',
    description: 'Cidadãos mineiros se reuniram no centro da cidade para defender os valores democráticos.',
    thumbnailUrl: '/images/video-thumbs/bh-manifestacao.jpg',
    videoUrl: 'https://example.com/video4.mp4',
    duration: 210,
    uploadedAt: '2024-01-12T11:20:00Z',
    city: 'Belo Horizonte',
    state: 'MG',
    country: 'BR',
    status: 'approved',
    viewCount: 6420,
    likeCount: 445,
    tags: ['manifestação', 'belo-horizonte', 'minas-gerais', 'pacífica']
  },
  {
    id: 'video-5',
    title: 'Tratorada Nacional - Interior de Goiás',
    description: 'Produtores rurais demonstram força com centenas de tratores em marcha organizada.',
    thumbnailUrl: '/images/video-thumbs/go-tratorada.jpg',
    videoUrl: 'https://example.com/video5.mp4',
    duration: 195,
    uploadedAt: '2024-01-11T07:30:00Z',
    city: 'Goiânia',
    state: 'GO',
    country: 'BR',
    status: 'approved',
    viewCount: 12890,
    likeCount: 987,
    tags: ['tratorada', 'agronegócio', 'goiás', 'produtores-rurais']
  },
  {
    id: 'video-6',
    title: 'Manifestação Estudantil - Porto Alegre',
    description: 'Jovens gaúchos se mobilizam em defesa da educação e da democracia.',
    thumbnailUrl: '/images/video-thumbs/poa-estudantes.jpg',
    videoUrl: 'https://example.com/video6.mp4',
    duration: 142,
    uploadedAt: '2024-01-10T13:45:00Z',
    city: 'Porto Alegre',
    state: 'RS',
    country: 'BR',
    status: 'approved',
    viewCount: 4320,
    likeCount: 312,
    tags: ['estudantes', 'educação', 'porto-alegre', 'juventude']
  }
];

export default function VideoFeed({ showSearchFilters = true, maxVideos, protestId, state }: VideoFeedProps) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [likedVideos, setLikedVideos] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<VideoSearchFilters>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      let filteredVideos = [...demoVideos];
      
      // Apply filters
      if (protestId) {
        filteredVideos = filteredVideos.filter(video => video.protestId === protestId);
      }
      
      if (state) {
        filteredVideos = filteredVideos.filter(video => video.state === state);
      }
      
      if (filters.state) {
        filteredVideos = filteredVideos.filter(video => video.state === filters.state);
      }
      
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        filteredVideos = filteredVideos.filter(video => 
          video.title.toLowerCase().includes(query) ||
          video.description.toLowerCase().includes(query) ||
          video.tags.some(tag => tag.toLowerCase().includes(query))
        );
      }
      
      // Limit results if specified
      if (maxVideos) {
        filteredVideos = filteredVideos.slice(0, maxVideos);
      }
      
      setVideos(filteredVideos);
      setLoading(false);
    }, 500);
  }, [protestId, state, filters, maxVideos]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatViewCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const handleLike = (videoId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedVideos(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(videoId)) {
        newLiked.delete(videoId);
      } else {
        newLiked.add(videoId);
      }
      return newLiked;
    });
  };

  const handleVideoClick = (video: Video) => {
    // In a real app, this would open a video player modal or navigate to video page
    alert(`Reproduzindo: ${video.title}\n\nEm uma implementação real, isto abriria um player de vídeo.`);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: maxVideos || 6 }).map((_, index) => (
          <div key={index} className="bg-gray-200 rounded-lg aspect-video animate-pulse">
            <div className="w-full h-48 bg-gray-300 rounded-t-lg"></div>
            <div className="p-4">
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-12">
        <PlayIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum vídeo encontrado</h3>
        <p className="text-gray-600">
          {protestId 
            ? 'Não há vídeos para este evento ainda.' 
            : 'Seja o primeiro a compartilhar um vídeo da sua manifestação!'
          }
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Search Filters */}
      {showSearchFilters && (
        <div className="mb-6 bg-white rounded-lg shadow-sm border p-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Buscar vídeos
              </label>
              <input
                type="text"
                placeholder="Título, descrição ou tags..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                onChange={(e) => setFilters(prev => ({ ...prev, state: e.target.value || undefined }))}
              >
                <option value="">Todos os estados</option>
                <option value="SP">São Paulo</option>
                <option value="RJ">Rio de Janeiro</option>
                <option value="MG">Minas Gerais</option>
                <option value="DF">Distrito Federal</option>
                <option value="RS">Rio Grande do Sul</option>
                <option value="GO">Goiás</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => setFilters({})}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                Limpar Filtros
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <div
            key={video.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105"
            onClick={() => handleVideoClick(video)}
          >
            {/* Thumbnail */}
            <div className="relative aspect-video bg-gray-900">
              {/* Placeholder thumbnail */}
              <div className="w-full h-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
                <div className="text-center text-white">
                  <PlayIcon className="h-16 w-16 mx-auto mb-2 opacity-80" />
                  <p className="text-sm font-medium">{video.city}, {video.state}</p>
                </div>
              </div>
              
              {/* Duration */}
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                {formatDuration(video.duration)}
              </div>
              
              {/* Live indicator */}
              {video.isLive && (
                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded font-bold animate-pulse">
                  AO VIVO
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 leading-tight">
                {video.title}
              </h3>
              
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {video.description}
              </p>

              {/* Metadata */}
              <div className="space-y-2 text-xs text-gray-500">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <EyeIcon className="h-4 w-4" />
                    <span>{formatViewCount(video.viewCount)} visualizações</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="h-4 w-4" />
                    <span>{new Date(video.uploadedAt).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  <MapPinIcon className="h-4 w-4" />
                  <span>{video.city}, {video.state}</span>
                </div>

                {video.protestTitle && (
                  <div className="text-purple-600 font-medium">
                    📢 {video.protestTitle}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => handleLike(video.id, e)}
                    className={`flex items-center gap-1 text-sm transition-colors ${
                      likedVideos.has(video.id) 
                        ? 'text-red-500 hover:text-red-600' 
                        : 'text-gray-500 hover:text-red-500'
                    }`}
                  >
                    {likedVideos.has(video.id) ? (
                      <HeartSolidIcon className="h-4 w-4" />
                    ) : (
                      <HeartIcon className="h-4 w-4" />
                    )}
                    <span>{video.likeCount + (likedVideos.has(video.id) ? 1 : 0)}</span>
                  </button>
                </div>
                
                <div className="flex gap-1">
                  {video.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      {!maxVideos && videos.length >= 6 && (
        <div className="text-center mt-8">
          <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium">
            Carregar Mais Vídeos
          </button>
        </div>
      )}
    </div>
  );
}