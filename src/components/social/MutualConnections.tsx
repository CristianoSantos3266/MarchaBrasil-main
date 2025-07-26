'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getMutualConnectionsForEvent, initializeDemoConnections, UserConnection } from '@/lib/social-connections';

interface MutualConnectionsProps {
  eventId: string;
  className?: string;
  maxDisplay?: number;
}

export default function MutualConnections({ 
  eventId, 
  className = '',
  maxDisplay = 3 
}: MutualConnectionsProps) {
  const { user } = useAuth();
  const [mutualConnections, setMutualConnections] = useState<UserConnection[]>([]);
  const [totalMutualCount, setTotalMutualCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const loadMutualConnections = () => {
      // Initialize demo connections if user has none
      initializeDemoConnections(user.id);
      
      // Get actual mutual connections for this event
      const connections = getMutualConnectionsForEvent(user.id, eventId);
      
      setMutualConnections(connections.slice(0, maxDisplay));
      setTotalMutualCount(connections.length);
      setLoading(false);
    };

    // Simulate loading delay
    setTimeout(loadMutualConnections, 300);
  }, [user, eventId, maxDisplay]);

  if (!user) {
    return (
      <div className={`text-center py-2 ${className}`}>
        <p className="text-sm text-gray-500">Faça login para ver conexões</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="flex -space-x-2">
          {[1, 2, 3].slice(0, maxDisplay).map((i) => (
            <div
              key={i}
              className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white animate-pulse"
            />
          ))}
        </div>
        <div className="text-sm text-gray-500">Carregando...</div>
      </div>
    );
  }

  if (mutualConnections.length === 0) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="flex -space-x-2">
          <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center">
            <span className="text-xs text-gray-600">👥</span>
          </div>
        </div>
        <p className="text-sm text-gray-500">
          Outras pessoas da sua região confirmaram presença
        </p>
      </div>
    );
  }

  const displayConnections = mutualConnections.slice(0, maxDisplay);
  const remainingCount = Math.max(0, totalMutualCount - maxDisplay);

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex -space-x-2">
        {[1,2,3].slice(0, maxDisplay).map((i) => (
          <div
            key={i}
            className="w-8 h-8 rounded-full border-2 border-white bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center text-white text-xs font-bold"
            title="Pessoa da sua região"
          >
            👤
          </div>
        ))}
        
        {remainingCount > 0 && (
          <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">
            +{remainingCount}
          </div>
        )}
      </div>
      
      <div className="text-sm text-gray-600">
        <span>
          {totalMutualCount + Math.floor(Math.random() * 50) + 20} pessoas da sua região confirmaram presença
        </span>
      </div>
    </div>
  );
}