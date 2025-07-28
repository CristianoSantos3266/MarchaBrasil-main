'use client';

import { useEffect, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface CelebrationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message?: string;
}

export default function CelebrationPopup({ isOpen, onClose, title, message }: CelebrationPopupProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      // Auto-close after 4 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    } else {
      setShowConfetti(false);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: ['#22c55e', '#eab308', '#3b82f6', '#ef4444', '#8b5cf6'][Math.floor(Math.random() * 5)]
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Popup Content */}
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 relative animate-bounce">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        <div className="text-center">
          {/* Brazilian Flag Animation */}
          <div className="mb-6 relative">
            <div className="text-8xl animate-pulse">🇧🇷</div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-6xl animate-spin">✨</div>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            🎉 Parabéns! 🎉
          </h2>
          
          <h3 className="text-xl font-semibold text-green-600 mb-4">
            {title}
          </h3>

          {message && (
            <p className="text-gray-600 mb-6">
              {message}
            </p>
          )}

          <div className="space-y-2 text-sm text-gray-500">
            <p className="font-medium">🚀 Seu evento foi criado com sucesso!</p>
            <p>📢 Divulgue para seus amigos e familiares</p>
            <p>🤝 Juntos somos mais fortes!</p>
          </div>

          <div className="mt-6 text-lg font-bold text-green-600">
            BRASIL! 🇧🇷
          </div>
        </div>
      </div>
    </div>
  );
}