'use client';

import { useState } from 'react';
import { DONATION_TIERS, DonationTier } from '@/types/donations';
import DonationCard from '@/components/donations/DonationCard';
import CryptoDonations from '@/components/donations/CryptoDonations';
import PixDonations from '@/components/donations/PixDonations';
import DonationStatsDisplay from '@/components/donations/DonationStats';
import DonorRecognition from '@/components/donations/DonorRecognition';
import StripeCheckout from '@/components/donations/StripeCheckout';
import { 
  ArrowLeftIcon,
  CreditCardIcon,
  LockClosedIcon,
  ArrowPathIcon,
  BanknotesIcon,
  HeartIcon,
  CurrencyDollarIcon,
  ServerIcon,
  CodeBracketIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  ChartBarIcon,
  EnvelopeIcon,
  ScaleIcon,
  ExclamationTriangleIcon,
  DevicePhoneMobileIcon,
  ChatBubbleLeftRightIcon,
  ShieldExclamationIcon,
  FingerPrintIcon
} from '@heroicons/react/24/outline';
import { CheckIcon } from '@heroicons/react/24/solid';

export default function SupportPage() {
  const [selectedMethod, setSelectedMethod] = useState<'pix' | 'traditional' | 'crypto'>('pix');
  const [isMonthly, setIsMonthly] = useState(true);

  const [selectedTier, setSelectedTier] = useState<DonationTier | null>(null);
  const [customAmount, setCustomAmount] = useState<number>(0);

  const handleDonate = (tier: DonationTier, monthly?: boolean) => {
    const type = monthly ? 'mensal' : 'única';
    
    if (selectedMethod === 'pix') {
      alert(`Pagamento PIX ${type} de ${tier.name} (R$${tier.amount}). Use a chave PIX: d271a5b0-4256-4c14-a3cc-0f71f3bf5bce`);
    } else {
      // Set the tier for Stripe checkout
      setSelectedTier(tier);
    }
  };

  const handleCustomDonation = () => {
    const amount = prompt('Digite o valor personalizado (BRL):');
    if (amount && !isNaN(Number(amount)) && Number(amount) > 0) {
      if (selectedMethod === 'pix') {
        alert(`Pagamento PIX de R$${amount}. Use a chave PIX: d271a5b0-4256-4c14-a3cc-0f71f3bf5bce`);
      } else {
        setCustomAmount(Number(amount));
        setSelectedTier(null);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.history.back()}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-2"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Voltar à Plataforma
            </button>
          </div>
          <div className="text-center mt-4">
            <h1 className="text-3xl font-bold text-gray-900">
              Apoie Marcha Brasil
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Ajude a manter ferramentas resistentes à censura para coordenação cívica pacífica
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <DonationStatsDisplay />

        {/* Method selector */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1 flex">
            <button
              onClick={() => setSelectedMethod('pix')}
              className={`px-6 py-2 rounded-md font-medium transition-colors flex items-center ${
                selectedMethod === 'pix'
                  ? 'bg-green-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <DevicePhoneMobileIcon className="h-5 w-5 mr-2" />
              PIX
            </button>
            <button
              onClick={() => setSelectedMethod('traditional')}
              className={`px-6 py-2 rounded-md font-medium transition-colors flex items-center ${
                selectedMethod === 'traditional'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <CreditCardIcon className="h-5 w-5 mr-2" />
              Cartão
            </button>
            <button
              onClick={() => setSelectedMethod('crypto')}
              className={`px-6 py-2 rounded-md font-medium transition-colors flex items-center ${
                selectedMethod === 'crypto'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <LockClosedIcon className="h-5 w-5 mr-2" />
              Crypto
            </button>
          </div>
        </div>

        {/* Monthly toggle */}
        {(selectedMethod === 'pix' || selectedMethod === 'traditional') && (
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1 flex">
              <button
                onClick={() => setIsMonthly(true)}
                className={`px-6 py-2 rounded-md font-medium transition-colors flex items-center ${
                  isMonthly
                    ? 'bg-green-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <ArrowPathIcon className="h-5 w-5 mr-2" />
                Mensal
              </button>
              <button
                onClick={() => setIsMonthly(false)}
                className={`px-6 py-2 rounded-md font-medium transition-colors flex items-center ${
                  !isMonthly
                    ? 'bg-green-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <BanknotesIcon className="h-5 w-5 mr-2" />
                Única
              </button>
            </div>
          </div>
        )}

        {/* Stripe payment section - appears immediately after button selection */}
        {selectedMethod === 'traditional' && (
          <div className="mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
              <div className="text-center mb-6">
                <div className="flex justify-center mb-4">
                  <div className="bg-blue-600 p-3 rounded-full">
                    <CreditCardIcon className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-blue-900 mb-2">
                  Pagamento via Stripe
                </h3>
                <p className="text-blue-700">
                  Processamento seguro internacional
                </p>
              </div>

              {/* Amount Selector - Added for better UX */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-blue-200 mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                  Valor do Apoio
                </h4>
                
                {/* Quick tier buttons */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  {DONATION_TIERS.map((tier) => (
                    <button
                      key={tier.id}
                      onClick={() => {
                        setSelectedTier(tier);
                        setCustomAmount(0);
                      }}
                      className={`p-3 rounded-lg border-2 transition-all text-center ${
                        selectedTier?.id === tier.id
                          ? 'border-blue-600 bg-blue-50 text-blue-900'
                          : 'border-gray-200 hover:border-blue-300 text-gray-700'
                      }`}
                    >
                      <div className="text-sm font-medium">R${tier.amount}</div>
                      <div className="text-xs text-gray-500">{tier.name}</div>
                    </button>
                  ))}
                </div>

                {/* Custom amount input */}
                <div className="border-t pt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ou digite um valor personalizado:
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R$</span>
                        <input
                          type="number"
                          min="5"
                          step="5"
                          placeholder="50"
                          className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          onChange={(e) => {
                            const value = Number(e.target.value);
                            if (value >= 5) {
                              setCustomAmount(value);
                              setSelectedTier(null);
                            } else {
                              setCustomAmount(0);
                            }
                          }}
                          value={customAmount > 0 ? customAmount : ''}
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setCustomAmount(0);
                        setSelectedTier(null);
                      }}
                      className="px-3 py-2 text-gray-500 hover:text-gray-700 transition-colors"
                      title="Limpar"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Valor mínimo: R$5
                  </p>
                </div>

                {/* Selected amount display */}
                {(selectedTier || customAmount > 0) && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-900">
                        R${selectedTier ? selectedTier.amount : customAmount}
                      </div>
                      <div className="text-sm text-green-700">
                        {selectedTier ? selectedTier.name : 'Valor Personalizado'} • {isMonthly ? 'Mensal' : 'Único'}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Stripe checkout section */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-blue-200 text-center">
                <div className="mb-4">
                  <svg className="h-8 w-auto mx-auto mb-3" viewBox="0 0 60 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M59.5 12.5c0 6.904-5.596 12.5-12.5 12.5S34.5 19.404 34.5 12.5 40.096 0 47 0s12.5 5.596 12.5 12.5z" fill="#6772e5"/>
                    <path d="M47 9.5c-1.381 0-2.5 1.119-2.5 2.5s1.119 2.5 2.5 2.5 2.5-1.119 2.5-2.5-1.119-2.5-2.5-2.5z" fill="#fff"/>
                    <path d="M47 7c-3.038 0-5.5 2.462-5.5 5.5s2.462 5.5 5.5 5.5 5.5-2.462 5.5-5.5S50.038 7 47 7zm0 9c-1.933 0-3.5-1.567-3.5-3.5S45.067 9 47 9s3.5 1.567 3.5 3.5S48.933 16 47 16z" fill="#fff"/>
                    <path d="M8.9 16.1h2.8v-6.2h-2.8v6.2zm14-6.2h-2.8v6.2h2.8v-3.4c0-1.1.9-2 2-2s2 .9 2 2v3.4h2.8v-3.4c0-2.6-2.1-4.7-4.7-4.7-1.3 0-2.4.5-3.2 1.4v-1.1h.1zm-7 0h-2.8v6.2h2.8v-3.4c0-1.1.9-2 2-2s2 .9 2 2v3.4h2.8v-3.4c0-2.6-2.1-4.7-4.7-4.7-1.3 0-2.4.5-3.2 1.4v-1.1h.1z" fill="#6772e5"/>
                  </svg>
                  <p className="text-sm text-gray-600">
                    Pagamentos processados com segurança via Stripe
                  </p>
                </div>
                
                {selectedTier ? (
                  <StripeCheckout
                    tier={selectedTier}
                    isMonthly={isMonthly}
                    onSuccess={() => setSelectedTier(null)}
                    onError={(error) => console.error('Payment error:', error)}
                  />
                ) : customAmount > 0 ? (
                  <StripeCheckout
                    amount={customAmount}
                    isMonthly={isMonthly}
                    onSuccess={() => setCustomAmount(0)}
                    onError={(error) => console.error('Payment error:', error)}
                  />
                ) : (
                  <div className="text-center">
                    <p className="text-gray-600 mb-4">
                      Selecione um valor acima para processar o pagamento
                    </p>
                    <button
                      className="bg-gray-300 text-gray-500 px-8 py-3 rounded-lg font-semibold cursor-not-allowed flex items-center gap-2 mx-auto"
                      disabled
                    >
                      <CreditCardIcon className="h-5 w-5" />
                      Selecione um valor primeiro
                    </button>
                  </div>
                )}
                
                <p className="text-xs text-gray-500 mt-3">
                  {isMonthly ? 'Cobrança automática mensal' : 'Pagamento único'} • Todos os cartões aceitos
                </p>
              </div>
            </div>
          </div>
        )}

        {selectedMethod === 'pix' || selectedMethod === 'traditional' ? (
          <>
            {/* Donation tiers */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
                Escolha Seu Nível de Apoio
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {DONATION_TIERS.map((tier, index) => (
                  <DonationCard
                    key={tier.id}
                    tier={tier}
                    onDonate={handleDonate}
                    isPopular={index === 1}
                    isMonthly={isMonthly}
                  />
                ))}
              </div>

              {/* Custom amount */}
              <div className="text-center">
                <button
                  onClick={handleCustomDonation}
                  className="bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-900 px-6 py-3 rounded-md font-medium transition-colors flex items-center gap-2 mx-auto"
                >
                  <HeartIcon className="h-5 w-5" />
                  Valor Personalizado
                </button>
              </div>

              {/* Payment method specific sections */}
              {selectedMethod === 'pix' && (
                <div className="mt-12">
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-8 border border-green-200">
                    <div className="text-center mb-6">
                      <div className="flex justify-center mb-4">
                        <div className="bg-green-600 p-3 rounded-full">
                          <DevicePhoneMobileIcon className="h-8 w-8 text-white" />
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold text-green-900 mb-2">
                        Chave PIX para Doações
                      </h3>
                      <p className="text-green-700">
                        Transferência instantânea e segura
                      </p>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-sm border border-green-200">
                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-2">Chave PIX (UUID):</p>
                        <div className="flex items-center justify-center gap-3 mb-4">
                          <code className="text-lg font-mono bg-gray-50 px-3 py-2 rounded border">
                            d271a5b0-4256-4c14-a3cc-0f71f3bf5bce
                          </code>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText('d271a5b0-4256-4c14-a3cc-0f71f3bf5bce');
                              alert('Chave PIX copiada!');
                            }}
                            className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 transition-colors"
                          >
                            Copiar
                          </button>
                        </div>
                        <p className="text-sm text-gray-600">
                          {isMonthly 
                            ? `Para doações mensais de R$5-R$500, use esta chave PIX todos os meses`
                            : `Para doações únicas, transfira qualquer valor via PIX`
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Emergency support */}
              <div className="mt-8 text-center">
                <p className="text-sm text-gray-600 mb-4 flex items-center justify-center gap-2">
                  <HeartIcon className="h-4 w-4 text-green-600" />
                  Para apoio mínimo em situações de emergência:
                </p>
                <button
                  onClick={() => handleDonate({
                    id: 'emergency',
                    name: 'Apoio Emergencial',
                    amount: 1,
                    currency: 'BRL',
                    description: 'Contribuição mínima para manter a plataforma',
                    icon: '💚',
                    benefits: ['Ajuda a manter servidores ativos']
                  }, isMonthly)}
                  className="bg-green-100 hover:bg-green-200 border border-green-300 text-green-800 px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 mx-auto"
                >
                  <HeartIcon className="h-4 w-4" />
                  R$1 - Apoio Emergencial
                </button>
              </div>
            </section>

            {/* Cost breakdown */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 text-center mb-8 flex items-center justify-center gap-2">
                <CurrencyDollarIcon className="h-7 w-7 text-green-600" />
                Para Onde Vai Seu Dinheiro
              </h2>
              
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Custos Mensais</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 flex items-center gap-2">
                          <ServerIcon className="h-5 w-5 text-blue-600" />
                          Hospedagem Internacional
                        </span>
                        <span className="font-medium">R$2.200/mês</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 flex items-center gap-2">
                          <CodeBracketIcon className="h-5 w-5 text-green-600" />
                          Desenvolvedores (3 devs)
                        </span>
                        <span className="font-medium">R$4.500/mês</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 flex items-center gap-2">
                          <ShieldCheckIcon className="h-5 w-5 text-purple-600" />
                          Moderação & Suporte
                        </span>
                        <span className="font-medium">R$2.000/mês</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 flex items-center gap-2">
                          <LockClosedIcon className="h-5 w-5 text-red-600" />
                          Ferramentas de Segurança
                        </span>
                        <span className="font-medium">R$1.200/mês</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 flex items-center gap-2">
                          <GlobeAltIcon className="h-5 w-5 text-blue-600" />
                          Domínios & CDN
                        </span>
                        <span className="font-medium">R$800/mês</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 flex items-center gap-2">
                          <ChartBarIcon className="h-5 w-5 text-yellow-600" />
                          Monitoramento & Analytics
                        </span>
                        <span className="font-medium">R$600/mês</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 flex items-center gap-2">
                          <EnvelopeIcon className="h-5 w-5 text-green-600" />
                          Email & Comunicação
                        </span>
                        <span className="font-medium">R$400/mês</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 flex items-center gap-2">
                          <ScaleIcon className="h-5 w-5 text-gray-600" />
                          Legal & Compliance
                        </span>
                        <span className="font-medium">R$300/mês</span>
                      </div>
                      <div className="border-t pt-3 flex justify-between items-center font-bold">
                        <span className="text-gray-900">Total Mensal</span>
                        <span className="text-red-600">R$12.000/mês</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        * Valores aproximados baseados em custos reais de infraestrutura
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Próximas Metas</h3>
                    <div className="space-y-4">
                      <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-red-900 flex items-center gap-2">
                            <ExclamationTriangleIcon className="h-5 w-5" />
                            Sustentabilidade Mensal
                          </span>
                          <span className="text-sm text-red-700">Déficit: R$8.400</span>
                        </div>
                        <div className="w-full bg-red-200 rounded-full h-2">
                          <div className="bg-red-600 h-2 rounded-full" style={{width: '30%'}}></div>
                        </div>
                        <p className="text-xs text-red-700 mt-2">R$3.600 / R$12.000 mensais</p>
                      </div>
                      
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-blue-900 flex items-center gap-2">
                            <DevicePhoneMobileIcon className="h-5 w-5" />
                            App Mobile
                          </span>
                          <span className="text-sm text-blue-700">Faltam R$15.000</span>
                        </div>
                        <div className="w-full bg-blue-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{width: '25%'}}></div>
                        </div>
                        <p className="text-xs text-blue-700 mt-2">R$5.000 / R$20.000</p>
                      </div>
                      
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-green-900 flex items-center gap-2">
                            <ChatBubbleLeftRightIcon className="h-5 w-5" />
                            Chat Criptografado
                          </span>
                          <span className="text-sm text-green-700">Faltam R$13.000</span>
                        </div>
                        <div className="w-full bg-green-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{width: '10%'}}></div>
                        </div>
                        <p className="text-xs text-green-700 mt-2">R$2.000 / R$15.000</p>
                      </div>
                      
                      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-purple-900 flex items-center gap-2">
                            <ShieldExclamationIcon className="h-5 w-5" />
                            Proteção DDoS Avançada
                          </span>
                          <span className="text-sm text-purple-700">Meta: R$25.000</span>
                        </div>
                        <div className="w-full bg-purple-200 rounded-full h-2">
                          <div className="bg-purple-600 h-2 rounded-full" style={{width: '8%'}}></div>
                        </div>
                        <p className="text-xs text-purple-700 mt-2">R$2.000 / R$25.000</p>
                      </div>
                      
                      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-yellow-900 flex items-center gap-2">
                            <FingerPrintIcon className="h-5 w-5" />
                            Auditoria de Segurança
                          </span>
                          <span className="text-sm text-yellow-700">Meta: R$18.000</span>
                        </div>
                        <div className="w-full bg-yellow-200 rounded-full h-2">
                          <div className="bg-yellow-600 h-2 rounded-full" style={{width: '6%'}}></div>
                        </div>
                        <p className="text-xs text-yellow-700 mt-2">R$1.000 / R$18.000</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Donor recognition */}
            <DonorRecognition />

            {/* Why support */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
                Por Que Seu Apoio Importa
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg p-6 text-center shadow-sm border border-gray-200">
                  <div className="flex justify-center mb-3">
                    <ShieldCheckIcon className="h-12 w-12 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Resistência à Censura</h3>
                  <p className="text-sm text-gray-600">
                    Manter múltiplos servidores e domínios espelho para garantir disponibilidade da plataforma
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-6 text-center shadow-sm border border-gray-200">
                  <div className="flex justify-center mb-3">
                    <LockClosedIcon className="h-12 w-12 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Privacidade & Segurança</h3>
                  <p className="text-sm text-gray-600">
                    Criptografia avançada e ferramentas de privacidade para proteger o anonimato dos usuários
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-6 text-center shadow-sm border border-gray-200">
                  <div className="flex justify-center mb-3">
                    <GlobeAltIcon className="h-12 w-12 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Infraestrutura Global</h3>
                  <p className="text-sm text-gray-600">
                    Rede mundial de servidores para máxima confiabilidade e velocidade
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-6 text-center shadow-sm border border-gray-200">
                  <div className="flex justify-center mb-3">
                    <DevicePhoneMobileIcon className="h-12 w-12 text-indigo-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Desenvolvimento da Plataforma</h3>
                  <p className="text-sm text-gray-600">
                    Melhoria contínua e novos recursos para melhor coordenação
                  </p>
                </div>
              </div>
            </section>
          </>
        ) : (
          <CryptoDonations />
        )}

        {/* Legal & transparency */}
        <section className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center flex items-center justify-center gap-2">
            <BanknotesIcon className="h-6 w-6 text-blue-600" />
            Transparência & Legal
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <ChartBarIcon className="h-5 w-5 text-green-600" />
                Transparência Financeira
              </h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Todas as doações vão diretamente para custos de infraestrutura</li>
                <li>• Relatórios financeiros mensais disponíveis sob solicitação</li>
                <li>• Sem enriquecimento pessoal ou doações políticas</li>
                <li>• Fundos gerenciados pela AlphaFlare Inc. (EUA)</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <ScaleIcon className="h-5 w-5 text-purple-600" />
                Conformidade Legal
              </h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Plataforma opera sob leis americanas e canadenses</li>
                <li>• Sem afiliação política ou endossos</li>
                <li>• Apoia apenas coordenação cívica pacífica</li>
                <li>• Recibos fiscais disponíveis para doações tradicionais</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
              <HeartIcon className="h-4 w-4 text-green-600" />
              Esta plataforma é politicamente neutra e apoia a participação cívica pacífica conforme protegida pelo direito internacional
            </p>
          </div>
        </section>

        {/* Contact */}
        <section className="text-center mt-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Dúvidas Sobre Doações?
          </h2>
          <p className="text-gray-600 mb-4">
            Estamos comprometidos com transparência e gestão responsável de fundos
          </p>
          <div className="space-x-4">
            <a 
              href="mailto:support@civicmobilization.org" 
              className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
            >
              <EnvelopeIcon className="h-4 w-4" />
              Contatar Suporte
            </a>
            <a 
              href="/transparency" 
              className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
            >
              <ChartBarIcon className="h-4 w-4" />
              Ver Relatórios Financeiros
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}