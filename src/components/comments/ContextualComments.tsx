'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { getComments, createComment, flagComment } from '@/lib/supabase'
import { 
  ChatBubbleLeftIcon,
  ExclamationTriangleIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline'

interface Comment {
  id: string
  context_type: 'event' | 'video'
  context_id: string
  user_id: string
  comment_text: string
  is_flagged: boolean
  created_at: string
  users: {
    public_name: string
  }
}

interface ContextualCommentsProps {
  contextType: 'event' | 'video'
  contextId: string
  className?: string
}

export default function ContextualComments({
  contextType,
  contextId,
  className = ''
}: ContextualCommentsProps) {
  const { user } = useAuth()
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newComment, setNewComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showAll, setShowAll] = useState(false)
  const [flaggingComment, setFlaggingComment] = useState<string | null>(null)

  // Load comments
  useEffect(() => {
    loadComments()
  }, [contextType, contextId])

  const loadComments = async () => {
    try {
      const { data, error } = await getComments(contextType, contextId)
      if (error) {
        setError('Erro ao carregar comentários')
      } else {
        setComments(data || [])
      }
    } catch (err) {
      setError('Erro ao carregar comentários')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.id || !newComment.trim() || submitting) return

    const commentText = newComment.trim()
    if (commentText.length > 500) {
      alert('Comentário deve ter no máximo 500 caracteres.')
      return
    }

    setSubmitting(true)
    try {
      const { data, error } = await createComment(contextType, contextId, user.id, commentText)
      
      if (error) {
        alert('Erro ao enviar comentário. Tente novamente.')
        return
      }

      if (data) {
        setComments(prev => [data, ...prev])
        setNewComment('')
      }
    } catch (err) {
      alert('Erro ao enviar comentário. Tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleFlagComment = async (commentId: string) => {
    if (flaggingComment || !user) return

    const confirmed = confirm('Deseja reportar este comentário como inadequado?')
    if (!confirmed) return

    setFlaggingComment(commentId)
    try {
      const { error } = await flagComment(commentId)
      
      if (error) {
        alert('Erro ao reportar comentário. Tente novamente.')
        return
      }

      // Remove comment from display
      setComments(prev => prev.filter(comment => comment.id !== commentId))
      alert('Comentário reportado com sucesso.')
    } catch (err) {
      alert('Erro ao reportar comentário. Tente novamente.')
    } finally {
      setFlaggingComment(null)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 1) return 'agora'
    if (diffMins < 60) return `${diffMins}min`
    if (diffHours < 24) return `${diffHours}h`
    if (diffDays < 7) return `${diffDays}d`
    
    return date.toLocaleDateString('pt-BR', { 
      day: 'numeric', 
      month: 'short' 
    })
  }

  const displayedComments = showAll ? comments : comments.slice(0, 3)

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 border border-gray-200 ${className}`}>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Carregando comentários...</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 border border-gray-200 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <ChatBubbleLeftIcon className="h-5 w-5 text-blue-600" />
        Comentários ({comments.length})
      </h3>

      {/* Comment Form */}
      {user ? (
        <form onSubmit={handleSubmitComment} className="mb-6">
          <div className="mb-3">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Deixe seu comentário sobre este evento..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
              maxLength={500}
              disabled={submitting}
            />
            <div className="flex justify-between items-center mt-2">
              <span className={`text-xs ${newComment.length > 450 ? 'text-red-500' : 'text-gray-500'}`}>
                {newComment.length}/500 caracteres
              </span>
              <button
                type="submit"
                disabled={!newComment.trim() || submitting}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
              >
                {submitting ? 'Enviando...' : 'Enviar comentário'}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-600 text-sm text-center">
            Faça login para deixar um comentário
          </p>
        </div>
      )}

      {/* Comments List */}
      {error ? (
        <div className="text-center py-4">
          <p className="text-red-600">{error}</p>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8">
          <ChatBubbleLeftIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">
            Seja o primeiro a comentar!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedComments.map((comment) => (
            <div key={comment.id} className="border-b border-gray-100 pb-4 last:border-b-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {comment.users.public_name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-gray-900 text-sm">
                      {comment.users.public_name}
                    </span>
                    <span className="text-gray-500 text-xs">
                      {formatDate(comment.created_at)}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed ml-10">
                    {comment.comment_text}
                  </p>
                </div>
                
                {user && user.id !== comment.user_id && (
                  <button
                    onClick={() => handleFlagComment(comment.id)}
                    disabled={flaggingComment === comment.id}
                    className="ml-2 text-gray-400 hover:text-red-500 transition-colors text-xs flex items-center gap-1"
                  >
                    <ExclamationTriangleIcon className="h-3 w-3" />
                    {flaggingComment === comment.id ? 'Reportando...' : 'Reportar'}
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Show More/Less Button */}
          {comments.length > 3 && (
            <div className="text-center pt-4">
              <button
                onClick={() => setShowAll(!showAll)}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1 mx-auto transition-colors"
              >
                {showAll ? (
                  <>
                    <ChevronUpIcon className="h-4 w-4" />
                    Ver menos
                  </>
                ) : (
                  <>
                    <ChevronDownIcon className="h-4 w-4" />
                    Ver todos ({comments.length})
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}