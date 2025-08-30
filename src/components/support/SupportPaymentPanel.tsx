'use client';

import { useState } from 'react';
import { CreditCardIcon, DevicePhoneMobileIcon } from '@heroicons/react/24/outline';
import CryptoDonations from '@/components/support/CryptoDonations';

export default function SupportPaymentPanel() {
  const [activeTab, setActiveTab] = useState<'pix' | 'card' | 'crypto'>('pix');
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');

  const presetAmounts = [10, 25, 50, 100];

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setSelectedAmount(null);
  };

  const getSelectedAmount = () => {
    return selectedAmount || (customAmount ? parseFloat(customAmount) : 0);
  };

  const copyPixKey = () => {
    navigator.clipboard.writeText('d271a5b0-4256-4c14-a3cc-0f71f3bf5bce');
    alert('Chave PIX copiada para a área de transferência!');
  };

  const handleStripePayment = async () => {
    if (!finalAmount || finalAmount < 5) {
      alert('Por favor, selecione um valor mínimo de R$ 5');
      return;
    }

    try {
      // Create Stripe checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: finalAmount,
          currency: 'brl',
          description: `Apoio à Marcha Brasil - R$ ${finalAmount}`,
        }),
      });

      const { url } = await response.json();
      
      if (url) {
        // Redirect to Stripe checkout
        window.location.href = url;
      } else {
        throw new Error('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Erro ao processar pagamento. Tente novamente.');
    }
  };

  const finalAmount = getSelectedAmount();

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <div className="flex">
          <button
            onClick={() => setActiveTab('pix')}
            className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
              activeTab === 'pix'
                ? 'bg-green-600 text-white border-b-2 border-green-600'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <DevicePhoneMobileIcon className="h-5 w-5 mx-auto mb-1" />
            PIX
          </button>
          <button
            onClick={() => setActiveTab('card')}
            className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
              activeTab === 'card'
                ? 'bg-blue-600 text-white border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <CreditCardIcon className="h-5 w-5 mx-auto mb-1" />
            Cartão
          </button>
          <button
            onClick={() => setActiveTab('crypto')}
            className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
              activeTab === 'crypto'
                ? 'bg-purple-600 text-white border-b-2 border-purple-600'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            ₿ Crypto
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Amount Selection */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            Escolha o valor do seu apoio
          </h3>
          
          {/* Preset amounts */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {presetAmounts.map((amount) => (
              <button
                key={amount}
                onClick={() => handleAmountSelect(amount)}
                className={`p-4 rounded-lg border-2 transition-all text-center ${
                  selectedAmount === amount
                    ? 'border-green-600 bg-green-50 text-green-900'
                    : 'border-gray-200 hover:border-green-300 text-gray-700'
                }`}
              >
                <div className="text-lg font-bold">R$ {amount}</div>
                <div className="text-xs text-gray-500">
                  {amount === 10 ? 'Básico' : 
                   amount === 25 ? 'Popular' : 
                   amount === 50 ? 'Generoso' : 'Defensor'}
                </div>
              </button>
            ))}
          </div>

          {/* Custom amount */}
          <div className="border-t pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ou digite um valor personalizado:
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R$</span>
              <input
                type="number"
                min="5"
                step="5"
                placeholder="25"
                value={customAmount}
                onChange={(e) => handleCustomAmountChange(e.target.value)}
                className="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Valor mínimo: R$ 5</p>
          </div>
        </div>

        {/* Payment Method Content */}
        {activeTab === 'pix' && (
          <div className="bg-green-50 rounded-xl p-6 border border-green-200">
            <div className="text-center mb-6">
              <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <DevicePhoneMobileIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-green-900">Pagamento via PIX</h3>
              <p className="text-green-700">Transferência instantânea e segura</p>
            </div>

            <div className="bg-white rounded-lg p-4 border border-green-200">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Chave PIX (UUID):</p>
                <div className="flex items-center gap-2 justify-center mb-4">
                  <code className="bg-gray-100 px-3 py-2 rounded border text-sm font-mono">
                    d271a5b0-4256-4c14-a3cc-0f71f3bf5bce
                  </code>
                  <button
                    onClick={copyPixKey}
                    className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 text-sm"
                  >
                    Copiar
                  </button>
                </div>
                {finalAmount > 0 && (
                  <div className="bg-green-100 rounded-lg p-3">
                    <p className="font-bold text-green-900">Valor: R$ {finalAmount}</p>
                    <p className="text-sm text-green-700">Use a chave PIX acima para transferir</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'card' && (
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
            <div className="text-center mb-6">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCardIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-blue-900">Pagamento com Cartão</h3>
              <p className="text-blue-700">Processamento seguro via Stripe</p>
            </div>

            {finalAmount > 0 ? (
              <div className="bg-white rounded-lg p-6 border border-blue-200">
                <div className="text-center mb-4">
                  <div className="text-2xl font-bold text-blue-900">R$ {finalAmount}</div>
                  <p className="text-blue-700">Pagamento único</p>
                </div>
                <button 
                  onClick={handleStripePayment}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <CreditCardIcon className="h-5 w-5" />
                  Pagar com Cartão
                </button>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Visa, Mastercard, American Express aceitos
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-lg p-6 border border-blue-200 text-center">
                <p className="text-gray-600 mb-4">Selecione um valor acima para continuar</p>
                <button
                  disabled
                  className="w-full bg-gray-300 text-gray-500 font-bold py-3 px-6 rounded-lg cursor-not-allowed"
                >
                  Selecione um valor primeiro
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'crypto' && <CryptoDonations />}
      </div>
    </div>
  );
}