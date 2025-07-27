'use client';

import { useState } from 'react';
import { 
  MegaphoneIcon, 
  CloudIcon, 
  MapPinIcon, 
  ClockIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  PaperAirplaneIcon,
  PhotoIcon,
  VideoCameraIcon
} from '@heroicons/react/24/outline';
import { LiveUpdate } from './LiveEventUpdates';

interface OrganizerUpdatePanelProps {
  protestId: string;
  organizerName: string;
  onUpdatePosted?: (update: Omit<LiveUpdate, 'id' | 'timestamp'>) => void;
  className?: string;
}

export default function OrganizerUpdatePanel({ 
  protestId, 
  organizerName, 
  onUpdatePosted,
  className = '' 
}: OrganizerUpdatePanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [updateType, setUpdateType] = useState<LiveUpdate['type']>('announcement');
  const [severity, setSeverity] = useState<LiveUpdate['severity']>('medium');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [location, setLocation] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  const updateTypes = [
    { value: 'announcement', label: 'Anúncio Geral', icon: MegaphoneIcon, color: 'blue' },
    { value: 'weather', label: 'Clima', icon: CloudIcon, color: 'cyan' },
    { value: 'route_change', label: 'Mudança de Rota', icon: MapPinIcon, color: 'purple' },
    { value: 'delay', label: 'Atraso', icon: ClockIcon, color: 'orange' },
    { value: 'safety', label: 'Segurança', icon: ExclamationTriangleIcon, color: 'red' },
    { value: 'info', label: 'Informação', icon: InformationCircleIcon, color: 'gray' }
  ] as const;

  const severityOptions = [
    { value: 'low', label: 'Baixa', color: 'green', description: 'Informação geral' },
    { value: 'medium', label: 'Média', color: 'blue', description: 'Informação importante' },
    { value: 'high', label: 'Alta', color: 'orange', description: 'Requer atenção' },
    { value: 'critical', label: 'Crítica', color: 'red', description: 'Urgente' }
  ] as const;

  const quickMessages = [
    { type: 'announcement', title: 'Concentração Iniciada', message: 'Manifestantes começaram a se concentrar no local. Ambiente pacífico e ordeiro.' },
    { type: 'announcement', title: 'Caminhada Iniciada', message: 'A caminhada pacífica foi iniciada conforme programado.' },
    { type: 'safety', title: 'Orientações de Segurança', message: 'Mantenham-se hidratados, sigam as orientações dos coordenadores e lembrem-se: manifestação 100% pacífica.' },
    { type: 'route_change', title: 'Desvio de Rota', message: 'Por orientação das autoridades, a rota foi alterada. Sigam os coordenadores.' },
    { type: 'announcement', title: 'Encerramento', message: 'A manifestação foi encerrada com sucesso. Obrigado a todos os participantes!' }
  ];

  const handleQuickMessage = (quick: typeof quickMessages[0]) => {
    setUpdateType(quick.type as LiveUpdate['type']);
    setTitle(quick.title);
    setMessage(quick.message);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !message.trim()) {
      alert('Por favor, preencha o título e a mensagem');
      return;
    }

    setIsPosting(true);

    try {
      const newUpdate: Omit<LiveUpdate, 'id' | 'timestamp'> = {
        type: updateType,
        title: title.trim(),
        message: message.trim(),
        severity,
        location: location.trim() || undefined,
        organizer: organizerName
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      onUpdatePosted?.(newUpdate);

      // Reset form
      setTitle('');
      setMessage('');
      setLocation('');
      setUpdateType('announcement');
      setSeverity('medium');
      
      alert('✅ Atualização enviada com sucesso!');
      setIsOpen(false);

    } catch (error) {
      alert('❌ Erro ao enviar atualização. Tente novamente.');
    } finally {
      setIsPosting(false);
    }
  };

  const getTypeColor = (type: string) => {
    const typeConfig = updateTypes.find(t => t.value === type);
    return typeConfig?.color || 'gray';
  };

  const getSeverityColor = (sev: string) => {
    const severityConfig = severityOptions.find(s => s.value === sev);
    return severityConfig?.color || 'gray';
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2 ${className}`}
      >
        <MegaphoneIcon className="h-5 w-5" />
        Postar Atualização
      </button>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-lg border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MegaphoneIcon className="h-6 w-6" />
            <div>
              <h3 className="text-lg font-bold">Postar Atualização</h3>
              <p className="text-sm text-blue-100">
                Envie informações em tempo real para os participantes
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white/80 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Quick Messages */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Mensagens Rápidas:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {quickMessages.map((quick, index) => (
              <button
                key={index}
                onClick={() => handleQuickMessage(quick)}
                className="text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
              >
                <p className="font-medium text-gray-900 text-sm">{quick.title}</p>
                <p className="text-xs text-gray-600 truncate">{quick.message}</p>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Update Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Tipo de Atualização
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {updateTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = updateType === type.value;
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setUpdateType(type.value)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      isSelected
                        ? `border-${type.color}-500 bg-${type.color}-50 text-${type.color}-700`
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    <Icon className="h-5 w-5 mx-auto mb-1" />
                    <span className="text-xs font-medium">{type.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Severity */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Prioridade
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {severityOptions.map((sev) => {
                const isSelected = severity === sev.value;
                return (
                  <button
                    key={sev.value}
                    type="button"
                    onClick={() => setSeverity(sev.value)}
                    className={`p-3 rounded-lg border-2 text-center transition-all ${
                      isSelected
                        ? `border-${sev.color}-500 bg-${sev.color}-50 text-${sev.color}-700`
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    <div className="text-sm font-medium">{sev.label}</div>
                    <div className="text-xs opacity-75">{sev.description}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
              Título da Atualização
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Concentração iniciada na Praça da Sé"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={100}
            />
            <div className="text-xs text-gray-500 mt-1">
              {title.length}/100 caracteres
            </div>
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
              Mensagem
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Descreva a atualização de forma clara e objetiva..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              maxLength={500}
            />
            <div className="text-xs text-gray-500 mt-1">
              {message.length}/500 caracteres
            </div>
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-2">
              Localização (Opcional)
            </label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ex: Praça da Sé, São Paulo"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={100}
            />
          </div>

          {/* Media Upload (Future Feature) */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Mídia (Em Breve)</h4>
            <div className="flex gap-2">
              <button
                type="button"
                disabled
                className="flex items-center gap-2 px-3 py-2 bg-gray-200 text-gray-500 rounded-lg cursor-not-allowed"
              >
                <PhotoIcon className="h-4 w-4" />
                Foto
              </button>
              <button
                type="button"
                disabled
                className="flex items-center gap-2 px-3 py-2 bg-gray-200 text-gray-500 rounded-lg cursor-not-allowed"
              >
                <VideoCameraIcon className="h-4 w-4" />
                Vídeo
              </button>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isPosting || !title.trim() || !message.trim()}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {isPosting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Enviando...
                </>
              ) : (
                <>
                  <PaperAirplaneIcon className="h-5 w-5" />
                  Publicar Atualização
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>

        {/* Guidelines */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">📋 Diretrizes para Atualizações</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Mantenha as mensagens claras e objetivas</li>
            <li>• Use informações verificadas e precisas</li>
            <li>• Priorize a segurança dos participantes</li>
            <li>• Sempre promova a natureza pacífica do evento</li>
            <li>• Evite informações desnecessárias ou alarmistas</li>
          </ul>
        </div>
      </div>
    </div>
  );
}