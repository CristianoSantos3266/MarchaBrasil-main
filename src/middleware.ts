import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Only apply middleware to admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Log admin route access attempts
    const userAgent = request.headers.get('user-agent') || 'unknown'
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    
    console.log(`🔐 Admin route access attempt: ${request.nextUrl.pathname} from IP: ${ip}, User-Agent: ${userAgent}`)
    
    // Add security headers for admin routes
    const response = NextResponse.next()
    
    // Prevent iframe embedding
    response.headers.set('X-Frame-Options', 'DENY')
    
    // Prevent MIME type sniffing
    response.headers.set('X-Content-Type-Options', 'nosniff')
    
    // Enable XSS protection
    response.headers.set('X-XSS-Protection', '1; mode=block')
    
    // Add referrer policy
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*'
  ]
}