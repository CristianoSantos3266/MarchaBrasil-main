'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import {
  BellIcon,
  CalendarIcon,
  MapPinIcon,
  UsersIcon,
  XMarkIcon,
  CheckIcon
} from '@heroicons/react/24/outline'

interface EventNotification {
  id: string
  organizerId: string
  organizerName: string
  eventId: string
  eventTitle: string
  eventDate: string
  eventLocation: string
  eventType: string
  createdAt: string
  read: boolean
}

export default function FollowNotifications() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<EventNotification[]>([])
  const [loading, setLoading] = useState(true)
  const [showNotifications, setShowNotifications] = useState(false)

  useEffect(() => {
    if (user) {
      loadNotifications()
      // Check for new events from followed organizers periodically
      const interval = setInterval(checkForNewEvents, 60000) // Every minute
      return () => clearInterval(interval)
    }
  }, [user])

  const loadNotifications = async () => {
    try {
      const savedNotifications = localStorage.getItem(`notifications_${user?.id}`)
      const notificationData = savedNotifications ? JSON.parse(savedNotifications) : []
      
      setNotifications(notificationData)
    } catch (error) {
      console.error('Error loading notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const checkForNewEvents = async () => {
    if (!user) return

    try {
      // Get followed organizers
      const savedFollows = localStorage.getItem(`follows_${user.id}`)
      const follows = savedFollows ? JSON.parse(savedFollows) : {}
      
      const followedOrganizerIds = Object.keys(follows).filter(
        organizerId => follows[organizerId].notifications !== false
      )

      if (followedOrganizerIds.length === 0) return

      // In production, this would check the database for new events
      // For demo, we'll simulate new event notifications
      generateDemoNotifications(followedOrganizerIds, follows)
      
    } catch (error) {
      console.error('Error checking for new events:', error)
    }
  }

  const generateDemoNotifications = (organizerIds: string[], follows: any) => {
    const demoEvents = [
      {
        organizerId: 'organizer_1',
        organizerName: 'Coordenação SP',
        eventTitle: 'Nova Manifestação pela Democracia',
        eventDate: '2024-08-15',
        eventLocation: 'Praça da República',
        eventType: 'manifestacao'
      },
      {
        organizerId: 'organizer_2',
        organizerName: 'Sindicato dos Caminhoneiros',
        eventTitle: 'Carreata Nacional dos Transportadores',
        eventDate: '2024-08-20',
        eventLocation: 'Rodovia Presidente Dutra',
        eventType: 'caminhoneiros'
      }
    ]

    const existingNotifications = localStorage.getItem(`notifications_${user?.id}`)
    const existing = existingNotifications ? JSON.parse(existingNotifications) : []
    
    const newNotifications = demoEvents
      .filter(event => organizerIds.includes(event.organizerId))
      .map(event => ({
        id: `notif_${Date.now()}_${Math.random()}`,
        organizerId: event.organizerId,
        organizerName: follows[event.organizerId]?.organizerName || event.organizerName,
        eventId: `event_${Date.now()}`,
        eventTitle: event.eventTitle,
        eventDate: event.eventDate,
        eventLocation: event.eventLocation,
        eventType: event.eventType,
        createdAt: new Date().toISOString(),
        read: false
      }))

    // Only add if we don't already have notifications for these events
    const existingEventTitles = existing.map((n: EventNotification) => n.eventTitle)
    const uniqueNewNotifications = newNotifications.filter(
      notif => !existingEventTitles.includes(notif.eventTitle)
    )

    if (uniqueNewNotifications.length > 0) {
      const updatedNotifications = [...uniqueNewNotifications, ...existing].slice(0, 50) // Keep last 50
      setNotifications(updatedNotifications)
      localStorage.setItem(`notifications_${user?.id}`, JSON.stringify(updatedNotifications))
      
      // Show browser notification
      if (Notification.permission === 'granted') {
        uniqueNewNotifications.forEach(notif => {
          new Notification(`Novo evento de ${notif.organizerName}`, {
            body: notif.eventTitle,
            icon: '/logo.png'
          })
        })
      }
    }
  }

  const markAsRead = (notificationId: string) => {
    const updatedNotifications = notifications.map(notif => 
      notif.id === notificationId ? { ...notif, read: true } : notif
    )
    setNotifications(updatedNotifications)
    localStorage.setItem(`notifications_${user?.id}`, JSON.stringify(updatedNotifications))
  }

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notif => ({ ...notif, read: true }))
    setNotifications(updatedNotifications)
    localStorage.setItem(`notifications_${user?.id}`, JSON.stringify(updatedNotifications))
  }

  const deleteNotification = (notificationId: string) => {
    const updatedNotifications = notifications.filter(notif => notif.id !== notificationId)
    setNotifications(updatedNotifications)
    localStorage.setItem(`notifications_${user?.id}`, JSON.stringify(updatedNotifications))
  }

  const unreadCount = notifications.filter(notif => !notif.read).length

  if (!user) return null

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <BellIcon className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {showNotifications && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-900">Notificações</h3>
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Marcar todas como lidas
                  </button>
                )}
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4">
                <div className="animate-pulse space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-16 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <BellIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Nenhuma notificação ainda.</p>
                <p className="text-sm mt-1">Siga organizadores para receber avisos de novos eventos!</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map(notification => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 transition-colors ${
                      !notification.read ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900 text-sm">
                            {notification.organizerName}
                          </span>
                          {!notification.read && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          )}
                        </div>
                        
                        <h4 className="font-medium text-gray-800 text-sm mb-2 line-clamp-2">
                          {notification.eventTitle}
                        </h4>
                        
                        <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="w-3 h-3" />
                            {new Date(notification.eventDate).toLocaleDateString('pt-BR')}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPinIcon className="w-3 h-3" />
                            {notification.eventLocation}
                          </div>
                        </div>
                        
                        <p className="text-xs text-gray-400">
                          {new Date(notification.createdAt).toLocaleString('pt-BR')}
                        </p>
                      </div>
                      
                      <div className="flex gap-1 ml-2">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="p-1 text-gray-400 hover:text-green-600"
                            title="Marcar como lida"
                          >
                            <CheckIcon className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="p-1 text-gray-400 hover:text-red-600"
                          title="Remover notificação"
                        >
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}