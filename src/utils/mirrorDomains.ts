export const MIRROR_DOMAINS = [
  'https://mobilizacao.com',
  'https://mobilizacao.net',
  'https://mobilizacao.org',
  'https://mobilizacao.info',
  'https://mobilizacao.xyz',
  'https://ipfs.io/ipfs/QmYourHashHere',
  'https://gateway.pinata.cloud/ipfs/QmYourHashHere'
];

export const TOR_ONION_ADDRESS = 'http://your-onion-address.onion';

export async function checkDomainHealth(domain: string): Promise<boolean> {
  try {
    const response = await fetch(`${domain}/health`, {
      method: 'HEAD',
      timeout: 5000,
      signal: AbortSignal.timeout(5000)
    });
    return response.ok;
  } catch {
    return false;
  }
}

export async function findWorkingMirror(): Promise<string | null> {
  const currentDomain = window.location.origin;
  
  // First check if current domain is working
  if (await checkDomainHealth(currentDomain)) {
    return currentDomain;
  }

  // Check mirror domains
  for (const domain of MIRROR_DOMAINS) {
    if (domain !== currentDomain && await checkDomainHealth(domain)) {
      return domain;
    }
  }

  return null;
}

export function redirectToMirror(mirrorDomain: string) {
  const currentPath = window.location.pathname + window.location.search;
  const newUrl = `${mirrorDomain}${currentPath}`;
  
  // Store the original domain for future reference
  localStorage.setItem('originalDomain', window.location.origin);
  localStorage.setItem('lastWorkingMirror', mirrorDomain);
  
  window.location.href = newUrl;
}

export function initializeMirrorCheck() {
  // Check every 30 seconds if the current domain is still accessible
  setInterval(async () => {
    const currentDomain = window.location.origin;
    const isHealthy = await checkDomainHealth(currentDomain);
    
    if (!isHealthy) {
      const workingMirror = await findWorkingMirror();
      if (workingMirror && workingMirror !== currentDomain) {
        console.warn('Current domain appears blocked. Redirecting to mirror...');
        redirectToMirror(workingMirror);
      }
    }
  }, 30000); // Check every 30 seconds
}

export function getStoredMirrorInfo() {
  return {
    originalDomain: localStorage.getItem('originalDomain'),
    lastWorkingMirror: localStorage.getItem('lastWorkingMirror'),
    isUsingMirror: window.location.origin !== localStorage.getItem('originalDomain')
  };
}