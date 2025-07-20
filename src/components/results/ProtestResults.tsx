'use client';

import { useState } from 'react';
import { Protest, CommunityImage, AnonymousTestimonial, ParticipantType } from '@/types';
import ImageUpload from './ImageUpload';
import IWasThereButton from './IWasThereButton';
import TestimonialForm from './TestimonialForm';
import TestimonialsList from './TestimonialsList';

interface ProtestResultsProps {
  protest: Protest;
  onUpdateResults: (protestId: string, updates: Record<string, unknown>) => void;
}

export default function ProtestResults({ protest, onUpdateResults }: ProtestResultsProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'images' | 'testimonials'>('overview');

  // Check if protest has ended (show results only after scheduled time)
  const protestDateTime = new Date(`${protest.date}T${protest.time}`);
  const now = new Date();
  const hasEnded = now > protestDateTime;

  if (!hasEnded) {
    return null; // Don't show results before the protest ends
  }

  const results = protest.results || {
    estimatedTurnout: {
      rsvpBased: Object.values(protest.rsvps).reduce((sum, count) => sum + count, 0),
      communityReported: 0,
      confidenceLevel: 'low' as const,
      source: 'RSVPs only'
    },
    verifications: {
      iwasthere: 0,
      uniqueVerifications: 0,
      lastVerification: new Date().toISOString()
    },
    communityImages: [],
    testimonials: [],
    lastUpdated: new Date().toISOString()
  };

  const handleImageUpload = (image: CommunityImage) => {
    const updatedImages = [...results.communityImages, image];
    onUpdateResults(protest.id, {
      ...results,
      communityImages: updatedImages,
      lastUpdated: new Date().toISOString()
    });
  };

  const handleVerification = (participantType: ParticipantType) => {
    const updatedVerifications = {
      iwasthere: results.verifications.iwasthere + 1,
      uniqueVerifications: results.verifications.uniqueVerifications + 1,
      lastVerification: new Date().toISOString()
    };

    // Update turnout estimate based on verifications
    const newCommunityReported = Math.max(
      results.estimatedTurnout.communityReported,
      updatedVerifications.iwasthere * 2 // Assume each verification represents ~2 people
    );

    onUpdateResults(protest.id, {
      ...results,
      verifications: updatedVerifications,
      estimatedTurnout: {
        ...results.estimatedTurnout,
        communityReported: newCommunityReported,
        confidenceLevel: updatedVerifications.iwasthere > 50 ? 'high' : updatedVerifications.iwasthere > 20 ? 'medium' : 'low'
      },
      lastUpdated: new Date().toISOString()
    });
  };

  const handleTestimonialSubmit = async (testimonialData: Omit<AnonymousTestimonial, 'id' | 'timestamp' | 'status' | 'upvotes' | 'reportedCount'>) => {
    const newTestimonial: AnonymousTestimonial = {
      ...testimonialData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      status: 'pending',
      upvotes: 0,
      reportedCount: 0
    };

    const updatedTestimonials = [...results.testimonials, newTestimonial];
    onUpdateResults(protest.id, {
      ...results,
      testimonials: updatedTestimonials,
      lastUpdated: new Date().toISOString()
    });
  };

  const handleTestimonialUpvote = (testimonialId: string) => {
    const updatedTestimonials = results.testimonials.map(t => 
      t.id === testimonialId ? { ...t, upvotes: t.upvotes + 1 } : t
    );
    
    onUpdateResults(protest.id, {
      ...results,
      testimonials: updatedTestimonials,
      lastUpdated: new Date().toISOString()
    });
  };

  const handleTestimonialReport = (testimonialId: string) => {
    const updatedTestimonials = results.testimonials.map(t => 
      t.id === testimonialId ? { ...t, reportedCount: t.reportedCount + 1 } : t
    );
    
    onUpdateResults(protest.id, {
      ...results,
      testimonials: updatedTestimonials,
      lastUpdated: new Date().toISOString()
    });
  };

  const approvedImages = results.communityImages.filter(img => img.status === 'approved');
  const totalTurnout = Math.max(results.estimatedTurnout.rsvpBased, results.estimatedTurnout.communityReported);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          📊 Resultados do Protesto
        </h2>
        <p className="text-gray-600 text-sm">
          Documentação comunitária e verificação de participação
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        {[
          { id: 'overview', label: '📈 Visão Geral' },
          { id: 'images', label: '📸 Fotos' },
          { id: 'testimonials', label: '💬 Testemunhos' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'overview' | 'images' | 'testimonials')}
            className={`px-4 py-2 font-medium text-sm transition-colors ${
              activeTab === tab.id
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Turnout Summary */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {results.estimatedTurnout.rsvpBased.toLocaleString()}
              </div>
              <div className="text-sm text-blue-700">RSVPs Originais</div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {results.verifications.iwasthere.toLocaleString()}
              </div>
              <div className="text-sm text-green-700">Verificações "Estive Lá"</div>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {totalTurnout.toLocaleString()}
              </div>
              <div className="text-sm text-purple-700">
                Estimativa Total
                <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                  results.estimatedTurnout.confidenceLevel === 'high' ? 'bg-green-100 text-green-800' :
                  results.estimatedTurnout.confidenceLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {results.estimatedTurnout.confidenceLevel === 'high' ? 'Alta confiança' :
                   results.estimatedTurnout.confidenceLevel === 'medium' ? 'Média confiança' :
                   'Baixa confiança'}
                </span>
              </div>
            </div>
          </div>

          {/* Verification Button */}
          <IWasThereButton
            protestId={protest.id}
            currentCount={results.verifications.iwasthere}
            onVerify={handleVerification}
          />

          {/* Quick Stats */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">📊 Estatísticas</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Fotos enviadas:</span>
                  <span>{results.communityImages.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Fotos aprovadas:</span>
                  <span>{approvedImages.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Testemunhos:</span>
                  <span>{results.testimonials.filter(t => t.status === 'approved').length}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">⏰ Linha do Tempo</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div>Protesto: {protest.date} às {protest.time}</div>
                {results.verifications.lastVerification && (
                  <div>Última verificação: {new Intl.DateTimeFormat('pt-BR', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                  }).format(new Date(results.verifications.lastVerification))}</div>
                )}
                <div>Atualizado: {new Intl.DateTimeFormat('pt-BR', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit'
                }).format(new Date(results.lastUpdated))}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Images Tab */}
      {activeTab === 'images' && (
        <div className="space-y-6">
          <ImageUpload protestId={protest.id} onUploadComplete={handleImageUpload} />
          
          {approvedImages.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">
                📸 Fotos da Comunidade ({approvedImages.length})
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {approvedImages.map((image) => (
                  <div key={image.id} className="relative group">
                    <img
                      src={image.blurredUrl}
                      alt="Foto do protesto"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                      👍 {image.upvotes}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Testimonials Tab */}
      {activeTab === 'testimonials' && (
        <div className="space-y-6">
          <TestimonialForm
            protestId={protest.id}
            onSubmit={handleTestimonialSubmit}
          />
          
          <TestimonialsList
            testimonials={results.testimonials}
            onUpvote={handleTestimonialUpvote}
            onReport={handleTestimonialReport}
          />
        </div>
      )}
    </div>
  );
}