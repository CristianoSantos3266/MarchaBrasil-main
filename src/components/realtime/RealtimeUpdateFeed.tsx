'use client';

import { useState, useEffect } from 'react';
import { 
  BellIcon,
  CloudIcon,
  MapPinIcon,
  ClockIcon,
  MegaphoneIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  UserGroupIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { BellIcon as BellSolid } from '@heroicons/react/24/solid';

interface RealtimeUpdate {
  id: string;
  protestId: string;
  type: 'weather' | 'delay' | 'route_change' | 'announcement' | 'safety' | 'info' | 'attendance';
  title: string;
  message: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
  location?: string;
  organizer?: string;
  attendeeCount?: number;
  isRead: boolean;
}

interface RealtimeUpdateFeedProps {
  protestIds?: string[]; // If provided, show updates only for these protests
  maxUpdates?: number;
  showNotifications?: boolean;
  className?: string;
}

export default function RealtimeUpdateFeed({ 
  protestIds, 
  maxUpdates = 10, 
  showNotifications = true,
  className = '' 
}: RealtimeUpdateFeedProps) {
  const [updates, setUpdates] = useState<RealtimeUpdate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  // Demo data for real-time updates
  const demoUpdates: RealtimeUpdate[] = [
    {
      id: '1',
      protestId: 'demo-sp-1',
      type: 'attendance',
      title: 'Nova Confirmação de Presença',
      message: 'João Silva confirmou presença na manifestação de São Paulo',
      timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 min ago
      severity: 'low',
      attendeeCount: 1247,
      isRead: false
    },
    {
      id: '2',
      protestId: 'demo-rj-1',
      type: 'weather',
      title: 'Alerta Climático - Rio de Janeiro',
      message: 'Possibilidade de chuva leve nas próximas 2 horas. Manifestantes devem levar guarda-chuva.',
      timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 min ago
      severity: 'medium',
      location: 'Copacabana, Rio de Janeiro',
      organizer: 'Coordenação RJ',
      isRead: false
    },
    {
      id: '3',
      protestId: 'demo-sp-1',
      type: 'announcement',
      title: 'Concentração Iniciada - São Paulo',
      message: 'Manifestantes começaram a se concentrar na Praça da Sé. Ambiente pacífico e ordeiro.',
      timestamp: new Date(Date.now() - 8 * 60 * 1000), // 8 min ago
      severity: 'medium',
      location: 'Praça da Sé, São Paulo',
      organizer: 'Coordenação SP',
      isRead: true
    },
    {
      id: '4',
      protestId: 'demo-bsb-1',
      type: 'route_change',
      title: 'Alteração de Rota - Brasília',
      message: 'Por orientação das autoridades, a rota foi alterada. Nova concentração na Esplanada dos Ministérios.',
      timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 min ago
      severity: 'high',
      location: 'Brasília, DF',
      organizer: 'Coordenação DF',
      isRead: true
    },
    {
      id: '5',
      protestId: 'demo-sp-1',
      type: 'safety',
      title: 'Orientações de Segurança',
      message: 'Mantenham-se hidratados, sigam as orientações dos coordenadores. Manifestação 100% pacífica.',
      timestamp: new Date(Date.now() - 25 * 60 * 1000), // 25 min ago
      severity: 'medium',
      organizer: 'Equipe de Segurança',
      isRead: true
    }
  ];

  useEffect(() => {
    // Load initial updates
    const timer = setTimeout(() => {
      let filteredUpdates = demoUpdates;
      
      if (protestIds && protestIds.length > 0) {
        filteredUpdates = demoUpdates.filter(update => 
          protestIds.includes(update.protestId)
        );
      }
      
      setUpdates(filteredUpdates.slice(0, maxUpdates));
      setUnreadCount(filteredUpdates.filter(u => !u.isRead).length);
      setIsLoading(false);
    }, 1000);

    // Simulate real-time updates every 30 seconds
    const updateInterval = setInterval(() => {
      // Add a new random update
      const newUpdate: RealtimeUpdate = {
        id: Date.now().toString(),
        protestId: protestIds?.[0] || 'demo-sp-1',
        type: 'attendance',
        title: 'Nova Confirmação de Presença',
        message: 'Participante confirmou presença no evento',
        timestamp: new Date(),
        severity: 'low',
        attendeeCount: Math.floor(Math.random() * 2000) + 1000,
        isRead: false
      };

      setUpdates(prev => [newUpdate, ...prev.slice(0, maxUpdates - 1)]);
      setUnreadCount(prev => prev + 1);

      // Show browser notification if enabled
      if (notificationsEnabled && showNotifications) {
        showBrowserNotification(newUpdate);
      }
    }, 30000);

    return () => {
      clearTimeout(timer);
      clearInterval(updateInterval);
    };
  }, [protestIds, maxUpdates]);

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationsEnabled(permission === 'granted');
    }
  };

  const showBrowserNotification = (update: RealtimeUpdate) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(update.title, {
        body: update.message,
        icon: '/favicon.ico',
        tag: update.id
      });
    }
  };

  const markAsRead = (updateId: string) => {
    setUpdates(prev => 
      prev.map(update => 
        update.id === updateId ? { ...update, isRead: true } : update
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setUpdates(prev => 
      prev.map(update => ({ ...update, isRead: true }))
    );
    setUnreadCount(0);
  };

  const getUpdateIcon = (type: RealtimeUpdate['type']) => {
    switch (type) {
      case 'weather':
        return <CloudIcon className="h-5 w-5" />;
      case 'delay':
        return <ClockIcon className="h-5 w-5" />;
      case 'route_change':
        return <MapPinIcon className="h-5 w-5" />;
      case 'announcement':
        return <MegaphoneIcon className="h-5 w-5" />;
      case 'safety':
        return <ExclamationTriangleIcon className="h-5 w-5" />;
      case 'attendance':
        return <UserGroupIcon className="h-5 w-5" />;
      default:
        return <InformationCircleIcon className="h-5 w-5" />;
    }
  };

  const getSeverityStyles = (severity: RealtimeUpdate['severity'], isRead: boolean) => {
    const opacity = isRead ? 'opacity-75' : '';
    
    switch (severity) {
      case 'critical':
        return `bg-red-50 border-red-200 text-red-800 ${opacity}`;
      case 'high':
        return `bg-orange-50 border-orange-200 text-orange-800 ${opacity}`;
      case 'medium':
        return `bg-blue-50 border-blue-200 text-blue-800 ${opacity}`;
      default:
        return `bg-green-50 border-green-200 text-green-800 ${opacity}`;
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Agora mesmo';
    if (diffMinutes < 60) return `${diffMinutes}min`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h`;
    return timestamp.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const displayedUpdates = showAll ? updates : updates.slice(0, 5);

  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg shadow-md border border-gray-200 p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 bg-gray-300 rounded"></div>
            <div className="h-6 bg-gray-300 rounded w-48"></div>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="border rounded-lg p-3">
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-md border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              {unreadCount > 0 ? (
                <BellSolid className="h-6 w-6 text-yellow-300" />
              ) : (
                <BellIcon className="h-6 w-6" />
              )}
              {unreadCount > 0 && (
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </div>
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold">Atualizações em Tempo Real</h3>
              <p className="text-sm text-purple-100">
                {unreadCount > 0 ? `${unreadCount} novas atualizações` : 'Todas as atualizações lidas'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {showNotifications && (
              <button
                onClick={requestNotificationPermission}
                className={`p-2 rounded-lg transition-colors ${
                  notificationsEnabled 
                    ? 'bg-green-500/20 text-green-200' 
                    : 'bg-white/20 hover:bg-white/30 text-white'
                }`}
                title={notificationsEnabled ? 'Notificações ativadas' : 'Ativar notificações'}
              >
                <BellIcon className="h-4 w-4" />
              </button>
            )}
            
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors"
              >
                Marcar todas como lidas
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Updates List */}
      <div className="p-4">
        {updates.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <BellIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>Nenhuma atualização no momento</p>
            <p className="text-sm">As atualizações em tempo real aparecerão aqui</p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayedUpdates.map((update) => (
              <div
                key={update.id}
                onClick={() => !update.isRead && markAsRead(update.id)}
                className={`p-4 rounded-lg border transition-all cursor-pointer hover:shadow-md ${
                  getSeverityStyles(update.severity, update.isRead)
                } ${!update.isRead ? 'ring-2 ring-blue-200' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-current">
                    {getUpdateIcon(update.type)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {!update.isRead && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                        <span className="text-xs font-medium text-current/70">
                          {formatTimestamp(update.timestamp)}
                        </span>
                      </div>
                      {update.attendeeCount && (
                        <div className="flex items-center gap-1 text-xs text-current/70">
                          <UserGroupIcon className="h-3 w-3" />
                          <span>{update.attendeeCount.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                    
                    <h4 className={`font-semibold text-current mb-1 ${!update.isRead ? 'font-bold' : ''}`}>
                      {update.title}
                    </h4>
                    
                    <p className="text-current/80 text-sm leading-relaxed">
                      {update.message}
                    </p>

                    {/* Location and Organizer */}
                    <div className="mt-2 flex flex-wrap gap-4 text-xs text-current/60">
                      {update.location && (
                        <div className="flex items-center gap-1">
                          <MapPinIcon className="h-3 w-3" />
                          <span>{update.location}</span>
                        </div>
                      )}
                      {update.organizer && (
                        <div className="flex items-center gap-1">
                          <span>Por: {update.organizer}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Show More/Less Button */}
        {updates.length > 5 && (
          <div className="mt-4 text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
            >
              {showAll ? 'Ver menos' : `Ver todas (${updates.length})`}
            </button>
          </div>
        )}

        {/* Real-time indicator */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Conectado • Atualizações em tempo real</span>
          </div>
        </div>
      </div>
    </div>
  );
}