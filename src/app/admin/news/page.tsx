'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import AdminNavigation from '@/components/admin/AdminNavigation'
import { getAllNews, createNewsPost, updateNewsPost, deleteNewsPost } from '@/lib/supabase'
import { NewsPost, CreateNewsPost } from '@/types/news'
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  CalendarIcon,
  TagIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

interface NewsFormData extends CreateNewsPost {
  id?: string
}

export default function AdminNewsPage() {
  const { user, userProfile, loading } = useAuth()
  const router = useRouter()
  const [news, setNews] = useState<NewsPost[]>([])
  const [loadingNews, setLoadingNews] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingPost, setEditingPost] = useState<NewsPost | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  
  const [formData, setFormData] = useState<NewsFormData>({
    title: '',
    content: '',
    excerpt: '',
    image_url: '',
    video_url: '',
    tags: [],
    status: 'draft'
  })

  // Check admin access
  useEffect(() => {
    if (!loading && (!user || !userProfile || (userProfile.role !== 'admin' && userProfile.role !== 'organizer'))) {
      router.push('/')
    }
  }, [user, userProfile, loading, router])

  // Load news
  useEffect(() => {
    loadNews()
  }, [])

  const loadNews = async () => {
    setLoadingNews(true)
    try {
      const { data, error } = await getAllNews(user?.id)
      if (error) {
        console.error('Error loading news:', error)
        setMessage('Erro ao carregar notícias')
      } else {
        setNews(data || [])
      }
    } catch (error) {
      console.error('Error loading news:', error)
      setMessage('Erro ao carregar notícias')
    } finally {
      setLoadingNews(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setSubmitting(true)
    setMessage('')

    try {
      const newsData = {
        ...formData,
        tags: typeof formData.tags === 'string' 
          ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
          : formData.tags || []
      }

      let result
      if (editingPost) {
        result = await updateNewsPost(editingPost.id, newsData)
      } else {
        result = await createNewsPost(newsData, user.id)
      }

      if (result.error) {
        setMessage(result.error.message || 'Erro ao salvar notícia')
      } else {
        setMessage(editingPost ? 'Notícia atualizada com sucesso!' : 'Notícia criada com sucesso!')
        resetForm()
        loadNews()
      }
    } catch (error: any) {
      setMessage(error.message || 'Erro ao salvar notícia')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (post: NewsPost) => {
    setEditingPost(post)
    setFormData({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt || '',
      image_url: post.image_url || '',
      video_url: post.video_url || '',
      tags: post.tags || [],
      status: post.status
    })
    setShowForm(true)
  }

  const handleDelete = async (postId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta notícia?')) return

    try {
      const { error } = await deleteNewsPost(postId)
      if (error) {
        setMessage('Erro ao excluir notícia')
      } else {
        setMessage('Notícia excluída com sucesso!')
        loadNews()
      }
    } catch (error) {
      setMessage('Erro ao excluir notícia')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      image_url: '',
      video_url: '',
      tags: [],
      status: 'draft'
    })
    setEditingPost(null)
    setShowForm(false)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published':
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />
      case 'draft':
        return <ClockIcon className="h-5 w-5 text-yellow-600" />
      case 'archived':
        return <XCircleIcon className="h-5 w-5 text-gray-600" />
      default:
        return <ClockIcon className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published':
        return 'Publicado'
      case 'draft':
        return 'Rascunho'
      case 'archived':
        return 'Arquivado'
      default:
        return 'Desconhecido'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando permissões...</p>
        </div>
      </div>
    )
  }

  if (!user || !userProfile || (userProfile.role !== 'admin' && userProfile.role !== 'organizer')) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gerenciar Notícias</h1>
              <p className="text-gray-600 mt-2">Crie e gerencie notícias do movimento</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Nova Notícia
            </button>
          </div>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes('sucesso') 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message}
          </div>
        )}

        {/* News Form */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingPost ? 'Editar Notícia' : 'Nova Notícia'}
                </h2>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Título da notícia..."
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Resumo
                    </label>
                    <textarea
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      rows={2}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Resumo breve da notícia (opcional)..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL da Imagem
                    </label>
                    <input
                      type="url"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://exemplo.com/imagem.jpg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL do Vídeo (YouTube)
                    </label>
                    <input
                      type="url"
                      value={formData.video_url}
                      onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://youtube.com/watch?v=..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags (separadas por vírgula)
                    </label>
                    <input
                      type="text"
                      value={Array.isArray(formData.tags) ? formData.tags.join(', ') : formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="São Paulo, Manifestação, Democracia..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'published' })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="draft">Rascunho</option>
                      <option value="published">Publicar</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Conteúdo * (Markdown suportado)
                    </label>
                    <textarea
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      required
                      rows={12}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                      placeholder="# Título da notícia

Conteúdo da notícia aqui...

## Subtítulo

- Item de lista
- Outro item

**Texto em negrito** e *texto em itálico*"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Use # para títulos, ## para subtítulos, **negrito**, *itálico*, - para listas
                    </p>
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-6 border-t">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
                  >
                    {submitting ? 'Salvando...' : (editingPost ? 'Atualizar' : 'Criar Notícia')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* News List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Notícias Existentes</h2>
          </div>
          
          {loadingNews ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando notícias...</p>
            </div>
          ) : news.length === 0 ? (
            <div className="p-8 text-center">
              <TagIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">Nenhuma notícia criada ainda.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Notícia
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Visualizações
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {news.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900 line-clamp-1">
                            {post.title}
                          </div>
                          <div className="text-sm text-gray-500 line-clamp-1">
                            {post.excerpt || post.content.replace(/[#*`]/g, '').substring(0, 100) + '...'}
                          </div>
                          {post.tags && post.tags.length > 0 && (
                            <div className="flex gap-1 mt-1">
                              {post.tags.slice(0, 3).map((tag) => (
                                <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(post.status)}
                          <span className="ml-2 text-sm text-gray-900">
                            {getStatusText(post.status)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          {formatDate(post.published_at || post.created_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <EyeIcon className="h-4 w-4 mr-1" />
                          {post.view_count || 0}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          {post.status === 'published' && (
                            <a
                              href={`/news/${post.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-900 p-1"
                              title="Ver notícia"
                            >
                              <EyeIcon className="h-4 w-4" />
                            </a>
                          )}
                          <button
                            onClick={() => handleEdit(post)}
                            className="text-yellow-600 hover:text-yellow-900 p-1"
                            title="Editar"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(post.id)}
                            className="text-red-600 hover:text-red-900 p-1"
                            title="Excluir"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}