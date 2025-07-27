// Real-time notification system for civic mobilization platform

export interface NotificationData {
  id: string;
  type: 'event_update' | 'weather_alert' | 'route_change' | 'safety_alert' | 'attendance_confirmation' | 'organizer_message';
  title: string;
  message: string;
  protestId?: string;
  userId?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  data?: Record<string, any>;
  actionUrl?: string;
  imageUrl?: string;
  sound?: 'default' | 'urgent' | 'silent';
  vibrate?: number[];
}

export interface NotificationPreferences {
  userId: string;
  eventUpdates: boolean;
  weatherAlerts: boolean;
  routeChanges: boolean;
  safetyAlerts: boolean;
  attendanceConfirmations: boolean;
  organizerMessages: boolean;
  browserNotifications: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  quietHours: {
    enabled: boolean;
    startTime: string; // HH:MM format
    endTime: string; // HH:MM format
  };
}

export class NotificationService {
  private static instance: NotificationService;
  private preferences: Map<string, NotificationPreferences> = new Map();
  private subscriptions: Map<string, (notification: NotificationData) => void> = new Map();
  private serviceWorkerRegistration: ServiceWorkerRegistration | null = null;

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Initialize notification service
  async initialize(): Promise<void> {
    // Register service worker for push notifications
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      try {
        this.serviceWorkerRegistration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered successfully');
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }

    // Request notification permission
    await this.requestNotificationPermission();
  }

  // Request browser notification permission
  async requestNotificationPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return 'denied';
    }

    let permission = Notification.permission;

    if (permission === 'default') {
      permission = await Notification.requestPermission();
    }

    return permission;
  }

  // Subscribe to push notifications
  async subscribeToPushNotifications(userId: string): Promise<PushSubscription | null> {
    if (!this.serviceWorkerRegistration) {
      console.error('Service Worker not registered');
      return null;
    }

    try {
      const subscription = await this.serviceWorkerRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_KEY || ''),
      });

      // In a real app, send this subscription to your server
      console.log('Push subscription:', subscription);
      
      return subscription;
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      return null;
    }
  }

  // Convert VAPID key for push subscription
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  // Set user notification preferences
  setPreferences(userId: string, preferences: Partial<NotificationPreferences>): void {
    const existingPrefs = this.preferences.get(userId) || this.getDefaultPreferences(userId);
    this.preferences.set(userId, { ...existingPrefs, ...preferences });
    
    // Store in localStorage
    localStorage.setItem(`notifications_${userId}`, JSON.stringify(this.preferences.get(userId)));
  }

  // Get user notification preferences
  getPreferences(userId: string): NotificationPreferences {
    // Try to load from memory
    let prefs = this.preferences.get(userId);
    
    if (!prefs) {
      // Try to load from localStorage
      const stored = localStorage.getItem(`notifications_${userId}`);
      if (stored) {
        prefs = JSON.parse(stored);
        if (prefs) {
          this.preferences.set(userId, prefs);
        }
      }
      
      if (!prefs) {
        prefs = this.getDefaultPreferences(userId);
        this.preferences.set(userId, prefs);
      }
    }
    
    return prefs;
  }

  // Get default notification preferences
  private getDefaultPreferences(userId: string): NotificationPreferences {
    return {
      userId,
      eventUpdates: true,
      weatherAlerts: true,
      routeChanges: true,
      safetyAlerts: true,
      attendanceConfirmations: true,
      organizerMessages: true,
      browserNotifications: true,
      emailNotifications: true,
      pushNotifications: false,
      quietHours: {
        enabled: true,
        startTime: '22:00',
        endTime: '07:00',
      },
    };
  }

  // Check if notifications should be sent (considering quiet hours)
  private shouldSendNotification(userId: string, severity: NotificationData['severity']): boolean {
    const prefs = this.getPreferences(userId);
    
    // Always send critical notifications
    if (severity === 'critical') {
      return true;
    }

    // Check quiet hours
    if (prefs.quietHours.enabled) {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      const startTime = prefs.quietHours.startTime;
      const endTime = prefs.quietHours.endTime;
      
      // Handle overnight quiet hours (e.g., 22:00 to 07:00)
      if (startTime > endTime) {
        if (currentTime >= startTime || currentTime <= endTime) {
          return false;
        }
      } else if (currentTime >= startTime && currentTime <= endTime) {
        return false;
      }
    }

    return true;
  }

  // Send notification to user
  async sendNotification(notification: NotificationData, targetUserId?: string): Promise<void> {
    const userId = targetUserId || notification.userId;
    
    if (userId && !this.shouldSendNotification(userId, notification.severity)) {
      console.log('Notification blocked by quiet hours:', notification.title);
      return;
    }

    // Check user preferences
    if (userId) {
      const prefs = this.getPreferences(userId);
      
      if (!this.isNotificationTypeEnabled(notification.type, prefs)) {
        console.log('Notification type disabled by user:', notification.type);
        return;
      }

      // Send browser notification
      if (prefs.browserNotifications) {
        await this.sendBrowserNotification(notification);
      }

      // Send push notification
      if (prefs.pushNotifications) {
        await this.sendPushNotification(notification);
      }
    } else {
      // Send to all users (broadcast)
      await this.sendBrowserNotification(notification);
    }

    // Trigger in-app notification handlers
    this.subscriptions.forEach(callback => {
      try {
        callback(notification);
      } catch (error) {
        console.error('Error in notification callback:', error);
      }
    });
  }

  // Check if specific notification type is enabled
  private isNotificationTypeEnabled(type: NotificationData['type'], prefs: NotificationPreferences): boolean {
    switch (type) {
      case 'event_update':
        return prefs.eventUpdates;
      case 'weather_alert':
        return prefs.weatherAlerts;
      case 'route_change':
        return prefs.routeChanges;
      case 'safety_alert':
        return prefs.safetyAlerts;
      case 'attendance_confirmation':
        return prefs.attendanceConfirmations;
      case 'organizer_message':
        return prefs.organizerMessages;
      default:
        return true;
    }
  }

  // Send browser notification
  private async sendBrowserNotification(notification: NotificationData): Promise<void> {
    if (Notification.permission !== 'granted') {
      return;
    }

    const options: NotificationOptions = {
      body: notification.message,
      icon: '/favicon.ico',
      badge: '/favicon-32x32.png',
      data: notification.data,
      tag: notification.id,
      requireInteraction: notification.severity === 'critical',
      silent: notification.sound === 'silent',
    };

    // Add vibration and actions for mobile devices (if supported)
    const extendedOptions = options as any;
    
    if (notification.vibrate) {
      extendedOptions.vibrate = notification.vibrate;
    } else if (notification.severity === 'critical') {
      extendedOptions.vibrate = [200, 100, 200, 100, 200];
    } else if (notification.severity === 'high') {
      extendedOptions.vibrate = [200, 100, 200];
    }

    if (notification.imageUrl) {
      extendedOptions.image = notification.imageUrl;
    }

    // Add action buttons
    if (notification.actionUrl) {
      extendedOptions.actions = [
        {
          action: 'view',
          title: 'Ver Detalhes',
          icon: '/icons/view.png',
        },
        {
          action: 'dismiss',
          title: 'Dispensar',
          icon: '/icons/dismiss.png',
        },
      ];
    }

    const browserNotification = new Notification(notification.title, extendedOptions);

    // Handle notification click
    browserNotification.onclick = () => {
      if (notification.actionUrl) {
        window.open(notification.actionUrl, '_blank');
      }
      browserNotification.close();
    };

    // Auto-close after delay (except for critical notifications)
    if (notification.severity !== 'critical') {
      setTimeout(() => {
        browserNotification.close();
      }, 5000);
    }
  }

  // Send push notification (server-side implementation would be needed)
  private async sendPushNotification(notification: NotificationData): Promise<void> {
    // In a real implementation, this would send a request to your server
    // which would then send the push notification to the user's device
    console.log('Push notification would be sent:', notification);
  }

  // Subscribe to in-app notifications
  subscribe(id: string, callback: (notification: NotificationData) => void): void {
    this.subscriptions.set(id, callback);
  }

  // Unsubscribe from in-app notifications
  unsubscribe(id: string): void {
    this.subscriptions.delete(id);
  }

  // Create notification for different event types
  createEventUpdateNotification(
    protestId: string,
    title: string,
    message: string,
    severity: NotificationData['severity'] = 'medium'
  ): NotificationData {
    return {
      id: `event_${protestId}_${Date.now()}`,
      type: 'event_update',
      title,
      message,
      protestId,
      severity,
      timestamp: new Date(),
      actionUrl: `/protest/${protestId}`,
      sound: severity === 'critical' ? 'urgent' : 'default',
    };
  }

  createWeatherAlert(
    protestId: string,
    weatherCondition: string,
    severity: NotificationData['severity'] = 'medium'
  ): NotificationData {
    return {
      id: `weather_${protestId}_${Date.now()}`,
      type: 'weather_alert',
      title: 'Alerta Climático',
      message: `Condições meteorológicas: ${weatherCondition}`,
      protestId,
      severity,
      timestamp: new Date(),
      actionUrl: `/protest/${protestId}`,
      sound: 'default',
      vibrate: [100, 50, 100],
    };
  }

  createRouteChangeNotification(
    protestId: string,
    newRoute: string,
    reason?: string
  ): NotificationData {
    return {
      id: `route_${protestId}_${Date.now()}`,
      type: 'route_change',
      title: 'Mudança de Rota',
      message: `Nova rota: ${newRoute}${reason ? ` - ${reason}` : ''}`,
      protestId,
      severity: 'high',
      timestamp: new Date(),
      actionUrl: `/protest/${protestId}`,
      sound: 'urgent',
      vibrate: [200, 100, 200],
    };
  }

  createSafetyAlert(
    protestId: string,
    message: string,
    severity: NotificationData['severity'] = 'high'
  ): NotificationData {
    return {
      id: `safety_${protestId}_${Date.now()}`,
      type: 'safety_alert',
      title: 'Alerta de Segurança',
      message,
      protestId,
      severity,
      timestamp: new Date(),
      actionUrl: `/protest/${protestId}`,
      sound: 'urgent',
      vibrate: [200, 100, 200, 100, 200],
    };
  }

  createAttendanceConfirmation(
    protestId: string,
    userName: string
  ): NotificationData {
    return {
      id: `attendance_${protestId}_${Date.now()}`,
      type: 'attendance_confirmation',
      title: 'Presença Confirmada',
      message: `${userName} confirmou presença no evento`,
      protestId,
      severity: 'low',
      timestamp: new Date(),
      sound: 'silent',
    };
  }
}

// Export singleton instance
export const notificationService = NotificationService.getInstance();

// React hook for using notifications (should be in a separate React hooks file)
/*
import { useState, useEffect } from 'react';

export function useNotifications(userId?: string) {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const subscriptionId = `hook_${Date.now()}`;
    
    notificationService.subscribe(subscriptionId, (notification) => {
      setNotifications(prev => [notification, ...prev.slice(0, 49)]); // Keep last 50
      setUnreadCount(prev => prev + 1);
    });

    return () => {
      notificationService.unsubscribe(subscriptionId);
    };
  }, []);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setUnreadCount(0);
  };

  const getPreferences = () => {
    return userId ? notificationService.getPreferences(userId) : null;
  };

  const updatePreferences = (prefs: Partial<NotificationPreferences>) => {
    if (userId) {
      notificationService.setPreferences(userId, prefs);
    }
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    getPreferences,
    updatePreferences,
    requestPermission: notificationService.requestNotificationPermission.bind(notificationService),
    subscribeToPush: (uid: string) => notificationService.subscribeToPushNotifications(uid),
  };
}
*/