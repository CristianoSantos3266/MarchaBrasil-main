'use client';

import { useState } from 'react';
import { ParticipantType, ConvoyJoinLocation } from '@/types';

interface RSVPModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (participantType: ParticipantType, joinLocation?: ConvoyJoinLocation) => void;
  protestTitle: string;
  isConvoy?: boolean;
}

const participantOptions = [
  { value: 'caminhoneiro', label: '🚛 Caminhoneiro', description: 'Motorista de caminhão' },
  { value: 'motociclista', label: '🏍️ Motociclista', description: 'Piloto de motocicleta' },
  { value: 'carro', label: '🚗 Carro Particular', description: 'Motorista de veículo particular' },
  { value: 'produtor_rural', label: '🌾 Produtor Rural', description: 'Agricultor ou pecuarista' },
  { value: 'comerciante', label: '🛍️ Comerciante', description: 'Empresário ou comerciante' },
  { value: 'populacao_geral', label: '👥 População Geral', description: 'Cidadão comum' }
];

const joinLocationOptions = [
  { value: 'inicio', label: 'Desde o início', description: 'Participar desde o ponto de partida' },
  { value: 'rota', label: 'Durante o percurso', description: 'Juntar-se na rota' },
  { value: 'destino', label: 'Apenas no destino', description: 'Aguardar no ponto final' }
];

export default function RSVPModal({ isOpen, onClose, onSubmit, protestTitle, isConvoy = false }: RSVPModalProps) {
  const [selectedType, setSelectedType] = useState<ParticipantType>('populacao_geral');
  const [selectedJoinLocation, setSelectedJoinLocation] = useState<ConvoyJoinLocation>('inicio');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(selectedType, isConvoy ? selectedJoinLocation : undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold text-gray-900">Confirmar Presença</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          <p className="text-gray-600 mb-6">
            Confirmando presença em: <strong>{protestTitle}</strong>
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Como você participará?
              </label>
              <div className="space-y-2">
                {participantOptions.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-start p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <input
                      type="radio"
                      name="participantType"
                      value={option.value}
                      checked={selectedType === option.value}
                      onChange={(e) => setSelectedType(e.target.value as ParticipantType)}
                      className="mt-1 mr-3"
                    />
                    <div>
                      <div className="font-medium text-gray-900">{option.label}</div>
                      <div className="text-sm text-gray-600">{option.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {isConvoy && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Onde você se juntará à carreata/motociata?
                </label>
                <div className="space-y-2">
                  {joinLocationOptions.map((option) => (
                    <label
                      key={option.value}
                      className="flex items-start p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <input
                        type="radio"
                        name="joinLocation"
                        value={option.value}
                        checked={selectedJoinLocation === option.value}
                        onChange={(e) => setSelectedJoinLocation(e.target.value as ConvoyJoinLocation)}
                        className="mt-1 mr-3"
                      />
                      <div>
                        <div className="font-medium text-gray-900">{option.label}</div>
                        <div className="text-sm text-gray-600">{option.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Importante:</strong> Suas informações são anônimas. Não coletamos dados pessoais.
                Esta confirmação é apenas para organização e contagem de participantes.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Confirmar Presença
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}