'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { 
  UserPlusIcon, 
  UserMinusIcon, 
  BellIcon,
  BellSlashIcon
} from '@heroicons/react/24/outline'

interface FollowButtonProps {
  organizerId: string
  organizerName: string
  className?: string
  showNotificationToggle?: boolean
}

interface FollowStatus {
  isFollowing: boolean
  notificationsEnabled: boolean
  followerCount: number
}

export default function FollowButton({ 
  organizerId, 
  organizerName, 
  className = '',
  showNotificationToggle = true 
}: FollowButtonProps) {
  const { user } = useAuth()
  const [followStatus, setFollowStatus] = useState<FollowStatus>({
    isFollowing: false,
    notificationsEnabled: true,
    followerCount: 0
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user && organizerId) {
      loadFollowStatus()
    }
  }, [user, organizerId])

  const loadFollowStatus = async () => {
    try {
      // In production, this would fetch from your database
      const savedFollows = localStorage.getItem(`follows_${user?.id}`)
      const follows = savedFollows ? JSON.parse(savedFollows) : {}
      
      const isFollowing = follows[organizerId] !== undefined
      const notificationsEnabled = follows[organizerId]?.notifications !== false
      
      // Demo follower count
      const demoFollowerCounts: { [key: string]: number } = {
        'organizer_1': 1247,
        'organizer_2': 892,
        'organizer_3': 2156,
        'default': Math.floor(Math.random() * 500) + 100
      }
      
      setFollowStatus({
        isFollowing,
        notificationsEnabled,
        followerCount: demoFollowerCounts[organizerId] || demoFollowerCounts.default
      })
    } catch (error) {
      console.error('Error loading follow status:', error)
    }
  }

  const handleFollow = async () => {
    if (!user) {
      alert('Faça login para seguir organizadores')
      return
    }

    setLoading(true)
    try {
      const savedFollows = localStorage.getItem(`follows_${user.id}`)
      const follows = savedFollows ? JSON.parse(savedFollows) : {}

      if (followStatus.isFollowing) {
        // Unfollow
        delete follows[organizerId]
        setFollowStatus(prev => ({
          ...prev,
          isFollowing: false,
          followerCount: prev.followerCount - 1
        }))
      } else {
        // Follow
        follows[organizerId] = {
          organizerName,
          followedAt: new Date().toISOString(),
          notifications: true
        }
        setFollowStatus(prev => ({
          ...prev,
          isFollowing: true,
          notificationsEnabled: true,
          followerCount: prev.followerCount + 1
        }))
      }

      localStorage.setItem(`follows_${user.id}`, JSON.stringify(follows))
      
      // In production, this would make an API call to update the database
      console.log('Follow status updated:', { organizerId, isFollowing: !followStatus.isFollowing })
      
    } catch (error) {
      console.error('Error updating follow status:', error)
      alert('Erro ao atualizar status de seguimento')
    } finally {
      setLoading(false)
    }
  }

  const handleNotificationToggle = async () => {
    if (!user || !followStatus.isFollowing) return

    setLoading(true)
    try {
      const savedFollows = localStorage.getItem(`follows_${user.id}`)
      const follows = savedFollows ? JSON.parse(savedFollows) : {}
      
      if (follows[organizerId]) {
        follows[organizerId].notifications = !followStatus.notificationsEnabled
        localStorage.setItem(`follows_${user.id}`, JSON.stringify(follows))
        
        setFollowStatus(prev => ({
          ...prev,
          notificationsEnabled: !prev.notificationsEnabled
        }))
      }
    } catch (error) {
      console.error('Error updating notification preferences:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        onClick={handleFollow}
        disabled={loading}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
          ${followStatus.isFollowing 
            ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100' 
            : 'bg-blue-600 text-white hover:bg-blue-700'
          }
          ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}
        `}
      >
        {followStatus.isFollowing ? (
          <>
            <UserMinusIcon className="w-4 h-4" />
            Deixar de Seguir
          </>
        ) : (
          <>
            <UserPlusIcon className="w-4 h-4" />
            Seguir
          </>
        )}
      </button>

      {followStatus.isFollowing && showNotificationToggle && (
        <button
          onClick={handleNotificationToggle}
          disabled={loading}
          className={`
            p-2 rounded-lg transition-all duration-200
            ${followStatus.notificationsEnabled
              ? 'bg-green-50 text-green-600 border border-green-200 hover:bg-green-100'
              : 'bg-gray-50 text-gray-400 border border-gray-200 hover:bg-gray-100'
            }
            ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}
          `}
          title={followStatus.notificationsEnabled ? 'Desativar notificações' : 'Ativar notificações'}
        >
          {followStatus.notificationsEnabled ? (
            <BellIcon className="w-4 h-4" />
          ) : (
            <BellSlashIcon className="w-4 h-4" />
          )}
        </button>
      )}

      <span className="text-sm text-gray-500">
        {followStatus.followerCount.toLocaleString()} seguidores
      </span>
    </div>
  )
}