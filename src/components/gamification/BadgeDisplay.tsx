'use client';

import { Badge, getBadgeById } from '@/lib/gamification';

interface BadgeDisplayProps {
  badgeId: string;
  size?: 'small' | 'medium' | 'large';
  showDescription?: boolean;
  earned?: boolean;
  className?: string;
}

export default function BadgeDisplay({ 
  badgeId, 
  size = 'medium', 
  showDescription = false,
  earned = true,
  className = ''
}: BadgeDisplayProps) {
  const badge = getBadgeById(badgeId);
  
  if (!badge) return null;

  const sizeClasses = {
    small: {
      container: 'w-8 h-8',
      icon: 'text-lg',
      text: 'text-xs',
      name: 'text-xs font-medium',
      desc: 'text-xs'
    },
    medium: {
      container: 'w-12 h-12',
      icon: 'text-2xl',
      text: 'text-sm',
      name: 'text-sm font-semibold',
      desc: 'text-xs'
    },
    large: {
      container: 'w-16 h-16',
      icon: 'text-3xl',
      text: 'text-base',
      name: 'text-base font-bold',
      desc: 'text-sm'
    }
  };

  const colorClasses = {
    green: earned ? 'bg-green-100 border-green-300 text-green-800' : 'bg-gray-100 border-gray-300 text-gray-400',
    blue: earned ? 'bg-blue-100 border-blue-300 text-blue-800' : 'bg-gray-100 border-gray-300 text-gray-400',
    purple: earned ? 'bg-purple-100 border-purple-300 text-purple-800' : 'bg-gray-100 border-gray-300 text-gray-400',
    gold: earned ? 'bg-yellow-100 border-yellow-300 text-yellow-800' : 'bg-gray-100 border-gray-300 text-gray-400'
  };

  const currentSize = sizeClasses[size];
  const currentColor = colorClasses[badge.color as keyof typeof colorClasses];

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      {/* Badge Icon */}
      <div className={`
        ${currentSize.container} 
        ${currentColor}
        rounded-full border-2 flex items-center justify-center
        ${earned ? 'shadow-md' : 'opacity-50'}
        transition-all duration-200
      `}>
        <span className={`${currentSize.icon} ${earned ? '' : 'grayscale'}`}>
          {badge.icon}
        </span>
      </div>

      {/* Badge Name */}
      <div className={`text-center ${currentSize.name} text-gray-900 ${earned ? '' : 'opacity-50'}`}>
        {badge.name}
      </div>

      {/* Badge Description */}
      {showDescription && (
        <div className={`text-center ${currentSize.desc} text-gray-600 max-w-32 ${earned ? '' : 'opacity-50'}`}>
          {badge.description}
        </div>
      )}

      {/* Earned indicator */}
      {!earned && size !== 'small' && (
        <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          🔒 Bloqueado
        </div>
      )}
    </div>
  );
}

interface BadgeCollectionProps {
  earnedBadgeIds: string[];
  showAll?: boolean;
  className?: string;
}

export function BadgeCollection({ 
  earnedBadgeIds, 
  showAll = false,
  className = ''
}: BadgeCollectionProps) {
  const badges = [
    'presente',
    'resistente', 
    'mobilizador',
    'marchador_nacional'
  ];

  const displayBadges = showAll ? badges : earnedBadgeIds;

  if (displayBadges.length === 0) {
    return (
      <div className={`text-center py-4 ${className}`}>
        <div className="text-gray-500 text-sm">
          🎖️ Participe de manifestações para conquistar distintivos!
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-wrap gap-4 justify-center ${className}`}>
      {badges.map(badgeId => {
        const earned = earnedBadgeIds.includes(badgeId);
        
        if (!showAll && !earned) return null;
        
        return (
          <BadgeDisplay
            key={badgeId}
            badgeId={badgeId}
            size="medium"
            showDescription={true}
            earned={earned}
          />
        );
      })}
    </div>
  );
}