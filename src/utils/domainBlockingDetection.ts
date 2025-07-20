export interface DomainHealth {
  isAccessible: boolean;
  responseTime: number;
  lastChecked: string;
  error?: string;
}

export interface FallbackOptions {
  enableIPFS: boolean;
  enableTor: boolean;
  enableVPN: boolean;
  showWarning: boolean;
}

// Brazil-specific checks for domain blocking
export async function checkDomainAccessibility(domain: string): Promise<DomainHealth> {
  const startTime = Date.now();
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(`${domain}/health`, {
      method: 'HEAD',
      signal: controller.signal,
      cache: 'no-cache'
    });
    
    clearTimeout(timeoutId);
    
    const responseTime = Date.now() - startTime;
    
    return {
      isAccessible: response.ok,
      responseTime,
      lastChecked: new Date().toISOString(),
      error: response.ok ? undefined : `HTTP ${response.status}`
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    return {
      isAccessible: false,
      responseTime,
      lastChecked: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Network error'
    };
  }
}

export async function detectCensorship(): Promise<{
  isBlocked: boolean;
  evidence: string[];
  recommendations: string[];
}> {
  const evidence: string[] = [];
  const recommendations: string[] = [];
  
  // Check if we're accessing via a suspicious route
  const currentDomain = window.location.hostname;
  const knownMirrors = ['ipfs.io', 'gateway.pinata.cloud', '.onion'];
  const isUsingMirror = knownMirrors.some(mirror => currentDomain.includes(mirror));
  
  if (isUsingMirror) {
    evidence.push('Currently accessing via mirror domain');
    recommendations.push('Main domain may be blocked');
  }
  
  // Check DNS resolution time (high latency may indicate DNS tampering)
  const dnsStart = Date.now();
  try {
    await fetch('/favicon.ico', { method: 'HEAD' });
    const dnsTime = Date.now() - dnsStart;
    
    if (dnsTime > 3000) {
      evidence.push(`Slow DNS resolution (${dnsTime}ms)`);
      recommendations.push('Consider using alternative DNS servers (1.1.1.1, 8.8.8.8)');
    }
  } catch (error) {
    evidence.push('DNS resolution failed');
    recommendations.push('Use VPN or Tor browser');
  }
  
  // Check for specific Brazilian ISP blocking patterns
  const userAgent = navigator.userAgent;
  const connection = (navigator as any).connection;
  
  if (connection && connection.effectiveType === 'slow-2g' && connection.downlink < 0.1) {
    evidence.push('Artificially throttled connection detected');
    recommendations.push('Connection appears to be artificially limited');
  }
  
  // Check for redirect loops or unusual responses
  const redirectLoops = localStorage.getItem('redirectLoops');
  if (redirectLoops && parseInt(redirectLoops) > 3) {
    evidence.push('Multiple redirects detected');
    recommendations.push('Clear browser cache and try again');
  }
  
  const isBlocked = evidence.length > 0;
  
  if (isBlocked) {
    recommendations.unshift(
      'Use VPN (recommended: Psiphon, Outline)',
      'Access via Tor browser',
      'Try IPFS gateway links',
      'Contact local digital rights organizations'
    );
  }
  
  return {
    isBlocked,
    evidence,
    recommendations
  };
}

export function enableAntiCensorshipMode(): void {
  // Store preference for anti-censorship features
  localStorage.setItem('antiCensorshipMode', 'true');
  
  // Enable service worker for offline functionality
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(console.error);
  }
  
  // Preload IPFS mirrors
  const ipfsMirrors = [
    'https://ipfs.io/ipfs/QmYourHashHere',
    'https://gateway.pinata.cloud/ipfs/QmYourHashHere',
    'https://cloudflare-ipfs.com/ipfs/QmYourHashHere'
  ];
  
  ipfsMirrors.forEach(mirror => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = mirror;
    document.head.appendChild(link);
  });
}

export function getBrazilianCensorshipInfo() {
  return {
    commonBlocks: [
      'DNS blocking by ISPs',
      'Court orders (Alexandre de Moraes pattern)',
      'Deep packet inspection',
      'IP address blocking'
    ],
    circumventionMethods: [
      {
        name: 'VPN Services',
        tools: ['Psiphon (free)', 'Outline', 'ProtonVPN', 'NordVPN'],
        difficulty: 'Easy',
        reliability: 'High'
      },
      {
        name: 'Tor Browser',
        tools: ['Tor Browser', 'Orbot (mobile)'],
        difficulty: 'Medium',
        reliability: 'Very High'
      },
      {
        name: 'DNS Changes',
        tools: ['1.1.1.1', '8.8.8.8', 'OpenDNS'],
        difficulty: 'Easy',
        reliability: 'Medium'
      },
      {
        name: 'IPFS Access',
        tools: ['IPFS Desktop', 'Brave Browser', 'Gateway links'],
        difficulty: 'Medium',
        reliability: 'High'
      }
    ],
    legalContext: {
      constitution: 'Article 5, XVI protects freedom of assembly',
      internetLaw: 'Marco Civil da Internet protects digital rights',
      warning: 'Peaceful protest coordination is constitutionally protected'
    }
  };
}