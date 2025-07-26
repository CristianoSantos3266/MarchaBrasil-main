'use client';

import Navigation from '@/components/ui/Navigation';
import Footer from '@/components/ui/Footer';
import { DocumentTextIcon, ExclamationTriangleIcon, HandRaisedIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

export default function TermsOfUsePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 to-blue-800 text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-white/20 backdrop-blur rounded-full p-4">
                <DocumentTextIcon className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4">
              Termos de Uso
            </h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto">
              Plataforma para manifestações pacíficas e democráticas
            </p>
            <p className="text-sm text-green-200 mt-2">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          
          {/* Peace Disclaimer */}
          <section className="mb-8">
            <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-6 text-white text-center mb-8">
              <div className="flex justify-center mb-4">
                <HandRaisedIcon className="h-12 w-12 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-4">
                ⚠️ IMPORTANTE: Compromisso com a Paz
              </h2>
              <p className="text-lg font-semibold">
                A Marcha Brasil apoia EXCLUSIVAMENTE manifestações pacíficas, ordeiras e democráticas.
              </p>
              <p className="mt-2 text-green-100">
                Qualquer incitação à violência, quebra-quebra ou atos ilegais resultará no banimento permanente da plataforma.
              </p>
            </div>
          </section>

          {/* Introduction */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Aceitação dos Termos</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Ao acessar e usar a plataforma Marcha Brasil, você concorda em cumprir e estar vinculado a estes 
              Termos de Uso. Se você não concordar com qualquer parte destes termos, não deve usar nossa plataforma.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Estes termos podem ser atualizados periodicamente, e o uso continuado da plataforma constitui 
              aceitação das versões revisadas.
            </p>
          </section>

          {/* Platform Purpose */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Finalidade da Plataforma</h2>
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-4">
              <h3 className="font-semibold text-blue-900 mb-3">A Marcha Brasil é uma plataforma destinada a:</h3>
              <ul className="space-y-2 text-blue-800">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  Facilitar a organização de manifestações pacíficas e democráticas
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  Promover o exercício dos direitos constitucionais de expressão e reunião
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  Fortalecer a participação cívica e democrática
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  Conectar cidadãos em defesa de causas legítimas
                </li>
              </ul>
            </div>
          </section>

          {/* User Responsibilities */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Responsabilidades do Usuário</h2>
            
            <h3 className="text-lg font-semibold text-gray-800 mb-3">3.1 Você concorda em:</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li>Usar a plataforma apenas para fins legais e pacíficos</li>
              <li>Fornecer informações verdadeiras e atualizadas</li>
              <li>Respeitar os direitos de outros usuários</li>
              <li>Não compartilhar conteúdo ofensivo, difamatório ou ilegal</li>
              <li>Manter a confidencialidade de suas credenciais de acesso</li>
              <li>Reportar atividades suspeitas ou inadequadas</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-800 mb-3">3.2 É estritamente proibido:</h3>
            <div className="bg-red-50 p-6 rounded-lg border border-red-200">
              <ul className="space-y-2 text-red-800">
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">✗</span>
                  Incitar ou promover violência de qualquer forma
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">✗</span>
                  Organizar ou participar de atividades ilegais
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">✗</span>
                  Promover quebra-quebra, depredação ou vandalismo
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">✗</span>
                  Compartilhar conteúdo pornográfico, ofensivo ou discriminatório
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">✗</span>
                  Fazer spam, phishing ou atividades fraudulentas
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">✗</span>
                  Tentar hackear, interferir ou comprometer a plataforma
                </li>
              </ul>
            </div>
          </section>

          {/* Peaceful Conduct */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <HandRaisedIcon className="h-6 w-6 text-green-600" />
              4. Conduta Pacífica Obrigatória
            </h2>
            
            <div className="bg-green-50 p-6 rounded-lg border border-green-200 mb-4">
              <h3 className="font-semibold text-green-900 mb-3">Compromisso com a Não-Violência</h3>
              <p className="text-green-800 mb-4">
                Todos os eventos e atividades organizados através da Marcha Brasil devem seguir 
                rigorosamente os princípios da manifestação pacífica conforme estabelecido na 
                Constituição Federal Brasileira.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <ShieldCheckIcon className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-900">Art. 5º, XVI da Constituição Federal:</p>
                    <p className="text-sm text-green-800">
                      "Todos podem reunir-se pacificamente, sem armas, em locais abertos ao público"
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
              <h4 className="font-semibold text-yellow-900 mb-3">⚠️ Consequências por Violação</h4>
              <ul className="space-y-2 text-yellow-800">
                <li>• Remoção imediata de conteúdo inadequado</li>
                <li>• Suspensão temporária ou permanente da conta</li>
                <li>• Relatório às autoridades competentes quando necessário</li>
                <li>• Responsabilização civil e criminal do usuário</li>
              </ul>
            </div>
          </section>

          {/* Content Policy */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Política de Conteúdo</h2>
            
            <h3 className="text-lg font-semibold text-gray-800 mb-3">5.1 Conteúdo Permitido</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>Informações sobre manifestações pacíficas</li>
              <li>Discussões democráticas e respeitosas</li>
              <li>Conteúdo educativo sobre direitos civis</li>
              <li>Relatos factuais de eventos</li>
              <li>Materiais de apoio à participação cívica</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-800 mb-3">5.2 Moderação</h3>
            <p className="text-gray-700 mb-4">
              Reservamo-nos o direito de moderar, editar ou remover qualquer conteúdo que viole 
              estes termos ou que consideremos inadequado para os objetivos da plataforma.
            </p>
          </section>

          {/* Liability */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Limitação de Responsabilidade</h2>
            
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">A Marcha Brasil:</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• É uma plataforma de comunicação e organização</li>
                <li>• Não organiza ou controla diretamente os eventos listados</li>
                <li>• Não se responsabiliza por ações de usuários individuais</li>
                <li>• Não garante a realização de eventos anunciados</li>
                <li>• Não se responsabiliza por danos decorrentes da participação em eventos</li>
              </ul>
              
              <p className="text-sm text-gray-600 mt-4">
                <strong>Importante:</strong> Cada usuário é integralmente responsável por suas ações 
                e pela veracidade das informações que compartilha.
              </p>
            </div>
          </section>

          {/* Privacy */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Privacidade e Proteção de Dados</h2>
            <p className="text-gray-700 mb-4">
              O tratamento de dados pessoais na plataforma é regido por nossa 
              <a href="/privacidade" className="text-blue-600 hover:underline font-medium"> Política de Privacidade</a>, 
              elaborada em conformidade com a Lei Geral de Proteção de Dados (LGPD).
            </p>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-blue-800 text-sm">
                <strong>Lembre-se:</strong> A participação em eventos públicos é, por natureza, uma atividade 
                pública. A plataforma não pode garantir anonimato em manifestações realizadas em espaços públicos.
              </p>
            </div>
          </section>

          {/* Termination */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Suspensão e Encerramento</h2>
            <p className="text-gray-700 mb-4">
              Podemos suspender ou encerrar o acesso de qualquer usuário que viole estes termos, 
              sem aviso prévio e a nosso critério exclusivo.
            </p>
            
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Motivos para suspensão incluem:</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>Violação dos termos de conduta pacífica</li>
              <li>Compartilhamento de conteúdo inadequado</li>
              <li>Atividades fraudulentas ou ilegais</li>
              <li>Tentativas de comprometer a segurança da plataforma</li>
            </ul>
          </section>

          {/* Legal Framework */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Lei Aplicável e Jurisdição</h2>
            <p className="text-gray-700 mb-4">
              Estes termos são regidos pelas leis brasileiras, especialmente:
            </p>
            
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Constituição Federal de 1988</li>
              <li>Código Civil Brasileiro</li>
              <li>Lei Geral de Proteção de Dados (LGPD)</li>
              <li>Marco Civil da Internet</li>
            </ul>
          </section>

          {/* Contact */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Contato</h2>
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <p className="text-gray-700 mb-3">
                Para dúvidas, sugestões ou relatos sobre violações destes termos:
              </p>
              
              <div className="space-y-2 text-gray-700">
                <p><strong>E-mail:</strong> legal@marchabrasil.org</p>
                <p><strong>Suporte:</strong> suporte@marchabrasil.org</p>
                <p><strong>Denúncias:</strong> denuncia@marchabrasil.org</p>
              </div>
              
              <p className="text-sm text-gray-600 mt-4">
                Respondemos a todas as solicitações em até 48 horas.
              </p>
            </div>
          </section>

          {/* Footer */}
          <div className="border-t border-gray-200 pt-6 mt-8">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Termos de Uso - Marcha Brasil
              </div>
              <div className="text-sm text-gray-500">
                Versão 1.0 - {new Date().toLocaleDateString('pt-BR')}
              </div>
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-400">
                "A liberdade de expressão e o direito de reunião são pilares inegociáveis da democracia."
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}