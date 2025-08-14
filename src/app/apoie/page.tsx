'use client';

import { useState } from 'react';
import SupportHero from '@/components/support/SupportHero';
import SupportPaymentPanel from '@/components/support/SupportPaymentPanel';
import SupportShareModal from '@/components/support/SupportShareModal';
import SupporterFeed from '@/components/support/SupporterFeed';
import ImpactBar from '@/components/support/ImpactBar';

export default function ApoiePage() {
  const [showPayments, setShowPayments] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const handleContribuir = () => {
    setShowPayments(true);
    // Smooth scroll to payment section
    setTimeout(() => {
      const paymentSection = document.getElementById('payment-section');
      if (paymentSection) {
        paymentSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleCompartilhar = () => {
    setShowShareModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-green-50">
      {/* Hero Section */}
      <SupportHero 
        onContribuir={handleContribuir}
        onCompartilhar={handleCompartilhar}
      />

      {/* Impact Bar - Always visible */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <ImpactBar />
      </div>

      {/* Payment Panel - Only shows after "Contribuir Agora" */}
      {showPayments && (
        <div id="payment-section" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
              Escolha Sua Forma de Apoio
            </h2>
            <p className="text-center text-gray-600">
              Toda contribuição ajuda a manter nossa plataforma livre e segura
            </p>
          </div>
          <SupportPaymentPanel />
        </div>
      )}

      {/* Supporter Feed - Always visible for social proof */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SupporterFeed />
      </div>

      {/* Share Modal */}
      <SupportShareModal 
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
      />
    </div>
  );
}