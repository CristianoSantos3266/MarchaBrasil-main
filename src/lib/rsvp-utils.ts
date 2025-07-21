'use client';

// Simple hash function for IP deduplication (client-side only)
export function hashIP(ip: string): string {
  if (!ip || typeof window === 'undefined') return '';
  
  // Simple hash function - not cryptographically secure but good enough for deduplication
  let hash = 0;
  for (let i = 0; i < ip.length; i++) {
    const char = ip.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

// Get client IP (browser fingerprint as fallback)
export function getClientFingerprint(): string {
  if (typeof window === 'undefined') return '';
  
  // Use a combination of browser properties as a fingerprint
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('Browser fingerprint', 2, 2);
  }
  
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
    canvas.toDataURL()
  ].join('|');
  
  return hashIP(fingerprint);
}

// Check if RSVP was already submitted (localStorage + fingerprint)
export function hasAlreadyRSVPed(protestId: string): boolean {
  if (typeof window === 'undefined') return false;
  
  const fingerprint = getClientFingerprint();
  const storageKey = `rsvp_${protestId}_${fingerprint}`;
  
  return localStorage.getItem(storageKey) !== null;
}

// Mark RSVP as submitted
export function markRSVPSubmitted(protestId: string, participantType: string): void {
  if (typeof window === 'undefined') return;
  
  const fingerprint = getClientFingerprint();
  const storageKey = `rsvp_${protestId}_${fingerprint}`;
  
  localStorage.setItem(storageKey, JSON.stringify({
    participantType,
    timestamp: new Date().toISOString(),
    fingerprint
  }));
}

// Get RSVP history for analytics
export function getRSVPHistory(): Array<{protestId: string, participantType: string, timestamp: string}> {
  if (typeof window === 'undefined') return [];
  
  const history = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('rsvp_')) {
      try {
        const data = JSON.parse(localStorage.getItem(key) || '{}');
        const protestId = key.split('_')[1];
        history.push({
          protestId,
          participantType: data.participantType,
          timestamp: data.timestamp
        });
      } catch (e) {
        // Ignore malformed entries
      }
    }
  }
  
  return history.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}