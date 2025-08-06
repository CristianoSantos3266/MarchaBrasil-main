'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ChatBubbleLeftRightIcon, UserCircleIcon, LockClosedIcon } from '@heroicons/react/24/outline';

interface ForumMessage {
  id: string;
  content: string;
  author: string;
  timestamp: Date;
  userId: string;
}

interface NucleoForumSectionProps {
  nucleoId: string;
  nucleoName: string;
}

export default function NucleoForumSection({ nucleoId, nucleoName }: NucleoForumSectionProps) {
  const { user, userProfile } = useAuth();
  const [messages, setMessages] = useState<ForumMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !user || !userProfile) return;
    
    setIsSubmitting(true);
    
    // Create new message object
    const message: ForumMessage = {
      id: Date.now().toString(),
      content: newMessage.trim(),
      author: userProfile.public_name || userProfile.name || user.email?.split('@')[0] || 'Usuário',
      timestamp: new Date(),
      userId: user.id
    };
    
    // Add to local state (future: save to Supabase)
    setMessages(prev => [message, ...prev]);
    setNewMessage('');
    setIsSubmitting(false);
  };

  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]?.toUpperCase()).slice(0, 2).join('');
  };

  if (!user) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <ChatBubbleLeftRightIcon className="h-6 w-6 text-blue-600" />
          Discussão do Núcleo
        </h3>
        
        <div className="text-center py-8">
          <LockClosedIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">
            Você precisa estar logado para participar das discussões.
          </p>
          <a
            href="/login"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <LockClosedIcon className="h-4 w-4 mr-2" />
            Fazer Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <ChatBubbleLeftRightIcon className="h-6 w-6 text-blue-600" />
        Discussão do Núcleo
      </h3>
      
      {/* Messages List */}
      <div className="space-y-4 mb-6">
        {messages.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p>Nenhuma discussão ainda.</p>
            <p className="text-sm">Seja o primeiro a iniciar uma conversa!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className="flex gap-3 p-4 bg-gray-50 rounded-lg">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {getUserInitials(message.author)}
                </div>
              </div>
              
              {/* Message Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-gray-900">{message.author}</span>
                  <span className="text-sm text-gray-500">
                    {message.timestamp.toLocaleString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <p className="text-gray-700 whitespace-pre-wrap break-words">
                  {message.content}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Future Enhancement Note */}
      {messages.length > 0 && (
        <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700">
            💡 <strong>Em desenvolvimento:</strong> Em breve as discussões serão persistentes e terão sistema de respostas.
          </p>
        </div>
      )}
      
      {/* Message Form - Instagram Style at Bottom */}
      <div className="border-t border-gray-200 pt-4">
        <form onSubmit={handleSubmitMessage}>
          <div className="flex gap-3">
            {/* User Avatar */}
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {getUserInitials(userProfile?.public_name || userProfile?.name || user?.email?.split('@')[0] || 'Usuário')}
              </div>
            </div>
            
            {/* Input Area */}
            <div className="flex-1">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={`Adicione uma mensagem ao ${nucleoName}...`}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                disabled={isSubmitting}
              />
              
              <div className="flex justify-between items-center mt-2">
                <div className="text-xs text-gray-500">
                  Postando como <span className="font-medium">{userProfile?.public_name || userProfile?.name || user?.email?.split('@')[0] || 'Usuário'}</span>
                </div>
                <button
                  type="submit"
                  disabled={!newMessage.trim() || isSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                >
                  {isSubmitting ? 'Publicando...' : 'Publicar'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}