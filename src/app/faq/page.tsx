'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navigation from '@/components/ui/Navigation'
import { 
  EnvelopeIcon, 
  ChatBubbleLeftRightIcon, 
  DevicePhoneMobileIcon,
  QuestionMarkCircleIcon,
  BookOpenIcon,
  GlobeAltIcon,
  CalendarDaysIcon,
  ShieldCheckIcon,
  LockClosedIcon,
  ScaleIcon,
  HeartIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'

interface FAQItem {
  question: string
  answer: string
  category: string
}

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [openItems, setOpenItems] = useState<Set<number>>(new Set())

  const faqs: FAQItem[] = [
    {
      category: 'platform',
      question: 'Por que essa plataforma existe?',
      answer: 'A população brasileira precisa de uma ferramenta para se organizar pacificamente e protestar de forma coordenada para transmitir suas mensagens. Hoje em dia, as informações estão muito dispersas em várias redes sociais e grupos diferentes. Nossa plataforma centraliza essas informações, criando um local único onde os cidadãos podem encontrar manifestações em sua região, se organizar democraticamente e exercer seus direitos constitucionais de forma pacífica e efetiva.'
    },
    {
      category: 'platform',
      question: 'O que é essa plataforma?',
      answer: 'Esta é uma plataforma digital neutra e apartidária que permite aos brasileiros organizar e participar de manifestações pacíficas. Nosso objetivo é facilitar o exercício democrático dos direitos constitucionais de reunião e expressão, centralizando informações que antes ficavam espalhadas.'
    },
    {
      category: 'safety',
      question: 'É seguro usar esta plataforma?',
      answer: 'Sim! Utilizamos criptografia de ponta a ponta, servidores internacionais para resistir à censura, e não armazenamos dados pessoais desnecessários. Todos os dados sensíveis são protegidos e não são compartilhados publicamente.'
    },
    {
      category: 'platform',
      question: 'A plataforma é neutra?',
      answer: 'Completamente. Somos apartidários e não apoiamos nenhum partido político específico. Nosso foco é exclusivamente em facilitar manifestações pacíficas e democráticas, independente da orientação política.'
    },
    {
      category: 'events',
      question: 'Como criar um evento?',
      answer: 'Para criar eventos, você precisa: 1) Criar uma conta, 2) Completar seu perfil de organizador, 3) Aguardar aprovação dos moderadores, 4) Usar o formulário "Criar Manifestação". Todos os eventos passam por moderação antes da publicação.'
    },
    {
      category: 'events',
      question: 'Como saber se outras pessoas vão participar?',
      answer: 'Cada evento mostra o número de pessoas que confirmaram presença. Você pode confirmar sua participação de forma anônima, escolhendo se vai como caminhoneiro, motociclista ou cidadão comum.'
    },
    {
      category: 'safety',
      question: 'Vocês apoiam protestos violentos?',
      answer: 'Absolutamente não! Nossa plataforma é exclusivamente para manifestações PACÍFICAS. Não toleramos violência, vandalismo ou qualquer atividade ilegal. Todos os eventos são moderados e devem seguir as leis brasileiras.'
    },
    {
      category: 'donation',
      question: 'Como doar para a plataforma?',
      answer: 'Você pode doar através da página "Apoiar a Causa" usando cartão de crédito (processado via Stripe internacional), Bitcoin, ou ajudando com divulgação e desenvolvimento. Todas as doações são usadas para manter a plataforma funcionando.'
    },
    {
      category: 'platform',
      question: 'Como o governo pode bloquear vocês?',
      answer: 'Utilizamos uma estratégia de múltiplas camadas: servidores internacionais, domínios espelho, CDN global, e código aberto. Se um domínio for bloqueado, outros continuarão funcionando. A plataforma foi projetada para ser resistente à censura.'
    },
    {
      category: 'events',
      question: 'Posso organizar eventos fora do Brasil?',
      answer: 'Sim! Temos uma seção especial para eventos internacionais, focada em brasileiros no exterior que querem se organizar em suas cidades. Consulte a aba "No Exterior" na navegação.'
    },
    {
      category: 'moderation',
      question: 'Como funciona a moderação?',
      answer: 'Todos os perfis de organizadores e eventos passam por revisão manual. Verificamos se o conteúdo está alinhado com manifestações pacíficas e se não viola nossas diretrizes. O processo geralmente leva até 48 horas.'
    },
    {
      category: 'privacy',
      question: 'Meus dados pessoais ficam seguros?',
      answer: 'Sim! Não exibimos dados pessoais publicamente. Informações como WhatsApp e email ficam visíveis apenas para moderadores. Você pode participar de eventos de forma completamente anônima.'
    },
    {
      category: 'privacy',
      question: 'Minhas informações estão seguras?',
      answer: 'Sim. Nenhum dado é exigido dos usuários comuns, e a plataforma é hospedada fora do Brasil. Leia mais sobre nossa política de privacidade e soberania digital.'
    },
    {
      category: 'legal',
      question: 'Isso é legal no Brasil?',
      answer: 'Sim! O direito de reunião pacífica está garantido no Art. 5º, XVI da Constituição Federal. Nossa plataforma apenas facilita o exercício desse direito constitucional, sempre dentro da legalidade.'
    }
  ]

  const categories = [
    { id: 'all', name: 'Todas', icon: BookOpenIcon },
    { id: 'platform', name: 'Plataforma', icon: GlobeAltIcon },
    { id: 'events', name: 'Eventos', icon: CalendarDaysIcon },
    { id: 'safety', name: 'Segurança', icon: ShieldCheckIcon },
    { id: 'privacy', name: 'Privacidade', icon: LockClosedIcon },
    { id: 'moderation', name: 'Moderação', icon: ScaleIcon },
    { id: 'donation', name: 'Doações', icon: HeartIcon },
    { id: 'legal', name: 'Legal', icon: DocumentTextIcon }
  ]

  const filteredFAQs = activeCategory === 'all' 
    ? faqs 
    : faqs.filter(faq => faq.category === activeCategory)

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems)
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index)
    } else {
      newOpenItems.add(index)
    }
    setOpenItems(newOpenItems)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-blue-50">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ❓ Perguntas Frequentes
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Encontre respostas para as dúvidas mais comuns sobre nossa plataforma 
            de mobilização cívica e manifestações pacíficas.
          </p>
        </div>

        {/* Category Filter */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-green-200 mb-8">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MagnifyingGlassIcon className="h-6 w-6 text-green-600" />
              Filtrar por categoria
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                      activeCategory === category.id
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <div className="flex justify-center mb-1">
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div>{category.name}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* FAQ Items */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-green-200">
          <div className="p-6">
            <div className="space-y-4">
              {filteredFAQs.map((faq, index) => (
                <div key={index} className="border border-gray-200 rounded-lg">
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full p-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
                    <svg
                      className={`w-5 h-5 transform transition-transform ${
                        openItems.has(index) ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {openItems.has(index) && (
                    <div className="p-4 pt-0 border-t border-gray-200">
                      <div className="text-gray-700 leading-relaxed">
                        {faq.answer.includes('política de privacidade e soberania digital') ? (
                          <>
                            Sim. Nenhum dado é exigido dos usuários comuns, e a plataforma é hospedada fora do Brasil.{' '}
                            <Link 
                              href="/privacidade" 
                              className="text-blue-600 hover:text-blue-800 underline font-medium"
                            >
                              🔗 Leia mais sobre nossa política de privacidade e soberania digital
                            </Link>
                          </>
                        ) : (
                          faq.answer
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {filteredFAQs.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <div className="text-4xl mb-4">🔍</div>
                <p>Nenhuma pergunta encontrada para esta categoria.</p>
              </div>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-8 bg-blue-50 rounded-xl border border-blue-200 p-6">
          <div className="text-center">
            <h2 className="text-xl font-bold text-blue-800 mb-4 flex items-center justify-center gap-2">
              <QuestionMarkCircleIcon className="h-6 w-6" />
              Não encontrou sua resposta?
            </h2>
            <p className="text-blue-700 mb-4">
              Se você tem uma dúvida que não está listada aqui, entre em contato conosco:
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <div className="flex justify-center mb-2">
                  <EnvelopeIcon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="font-bold text-blue-800">Email</div>
                <div className="text-sm text-blue-600">contato@marchabrasil.com</div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <div className="flex justify-center mb-2">
                  <ChatBubbleLeftRightIcon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="font-bold text-blue-800">Telegram</div>
                <div className="text-sm text-blue-600">@MobilizacaoCivica</div>
              </div>
              <a href="https://wa.me/13657671900" target="_blank" rel="noopener noreferrer" className="bg-white rounded-lg p-4 border border-blue-200 hover:bg-blue-50 transition-colors">
                <div className="flex justify-center mb-2">
                  <DevicePhoneMobileIcon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="font-bold text-blue-800">WhatsApp</div>
                <div className="text-sm text-blue-600">Entre em contato</div>
              </a>
            </div>
          </div>
        </div>

        {/* Legal Notice */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p className="flex items-center justify-center gap-2">
            <DocumentTextIcon className="h-5 w-5 text-gray-500" />
            Esta plataforma opera em conformidade com a Constituição Federal Brasileira, 
            especificamente o Art. 5º, XVI, que garante o direito de reunião pacífica.
          </p>
        </div>
      </div>
    </div>
  )
}