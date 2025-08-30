import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Admin guard helper
function checkAdminAccess(request: NextRequest) {
  const adminEmail = process.env.ADMIN_EMAIL
  const userEmail = request.headers.get('x-user-email')?.toLowerCase()

  if (!adminEmail) {
    return { authorized: false, error: 'Admin email not configured' }
  }

  if (!userEmail || userEmail !== adminEmail.toLowerCase()) {
    return { authorized: false, error: 'Unauthorized' }
  }

  return { authorized: true }
}

export async function GET(request: NextRequest) {
  // Admin access check
  const adminCheck = checkAdminAccess(request)
  if (!adminCheck.authorized) {
    return NextResponse.json({ error: adminCheck.error }, { status: 403 })
  }

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        users!events_creator_id_fkey(public_name, email, whatsapp)
      `)
      .or('status.eq.pending,approved.eq.false')
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}