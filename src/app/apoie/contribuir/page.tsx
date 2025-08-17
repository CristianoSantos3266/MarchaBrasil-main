'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeftIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import SupportPaymentPanel from '@/components/support/SupportPaymentPanel';
import SupporterFeed from '@/components/support/SupporterFeed';
import ImpactBar from '@/components/support/ImpactBar';

export default function ContribuirPage() {
  const searchParams = useSearchParams();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCanceled, setShowCanceled] = useState(false);

  useEffect(() => {
    const success = searchParams.get('success');
    const canceled = searchParams.get('canceled');
    
    if (success === 'true') {
      setShowSuccess(true);
      // Auto-hide after 5 seconds
      setTimeout(() => setShowSuccess(false), 5000);
    }
    
    if (canceled === 'true') {
      setShowCanceled(true);
      // Auto-hide after 3 seconds
      setTimeout(() => setShowCanceled(false), 3000);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Link 
              href="/apoie"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              Voltar
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Contribuir para Marcha Brasil
              </h1>
              <p className="text-gray-600 mt-1">
                Escolha sua forma de apoio e ajude a manter nossa plataforma livre
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Success/Error Messages */}
      {showSuccess && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg flex items-center gap-3">
            <CheckCircleIcon className="h-6 w-6 text-green-600" />
            <div>
              <p className="font-bold">Pagamento realizado com sucesso!</p>
              <p className="text-sm">Obrigado por apoiar a Marcha Brasil. Sua contribuição faz a diferença!</p>
            </div>
          </div>
        </div>
      )}

      {showCanceled && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-orange-100 border border-orange-400 text-orange-700 px-4 py-3 rounded-lg flex items-center gap-3">
            <XCircleIcon className="h-6 w-6 text-orange-600" />
            <div>
              <p className="font-bold">Pagamento cancelado</p>
              <p className="text-sm">Você pode tentar novamente quando quiser. Estamos aqui para ajudar!</p>
            </div>
          </div>
        </div>
      )}

      {/* Impact Bar */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ImpactBar />
      </div>

      {/* Payment Panel */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
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

      {/* Supporter Feed */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <SupporterFeed />
      </div>
    </div>
  );
}