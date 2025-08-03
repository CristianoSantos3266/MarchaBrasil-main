import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import Navigation from '@/components/ui/Navigation'
import { getNewsPost, getPublishedNews } from '@/lib/supabase'
import { NewsPost } from '@/types/news'
import { CalendarIcon, EyeIcon, TagIcon, ArrowLeftIcon, ShareIcon } from '@heroicons/react/24/outline'

interface PageProps {
  params: { slug: string }
}

export async function generateStaticParams() {
  const { data: posts } = await getPublishedNews()
  
  if (!posts) return []
  
  return posts.map((post: NewsPost) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { data: post } = await getNewsPost(params.slug)
  
  if (!post) {
    return {
      title: 'Notícia não encontrada - Marcha Brasil'
    }
  }

  return {
    title: `${post.title} - Marcha Brasil`,
    description: post.excerpt || post.content.replace(/[#*`]/g, '').substring(0, 160),
    openGraph: {
      title: post.title,
      description: post.excerpt || post.content.replace(/[#*`]/g, '').substring(0, 160),
      images: post.image_url ? [post.image_url] : undefined,
    },
    themeColor: '#002776',
    viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0'
  }
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function getYouTubeVideoId(url: string): string | null {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  const match = url.match(regex)
  return match ? match[1] : null
}

function ShareButtons({ post }: { post: NewsPost }) {
  const currentUrl = typeof window !== 'undefined' ? window.location.href : ''
  const text = `${post.title} - Marcha Brasil`
  
  const shareUrls = {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${text} ${currentUrl}`)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(text)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(currentUrl)}`
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-gray-700">Compartilhar:</span>
      <div className="flex gap-2">
        <a
          href={shareUrls.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-3 py-2 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition-colors"
        >
          📱 WhatsApp
        </a>
        <a
          href={shareUrls.telegram}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-3 py-2 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600 transition-colors"
        >
          ✈️ Telegram
        </a>
        <a
          href={shareUrls.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-3 py-2 bg-sky-500 text-white text-xs rounded-lg hover:bg-sky-600 transition-colors"
        >
          🐦 Twitter
        </a>
      </div>
    </div>
  )
}

function MarkdownContent({ content }: { content: string }) {
  // Simple markdown parser for basic formatting
  const processMarkdown = (text: string) => {
    return text
      .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold text-gray-900 mb-6 mt-8">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold text-gray-900 mb-4 mt-6">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-xl font-bold text-gray-900 mb-3 mt-4">$1</h3>')
      .replace(/^\- (.*$)/gm, '<li class="mb-1">$1</li>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/\n/g, '<br>')
  }

  // Wrap list items in ul tags
  const processLists = (text: string) => {
    return text.replace(/(<li class="mb-1">.*?<\/li>)/gs, (match) => {
      const listItems = match.match(/<li class="mb-1">.*?<\/li>/g)
      if (listItems) {
        return `<ul class="list-disc list-inside mb-4 space-y-1">${listItems.join('')}</ul>`
      }
      return match
    })
  }

  const processedContent = processLists(processMarkdown(content))

  return (
    <div 
      className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
      dangerouslySetInnerHTML={{ 
        __html: `<p class="mb-4">${processedContent}</p>` 
      }}
    />
  )
}

async function NewsPostPage({ params }: PageProps) {
  const { data: post, error } = await getNewsPost(params.slug)

  if (error || !post) {
    notFound()
  }

  const youtubeVideoId = post.video_url ? getYouTubeVideoId(post.video_url) : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/news"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Voltar para notícias
          </Link>
        </div>

        <article className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Featured Media */}
          {post.image_url || post.video_url ? (
            <div className="relative aspect-video bg-gray-900">
              {post.image_url ? (
                <Image
                  src={post.image_url}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              ) : youtubeVideoId ? (
                <iframe
                  src={`https://www.youtube.com/embed/${youtubeVideoId}`}
                  title={post.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              ) : null}
            </div>
          ) : (
            <div className="relative aspect-video bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center">
              <div className="text-center text-white">
                <TagIcon className="h-20 w-20 mx-auto mb-4 opacity-80" />
                <h2 className="text-2xl font-bold">Marcha Brasil</h2>
                <p className="text-lg opacity-90">Notícias</p>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="p-8">
            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-6 pb-6 border-b">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                <span>{formatDate(post.published_at || post.created_at)}</span>
              </div>
              {post.view_count !== undefined && (
                <div className="flex items-center gap-2">
                  <EyeIcon className="h-4 w-4" />
                  <span>{post.view_count} visualizações</span>
                </div>
              )}
              <div className="text-gray-600">
                Por {post.author_name || 'Redação Marcha Brasil'}
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-medium"
                  >
                    #{tag.replace(/\s/g, '')}
                  </span>
                ))}
              </div>
            )}

            {/* Content */}
            <div className="mb-8">
              <MarkdownContent content={post.content} />
            </div>

            {/* Share Buttons */}
            <div className="pt-8 border-t">
              <ShareButtons post={post} />
            </div>
          </div>
        </article>

        {/* Related/Back to News */}
        <div className="mt-12 text-center">
          <Link
            href="/news"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Ver mais notícias
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NewsPostPage