'use client';

import { useState } from 'react';
import { AnonymousTestimonial, ParticipantType } from '@/types';

interface TestimonialFormProps {
  protestId: string;
  onSubmit: (testimonial: Omit<AnonymousTestimonial, 'id' | 'timestamp' | 'status' | 'upvotes' | 'reportedCount'>) => void;
}

export default function TestimonialForm({ protestId, onSubmit }: TestimonialFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    content: '',
    participantType: 'populacao_geral' as ParticipantType,
    location: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const maxChars = 500;

  const participantOptions = [
    { value: 'caminhoneiro', label: '🚛 Caminhoneiro' },
    { value: 'motociclista', label: '🏍️ Motociclista' },
    { value: 'carro', label: '🚗 Motorista' },
    { value: 'produtor_rural', label: '🌾 Produtor Rural' },
    { value: 'comerciante', label: '🛍️ Comerciante' },
    { value: 'populacao_geral', label: '👥 Cidadão' }
  ];

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value;
    if (content.length <= maxChars) {
      setFormData(prev => ({ ...prev, content }));
      setCharCount(content.length);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.content.trim().length < 10) {
      alert('O testemunho deve ter pelo menos 10 caracteres.');
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({
        content: formData.content.trim(),
        participantType: formData.participantType,
        location: formData.location.trim() || undefined
      });

      // Reset form
      setFormData({
        content: '',
        participantType: 'populacao_geral',
        location: ''
      });
      setCharCount(0);
      setIsOpen(false);

      alert('✅ Testemunho enviado! Será revisado antes da publicação.');

    } catch (error) {
      console.error('Failed to submit testimonial:', error);
      alert('Erro ao enviar testemunho. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="text-center">
          <h3 className="font-semibold text-gray-900 mb-2">
            💬 Compartilhe sua Experiência
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Conte como foi participar deste protesto e inspire outros cidadãos
          </p>
          <button
            onClick={() => setIsOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            ✍️ Escrever Testemunho
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-900">
          💬 Escrever Testemunho Anônimo
        </h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Participant type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Como você participou?
          </label>
          <div className="grid grid-cols-2 gap-2">
            {participantOptions.map((option) => (
              <label
                key={option.value}
                className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <input
                  type="radio"
                  name="participantType"
                  value={option.value}
                  checked={formData.participantType === option.value}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    participantType: e.target.value as ParticipantType 
                  }))}
                  className="mr-2"
                />
                <span className="text-sm">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Location (optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Região (opcional)
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            placeholder="Ex: Centro da cidade, Zona Sul..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Área geral apenas - não forneça endereços específicos
          </p>
        </div>

        {/* Testimonial content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Seu Testemunho *
          </label>
          <textarea
            value={formData.content}
            onChange={handleContentChange}
            placeholder="Conte sua experiência: Como foi participar? O que você sentiu? Qual foi o impacto para você? Por que é importante participar de protestos pacíficos?"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={6}
            required
          />
          <div className="flex justify-between text-xs mt-1">
            <span className="text-gray-500">Mínimo 10 caracteres</span>
            <span className={`${charCount > maxChars * 0.9 ? 'text-red-600' : 'text-gray-500'}`}>
              {charCount}/{maxChars}
            </span>
          </div>
        </div>

        {/* Guidelines */}
        <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
          <h4 className="font-semibold text-yellow-800 text-sm mb-2">📝 Diretrizes:</h4>
          <ul className="text-xs text-yellow-700 space-y-1">
            <li>• Mantenha o foco na experiência pessoal e pacífica</li>
            <li>• Evite nomes de pessoas ou informações identificáveis</li>
            <li>• Não inclua conteúdo violento ou ofensivo</li>
            <li>• Seja respeitoso com diferentes pontos de vista</li>
            <li>• Testemunhos são revisados antes da publicação</li>
          </ul>
        </div>

        {/* Privacy notice */}
        <div className="bg-blue-50 border border-blue-200 rounded p-3">
          <p className="text-xs text-blue-800">
            🔒 <strong>Privacidade:</strong> Seu testemunho é completamente anônimo. 
            Não coletamos dados pessoais e não há como rastrear a autoria.
          </p>
        </div>

        {/* Submit */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting || formData.content.trim().length < 10}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Enviando...' : 'Enviar Testemunho'}
          </button>
        </div>
      </form>
    </div>
  );
}