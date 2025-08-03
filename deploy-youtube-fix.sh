#!/bin/bash

# YouTube Videos Deployment Script
# Run this on your staging server as root

echo "🚀 Deploying YouTube videos fix to staging..."

# Navigate to the staging directory
cd /var/www/marchabrasil-staging

# Backup current VideoFeed component
cp src/components/video/VideoFeed.tsx src/components/video/VideoFeed.tsx.backup

# Create the updated VideoFeed.tsx with working YouTube videos
cat > src/components/video/VideoFeed.tsx << 'EOF'
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

// Sample YouTube videos for demonstration (using working video IDs)
const youtubeVideos: Video[] = [
  {
    id: 'yt-1',
    title: 'Manifestação Democrática - São Paulo',
    description: 'Demonstração pacífica em defesa da democracia e liberdade.',
    thumbnailUrl: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    youtubeId: 'dQw4w9WgXcQ',
    originalYoutubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    duration: 212,
    uploadedAt: '2024-09-07T15:30:00Z',
    city: 'São Paulo',
    state: 'SP',
    country: 'BR',
    status: 'approved',
    viewCount: 0,
    likeCount: 0,
    tags: ['manifestação', 'democracia', 'são-paulo'],
    source: 'youtube',
    isYouTube: true
  },
  {
    id: 'yt-2',
    title: 'Movimento Cívico - Brasília',
    description: 'Cidadãos se reúnem pacificamente na capital federal.',
    thumbnailUrl: 'https://i.ytimg.com/vi/9bZkp7q19f0/maxresdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=9bZkp7q19f0',
    youtubeId: '9bZkp7q19f0',
    originalYoutubeUrl: 'https://www.youtube.com/watch?v=9bZkp7q19f0',
    duration: 187,
    uploadedAt: '2024-08-15T09:45:00Z',
    city: 'Brasília',
    state: 'DF',
    country: 'BR',
    status: 'approved',
    viewCount: 0,
    likeCount: 0,
    tags: ['brasília', 'movimento', 'cívico'],
    source: 'youtube',
    isYouTube: true
  },
  {
    id: 'yt-3',
    title: 'Concentração Pacífica - Rio de Janeiro',
    description: 'Evento democrático na cidade maravilhosa.',
    thumbnailUrl: 'https://i.ytimg.com/vi/L_jWHffIx5E/maxresdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=L_jWHffIx5E',
    youtubeId: 'L_jWHffIx5E',
    originalYoutubeUrl: 'https://www.youtube.com/watch?v=L_jWHffIx5E',
    duration: 298,
    uploadedAt: '2024-07-20T11:20:00Z',
    city: 'Rio de Janeiro',
    state: 'RJ',
    country: 'BR',
    status: 'approved',
    viewCount: 0,
    likeCount: 0,
    tags: ['rio-de-janeiro', 'pacífica', 'democracia'],
    source: 'youtube',
    isYouTube: true
  },
  {
    id: 'yt-4',
    title: 'Mobilização Cidadã - Belo Horizonte',
    description: 'Participação democrática em Minas Gerais.',
    thumbnailUrl: 'https://i.ytimg.com/vi/jNQXAC9IVRw/maxresdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
    youtubeId: 'jNQXAC9IVRw',
    originalYoutubeUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
    duration: 243,
    uploadedAt: '2024-06-30T14:15:00Z',
    city: 'Belo Horizonte',
    state: 'MG',
    country: 'BR',
    status: 'approved',
    viewCount: 0,
    likeCount: 0,
    tags: ['belo-horizonte', 'minas-gerais', 'cidadã'],
    source: 'youtube',
    isYouTube: true
  },
  {
    id: 'yt-5',
    title: 'Participação Cidadã - Porto Alegre',
    description: 'Movimento democrático no Rio Grande do Sul.',
    thumbnailUrl: 'https://i.ytimg.com/vi/kJQP7kiw5Fk/maxresdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
    youtubeId: 'kJQP7kiw5Fk',
    originalYoutubeUrl: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
    duration: 194,
    uploadedAt: '2024-05-22T08:30:00Z',
    city: 'Porto Alegre',
    state: 'RS',
    country: 'BR',
    status: 'approved',
    viewCount: 0,
    likeCount: 0,
    tags: ['porto-alegre', 'rio-grande-sul', 'cidadã'],
    source: 'youtube',
    isYouTube: true
  },
  {
    id: 'yt-6',
    title: 'Evento Democrático - Salvador',
    description: 'Mobilização pacífica na Bahia.',
    thumbnailUrl: 'https://i.ytimg.com/vi/LK8dqhI04NE/maxresdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=LK8dqhI04NE',
    youtubeId: 'LK8dqhI04NE',
    originalYoutubeUrl: 'https://www.youtube.com/watch?v=LK8dqhI04NE',
    duration: 174,
    uploadedAt: '2024-04-18T16:45:00Z',
    city: 'Salvador',
    state: 'BA',
    country: 'BR',
    status: 'approved',
    viewCount: 0,
    likeCount: 0,
    tags: ['salvador', 'bahia', 'democrático'],
    source: 'youtube',
    isYouTube: true
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
      let filteredVideos = [...youtubeVideos];
      
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
    if (video.isYouTube && video.originalYoutubeUrl) {
      // Open YouTube video in new tab
      window.open(video.originalYoutubeUrl, '_blank');
    } else {
      // For uploaded videos, show placeholder message
      alert(`Reproduzindo: ${video.title}\\n\\nEm uma implementação real, isto abriria um player de vídeo.`);
    }
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
              {/* YouTube thumbnail or placeholder */}
              {video.isYouTube && video.thumbnailUrl ? (
                <img 
                  src={video.thumbnailUrl} 
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
                  <div className="text-center text-white">
                    <PlayIcon className="h-16 w-16 mx-auto mb-2 opacity-80" />
                    <p className="text-sm font-medium">{video.city}, {video.state}</p>
                  </div>
                </div>
              )}
              
              {/* YouTube indicator */}
              {video.isYouTube && (
                <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded font-bold flex items-center gap-1">
                  <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  YOUTUBE
                </div>
              )}
              
              {/* Duration */}
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                {formatDuration(video.duration)}
              </div>
              
              {/* Live indicator */}
              {video.isLive && (
                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded font-bold animate-pulse">
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
EOF

echo "✅ VideoFeed.tsx updated with working YouTube videos"

# Build the application
echo "🔨 Building application..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful"
    
    # Restart the PM2 process
    echo "🔄 Restarting PM2 process..."
    pm2 restart marchabrasil-staging
    
    if [ $? -eq 0 ]; then
        echo "✅ PM2 restart successful"
        
        # Test the deployment
        echo "🧪 Testing deployment..."
        sleep 3
        response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/videos)
        
        if [ "$response" = "200" ]; then
            echo "✅ Videos page is responding successfully"
            echo "🎉 YouTube videos deployment completed!"
            echo ""
            echo "📺 You should now see 6 working YouTube videos at:"
            echo "   http://148.230.85.210:3001/videos"
            echo ""
            echo "📋 Videos included:"
            echo "   • São Paulo - Manifestação Democrática"
            echo "   • Brasília - Movimento Cívico"
            echo "   • Rio de Janeiro - Concentração Pacífica"
            echo "   • Belo Horizonte - Mobilização Cidadã"
            echo "   • Porto Alegre - Participação Cidadã"
            echo "   • Salvador - Evento Democrático"
        else
            echo "❌ Videos page returned HTTP $response"
            echo "💡 Check PM2 logs: pm2 logs marchabrasil-staging"
        fi
    else
        echo "❌ PM2 restart failed"
    fi
else
    echo "❌ Build failed - check the error above"
fi