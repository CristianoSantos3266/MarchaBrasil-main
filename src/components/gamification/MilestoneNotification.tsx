'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/lib/gamification';

interface MilestoneNotificationProps {
  message?: string | null;
  newBadges?: Badge[];
  onClose?: () => void;
  autoHideDelay?: number;
}

export default function MilestoneNotification({ 
  message, 
  newBadges = [],
  onClose,
  autoHideDelay = 5000
}: MilestoneNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (message || newBadges.length > 0) {
      setIsVisible(true);
      setIsAnimating(true);

      // Auto-hide after delay
      if (autoHideDelay > 0) {
        const timer = setTimeout(() => {
          handleClose();
        }, autoHideDelay);

        return () => clearTimeout(timer);
      }
    }
  }, [message, newBadges, autoHideDelay]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) {
        onClose();
      }
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className={`
        bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4
        transform transition-all duration-300 ease-out
        ${isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
      `}>
        {/* Header */}
        <div className="text-center mb-4">
          <div className="text-4xl mb-2">🎉</div>
          <h3 className="text-xl font-bold text-gray-900">
            {newBadges.length > 0 ? 'Distintivo Conquistado!' : 'Marco Alcançado!'}
          </h3>
        </div>

        {/* New Badge Display */}
        {newBadges.length > 0 && (
          <div className="mb-4">
            {newBadges.map((badge, index) => (
              <div key={badge.id} className="text-center mb-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                <div className="text-4xl mb-2">{badge.icon}</div>
                <div className="text-lg font-bold text-gray-900 mb-1">{badge.name}</div>
                <div className="text-sm text-gray-600">{badge.description}</div>
              </div>
            ))}
          </div>
        )}

        {/* Milestone Message */}
        {message && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800 text-center font-medium">
              {message}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            Continuar
          </button>
          
          {newBadges.length > 0 && (
            <button
              onClick={() => {
                // Share achievement (could trigger social share)
                if (navigator.share) {
                  navigator.share({
                    title: 'Marcha Brasil - Distintivo Conquistado!',
                    text: `Conquistei o distintivo "${newBadges[0].name}" na Marcha Brasil! 🇧🇷`,
                    url: window.location.href
                  });
                }
                handleClose();
              }}
              className="flex-1 px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors font-medium"
            >
              📢 Compartilhar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Hook for showing milestone notifications
export function useMilestoneNotification() {
  const [notification, setNotification] = useState<{
    message?: string | null;
    newBadges?: Badge[];
  } | null>(null);

  const showNotification = (message?: string | null, newBadges?: Badge[]) => {
    setNotification({ message, newBadges });
  };

  const hideNotification = () => {
    setNotification(null);
  };

  const NotificationComponent = notification ? (
    <MilestoneNotification
      message={notification.message}
      newBadges={notification.newBadges}
      onClose={hideNotification}
    />
  ) : null;

  return {
    showNotification,
    hideNotification,
    NotificationComponent
  };
}