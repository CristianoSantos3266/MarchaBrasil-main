
import Navigation from '@/components/ui/Navigation';
import SupportHero from '@/components/support/SupportHero';
import SupporterFeed from '@/components/support/SupporterFeed';
import ImpactBar from '@/components/support/ImpactBar';

export default function ApoiePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-green-50">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <SupportHero />

      {/* Impact Bar - Always visible */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <ImpactBar />
      </div>

      {/* Supporter Feed - Always visible for social proof */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SupporterFeed />
      </div>
    </div>
  );
}

