'use client';

import { useState } from 'react';
import { ParticipantType, ConvoyJoinLocation } from '@/types';
import { getRelevantParticipantTypes, PARTICIPANT_TYPE_LABELS, PARTICIPANT_TYPE_ICONS, RSVP_TO_PARTICIPANT_TYPE } from '@/lib/event-participants';
import { ShieldCheckIcon, EyeSlashIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';

interface RSVPModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (participantType: ParticipantType, joinLocation?: ConvoyJoinLocation, verification?: { email?: string; phone?: string }) => void;
  protestTitle: string;
  protestType?: string;
  isConvoy?: boolean;
}

// Participant options will be generated dynamically based on event type

const joinLocationOptions = [
  { value: 'inicio', label: 'Desde o início', description: 'Participar desde o ponto de partida' },
  { value: 'rota', label: 'Durante o percurso', description: 'Juntar-se na rota' },
  { value: 'destino', label: 'Apenas no destino', description: 'Aguardar no ponto final' }
];

export default function RSVPModal({ isOpen, onClose, onSubmit, protestTitle, protestType = 'manifestacao', isConvoy = false }: RSVPModalProps) {
  // Get relevant participant types for this protest type
  const relevantParticipantTypes = getRelevantParticipantTypes(protestType);
  
  // Generate participant options based on relevant types (convert RSVP keys to ParticipantType)
  const participantOptions = relevantParticipantTypes.map(rsvpKey => {
    const participantType = RSVP_TO_PARTICIPANT_TYPE[rsvpKey];
    return {
      value: participantType,
      label: `${PARTICIPANT_TYPE_ICONS[rsvpKey]} ${PARTICIPANT_TYPE_LABELS[rsvpKey]}`,
      description: PARTICIPANT_TYPE_LABELS[rsvpKey]
    };
  });
  
  const [selectedType, setSelectedType] = useState<ParticipantType>(
    relevantParticipantTypes.length > 0 
      ? RSVP_TO_PARTICIPANT_TYPE[relevantParticipantTypes[0]] as ParticipantType 
      : 'populacao_geral'
  );
  const [selectedJoinLocation, setSelectedJoinLocation] = useState<ConvoyJoinLocation>('inicio');
  const [wantsVerification, setWantsVerification] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const verification = wantsVerification ? { email: email || undefined, phone: phone || undefined } : undefined;
    onSubmit(selectedType, isConvoy ? selectedJoinLocation : undefined, verification);
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

            {/* Verification Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <EyeSlashIcon className="h-6 w-6 text-blue-600" />
                  <div>
                    <h3 className="font-medium text-blue-900">Apoio Anônimo</h3>
                    <p className="text-sm text-blue-700">Confirmação rápida e privada</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setWantsVerification(false)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    !wantsVerification
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-blue-600 border border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  Escolher
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <ShieldCheckIcon className="h-6 w-6 text-green-600" />
                  <div>
                    <h3 className="font-medium text-green-900">Patriota Verificado</h3>
                    <p className="text-sm text-green-700">Dados confiáveis + benefícios extras</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setWantsVerification(true)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    wantsVerification
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-green-600 border border-green-300 hover:bg-green-50'
                  }`}
                >
                  Escolher
                </button>
              </div>

              {wantsVerification && (
                <div className="p-4 bg-gray-50 rounded-lg space-y-4">
                  <p className="text-sm text-gray-700 font-medium">
                    Opcional: Forneça pelo menos um contato para se tornar um Patriota Verificado
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <EnvelopeIcon className="h-4 w-4 inline mr-2" />
                        Email (opcional)
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="seu@email.com"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <PhoneIcon className="h-4 w-4 inline mr-2" />
                        WhatsApp (opcional)
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="(11) 99999-9999"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>
                  
                  <div className="bg-green-100 border border-green-300 rounded p-3">
                    <p className="text-xs text-green-800">
                      🛡️ <strong>Benefícios do Patriota Verificado:</strong><br/>
                      • Suas confirmações contam mais para estatísticas oficiais<br/>
                      • Notificações sobre eventos próximos (opcional)<br/>
                      • Badge de "Patriota Verificado" em rankings<br/>
                      • Ajuda a combater bots e inflação artificial
                    </p>
                  </div>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>🔒 Privacidade Garantida:</strong> Não rastreamos. Não vendemos dados. 
                  Seus dados ficam criptografados e são usados apenas para contagem e notificações opcionais.
                </p>
              </div>
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
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                {wantsVerification ? (
                  <>
                    <ShieldCheckIcon className="h-4 w-4" />
                    Confirmar como Patriota Verificado
                  </>
                ) : (
                  <>
                    <EyeSlashIcon className="h-4 w-4" />
                    Confirmar Anonimamente
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}