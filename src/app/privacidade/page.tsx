'use client'

import Navigation from '@/components/ui/Navigation'
import Link from 'next/link'
import { 
  ShieldCheckIcon,
  GlobeAltIcon,
  UserIcon,
  LockClosedIcon,
  EyeSlashIcon,
  ServerIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-blue-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mb-4">
            <ShieldCheckIcon className="h-16 w-16 text-green-600 mx-auto" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Privacidade e Soberania Digital
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Na Marcha Brasil, sua liberdade, segurança e anonimato são prioridade absoluta. 
            Esta plataforma foi criada para garantir que cidadãos brasileiros possam se organizar 
            pacificamente, sem medo de perseguição ou censura.
          </p>
        </div>

        <div className="space-y-8">
          {/* International Hosting */}
          <div className="bg-white rounded-xl shadow-lg border-2 border-green-200 p-8">
            <div className="flex items-center gap-3 mb-6">
              <GlobeAltIcon className="h-8 w-8 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">Onde estamos hospedados?</h2>
            </div>
            
            <p className="text-gray-700 text-lg mb-6">
              <strong>Marcha Brasil está hospedada fora do território brasileiro</strong>, em servidores 
              localizados nos Estados Unidos, sob proteção das leis americanas de liberdade de expressão.
            </p>

            <div className="bg-green-50 rounded-lg p-6 border border-green-200">
              <h3 className="font-bold text-green-800 mb-4">Isso significa que:</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-green-800">
                    <strong>Nenhuma autoridade brasileira</strong> pode exigir ou acessar dados armazenados pela plataforma.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-green-800">
                    <strong>As leis brasileiras não se aplicam</strong> à nossa infraestrutura.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-green-800">
                    O domínio, os dados e a segurança estão sob <strong>jurisdição americana</strong>, 
                    com garantias constitucionais mais fortes.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* User Data Collection */}
          <div className="bg-white rounded-xl shadow-lg border-2 border-blue-200 p-8">
            <div className="flex items-center gap-3 mb-6">
              <UserIcon className="h-8 w-8 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">O que coletamos dos usuários?</h2>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200 mb-6">
              <p className="text-lg font-bold text-blue-800 mb-4">
                Usuários comuns (participantes de manifestações) não precisam se cadastrar.
              </p>
              
              <div className="space-y-2">
                <p className="text-blue-700 font-medium">Você pode:</p>
                <ul className="list-disc list-inside text-blue-700 space-y-1 ml-4">
                  <li>Visualizar eventos</li>
                  <li>Confirmar presença</li>
                  <li>Compartilhar a mobilização</li>
                </ul>
                <p className="text-blue-800 font-bold mt-3">
                  Tudo sem fornecer nome, e-mail ou telefone.
                </p>
              </div>
            </div>
          </div>

          {/* Organizer Security */}
          <div className="bg-white rounded-xl shadow-lg border-2 border-purple-200 p-8">
            <div className="flex items-center gap-3 mb-6">
              <LockClosedIcon className="h-8 w-8 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">Segurança para organizadores</h2>
            </div>
            
            <p className="text-gray-700 mb-4">
              Organizadores que desejam cadastrar manifestações devem fornecer um número de WhatsApp 
              para verificação manual. Isso é necessário para garantir a veracidade e confiança 
              dos eventos publicados.
            </p>

            <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
              <h3 className="font-bold text-purple-800 mb-4">Esses dados:</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <EyeSlashIcon className="h-5 w-5 text-purple-600" />
                  <p className="text-purple-800">Não são divulgados</p>
                </div>
                <div className="flex items-center gap-3">
                  <EyeSlashIcon className="h-5 w-5 text-purple-600" />
                  <p className="text-purple-800">Não são compartilhados</p>
                </div>
                <div className="flex items-center gap-3">
                  <ShieldCheckIcon className="h-5 w-5 text-purple-600" />
                  <p className="text-purple-800">Servem exclusivamente para validação interna</p>
                </div>
              </div>
            </div>
          </div>

          {/* Anti-Censorship */}
          <div className="bg-white rounded-xl shadow-lg border-2 border-red-200 p-8">
            <div className="flex items-center gap-3 mb-6">
              <ServerIcon className="h-8 w-8 text-red-600" />
              <h2 className="text-2xl font-bold text-gray-900">E se o governo brasileiro tentar derrubar a plataforma?</h2>
            </div>
            
            <p className="text-gray-700 text-lg mb-6">
              Temos medidas de proteção em múltiplos níveis:
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <div className="flex items-center gap-2 mb-2">
                  <ServerIcon className="h-5 w-5 text-red-600" />
                  <h4 className="font-bold text-red-800">Hospedagem internacional</h4>
                </div>
                <p className="text-red-700 text-sm">com redundância</p>
              </div>
              
              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <div className="flex items-center gap-2 mb-2">
                  <GlobeAltIcon className="h-5 w-5 text-red-600" />
                  <h4 className="font-bold text-red-800">VPN embutida</h4>
                </div>
                <p className="text-red-700 text-sm">para acesso mesmo sob bloqueios</p>
              </div>
              
              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <div className="flex items-center gap-2 mb-2">
                  <DocumentTextIcon className="h-5 w-5 text-red-600" />
                  <h4 className="font-bold text-red-800">Domínios espelho</h4>
                </div>
                <p className="text-red-700 text-sm">para acesso alternativo</p>
              </div>
              
              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheckIcon className="h-5 w-5 text-red-600" />
                  <h4 className="font-bold text-red-800">Backup da infraestrutura</h4>
                </div>
                <p className="text-red-700 text-sm">fora do Brasil</p>
              </div>
            </div>

            <div className="mt-6 bg-red-600 text-white rounded-lg p-4 text-center">
              <p className="text-lg font-bold">
                Nosso compromisso é nunca sair do ar.
              </p>
            </div>
          </div>

          {/* Legal Framework */}
          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-8">
            <div className="flex items-center gap-3 mb-6">
              <DocumentTextIcon className="h-8 w-8 text-gray-600" />
              <h2 className="text-2xl font-bold text-gray-900">Base Legal</h2>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h3 className="font-bold text-gray-800 mb-4">Direitos Constitucionais Garantidos:</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-800">
                      Art. 5º, XVI da Constituição Federal
                    </p>
                    <p className="text-gray-600 text-sm">
                      "Todos podem reunir-se pacificamente, sem armas, em locais abertos ao público, 
                      independentemente de autorização"
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-800">
                      Art. 5º, IV da Constituição Federal
                    </p>
                    <p className="text-gray-600 text-sm">
                      "É livre a manifestação do pensamento"
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-800">
                      Art. 1º, Parágrafo Único
                    </p>
                    <p className="text-gray-600 text-sm">
                      "Todo o poder emana do povo, que o exerce por meio de representantes eleitos 
                      ou diretamente"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Security Commitment */}
          <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-8 text-white text-center">
            <div className="mb-4">
              <ShieldCheckIcon className="h-12 w-12 text-white mx-auto" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Compromisso com a Liberdade</h2>
            <p className="text-lg mb-6">
              Esta plataforma existe para defender os direitos constitucionais dos brasileiros. 
              Não cedemos a pressões políticas e não colaboramos com censura.
            </p>
            <div className="bg-white/20 backdrop-blur rounded-lg p-4">
              <p className="font-bold">
                "A liberdade de expressão e o direito de reunião são pilares inegociáveis da democracia."
              </p>
            </div>
          </div>

          {/* Contact and Transparency */}
          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-8">
            <div className="flex items-center gap-3 mb-6">
              <ExclamationTriangleIcon className="h-8 w-8 text-yellow-600" />
              <h2 className="text-2xl font-bold text-gray-900">Transparência e Contato</h2>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-700">
                Se você tem dúvidas sobre nossa política de privacidade ou segurança, 
                entre em contato conosco:
              </p>
              
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-gray-800">
                  <strong>Email:</strong> equipe@marchabrasil.com<br/>
                  <strong>Telegram:</strong> @marchabrasil<br/>
                  <strong>Instagram:</strong> marchabrasil2025<br/>
                  <strong>WhatsApp:</strong> +1 (365) 767-1900
                </p>
              </div>
              
              <p className="text-sm text-gray-600">
                Respondemos a todas as dúvidas sobre privacidade e segurança em até 48 horas.
              </p>
            </div>
          </div>

          {/* Back to FAQ */}
          <div className="text-center">
            <Link 
              href="/faq" 
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <DocumentTextIcon className="h-5 w-5" />
              Voltar para o FAQ
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}