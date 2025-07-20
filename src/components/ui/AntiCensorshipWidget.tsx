'use client';

import { useState, useEffect } from 'react';
import { detectCensorship, getBrazilianCensorshipInfo, enableAntiCensorshipMode } from '@/utils/domainBlockingDetection';

export default function AntiCensorshipWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [censorshipStatus, setCensorshipStatus] = useState<{
    isBlocked: boolean;
    evidence: string[];
    recommendations: string[];
  } | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const censorshipInfo = getBrazilianCensorshipInfo();

  useEffect(() => {
    // Auto-check on load
    checkCensorship();
  }, []);

  const checkCensorship = async () => {
    setIsChecking(true);
    try {
      const result = await detectCensorship();
      setCensorshipStatus(result);
    } catch (error) {
      console.error('Censorship check failed:', error);
    } finally {
      setIsChecking(false);
    }
  };

  const handleEnableAntiCensorship = () => {
    enableAntiCensorshipMode();
    alert('Modo anti-censura ativado! O site funcionará melhor sob bloqueios.');
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className={`p-3 rounded-full shadow-lg text-white font-medium ${
            censorshipStatus?.isBlocked 
              ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
          title="Anti-Censorship Tools"
        >
          {censorshipStatus?.isBlocked ? '🚨' : '🛡️'}
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-6 max-w-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-gray-900 text-sm">
          🛡️ Anti-Censorship Tools
        </h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
      </div>

      {/* Status */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-3 h-3 rounded-full ${
            isChecking 
              ? 'bg-yellow-500 animate-pulse' 
              : censorshipStatus?.isBlocked 
                ? 'bg-red-500' 
                : 'bg-green-500'
          }`}></div>
          <span className="text-sm font-medium">
            {isChecking 
              ? 'Checking...' 
              : censorshipStatus?.isBlocked 
                ? 'Potential Blocking Detected' 
                : 'Access Normal'
            }
          </span>
        </div>
        
        <button
          onClick={checkCensorship}
          disabled={isChecking}
          className="text-xs text-blue-600 hover:text-blue-800"
        >
          🔄 Check Again
        </button>
      </div>

      {/* Evidence */}
      {censorshipStatus?.isBlocked && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
          <h4 className="font-semibold text-red-800 text-xs mb-2">Evidence:</h4>
          <ul className="text-xs text-red-700 space-y-1">
            {censorshipStatus.evidence.map((item, index) => (
              <li key={index}>• {item}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommendations */}
      {censorshipStatus?.recommendations && censorshipStatus.recommendations.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold text-gray-900 text-xs mb-2">Recommendations:</h4>
          <ul className="text-xs text-gray-600 space-y-1">
            {censorshipStatus.recommendations.slice(0, 3).map((item, index) => (
              <li key={index}>• {item}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Quick Actions */}
      <div className="space-y-2">
        <button
          onClick={handleEnableAntiCensorship}
          className="w-full px-3 py-2 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700"
        >
          🚀 Enable Anti-Censorship Mode
        </button>
        
        <div className="grid grid-cols-2 gap-2">
          <a
            href="https://www.torproject.org/download/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs text-center hover:bg-gray-200"
          >
            📥 Get Tor
          </a>
          <a
            href="https://psiphon.ca/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs text-center hover:bg-gray-200"
          >
            🔐 Get VPN
          </a>
        </div>
      </div>

      {/* Legal Info */}
      <div className="mt-4 p-2 bg-blue-50 border border-blue-200 rounded">
        <p className="text-xs text-blue-800">
          <strong>🏛️ Legal:</strong> Peaceful protest coordination is protected by Article 5, XVI of the Brazilian Constitution.
        </p>
      </div>
    </div>
  );
}