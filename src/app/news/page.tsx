'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Navigation from '@/components/ui/Navigation'
import { getPublishedNews } from '@/lib/supabase'
import { NewsPost } from '@/types/news'
import { CalendarIcon, EyeIcon, TagIcon, PlayIcon } from '@heroicons/react/24/outline'

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

function getYouTubeVideoId(url: string): string | null {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  const match = url.match(regex)
  return match ? match[1] : null
}

export default function NewsPage() {
  const [posts, setPosts] = useState<NewsPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadNews = async () => {
      try {
        const { data, error } = await getPublishedNews()
        if (error) {
          console.error('Error loading news:', error)
          setError('Erro ao carregar notícias')
        } else {
          setPosts(data || [])
        }
      } catch (err) {
        console.error('Error loading news:', err)
        setError('Erro ao carregar notícias')
      } finally {
        setLoading(false)
      }
    }
    loadNews()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando notícias...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            📰 Notícias
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Acompanhe as últimas notícias sobre manifestações pacíficas e movimentos cívicos em todo o Brasil
          </p>
        </div>

        {error ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
              <TagIcon className="h-16 w-16 mx-auto text-red-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Erro ao carregar</h3>
              <p className="text-gray-600">{error}</p>
            </div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
              <TagIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma notícia ainda</h3>
              <p className="text-gray-600">
                As primeiras notícias serão publicadas em breve.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post: NewsPost) => (
              <article key={post.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                {/* Media */}
                <div className="relative aspect-video bg-gray-900">
                  {post.image_url ? (
                    <Image
                      src={post.image_url}
                      alt={post.title}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        // Fallback for missing images
                        (e.target as HTMLImageElement).style.display = 'none'
                      }}
                    />
                  ) : post.video_url && getYouTubeVideoId(post.video_url) ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={`https://i.ytimg.com/vi/${getYouTubeVideoId(post.video_url)}/maxresdefault.jpg`}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                        <div className="bg-red-600 rounded-full p-3">
                          <PlayIcon className="h-8 w-8 text-white" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center">
                      <div className="text-center text-white">
                        <TagIcon className="h-16 w-16 mx-auto mb-2 opacity-80" />
                        <p className="text-sm font-medium">Marcha Brasil</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="h-4 w-4" />
                      <span>{formatDate(post.published_at || post.created_at)}</span>
                    </div>
                    {post.view_count !== undefined && (
                      <div className="flex items-center gap-1">
                        <EyeIcon className="h-4 w-4" />
                        <span>{post.view_count} visualizações</span>
                      </div>
                    )}
                  </div>

                  <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight">
                    <Link href={`/news/${post.slug}`} className="hover:text-blue-600 transition-colors">
                      {post.title}
                    </Link>
                  </h2>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {post.excerpt || post.content.replace(/[#*`]/g, '').substring(0, 150) + '...'}
                  </p>

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium"
                        >
                          #{tag.replace(/\s/g, '')}
                        </span>
                      ))}
                      {post.tags.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{post.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Author */}
                  <div className="text-xs text-gray-500 border-t pt-3">
                    Por {post.author_name || 'Redação Marcha Brasil'}
                  </div>

                  {/* Read More */}
                  <div className="mt-4">
                    <Link
                      href={`/news/${post.slug}`}
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
                    >
                      Ler mais →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}