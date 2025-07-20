'use client';

import { useState } from 'react';
import { AnonymousTestimonial } from '@/types';

interface TestimonialsListProps {
  testimonials: AnonymousTestimonial[];
  onUpvote: (testimonialId: string) => void;
  onReport: (testimonialId: string) => void;
}

export default function TestimonialsList({ testimonials, onUpvote, onReport }: TestimonialsListProps) {
  const [reportedItems, setReportedItems] = useState<Set<string>>(new Set());
  const [upvotedItems, setUpvotedItems] = useState<Set<string>>(new Set());

  const approvedTestimonials = testimonials.filter(t => t.status === 'approved');

  const participantIcons = {
    caminhoneiro: '🚛',
    motociclista: '🏍️',
    carro: '🚗',
    produtor_rural: '🌾',
    comerciante: '🛍️',
    populacao_geral: '👥'
  };

  const participantLabels = {
    caminhoneiro: 'Caminhoneiro',
    motociclista: 'Motociclista',
    carro: 'Motorista',
    produtor_rural: 'Produtor Rural',
    comerciante: 'Comerciante',
    populacao_geral: 'Cidadão'
  };

  const handleUpvote = (testimonialId: string) => {
    if (upvotedItems.has(testimonialId)) return;
    
    setUpvotedItems(prev => new Set([...prev, testimonialId]));
    onUpvote(testimonialId);
  };

  const handleReport = (testimonialId: string) => {
    if (reportedItems.has(testimonialId)) return;
    
    if (confirm('Reportar este testemunho por conteúdo inadequado?')) {
      setReportedItems(prev => new Set([...prev, testimonialId]));
      onReport(testimonialId);
      alert('Testemunho reportado. Será revisado pelos moderadores.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString));
  };

  if (approvedTestimonials.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <div className="text-4xl mb-4">💬</div>
        <h3 className="font-semibold text-gray-900 mb-2">Nenhum testemunho ainda</h3>
        <p className="text-gray-600 text-sm">
          Seja o primeiro a compartilhar sua experiência neste protesto!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-900 mb-4">
        💬 Testemunhos da Comunidade ({approvedTestimonials.length})
      </h3>
      
      {approvedTestimonials.map((testimonial) => (
        <div
          key={testimonial.id}
          className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">
                {participantIcons[testimonial.participantType]}
              </span>
              <div>
                <span className="font-medium text-gray-900 text-sm">
                  {participantLabels[testimonial.participantType]}
                </span>
                {testimonial.location && (
                  <span className="text-gray-500 text-sm ml-2">
                    • {testimonial.location}
                  </span>
                )}
              </div>
            </div>
            <span className="text-xs text-gray-500">
              {formatDate(testimonial.timestamp)}
            </span>
          </div>

          <div className="mb-4">
            <p className="text-gray-700 leading-relaxed">
              "{testimonial.content}"
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleUpvote(testimonial.id)}
                disabled={upvotedItems.has(testimonial.id)}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-colors ${
                  upvotedItems.has(testimonial.id)
                    ? 'bg-green-100 text-green-700 cursor-not-allowed'
                    : 'bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-700'
                }`}
              >
                <span>{upvotedItems.has(testimonial.id) ? '✅' : '👍'}</span>
                <span>{testimonial.upvotes + (upvotedItems.has(testimonial.id) ? 1 : 0)}</span>
              </button>
            </div>

            <button
              onClick={() => handleReport(testimonial.id)}
              disabled={reportedItems.has(testimonial.id)}
              className={`text-xs px-2 py-1 rounded transition-colors ${
                reportedItems.has(testimonial.id)
                  ? 'bg-red-100 text-red-700 cursor-not-allowed'
                  : 'text-gray-500 hover:text-red-600 hover:bg-red-50'
              }`}
            >
              {reportedItems.has(testimonial.id) ? '✅ Reportado' : '🚨 Reportar'}
            </button>
          </div>
        </div>
      ))}

      <div className="text-center text-xs text-gray-500 mt-6">
        <p>
          Testemunhos são revisados antes da publicação para garantir conteúdo apropriado.
          Reportar conteúdo inadequado ajuda a manter a qualidade da plataforma.
        </p>
      </div>
    </div>
  );
}