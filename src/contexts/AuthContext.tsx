'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User as SupabaseUser } from '@supabase/supabase-js'
import { supabase, getCurrentUser, getUserProfile } from '@/lib/supabase'
import { User } from '@/types/database'

interface AuthContextType {
  user: SupabaseUser | null
  userProfile: User | null
  loading: boolean
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Demo mode detection
const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [ready, setReady] = useState(false)
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [userProfile, setUserProfile] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Prevent hydration mismatch - only render after client is ready
  useEffect(() => {
    setReady(true)
  }, [])

  const loadDemoUser = () => {
    if (typeof window !== 'undefined') {
      const demoUser = localStorage.getItem('demo-user')
      if (demoUser) {
        try {
          const userData = JSON.parse(demoUser)
          setUser(userData)
          setUserProfile({
            id: userData.id,
            email: userData.email,
            public_name: userData.public_name || userData.email?.split('@')[0] || userData.name,
            name: userData.name || userData.email?.split('@')[0],
            role: userData.role || 'user',
            created_at: userData.created_at || new Date().toISOString(),
            updated_at: userData.updated_at || new Date().toISOString()
          })
        } catch (error) {
          console.error('Error parsing demo user data:', error)
        }
      } else {
        setUser(null)
        setUserProfile(null)
      }
    }
  }

  useEffect(() => {
    if (isDemoMode) {
      // In demo mode, check localStorage for demo user
      loadDemoUser()
      
      // Listen for localStorage changes (e.g., from login page)
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'demo-user') {
          loadDemoUser()
        }
      }
      
      window.addEventListener('storage', handleStorageChange)
      
      // Also listen for custom events (for same-page updates)
      const handleCustomStorageChange = () => {
        loadDemoUser()
      }
      
      window.addEventListener('demo-user-updated', handleCustomStorageChange)
      
      setLoading(false)
      
      return () => {
        window.removeEventListener('storage', handleStorageChange)
        window.removeEventListener('demo-user-updated', handleCustomStorageChange)
      }
    }

    if (!supabase) {
      setLoading(false)
      return
    }

    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      
      if (session?.user) {
        const { data: profile } = await getUserProfile(session.user.id)
        setUserProfile(profile)
      }
      
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        
        if (session?.user) {
          const { data: profile } = await getUserProfile(session.user.id)
          setUserProfile(profile)
        } else {
          setUserProfile(null)
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    if (isDemoMode) {
      // In demo mode, just clear localStorage and state
      localStorage.removeItem('demo-user')
      setUser(null)
      setUserProfile(null)
      
      // Trigger custom event and reload page
      window.dispatchEvent(new CustomEvent('demo-user-updated'))
      setTimeout(() => {
        window.location.href = '/'
      }, 100)
      return
    }
    
    if (!supabase) return
    const { error } = await supabase.auth.signOut()
    if (!error) {
      setUser(null)
      setUserProfile(null)
    }
  }

  const refreshProfile = async () => {
    if (isDemoMode && user) {
      // In demo mode, reload from localStorage
      const demoUser = localStorage.getItem('demo-user')
      if (demoUser) {
        try {
          const userData = JSON.parse(demoUser)
          setUserProfile({
            id: userData.id,
            email: userData.email,
            public_name: userData.public_name || userData.email.split('@')[0],
            name: userData.name || userData.email.split('@')[0],
            phone: userData.phone || null,
            city: userData.city || null,
            state: userData.state || null,
            whatsapp: userData.whatsapp || null,
            bio: userData.bio || null,
            motivation: userData.motivation || null,
            social_link: userData.social_link || null,
            role: userData.role || 'user',
            created_at: userData.created_at || new Date().toISOString(),
            updated_at: userData.updated_at || new Date().toISOString()
          })
        } catch (error) {
          console.error('Error refreshing demo profile:', error)
        }
      }
    } else if (user) {
      const { data: profile } = await getUserProfile(user.id)
      setUserProfile(profile)
    }
  }

  // Prevent hydration mismatch - only render provider after client is ready
  if (!ready) {
    return (
      <AuthContext.Provider value={{
        user: null,
        userProfile: null,
        loading: true,
        signOut: async () => {},
        refreshProfile: async () => {}
      }}>
        {children}
      </AuthContext.Provider>
    )
  }

  return (
    <AuthContext.Provider value={{
      user,
      userProfile,
      loading,
      signOut,
      refreshProfile
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}