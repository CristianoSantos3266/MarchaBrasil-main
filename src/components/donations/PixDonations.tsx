'use client';

import { useState } from 'react';
import { 
  DevicePhoneMobileIcon,
  ClipboardDocumentIcon,
  QrCodeIcon,
  CheckIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';

interface PixDonationsProps {
  amount?: number;
  isMonthly?: boolean;
}

export default function PixDonations({ amount, isMonthly = false }: PixDonationsProps) {
  const [copiedPix, setCopiedPix] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(amount || 0);
  const [customAmount, setCustomAmount] = useState('');

  // Mock PIX key for demonstration
  const pixKey = "marcha.brasil@email.com";
  
  const presetAmounts = [5, 15, 50, 100, 250, 500];

  const copyPixKey = async () => {
    try {
      await navigator.clipboard.writeText(pixKey);
      setCopiedPix(true);
      setTimeout(() => setCopiedPix(false), 2000);
    } catch (err) {
      console.error('Failed to copy PIX key:', err);
    }
  };

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomAmount(value);
    if (value && !isNaN(Number(value))) {
      setSelectedAmount(Number(value));
    }
  };

  const generatePixPayment = () => {
    if (selectedAmount <= 0) {
      alert('Por favor, selecione um valor válido para doação');
      return;
    }

    const type = isMonthly ? 'mensal' : 'única';
    alert(`PIX de R$${selectedAmount} ${type} será processado. Chave PIX: ${pixKey}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="bg-green-100 p-4 rounded-full">
            <DevicePhoneMobileIcon className="h-12 w-12 text-green-600" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Doação via PIX
        </h3>
        <p className="text-gray-600">
          Pagamento instantâneo e seguro com PIX
        </p>
      </div>

      {/* Amount selection */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Selecione o valor</h4>
        
        <div className="grid grid-cols-3 gap-3 mb-4">
          {presetAmounts.map((amount) => (
            <button
              key={amount}
              onClick={() => handleAmountSelect(amount)}
              className={`p-3 rounded-lg border-2 transition-colors text-center ${
                selectedAmount === amount
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-200 hover:border-green-300 text-gray-700'
              }`}
            >
              <BanknotesIcon className="h-5 w-5 mx-auto mb-1" />
              <span className="font-semibold">R${amount}</span>
            </button>
          ))}
        </div>

        {/* Custom amount */}
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700">Valor personalizado:</label>
          <div className="flex items-center">
            <span className="text-gray-500 mr-1">R$</span>
            <input
              type="number"
              value={customAmount}
              onChange={handleCustomAmountChange}
              placeholder="0,00"
              className="border border-gray-300 rounded px-3 py-2 w-24 focus:outline-none focus:ring-2 focus:ring-green-500"
              min="1"
              step="0.01"
            />
          </div>
        </div>
      </div>

      {/* PIX key */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Chave PIX</h4>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">Chave PIX (Email):</p>
              <p className="font-mono text-lg text-gray-900 break-all">{pixKey}</p>
            </div>
            <button
              onClick={copyPixKey}
              className={`ml-4 p-2 rounded-lg transition-colors ${
                copiedPix 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {copiedPix ? (
                <CheckIcon className="h-5 w-5" />
              ) : (
                <ClipboardDocumentIcon className="h-5 w-5" />
              )}
            </button>
          </div>
          
          <div className="text-center">
            <button
              onClick={copyPixKey}
              className={`text-sm font-medium ${
                copiedPix 
                  ? 'text-green-600' 
                  : 'text-blue-600 hover:text-blue-800'
              }`}
            >
              {copiedPix ? '✓ Copiado!' : 'Copiar chave PIX'}
            </button>
          </div>
        </div>
      </div>

      {/* Payment instructions */}
      <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-blue-900 mb-3">
          Como fazer a doação via PIX
        </h4>
        <ol className="text-sm text-blue-800 space-y-2">
          <li><strong>1.</strong> Abra o app do seu banco ou carteira digital</li>
          <li><strong>2.</strong> Escolha a opção PIX</li>
          <li><strong>3.</strong> Cole a chave PIX copiada acima</li>
          <li><strong>4.</strong> Digite o valor: <strong>R${selectedAmount > 0 ? selectedAmount.toFixed(2) : '0,00'}</strong></li>
          <li><strong>5.</strong> Confirme o pagamento</li>
        </ol>
        
        {isMonthly && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-xs text-yellow-800">
              <strong>Nota:</strong> Para doações mensais, você precisará repetir este processo mensalmente. 
              Em breve teremos PIX recorrente automático.
            </p>
          </div>
        )}
      </div>

      {/* Generate payment button */}
      <div className="text-center">
        <button
          onClick={generatePixPayment}
          disabled={selectedAmount <= 0}
          className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center mx-auto"
        >
          <DevicePhoneMobileIcon className="h-5 w-5 mr-2" />
          {selectedAmount > 0 
            ? `Doar R$${selectedAmount.toFixed(2)} via PIX`
            : 'Selecione um valor'
          }
        </button>
        
        <p className="text-xs text-gray-500 mt-3">
          Doação {isMonthly ? 'mensal' : 'única'} • Processamento instantâneo
        </p>
      </div>
    </div>
  );
}