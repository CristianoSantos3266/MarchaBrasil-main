'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { PlayIcon, EyeIcon, HeartIcon, CalendarIcon, MapPinIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { Video } from '@/types/video';
import ContextualComments from '@/components/comments/ContextualComments';
import Footer from '@/components/ui/Footer';
import Link from 'next/link';

// Demo videos (in real app, this would come from API/database)
const demoVideos: Video[] = [
  {
    id: 'yt-1',
    title: 'Manifestantes protestam contra Lula e STF em SP e BH',
    description: 'Milhares de brasileiros se reuniram em São Paulo e Belo Horizonte para protestar contra decisões recentes do STF e políticas do governo federal. A manifestação foi pacífica e contou com a participação de famílias, comerciantes, produtores rurais e cidadãos de diversas classes sociais unidos pela defesa da democracia e transparência institucional.',
    thumbnailUrl: 'https://i.ytimg.com/vi/GHB0ITXp--c/maxresdefault.jpg',
    videoUrl: 'https://www.youtube.com/embed/GHB0ITXp--c',
    youtubeId: 'GHB0ITXp--c',
    originalYoutubeUrl: 'https://www.youtube.com/watch?v=GHB0ITXp--c',
    duration: 420,
    uploadedAt: '2024-07-14T12:00:00Z',
    city: 'São Paulo',
    state: 'SP',
    country: 'BR',
    status: 'approved',
    viewCount: 12500,
    likeCount: 890,
    tags: ['protesto', 'SP', 'BH', 'STF', 'democracia'],
    source: 'youtube',
    isYouTube: true
  },
  {
    id: 'yt-2',
    title: 'Manifestação pela Democracia - Brasília 2024',
    description: 'Ato cívico histórico em defesa das instituições democráticas na capital federal. Milhares de cidadãos se reuniram no centro de Brasília para demonstrar apoio à Constituição e aos valores democráticos brasileiros.',
    thumbnailUrl: 'https://i.ytimg.com/vi/GHB0ITXp--c/maxresdefault.jpg',
    videoUrl: 'https://www.youtube.com/embed/GHB0ITXp--c',
    youtubeId: 'GHB0ITXp--c',
    originalYoutubeUrl: 'https://www.youtube.com/watch?v=GHB0ITXp--c',
    duration: 212,
    uploadedAt: '2024-09-07T15:30:00Z',
    city: 'Brasília',
    state: 'DF',
    country: 'BR',
    status: 'approved',
    viewCount: 8750,
    likeCount: 620,
    tags: ['manifestação', 'democracia', 'brasília', 'constituição'],
    source: 'youtube',
    isYouTube: true
  }
];

export default function VideoDetailPage() {
  const params = useParams();
  const videoId = params.id as string;
  
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  
  useEffect(() => {
    // Simulate loading video data
    setTimeout(() => {
      const foundVideo = demoVideos.find(v => v.id === videoId);
      setVideo(foundVideo || null);
      setLoading(false);
    }, 500);
  }, [videoId]);

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleLike = () => {
    setLiked(!liked);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="aspect-video bg-gray-300 rounded-lg mb-6"></div>
            <div className="h-8 bg-gray-300 rounded mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Vídeo não encontrado</h1>
          <p className="text-gray-600 mb-6">O vídeo que você está procurando não existe.</p>
          <Link
            href="/videos"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Voltar aos vídeos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/videos"
              className="text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center gap-2"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Voltar aos vídeos
            </Link>
            <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
              Vídeo da Manifestação
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Video Player */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="aspect-video bg-gray-900">
            {video.isYouTube && video.youtubeId ? (
              <iframe
                src={`https://www.youtube.com/embed/${video.youtubeId}`}
                title={video.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center text-white">
                  <PlayIcon className="h-16 w-16 mx-auto mb-4 opacity-80" />
                  <p className="text-lg font-medium">Player de vídeo</p>
                  <p className="text-sm opacity-80">Em desenvolvimento</p>
                </div>
              </div>
            )}
          </div>

          {/* Video Info */}
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {video.title}
            </h1>

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <EyeIcon className="h-4 w-4" />
                  <span>{formatViewCount(video.viewCount)} visualizações</span>
                </div>
                <div className="flex items-center gap-1">
                  <CalendarIcon className="h-4 w-4" />
                  <span>{formatDate(video.uploadedAt)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPinIcon className="h-4 w-4" />
                  <span>{video.city}, {video.state}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    liked 
                      ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {liked ? (
                    <HeartSolidIcon className="h-5 w-5" />
                  ) : (
                    <HeartIcon className="h-5 w-5" />
                  )}
                  <span className="font-medium">
                    {video.likeCount + (liked ? 1 : 0)}
                  </span>
                </button>

                {video.isYouTube && (
                  <a
                    href={video.originalYoutubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center gap-2"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                    Ver no YouTube
                  </a>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Descrição</h3>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {video.description}
                </p>
              </div>
            </div>

            {/* Tags */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {video.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Duration and additional info */}
            <div className="text-sm text-gray-600 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span>Duração: {formatDuration(video.duration)}</span>
                <span>Fonte: YouTube</span>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <ContextualComments 
          contextType="video"
          contextId={videoId}
        />
      </div>

      <Footer />
    </div>
  );
}