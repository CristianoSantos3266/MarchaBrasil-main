'use client'

import { useState } from 'react'
import Navigation from '@/components/ui/Navigation'
import Footer from '@/components/ui/Footer'
import { useAuth } from '@/contexts/AuthContext'

export default function NewsPage() {
  const { user } = useAuth()
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { id: 'all', name: 'Todas', icon: '📰' },
    { id: 'politics', name: 'Política', icon: '🏛️' },
    { id: 'democracy', name: 'Democracia', icon: '🗳️' },
    { id: 'manifestations', name: 'Manifestações', icon: '✊' },
    { id: 'rights', name: 'Direitos', icon: '⚖️' }
  ]

  const mockNews = [
    {
      id: 1,
      title: 'Nova Lei de Manifestações Pacíficas em Discussão',
      summary: 'Congresso debate regulamentação que garante direitos constitucionais dos manifestantes.',
      category: 'politics',
      date: '2025-01-08',
      readTime: '5 min',
      featured: true
    },
    {
      id: 2,
      title: 'Manifestação Pacífica Reúne Milhares em São Paulo',
      summary: 'Evento organizado pela plataforma mobiliza cidadãos em defesa da democracia.',
      category: 'manifestations',
      date: '2025-01-07',
      readTime: '3 min',
      featured: false
    },
    {
      id: 3,
      title: 'Como Organizar Manifestações Seguras e Eficazes',
      summary: 'Guia completo com dicas práticas para organizadores de eventos cívicos.',
      category: 'rights',
      date: '2025-01-06',
      readTime: '8 min',
      featured: false
    }
  ]

  const filteredNews = selectedCategory === 'all' 
    ? mockNews 
    : mockNews.filter(item => item.category === selectedCategory)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            📰 Notícias e Atualizações
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Fique por dentro das últimas notícias sobre manifestações pacíficas, 
            direitos democráticos e mobilizações cidadãs no Brasil
          </p>
        </div>

        {/* Categories Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-200'
                }`}
              >
                <span>{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Article */}
        {selectedCategory === 'all' && (
          <div className="mb-12">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white">
              <div className="flex items-start justify-between mb-4">
                <span className="bg-yellow-400 text-blue-900 px-3 py-1 rounded-full text-sm font-bold">
                  ⭐ Destaque
                </span>
                <span className="text-blue-100 text-sm">
                  {formatDate(mockNews[0].date)}
                </span>
              </div>
              <h2 className="text-3xl font-bold mb-4">
                {mockNews[0].title}
              </h2>
              <p className="text-xl text-blue-100 mb-6">
                {mockNews[0].summary}
              </p>
              <div className="flex items-center gap-4">
                <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-blue-50 transition-colors">
                  Ler Matéria Completa
                </button>
                <span className="text-blue-200 text-sm">
                  ⏱️ {mockNews[0].readTime} de leitura
                </span>
              </div>
            </div>
          </div>
        )}

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.filter(item => !item.featured || selectedCategory !== 'all').map((article) => (
            <article
              key={article.id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-100"
            >
              <div className="h-48 bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center">
                <span className="text-6xl opacity-50">📰</span>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                    {categories.find(cat => cat.id === article.category)?.icon}
                    {categories.find(cat => cat.id === article.category)?.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDate(article.date)}
                  </span>
                </div>
                
                <h3 className="font-bold text-gray-900 mb-3 text-lg leading-tight">
                  {article.title}
                </h3>
                
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {article.summary}
                </p>
                
                <div className="flex items-center justify-between">
                  <button className="text-blue-600 font-medium hover:text-blue-700 transition-colors text-sm">
                    Ler mais →
                  </button>
                  <span className="text-xs text-gray-500">
                    ⏱️ {article.readTime}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Empty State */}
        {filteredNews.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📰</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Nenhuma notícia encontrada
            </h3>
            <p className="text-gray-600">
              Não há notícias disponíveis nesta categoria no momento.
            </p>
          </div>
        )}

        {/* Newsletter Signup */}
        <div className="mt-16 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 border border-green-200">
          <div className="text-center">
            <div className="text-4xl mb-4">📬</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Receba as Últimas Notícias
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Mantenha-se informado sobre manifestações, direitos democráticos e 
              mobilizações cidadãs. Receba nossa newsletter semanal.
            </p>
            <div className="max-w-md mx-auto flex gap-3">
              <input
                type="email"
                placeholder="Seu melhor e-mail"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors">
                Inscrever
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Respeitamos sua privacidade. Cancele a qualquer momento.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}