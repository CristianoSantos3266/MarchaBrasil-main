'use client'

import { useState } from 'react'
import Navigation from '@/components/ui/Navigation'
import { 
  HeartIcon,
  FlagIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  LockClosedIcon,
  ExclamationTriangleIcon,
  GlobeAltIcon,
  SpeakerWaveIcon,
  ComputerDesktopIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline'

export default function DonatePage() {
  const [amount, setAmount] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const predefinedAmounts = [1, 10, 20]
  
  const handleDonate = async (donationAmount: number) => {
    setIsProcessing(true)
    
    try {
      // TODO: Implement Stripe integration
      alert(`Funcionalidade em desenvolvimento! Valor: R$ ${donationAmount}`)
      
      // Simulate processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
    } catch (error) {
      console.error('Donation error:', error)
      alert('Erro ao processar doação. Tente novamente.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-blue-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg border-2 border-green-200">
          <div className="text-center p-8 border-b border-gray-200">
            <div className="flex justify-center mb-4">
              <HeartIcon className="h-16 w-16 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Apoiar a Causa
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Sua doação ajuda a manter esta plataforma funcionando e resistente à censura. 
              Contribua para a democracia e liberdade de expressão no Brasil.
            </p>
          </div>

          <div className="p-8">
            {/* Current Status */}
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200 mb-8">
              <h2 className="text-xl font-bold text-blue-800 mb-4 flex items-center gap-2">
                <FlagIcon className="h-6 w-6" />
                Nossa Meta
              </h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-blue-700 mb-2">
                    <span>Arrecadado</span>
                    <span>R$ 12.450 / R$ 50.000</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-3">
                    <div className="bg-blue-600 h-3 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-800">284</div>
                    <div className="text-sm text-blue-600">Apoiadores</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-800">R$ 44</div>
                    <div className="text-sm text-blue-600">Doação Média</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-800">25%</div>
                    <div className="text-sm text-blue-600">da Meta</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Donation Options */}
            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <CurrencyDollarIcon className="h-6 w-6" />
                  Escolha o Valor
                </h2>
                
                {/* Predefined amounts */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                  {predefinedAmounts.map((value) => (
                    <button
                      key={value}
                      onClick={() => handleDonate(value)}
                      disabled={isProcessing}
                      className="bg-green-100 hover:bg-green-200 text-green-800 font-bold py-3 px-4 rounded-lg transition-colors disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed"
                    >
                      R$ {value}
                    </button>
                  ))}
                </div>

                {/* Custom amount */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Valor personalizado (R$)
                    </label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Ex: 35"
                      min="1"
                    />
                  </div>
                  
                  <button
                    onClick={() => amount && handleDonate(parseFloat(amount))}
                    disabled={!amount || isProcessing}
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-6 rounded-lg font-bold hover:from-green-700 hover:to-green-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <CreditCardIcon className="h-5 w-5" />
                        Processando...
                      </>
                    ) : (
                      <>
                        <HeartIcon className="h-5 w-5" />
                        Doar Agora
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Information */}
              <div className="space-y-6">
                <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
                  <h3 className="text-lg font-bold text-yellow-800 mb-3 flex items-center gap-2">
                    <ShieldCheckIcon className="h-5 w-5" />
                    Para que serve sua doação?
                  </h3>
                  <ul className="text-sm text-yellow-700 space-y-2">
                    <li>• <strong>Hospedagem internacional:</strong> Servidores fora do Brasil para resistir à censura</li>
                    <li>• <strong>Segurança:</strong> Certificados SSL, proteção DDoS e backup dos dados</li>
                    <li>• <strong>Desenvolvimento:</strong> Melhorias na plataforma e novas funcionalidades</li>
                    <li>• <strong>Moderação:</strong> Equipe para revisar eventos e manter a qualidade</li>
                  </ul>
                </div>

                <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                  <h3 className="text-lg font-bold text-green-800 mb-3 flex items-center gap-2">
                    <LockClosedIcon className="h-5 w-5" />
                    Transparência e Segurança
                  </h3>
                  <ul className="text-sm text-green-700 space-y-2">
                    <li>• <strong>Pagamentos seguros:</strong> Processados via Stripe internacional</li>
                    <li>• <strong>Sem armazenamento:</strong> Não guardamos dados de cartão</li>
                    <li>• <strong>Relatórios mensais:</strong> Publicamos como os recursos são usados</li>
                    <li>• <strong>Doações anônimas:</strong> Não associamos doações a perfis de usuário</li>
                  </ul>
                </div>

                <div className="bg-red-50 rounded-lg p-6 border border-red-200">
                  <h3 className="text-lg font-bold text-red-800 mb-3 flex items-center gap-2">
                    <ExclamationTriangleIcon className="h-5 w-5" />
                    Importante
                  </h3>
                  <p className="text-sm text-red-700">
                    Esta plataforma é <strong>apartidária</strong> e <strong>neutra</strong>. 
                    Apoiamos apenas manifestações pacíficas e dentro da legalidade. 
                    Sua doação não financia nenhum partido político específico.
                  </p>
                </div>
              </div>
            </div>

            {/* Alternative Methods */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6 text-center flex items-center justify-center gap-2">
                <GlobeAltIcon className="h-6 w-6" />
                Outras Formas de Apoiar
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex justify-center mb-2">
                    <CurrencyDollarIcon className="h-8 w-8 text-orange-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Bitcoin</h3>
                  <p className="text-sm text-gray-600 mb-3">Para máxima privacidade</p>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Ver endereço BTC
                  </button>
                </div>

                <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex justify-center mb-2">
                    <SpeakerWaveIcon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Divulgação</h3>
                  <p className="text-sm text-gray-600 mb-3">Compartilhe com amigos</p>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Copiar link
                  </button>
                </div>

                <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex justify-center mb-2">
                    <ComputerDesktopIcon className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Contribuir</h3>
                  <p className="text-sm text-gray-600 mb-3">Ajude no desenvolvimento</p>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Ver GitHub
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}