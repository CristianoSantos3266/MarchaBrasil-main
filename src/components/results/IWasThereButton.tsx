'use client';

import { useState, useEffect } from 'react';
import { ParticipantType } from '@/types';

interface IWasThereButtonProps {
  protestId: string;
  currentCount: number;
  onVerify: (participantType: ParticipantType) => void;
}

export default function IWasThereButton({ protestId, currentCount, onVerify }: IWasThereButtonProps) {
  const [hasVerified, setHasVerified] = useState(false);
  const [showTypeSelector, setShowTypeSelector] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Check if user has already verified for this protest
    const verificationKey = `verified_${protestId}`;
    const existingVerification = localStorage.getItem(verificationKey);
    if (existingVerification) {
      setHasVerified(true);
    }
  }, [protestId]);

  const handleVerify = async (participantType: ParticipantType) => {
    setIsSubmitting(true);
    
    try {
      // Store verification locally to prevent double-voting
      const verificationKey = `verified_${protestId}`;
      const verificationData = {
        timestamp: new Date().toISOString(),
        participantType,
        protestId
      };
      
      localStorage.setItem(verificationKey, JSON.stringify(verificationData));
      
      // Submit verification
      onVerify(participantType);
      
      setHasVerified(true);
      setShowTypeSelector(false);
      
      // Show success message
      const participantLabels = {
        caminhoneiro: 'Caminhoneiro',
        motociclista: 'Motociclista',
        carro: 'Motorista',
        produtor_rural: 'Produtor Rural',
        comerciante: 'Comerciante',
        populacao_geral: 'Cidadão'
      };
      
      alert(`✅ Verificação confirmada como ${participantLabels[participantType]}!`);
      
    } catch (error) {
      console.error('Verification failed:', error);
      alert('Erro ao verificar presença. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const participantOptions = [
    { value: 'caminhoneiro', label: '🚛 Caminhoneiro', color: 'bg-red-100 text-red-800' },
    { value: 'motociclista', label: '🏍️ Motociclista', color: 'bg-blue-100 text-blue-800' },
    { value: 'carro', label: '🚗 Motorista', color: 'bg-green-100 text-green-800' },
    { value: 'produtor_rural', label: '🌾 Produtor Rural', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'comerciante', label: '🛍️ Comerciante', color: 'bg-purple-100 text-purple-800' },
    { value: 'populacao_geral', label: '👥 Cidadão', color: 'bg-gray-100 text-gray-800' }
  ];

  if (hasVerified) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="text-2xl">✅</div>
          <div>
            <h3 className="font-semibold text-green-800">Presença Verificada</h3>
            <p className="text-sm text-green-700">
              Obrigado por confirmar sua participação!
            </p>
          </div>
        </div>
        <div className="mt-3 text-center">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            👥 {currentCount.toLocaleString()} verificações
          </span>
        </div>
      </div>
    );
  }

  if (showTypeSelector) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-3">
          Como você participou do protesto?
        </h3>
        
        <div className="grid grid-cols-2 gap-2 mb-4">
          {participantOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleVerify(option.value as ParticipantType)}
              disabled={isSubmitting}
              className={`p-3 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 hover:opacity-80 ${option.color}`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowTypeSelector(false)}
            className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50"
          >
            Cancelar
          </button>
        </div>

        <div className="mt-3 text-xs text-gray-500">
          <p>
            🔒 Sua verificação é anônima e ajuda a documentar a participação real no evento.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="text-center mb-4">
        <h3 className="font-semibold text-gray-900 mb-2">
          ✋ Você esteve presente neste protesto?
        </h3>
        <p className="text-sm text-gray-600">
          Ajude a documentar a participação real confirmando sua presença
        </p>
      </div>

      <div className="mb-4 text-center">
        <span className="inline-flex items-center px-4 py-2 rounded-full text-lg font-bold bg-blue-100 text-blue-800">
          👥 {currentCount.toLocaleString()} verificações
        </span>
      </div>

      <button
        onClick={() => setShowTypeSelector(true)}
        className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
      >
        ✋ Eu Estive Presente
      </button>

      <div className="mt-3 text-xs text-gray-500 text-center">
        <p>
          Esta verificação é anônima e ajuda a medir a participação real no evento. 
          Apenas uma verificação por pessoa.
        </p>
      </div>
    </div>
  );
}