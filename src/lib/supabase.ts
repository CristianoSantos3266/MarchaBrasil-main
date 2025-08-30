import { createClient } from '@supabase/supabase-js'
import { isStrongPassword, PASSWORD_HELP_PT } from '@/lib/validation'

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
  if (!isStrongPassword(password)) {
    return { data: null, error: { message: PASSWORD_HELP_PT } }
  }
  
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
  if (DEMO_MODE) {
    // Demo mode - simulate successful update
    await new Promise(resolve => setTimeout(resolve, 500))
    return { 
      data: { 
        id: userId, 
        ...updates,
        updated_at: new Date().toISOString()
      }, 
      error: null 
    }
  }
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

// Donation helpers
export const getDonationStats = async () => {
  if (!supabase) {
    // Return demo data when Supabase is not configured
    return { 
      data: {
        total_raised: 0,
        total_donors: 0,
        currency: 'BRL',
        last_updated: new Date().toISOString()
      }, 
      error: null 
    }
  }
  const { data, error } = await supabase
    .from('donation_stats')
    .select('*')
    .single()
  
  return { data, error }
}

export const createDonation = async (donationData: {
  stripe_session_id: string;
  amount: number;
  payment_method: string;
  is_monthly: boolean;
  donation_tier?: string;
  tier_name?: string;
  donor_email?: string;
  metadata?: any;
}) => {
  if (!supabase) {
    return { data: null, error: { message: 'Supabase not configured' } }
  }
  const { data, error } = await supabase
    .from('donations')
    .insert(donationData)
    .select()
    .single()
  
  return { data, error }
}

export const updateDonationStatus = async (
  stripeSessionId: string, 
  status: string, 
  paymentIntentId?: string,
  completedAt?: string
) => {
  if (!supabase) {
    return { data: null, error: { message: 'Supabase not configured' } }
  }
  const updateData: any = { 
    payment_status: status,
    updated_at: new Date().toISOString()
  }
  
  if (paymentIntentId) {
    updateData.stripe_payment_intent_id = paymentIntentId
  }
  
  if (completedAt) {
    updateData.completed_at = completedAt
  }
  
  const { data, error } = await supabase
    .from('donations')
    .update(updateData)
    .eq('stripe_session_id', stripeSessionId)
    .select()
    .single()
  
  return { data, error }
}

// News helpers
export const getPublishedNews = async (limit?: number) => {
  if (DEMO_MODE) {
    // Return demo news data
    const demoNews = [
      {
        id: 'news-1',
        title: 'Grande Manifestação Pacífica em São Paulo',
        slug: 'manifestacao-sao-paulo-2024',
        content: `# Grande Manifestação Pacífica em São Paulo

Milhares de brasileiros se reuniram pacificamente na Avenida Paulista para defender a democracia e os valores constitucionais. O evento contou com a participação de famílias, estudantes e trabalhadores de toda a região metropolitana.

## Principais Reivindicações

- Defesa da Constituição
- Transparência no governo
- Liberdade de expressão
- Fortalecimento das instituições democráticas

A manifestação transcorreu de forma ordeira, com total apoio das autoridades locais e ampla cobertura da imprensa nacional e internacional.`,
        excerpt: 'Milhares se reuniram pacificamente na Avenida Paulista defendendo a democracia e valores constitucionais.',
        image_url: '/images/news/manifestacao-sp-2024.jpg',
        tags: ['São Paulo', 'Manifestação', 'Democracia', 'Constituição'],
        status: 'published' as const,
        author_id: 'demo-admin',
        author_name: 'Redação Marcha Brasil',
        created_at: '2024-07-15T10:00:00Z',
        updated_at: '2024-07-15T10:00:00Z',
        published_at: '2024-07-15T10:00:00Z',
        view_count: 1250
      },
      {
        id: 'news-2',
        title: 'Movimento Estudantil Organiza Ato Cívico em Brasília',
        slug: 'movimento-estudantil-brasilia',
        content: `# Movimento Estudantil Organiza Ato Cívico em Brasília

Estudantes de universidades de todo o país se mobilizam para um grande ato cívico na capital federal. O evento tem como objetivo defender a educação pública e a autonomia universitária.

## Apoio das Universidades

- UnB - Universidade de Brasília
- USP - Universidade de São Paulo  
- UFMG - Universidade Federal de Minas Gerais
- UFRJ - Universidade Federal do Rio de Janeiro

O movimento conta com apoio de professores, reitores e da sociedade civil organizada.`,
        excerpt: 'Estudantes de todo o país se mobilizam em Brasília pela educação pública e autonomia universitária.',
        video_url: 'https://www.youtube.com/watch?v=GHB0ITXp--c',
        tags: ['Brasília', 'Educação', 'Estudantes', 'Universidades'],
        status: 'published' as const,
        author_id: 'demo-admin',
        author_name: 'Redação Marcha Brasil',
        created_at: '2024-07-12T14:30:00Z',
        updated_at: '2024-07-12T14:30:00Z',
        published_at: '2024-07-12T14:30:00Z',
        view_count: 890
      },
      {
        id: 'news-3',
        title: 'Cidadãos se Mobilizam no Rio pela Transparência',
        slug: 'mobilizacao-rio-transparencia',
        content: `# Cidadãos se Mobilizam no Rio pela Transparência

Uma grande mobilização cívica acontece no Rio de Janeiro, reunindo cidadãos de todas as idades em defesa da transparência pública e do combate à corrupção.

## Participação Diversa

O movimento conta com:
- Profissionais liberais
- Comerciantes
- Aposentados
- Jovens e estudantes
- Famílias inteiras

A mobilização é apartidária e tem como foco exclusivo a defesa da transparência nas instituições públicas.`,
        excerpt: 'Grande mobilização cívica no Rio de Janeiro em defesa da transparência pública e combate à corrupção.',
        image_url: '/images/news/mobilizacao-rio-2024.jpg',
        tags: ['Rio de Janeiro', 'Transparência', 'Combate à Corrupção', 'Sociedade Civil'],
        status: 'published' as const,
        author_id: 'demo-admin',
        author_name: 'Redação Marcha Brasil',
        created_at: '2024-07-10T16:45:00Z',
        updated_at: '2024-07-10T16:45:00Z',
        published_at: '2024-07-10T16:45:00Z',
        view_count: 650
      }
    ]
    
    const result = limit ? demoNews.slice(0, limit) : demoNews
    return { data: result, error: null }
  }

  if (!supabase) {
    return { data: [], error: null }
  }

  let query = supabase
    .from('news_posts')
    .select(`
      *,
      users!news_posts_author_id_fkey(public_name)
    `)
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  if (limit) {
    query = query.limit(limit)
  }

  const { data, error } = await query
  return { data, error }
}

export const getNewsPost = async (slug: string) => {
  if (DEMO_MODE) {
    const demoNews = await getPublishedNews()
    const post = demoNews.data?.find(post => post.slug === slug)
    return { data: post || null, error: post ? null : { message: 'Post not found' } }
  }

  if (!supabase) {
    return { data: null, error: { message: 'Supabase not configured' } }
  }

  const { data, error } = await supabase
    .from('news_posts')
    .select(`
      *,
      users!news_posts_author_id_fkey(public_name)
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  return { data, error }
}

export const getAllNews = async (authorId?: string) => {
  if (DEMO_MODE) {
    const demoNews = await getPublishedNews()
    return demoNews
  }

  if (!supabase) {
    return { data: [], error: null }
  }

  let query = supabase
    .from('news_posts')
    .select(`
      *,
      users!news_posts_author_id_fkey(public_name)
    `)
    .order('created_at', { ascending: false })

  if (authorId) {
    query = query.eq('author_id', authorId)
  }

  const { data, error } = await query
  return { data, error }
}

export const createNewsPost = async (newsData: any, authorId: string) => {
  if (DEMO_MODE) {
    // Simulate creating a news post
    await new Promise(resolve => setTimeout(resolve, 500))
    const newPost = {
      id: `news-${Date.now()}`,
      ...newsData,
      slug: newsData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, ''),
      author_id: authorId,
      author_name: 'Demo User',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      published_at: newsData.status === 'published' ? new Date().toISOString() : null,
      view_count: 0
    }
    return { data: newPost, error: null }
  }

  if (!supabase) {
    return { data: null, error: { message: 'Supabase not configured' } }
  }

  const slug = newsData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
  
  const { data, error } = await supabase
    .from('news_posts')
    .insert({
      ...newsData,
      slug,
      author_id: authorId,
      published_at: newsData.status === 'published' ? new Date().toISOString() : null
    })
    .select(`
      *,
      users!news_posts_author_id_fkey(public_name)
    `)
    .single()

  return { data, error }
}

export const updateNewsPost = async (postId: string, updates: any) => {
  if (DEMO_MODE) {
    // Simulate updating a news post
    await new Promise(resolve => setTimeout(resolve, 500))
    return { 
      data: { 
        id: postId, 
        ...updates,
        updated_at: new Date().toISOString(),
        published_at: updates.status === 'published' ? new Date().toISOString() : null
      }, 
      error: null 
    }
  }

  if (!supabase) {
    return { data: null, error: { message: 'Supabase not configured' } }
  }

  if (updates.title) {
    updates.slug = updates.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
  }

  if (updates.status === 'published' && !updates.published_at) {
    updates.published_at = new Date().toISOString()
  }

  const { data, error } = await supabase
    .from('news_posts')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', postId)
    .select(`
      *,
      users!news_posts_author_id_fkey(public_name)
    `)
    .single()

  return { data, error }
}

export const deleteNewsPost = async (postId: string) => {
  if (DEMO_MODE) {
    // Simulate deleting a news post
    await new Promise(resolve => setTimeout(resolve, 500))
    return { error: null }
  }

  if (!supabase) {
    return { error: { message: 'Supabase not configured' } }
  }

  const { error } = await supabase
    .from('news_posts')
    .delete()
    .eq('id', postId)

  return { error }
}

// Attendance helpers
export const confirmEventAttendance = async (eventId: string, userId: string) => {
  if (DEMO_MODE) {
    // Simulate attendance confirmation
    await new Promise(resolve => setTimeout(resolve, 500))
    return { 
      data: { 
        event_id: eventId, 
        user_id: userId, 
        confirmed_at: new Date().toISOString() 
      }, 
      error: null 
    }
  }

  if (!supabase) {
    return { data: null, error: { message: 'Supabase not configured' } }
  }

  // First check if user already confirmed
  const { data: existing } = await supabase
    .from('event_confirmations')
    .select('id')
    .eq('event_id', eventId)
    .eq('user_id', userId)
    .single()

  if (existing) {
    return { data: null, error: { message: 'User already confirmed attendance' } }
  }

  // Insert confirmation
  const { data, error } = await supabase
    .from('event_confirmations')
    .insert({
      event_id: eventId,
      user_id: userId
    })
    .select()
    .single()

  if (!error) {
    // Increment event confirmed_count using RPC
    await supabase.rpc('increment_event_confirmation', { event_id: eventId })
  }

  return { data, error }
}

export const checkUserAttendanceConfirmation = async (eventId: string, userId: string) => {
  if (DEMO_MODE) {
    // In demo mode, simulate some confirmations
    const demoConfirmed = Math.random() > 0.7 // 30% chance user confirmed
    return { data: demoConfirmed ? { confirmed: true } : null, error: null }
  }

  if (!supabase) {
    return { data: null, error: null }
  }

  const { data, error } = await supabase
    .from('event_confirmations')
    .select('id')
    .eq('event_id', eventId)
    .eq('user_id', userId)
    .single()

  return { data, error }
}

export const getEventWithAttendance = async (eventId: string) => {
  if (DEMO_MODE) {
    // Return demo event with attendance data
    return {
      data: {
        id: eventId,
        title: 'Demo Event',
        confirmed_count: Math.floor(Math.random() * 1000) + 50,
        estimated_from_source: Math.floor(Math.random() * 5000) + 1000,
        source_name: 'Folha de S.Paulo',
        source_url: 'https://folha.uol.com.br'
      },
      error: null
    }
  }

  if (!supabase) {
    return { data: null, error: { message: 'Supabase not configured' } }
  }

  const { data, error } = await supabase
    .from('events')
    .select(`
      *,
      users!events_creator_id_fkey(public_name)
    `)
    .eq('id', eventId)
    .single()

  return { data, error }
}

// Comments helpers
export const getComments = async (contextType: 'event' | 'video', contextId: string, limit?: number) => {
  if (DEMO_MODE) {
    // Return demo comments
    const demoComments = [
      {
        id: 'comment-1',
        context_type: contextType,
        context_id: contextId,
        user_id: 'demo-user-1',
        comment_text: 'Excelente iniciativa! Vamos participar em massa.',
        is_flagged: false,
        created_at: new Date(Date.now() - 3600000).toISOString(),
        users: { public_name: 'Maria Silva' }
      },
      {
        id: 'comment-2',
        context_type: contextType,
        context_id: contextId,
        user_id: 'demo-user-2',
        comment_text: 'Importante manter a manifestação pacífica. Democracia sempre!',
        is_flagged: false,
        created_at: new Date(Date.now() - 7200000).toISOString(),
        users: { public_name: 'João Santos' }
      },
      {
        id: 'comment-3',
        context_type: contextType,
        context_id: contextId,
        user_id: 'demo-user-3',
        comment_text: 'Organizadores estão de parabéns pela transparência.',
        is_flagged: false,
        created_at: new Date(Date.now() - 10800000).toISOString(),
        users: { public_name: 'Ana Costa' }
      }
    ]
    
    const result = limit ? demoComments.slice(0, limit) : demoComments
    return { data: result, error: null }
  }

  if (!supabase) {
    return { data: [], error: null }
  }

  let query = supabase
    .from('comments')
    .select(`
      *,
      users!comments_user_id_fkey(public_name)
    `)
    .eq('context_type', contextType)
    .eq('context_id', contextId)
    .eq('is_flagged', false)
    .order('created_at', { ascending: false })

  if (limit) {
    query = query.limit(limit)
  }

  const { data, error } = await query
  return { data, error }
}

export const createComment = async (
  contextType: 'event' | 'video',
  contextId: string,
  userId: string,
  commentText: string
) => {
  if (DEMO_MODE) {
    // Simulate creating a comment
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
      data: {
        id: `comment-${Date.now()}`,
        context_type: contextType,
        context_id: contextId,
        user_id: userId,
        comment_text: commentText,
        is_flagged: false,
        created_at: new Date().toISOString(),
        users: { public_name: 'Usuário Demo' }
      },
      error: null
    }
  }

  if (!supabase) {
    return { data: null, error: { message: 'Supabase not configured' } }
  }

  // Sanitize comment text
  const sanitizedText = commentText.trim().substring(0, 500)

  const { data, error } = await supabase
    .from('comments')
    .insert({
      context_type: contextType,
      context_id: contextId,
      user_id: userId,
      comment_text: sanitizedText
    })
    .select(`
      *,
      users!comments_user_id_fkey(public_name)
    `)
    .single()

  return { data, error }
}

export const flagComment = async (commentId: string) => {
  if (DEMO_MODE) {
    // Simulate flagging a comment
    await new Promise(resolve => setTimeout(resolve, 300))
    return { error: null }
  }

  if (!supabase) {
    return { error: { message: 'Supabase not configured' } }
  }

  const { error } = await supabase
    .from('comments')
    .update({ is_flagged: true })
    .eq('id', commentId)

  return { error }
}