'use client';

import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { CRYPTO_ADDRESSES, CryptoAddress } from '@/types/donations';

export default function CryptoDonations() {
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoAddress>(CRYPTO_ADDRESSES[0]);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    generateQRCode(selectedCrypto.address);
  }, [selectedCrypto]);

  const generateQRCode = async (address: string) => {
    try {
      const url = await QRCode.toDataURL(address, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });
      setQrCodeUrl(url);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
        💰 Crypto Donations
      </h3>
      
      <p className="text-gray-600 text-center mb-6 text-sm">
        Support censorship-resistant infrastructure with cryptocurrency
      </p>

      {/* Crypto selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
        {CRYPTO_ADDRESSES.map((crypto) => (
          <button
            key={crypto.currency}
            onClick={() => setSelectedCrypto(crypto)}
            className={`p-3 rounded-lg border text-center transition-colors ${
              selectedCrypto.currency === crypto.currency
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300 text-gray-700'
            }`}
          >
            <div className="text-lg mb-1">{crypto.icon}</div>
            <div className="text-xs font-medium">{crypto.currency}</div>
          </button>
        ))}
      </div>

      {/* Selected crypto details */}
      <div className="text-center mb-6">
        <h4 className="font-semibold text-gray-900 mb-2">
          {selectedCrypto.icon} {selectedCrypto.name}
          {selectedCrypto.network && (
            <span className="text-sm text-gray-500 ml-2">({selectedCrypto.network})</span>
          )}
        </h4>
        
        {/* QR Code */}
        {qrCodeUrl && (
          <div className="flex justify-center mb-4">
            <img 
              src={qrCodeUrl} 
              alt={`${selectedCrypto.name} QR Code`}
              className="border border-gray-200 rounded-lg"
            />
          </div>
        )}

        {/* Address */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4">
          <p className="text-xs text-gray-600 mb-1">Send to this address:</p>
          <p className="text-sm font-mono text-gray-900 break-all">
            {selectedCrypto.address}
          </p>
        </div>

        {/* Copy button */}
        <button
          onClick={() => copyToClipboard(selectedCrypto.address)}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            copied
              ? 'bg-green-100 text-green-700 border border-green-300'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {copied ? '✓ Copied!' : '📋 Copy Address'}
        </button>
      </div>

      {/* Important notes */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h5 className="font-semibold text-yellow-800 text-sm mb-2">⚠️ Important Notes:</h5>
        <ul className="text-xs text-yellow-700 space-y-1">
          <li>• Only send {selectedCrypto.name} to this address</li>
          {selectedCrypto.network && (
            <li>• Ensure you're using the {selectedCrypto.network} network</li>
          )}
          <li>• Donations are anonymous and non-refundable</li>
          <li>• We cannot provide tax receipts for crypto donations</li>
          <li>• Double-check the address before sending</li>
        </ul>
      </div>

      {/* Privacy note */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          🔒 Your donation is completely anonymous. We only track total amounts, not individual transactions.
        </p>
      </div>
    </div>
  );
}