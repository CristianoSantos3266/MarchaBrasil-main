'use client';

import { useState } from 'react';
import { DONATION_TIERS, DonationTier } from '@/types/donations';
import DonationCard from '@/components/donations/DonationCard';
import CryptoDonations from '@/components/donations/CryptoDonations';
import DonationStatsDisplay from '@/components/donations/DonationStats';

export default function SupportPage() {
  const [selectedMethod, setSelectedMethod] = useState<'traditional' | 'crypto'>('traditional');

  const handleDonate = (tier: DonationTier) => {
    // In a real implementation, this would integrate with Stripe
    alert(`Redirecting to secure payment for ${tier.name} ($${tier.amount}). This would integrate with Stripe via AlphaFlare Inc.`);
  };

  const handleCustomDonation = () => {
    const amount = prompt('Enter custom amount (USD):');
    if (amount && !isNaN(Number(amount)) && Number(amount) > 0) {
      alert(`Redirecting to secure payment for $${amount}. This would integrate with Stripe via AlphaFlare Inc.`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.history.back()}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              ← Back to Platform
            </button>
          </div>
          <div className="text-center mt-4">
            <h1 className="text-3xl font-bold text-gray-900">
              Support Civic Infrastructure
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Help maintain censorship-resistant tools for peaceful civic coordination
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <DonationStatsDisplay />

        {/* Method selector */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1 flex">
            <button
              onClick={() => setSelectedMethod('traditional')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                selectedMethod === 'traditional'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              💳 Traditional Payment
            </button>
            <button
              onClick={() => setSelectedMethod('crypto')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                selectedMethod === 'crypto'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              🔐 Crypto Donation
            </button>
          </div>
        </div>

        {selectedMethod === 'traditional' ? (
          <>
            {/* Donation tiers */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
                Choose Your Support Level
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {DONATION_TIERS.map((tier, index) => (
                  <DonationCard
                    key={tier.id}
                    tier={tier}
                    onDonate={handleDonate}
                    isPopular={index === 1}
                  />
                ))}
              </div>

              {/* Custom amount */}
              <div className="text-center">
                <button
                  onClick={handleCustomDonation}
                  className="bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-900 px-6 py-3 rounded-md font-medium transition-colors"
                >
                  💝 Custom Amount
                </button>
              </div>
            </section>

            {/* Why support */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
                Why Your Support Matters
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg p-6 text-center shadow-sm border border-gray-200">
                  <div className="text-3xl mb-3">🛡️</div>
                  <h3 className="font-semibold text-gray-900 mb-2">Censorship Resistance</h3>
                  <p className="text-sm text-gray-600">
                    Maintain multiple servers and mirror domains to ensure platform availability
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-6 text-center shadow-sm border border-gray-200">
                  <div className="text-3xl mb-3">🔐</div>
                  <h3 className="font-semibold text-gray-900 mb-2">Privacy & Security</h3>
                  <p className="text-sm text-gray-600">
                    Advanced encryption and privacy tools to protect user anonymity
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-6 text-center shadow-sm border border-gray-200">
                  <div className="text-3xl mb-3">🌐</div>
                  <h3 className="font-semibold text-gray-900 mb-2">Global Infrastructure</h3>
                  <p className="text-sm text-gray-600">
                    Worldwide server network for maximum reliability and speed
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-6 text-center shadow-sm border border-gray-200">
                  <div className="text-3xl mb-3">📱</div>
                  <h3 className="font-semibold text-gray-900 mb-2">Platform Development</h3>
                  <p className="text-sm text-gray-600">
                    Continuous improvement and new features for better coordination
                  </p>
                </div>
              </div>
            </section>
          </>
        ) : (
          <CryptoDonations />
        )}

        {/* Legal & transparency */}
        <section className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
            💼 Transparency & Legal
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">🔍 Financial Transparency</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• All donations go directly to infrastructure costs</li>
                <li>• Monthly financial reports available on request</li>
                <li>• No personal enrichment or political donations</li>
                <li>• Funds managed by AlphaFlare Inc. (USA)</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">⚖️ Legal Compliance</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Platform operates under US and Canadian law</li>
                <li>• No political affiliation or endorsements</li>
                <li>• Supports peaceful civic coordination only</li>
                <li>• Tax receipts available for traditional donations</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              🤝 This platform is politically neutral and supports peaceful civic participation as protected by international law
            </p>
          </div>
        </section>

        {/* Contact */}
        <section className="text-center mt-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Questions About Donations?
          </h2>
          <p className="text-gray-600 mb-4">
            We're committed to transparency and responsible fund management
          </p>
          <div className="space-x-4">
            <a 
              href="mailto:support@civicmobilization.org" 
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              📧 Contact Support
            </a>
            <a 
              href="/transparency" 
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              📊 View Financial Reports
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}