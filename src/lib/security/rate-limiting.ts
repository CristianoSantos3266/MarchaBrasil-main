interface RateLimitEntry {
  count: number
  firstAttempt: number
  lastAttempt: number
  blocked: boolean
  blockUntil?: number
}

interface RateLimitConfig {
  maxAttempts: number
  windowMs: number
  blockDurationMs: number
  progressiveDelay: boolean
}

class RateLimiter {
  private attempts: Map<string, RateLimitEntry> = new Map()
  private configs: Map<string, RateLimitConfig> = new Map()

  constructor() {
    // Define rate limiting configurations for different actions
    this.setConfig('event_creation', {
      maxAttempts: 3,
      windowMs: 60 * 60 * 1000, // 1 hour
      blockDurationMs: 4 * 60 * 60 * 1000, // 4 hours
      progressiveDelay: true
    })

    this.setConfig('organizer_verification', {
      maxAttempts: 5,
      windowMs: 24 * 60 * 60 * 1000, // 24 hours
      blockDurationMs: 24 * 60 * 60 * 1000, // 24 hours
      progressiveDelay: false
    })

    this.setConfig('login_attempts', {
      maxAttempts: 5,
      windowMs: 15 * 60 * 1000, // 15 minutes
      blockDurationMs: 30 * 60 * 1000, // 30 minutes
      progressiveDelay: true
    })

    this.setConfig('comment_posting', {
      maxAttempts: 10,
      windowMs: 60 * 1000, // 1 minute
      blockDurationMs: 5 * 60 * 1000, // 5 minutes
      progressiveDelay: true
    })

    this.setConfig('file_upload', {
      maxAttempts: 20,
      windowMs: 60 * 60 * 1000, // 1 hour
      blockDurationMs: 2 * 60 * 60 * 1000, // 2 hours
      progressiveDelay: false
    })
  }

  setConfig(action: string, config: RateLimitConfig) {
    this.configs.set(action, config)
  }

  getClientIdentifier(ip: string, userId?: string): string {
    // Use user ID if available, otherwise fall back to IP
    return userId ? `user_${userId}` : `ip_${ip}`
  }

  checkRateLimit(action: string, clientId: string): {
    allowed: boolean
    remainingAttempts: number
    resetTime: number
    retryAfter?: number
  } {
    const config = this.configs.get(action)
    if (!config) {
      throw new Error(`Rate limit configuration not found for action: ${action}`)
    }

    const now = Date.now()
    const entry = this.attempts.get(`${action}_${clientId}`)

    // Clean up expired entries
    this.cleanupExpiredEntries()

    // If no entry exists, this is the first attempt
    if (!entry) {
      this.attempts.set(`${action}_${clientId}`, {
        count: 1,
        firstAttempt: now,
        lastAttempt: now,
        blocked: false
      })

      return {
        allowed: true,
        remainingAttempts: config.maxAttempts - 1,
        resetTime: now + config.windowMs
      }
    }

    // Check if currently blocked
    if (entry.blocked && entry.blockUntil && now < entry.blockUntil) {
      return {
        allowed: false,
        remainingAttempts: 0,
        resetTime: entry.blockUntil,
        retryAfter: entry.blockUntil - now
      }
    }

    // Check if window has reset
    if (now - entry.firstAttempt > config.windowMs) {
      // Reset the counter
      this.attempts.set(`${action}_${clientId}`, {
        count: 1,
        firstAttempt: now,
        lastAttempt: now,
        blocked: false
      })

      return {
        allowed: true,
        remainingAttempts: config.maxAttempts - 1,
        resetTime: now + config.windowMs
      }
    }

    // Increment attempt count
    entry.count++
    entry.lastAttempt = now

    // Check if limit exceeded
    if (entry.count > config.maxAttempts) {
      entry.blocked = true
      entry.blockUntil = now + config.blockDurationMs

      return {
        allowed: false,
        remainingAttempts: 0,
        resetTime: entry.blockUntil,
        retryAfter: config.blockDurationMs
      }
    }

    // Calculate progressive delay if enabled
    if (config.progressiveDelay && entry.count > 1) {
      const delayMs = Math.min(1000 * Math.pow(2, entry.count - 2), 30000) // Max 30 seconds
      return {
        allowed: false,
        remainingAttempts: config.maxAttempts - entry.count,
        resetTime: now + config.windowMs,
        retryAfter: delayMs
      }
    }

    return {
      allowed: true,
      remainingAttempts: config.maxAttempts - entry.count,
      resetTime: now + config.windowMs
    }
  }

  recordSuccess(action: string, clientId: string) {
    // Reset the rate limit entry on successful action
    this.attempts.delete(`${action}_${clientId}`)
  }

  recordFailure(action: string, clientId: string) {
    // Failure is already recorded in checkRateLimit
    // This method can be used for additional failure tracking if needed
  }

  cleanupExpiredEntries() {
    const now = Date.now()
    for (const [key, entry] of this.attempts.entries()) {
      const config = this.getConfigForEntry(key)
      if (config && now - entry.firstAttempt > config.windowMs && 
          (!entry.blockUntil || now > entry.blockUntil)) {
        this.attempts.delete(key)
      }
    }
  }

  private getConfigForEntry(key: string): RateLimitConfig | undefined {
    for (const [action] of this.configs.entries()) {
      if (key.startsWith(action + '_')) {
        return this.configs.get(action)
      }
    }
    return undefined
  }

  // Get current status for an action/client
  getStatus(action: string, clientId: string): RateLimitEntry | null {
    return this.attempts.get(`${action}_${clientId}`) || null
  }

  // Admin function to unblock a client
  unblock(action: string, clientId: string): boolean {
    const key = `${action}_${clientId}`
    const entry = this.attempts.get(key)
    if (entry) {
      entry.blocked = false
      delete entry.blockUntil
      return true
    }
    return false
  }

  // Get all current rate limit states (for admin monitoring)
  getAllStates(): Array<{
    key: string
    action: string
    clientId: string
    entry: RateLimitEntry
  }> {
    const states = []
    for (const [key, entry] of this.attempts.entries()) {
      const parts = key.split('_')
      const action = parts[0]
      const clientId = parts.slice(1).join('_')
      states.push({ key, action, clientId, entry })
    }
    return states
  }
}

// Singleton instance
export const rateLimiter = new RateLimiter()

// Utility function to get client IP (for server-side use)
export function getClientIP(request: Request): string {
  // Try various headers that might contain the real IP
  const headers = request.headers
  
  const forwarded = headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  const realIp = headers.get('x-real-ip')
  if (realIp) {
    return realIp
  }
  
  const cfConnectingIp = headers.get('cf-connecting-ip')
  if (cfConnectingIp) {
    return cfConnectingIp
  }
  
  const xClientIp = headers.get('x-client-ip')
  if (xClientIp) {
    return xClientIp
  }
  
  // Fallback to a default (this should be replaced with actual IP detection)
  return '127.0.0.1'
}

// Client-side rate limiting using localStorage
export class ClientRateLimiter {
  private storageKey = 'civic_rate_limits'
  
  checkClientRateLimit(action: string, maxAttempts: number = 10, windowMs: number = 60000): {
    allowed: boolean
    remainingAttempts: number
    resetTime: number
  } {
    if (typeof window === 'undefined') {
      return { allowed: true, remainingAttempts: maxAttempts, resetTime: Date.now() + windowMs }
    }

    const now = Date.now()
    const stored = localStorage.getItem(this.storageKey)
    const data = stored ? JSON.parse(stored) : {}
    
    const entry = data[action]
    
    if (!entry) {
      data[action] = {
        count: 1,
        firstAttempt: now,
        resetTime: now + windowMs
      }
      localStorage.setItem(this.storageKey, JSON.stringify(data))
      return {
        allowed: true,
        remainingAttempts: maxAttempts - 1,
        resetTime: now + windowMs
      }
    }
    
    // Check if window has reset
    if (now > entry.resetTime) {
      data[action] = {
        count: 1,
        firstAttempt: now,
        resetTime: now + windowMs
      }
      localStorage.setItem(this.storageKey, JSON.stringify(data))
      return {
        allowed: true,
        remainingAttempts: maxAttempts - 1,
        resetTime: now + windowMs
      }
    }
    
    // Increment counter
    entry.count++
    
    if (entry.count > maxAttempts) {
      localStorage.setItem(this.storageKey, JSON.stringify(data))
      return {
        allowed: false,
        remainingAttempts: 0,
        resetTime: entry.resetTime
      }
    }
    
    localStorage.setItem(this.storageKey, JSON.stringify(data))
    return {
      allowed: true,
      remainingAttempts: maxAttempts - entry.count,
      resetTime: entry.resetTime
    }
  }
  
  resetClientRateLimit(action: string) {
    if (typeof window === 'undefined') return
    
    const stored = localStorage.getItem(this.storageKey)
    const data = stored ? JSON.parse(stored) : {}
    delete data[action]
    localStorage.setItem(this.storageKey, JSON.stringify(data))
  }
}

export const clientRateLimiter = new ClientRateLimiter()

// Middleware function for API routes
export function withRateLimit(
  action: string,
  handler: (request: Request, ...args: any[]) => Promise<Response>
) {
  return async (request: Request, ...args: any[]): Promise<Response> => {
    const ip = getClientIP(request)
    const clientId = rateLimiter.getClientIdentifier(ip)
    
    const result = rateLimiter.checkRateLimit(action, clientId)
    
    if (!result.allowed) {
      return new Response(
        JSON.stringify({
          error: 'Rate limit exceeded',
          retryAfter: result.retryAfter,
          resetTime: result.resetTime
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': Math.ceil((result.retryAfter || 0) / 1000).toString(),
            'X-RateLimit-Limit': '5',
            'X-RateLimit-Remaining': result.remainingAttempts.toString(),
            'X-RateLimit-Reset': result.resetTime.toString()
          }
        }
      )
    }
    
    try {
      const response = await handler(request, ...args)
      
      // Record success if response is OK
      if (response.ok) {
        rateLimiter.recordSuccess(action, clientId)
      } else {
        rateLimiter.recordFailure(action, clientId)
      }
      
      return response
    } catch (error) {
      rateLimiter.recordFailure(action, clientId)
      throw error
    }
  }
}