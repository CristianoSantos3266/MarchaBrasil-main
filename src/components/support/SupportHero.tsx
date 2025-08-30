'use client';

import { useMemo } from 'react';
import { HeartIcon, ShareIcon, ShieldCheckIcon, ChartBarIcon, GlobeAltIcon } from '@heroicons/react/24/solid';
import { SHOW_DONATION_STATS, MOMENTUM_MIN_DONORS_7D, MOMENTUM_MIN_PROGRESS } from '@/lib/featureFlags';
import { FundraisingStats, shouldShowProgress, pct, formatBRL } from '@/lib/fundraising';

interface SupportHeroProps {
  onContribuir: () => void;
  onCompartilhar: () => void;
  stats?: FundraisingStats;
}

export default function SupportHero({ onContribuir, onCompartilhar, stats }: SupportHeroProps) {
  const fallback: FundraisingStats = { goalCents: 0, raisedCents: 0, donorsLast7d: 0 };
  const effective = stats ?? fallback;

  const showProgress = useMemo(() => {
    if (!SHOW_DONATION_STATS) return false;
    return shouldShowProgress(effective, {
      minProgress: MOMENTUM_MIN_PROGRESS,
      minDonors7d: MOMENTUM_MIN_DONORS_7D,
    });
  }, [effective]);

  const progressPct = Math.round(pct(effective) * 100);

  return (
    <div className="bg-white py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left side - Content */}
          <div className="text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-gray-900">
              <GlobeAltIcon className="inline h-12 w-12 text-green-600 mr-3" />
              Ajude a manter o <span className="text-green-600">Marcha Brasil</span> no ar
            </h1>
            
            <p className="text-xl sm:text-2xl mb-8 text-gray-700 leading-relaxed">
              Sua contribuição cobre <strong>servidores</strong>, <strong>CDN</strong>, <strong>monitoramento</strong> e
              <strong> horas de desenvolvimento</strong> para evoluirmos a plataforma com segurança e transparência.
            </p>

            {/* Impact bullets (always shown) */}
            <ul className="mb-8 space-y-2 text-gray-700">
              <li>• <strong>R$30</strong> ajuda com custos de hospedagem e logs</li>
              <li>• <strong>R$60</strong> cobre monitoramento e backups</li>
              <li>• <strong>R$120</strong> financia horas de desenvolvimento e melhorias</li>
            </ul>

            {/* Momentum-aware: show progress only if rule passes */}
            {showProgress && (
              <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-200">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                  <span>Progresso</span>
                  <span>{progressPct}%</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-green-600 h-2"
                    style={{ width: `${progressPct}%` }}
                    aria-label={`Progresso ${progressPct}%`}
                  />
                </div>

                <div className="mt-2 text-sm text-gray-600">
                  <span className="mr-3">Meta: <strong>{formatBRL(effective.goalCents)}</strong></span>
                  <span>Já arrecadado: <strong>{formatBRL(effective.raisedCents)}</strong></span>
                </div>
              </div>
            )}

            {/* Call to Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <button
                onClick={onContribuir}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
              >
                <HeartIcon className="h-6 w-6" />
                Contribuir Agora
              </button>
              
              <button
                onClick={onCompartilhar}
                className="bg-white hover:bg-gray-50 text-gray-900 font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border-2 border-gray-200 flex items-center justify-center gap-3"
              >
                <ShareIcon className="h-6 w-6" />
                Compartilhar
              </button>
            </div>

            <div className="flex justify-center sm:justify-start items-center gap-6 text-sm text-gray-600 flex-wrap">
              <span className="flex items-center gap-2">
                <ShieldCheckIcon className="h-5 w-5 text-green-600" />
                <strong>100% seguro</strong>
              </span>
              <span className="flex items-center gap-2">
                <GlobeAltIcon className="h-5 w-5 text-blue-600" />
                <strong>Apoio brasileiro</strong>
              </span>
              <span className="flex items-center gap-2">
                <ChartBarIcon className="h-5 w-5 text-purple-600" />
                <strong>Transparência total</strong>
              </span>
            </div>
          </div>

          {/* Right side - Image */}
          <div className="lg:order-last">
            <div 
              className="relative rounded-2xl overflow-hidden shadow-2xl h-80 sm:h-96 lg:h-[500px]"
              style={{
                backgroundImage: 'url(/images/brazilian-flag-hero.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              {/* Overlay for better aesthetics */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}