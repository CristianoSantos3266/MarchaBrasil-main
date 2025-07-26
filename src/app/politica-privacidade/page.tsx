'use client';

import Navigation from '@/components/ui/Navigation';
import Footer from '@/components/ui/Footer';
import { ShieldCheckIcon, UserGroupIcon, DocumentTextIcon, LockClosedIcon } from '@heroicons/react/24/outline';

export default function LGPDPrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-white/20 backdrop-blur rounded-full p-4">
                <ShieldCheckIcon className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4">
              Política de Privacidade
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Em conformidade com a Lei Geral de Proteção de Dados (LGPD)
            </p>
            <p className="text-sm text-blue-200 mt-2">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          
          {/* Introduction */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <DocumentTextIcon className="h-6 w-6 text-blue-600" />
              1. Introdução
            </h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed">
                A Marcha Brasil está comprometida com a proteção da sua privacidade e dos seus dados pessoais. 
                Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos suas 
                informações pessoais de acordo com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018) 
                e demais normas aplicáveis.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                Ao utilizar nossa plataforma, você concorda com as práticas descritas nesta política.
              </p>
            </div>
          </section>

          {/* Data Collection */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Dados Coletados</h2>
            
            <h3 className="text-lg font-semibold text-gray-800 mb-3">2.1 Dados Fornecidos por Você</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>Nome completo</li>
              <li>Endereço de e-mail</li>
              <li>Número de telefone (opcional)</li>
              <li>Cidade e estado de residência</li>
              <li>Informações de perfil (opcional)</li>
              <li>Dados de participação em eventos</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-800 mb-3">2.2 Dados Coletados Automaticamente</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>Endereço IP</li>
              <li>Tipo de navegador e sistema operacional</li>
              <li>Páginas visitadas e tempo de navegação</li>
              <li>Dados de localização (quando autorizado)</li>
              <li>Cookies e tecnologias similares</li>
            </ul>
          </section>

          {/* Data Usage */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Finalidades do Tratamento</h2>
            <p className="text-gray-700 mb-4">Utilizamos seus dados pessoais para as seguintes finalidades:</p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Finalidades Principais</h4>
                <ul className="list-disc pl-4 text-blue-800 text-sm space-y-1">
                  <li>Criação e gerenciamento de conta</li>
                  <li>Organização e participação em eventos</li>
                  <li>Comunicação sobre manifestações</li>
                  <li>Prestação de suporte técnico</li>
                </ul>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">Finalidades Secundárias</h4>
                <ul className="list-disc pl-4 text-green-800 text-sm space-y-1">
                  <li>Melhoria da plataforma</li>
                  <li>Análises estatísticas</li>
                  <li>Prevenção de fraudes</li>
                  <li>Cumprimento de obrigações legais</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Legal Basis */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Base Legal</h2>
            <p className="text-gray-700 mb-4">O tratamento dos seus dados pessoais é baseado nas seguintes hipóteses legais:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Consentimento:</strong> Para envio de comunicações promocionais e newsletters</li>
              <li><strong>Execução de contrato:</strong> Para prestação dos serviços da plataforma</li>
              <li><strong>Legítimo interesse:</strong> Para melhorias na plataforma e prevenção de fraudes</li>
              <li><strong>Cumprimento de obrigação legal:</strong> Para atendimento a autoridades competentes</li>
            </ul>
          </section>

          {/* User Rights */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Seus Direitos (LGPD)</h2>
            <p className="text-gray-700 mb-4">Conforme a LGPD, você tem os seguintes direitos:</p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="text-blue-600 mt-1">✓</div>
                  <div>
                    <h4 className="font-semibold text-blue-900">Confirmação e Acesso</h4>
                    <p className="text-sm text-blue-800">Confirmar se tratamos seus dados e acessá-los</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="text-green-600 mt-1">✓</div>
                  <div>
                    <h4 className="font-semibold text-green-900">Correção</h4>
                    <p className="text-sm text-green-800">Corrigir dados incompletos ou desatualizados</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                  <div className="text-purple-600 mt-1">✓</div>
                  <div>
                    <h4 className="font-semibold text-purple-900">Anonimização ou Exclusão</h4>
                    <p className="text-sm text-purple-800">Solicitar anonimização ou exclusão de dados</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                  <div className="text-orange-600 mt-1">✓</div>
                  <div>
                    <h4 className="font-semibold text-orange-900">Portabilidade</h4>
                    <p className="text-sm text-orange-800">Receber seus dados em formato estruturado</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                  <div className="text-red-600 mt-1">✓</div>
                  <div>
                    <h4 className="font-semibold text-red-900">Oposição</h4>
                    <p className="text-sm text-red-800">Opor-se ao tratamento desnecessário</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="text-gray-600 mt-1">✓</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Revisão de Decisões</h4>
                    <p className="text-sm text-gray-800">Revisar decisões automatizadas</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Security */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <LockClosedIcon className="h-6 w-6 text-green-600" />
              6. Segurança dos Dados
            </h2>
            <p className="text-gray-700 mb-4">Implementamos medidas técnicas e organizacionais para proteger seus dados:</p>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl mb-2">🔒</div>
                <h4 className="font-semibold text-gray-900 mb-1">Criptografia</h4>
                <p className="text-xs text-gray-600">Dados protegidos com SSL/TLS</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl mb-2">🛡️</div>
                <h4 className="font-semibold text-gray-900 mb-1">Controle de Acesso</h4>
                <p className="text-xs text-gray-600">Acesso restrito e monitorado</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl mb-2">💾</div>
                <h4 className="font-semibold text-gray-900 mb-1">Backup Seguro</h4>
                <p className="text-xs text-gray-600">Backups regulares e criptografados</p>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Contato e DPO</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">Para exercer seus direitos ou esclarecer dúvidas:</h3>
              <div className="space-y-2 text-gray-700">
                <p><strong>E-mail:</strong> privacidade@marchabrasil.org</p>
                <p><strong>DPO (Encarregado):</strong> dpo@marchabrasil.org</p>
                <p><strong>Formulário:</strong> <a href="/contato" className="text-blue-600 hover:underline">marchabrasil.org/contato</a></p>
              </div>
              <p className="text-sm text-gray-600 mt-4">
                Responderemos sua solicitação em até 15 dias úteis.
              </p>
            </div>
          </section>

          {/* Footer */}
          <div className="border-t border-gray-200 pt-6 mt-8">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Política de Privacidade (LGPD) - Marcha Brasil
              </div>
              <div className="text-sm text-gray-500">
                Versão 1.0 - {new Date().toLocaleDateString('pt-BR')}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}