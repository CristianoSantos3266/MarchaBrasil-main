import { createClient } from '@supabase/supabase-js'

// Simple type definition to avoid import issues
type Database = {
  public: {
    Tables: any
    Views: any
    Functions: any
    Enums: any
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Only create client if valid credentials are provided
const hasValidCredentials = 
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://placeholder.supabase.co' && 
  supabaseAnonKey !== 'placeholder-key'

export const supabase = hasValidCredentials 
  ? createClient<Database>(supabaseUrl, supabaseAnonKey)
  : null

// Demo mode flag for launch
const DEMO_MODE = !hasValidCredentials || process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

// Debug logging (disabled for production)
// console.log('Supabase config:', { DEMO_MODE })

// Auth helpers
export const signUp = async (email: string, password: string) => {
  if (DEMO_MODE) {
    // Demo mode - simulate successful signup
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate network delay
    return { 
      data: { 
        user: { 
          id: 'demo-user-' + Date.now(), 
          email,
          email_confirmed_at: new Date().toISOString() // Auto-confirm in demo mode
        }, 
        session: { access_token: 'demo-token-' + Date.now() }
      }, 
      error: null 
    }
  }
  if (!supabase) {
    return { data: null, error: { message: 'Supabase not configured' } }
  }
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  return { data, error }
}

export const signIn = async (email: string, password: string) => {
  if (DEMO_MODE) {
    // Demo mode - simulate successful login
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate network delay
    return { 
      data: { 
        user: { id: 'demo-user-' + Date.now(), email }, 
        session: { access_token: 'demo-token' } 
      }, 
      error: null 
    }
  }
  if (!supabase) {
    return { data: null, error: { message: 'Supabase not configured' } }
  }
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export const signOut = async () => {
  if (!supabase) {
    return { error: { message: 'Supabase not configured' } }
  }
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async () => {
  if (!supabase) {
    return null
  }
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export const getUserProfile = async (userId: string) => {
  if (!supabase) {
    return { data: null, error: { message: 'Supabase not configured' } }
  }
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()
  
  return { data, error }
}

export const updateUserProfile = async (userId: string, updates: any) => {
  if (!supabase) {
    return { data: null, error: { message: 'Supabase not configured' } }
  }
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
  
  return { data, error }
}

// Event helpers
export const getApprovedEvents = async () => {
  if (!supabase) {
    return { data: [], error: null }
  }
  const { data, error } = await supabase
    .from('events')
    .select(`
      *,
      users!events_creator_id_fkey(public_name)
    `)
    .eq('status', 'approved')
    .order('date', { ascending: true })
  
  return { data, error }
}

export const getEventsByCreator = async (creatorId: string) => {
  if (!supabase) {
    return { data: [], error: null }
  }
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('creator_id', creatorId)
    .order('created_at', { ascending: false })
  
  return { data, error }
}

export const createEvent = async (eventData: any) => {
  if (!supabase) {
    return { data: null, error: { message: 'Supabase not configured' } }
  }
  const { data, error } = await supabase
    .from('events')
    .insert(eventData)
    .select()
    .single()
  
  return { data, error }
}

// Admin helpers
export const getPendingUsers = async () => {
  if (!supabase) {
    return { data: [], error: null }
  }
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('role', 'organizer-pending')
    .order('created_at', { ascending: true })
  
  return { data, error }
}

export const getPendingEvents = async () => {
  if (!supabase) {
    return { data: [], error: null }
  }
  const { data, error } = await supabase
    .from('events')
    .select(`
      *,
      users!events_creator_id_fkey(public_name, email, whatsapp)
    `)
    .eq('status', 'pending')
    .order('created_at', { ascending: true })
  
  return { data, error }
}

export const approveUser = async (userId: string) => {
  if (!supabase) {
    return { data: null, error: { message: 'Supabase not configured' } }
  }
  const { data, error } = await supabase
    .from('users')
    .update({ role: 'organizer' })
    .eq('id', userId)
    .select()
    .single()
  
  return { data, error }
}

export const approveEvent = async (eventId: string) => {
  if (!supabase) {
    return { data: null, error: { message: 'Supabase not configured' } }
  }
  const { data, error } = await supabase
    .from('events')
    .update({ status: 'approved' })
    .eq('id', eventId)
    .select()
    .single()
  
  return { data, error }
}

export const rejectEvent = async (eventId: string, reason: string) => {
  if (!supabase) {
    return { data: null, error: { message: 'Supabase not configured' } }
  }
  const { data, error } = await supabase
    .from('events')
    .update({ 
      status: 'rejected',
      rejection_reason: reason 
    })
    .eq('id', eventId)
    .select()
    .single()
  
  return { data, error }
}