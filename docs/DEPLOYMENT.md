# 🛡️ Civic Mobilization Platform - Deployment Guide

## Censorship Resistance Strategy

This platform is designed to be censorship-resistant and deployable across multiple channels to ensure availability even under authoritarian pressure.

## 1. IPFS Deployment (Primary)

### Quick Deployment
```bash
npm run deploy:ipfs
```

### Manual IPFS Deployment
```bash
# Build static files
npm run build:static

# Deploy to IPFS (requires IPFS CLI)
ipfs add -r out/

# Pin to make permanent
ipfs pin add <hash>

# Access via gateway
https://ipfs.io/ipfs/<hash>
```

### IPFS Hosting Services
- **Pinata**: Professional IPFS pinning service
- **Fleek**: Automatic deployment from GitHub
- **IPFS Cluster**: Distributed pinning network

## 2. Traditional Web Hosting

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Netlify
```bash
# Build static files
npm run build:static

# Upload 'out' folder to Netlify
```

### GitHub Pages
```bash
# Push to gh-pages branch
git subtree push --prefix out origin gh-pages
```

## 3. Mirror Domains Strategy

To resist DNS blocking, deploy to multiple domains:

1. **Primary Domain**: `.com` or `.org`
2. **Mirror Domains**: Different TLDs (`.net`, `.info`, `.xyz`)
3. **Decentralized Domains**: Handshake (`.hns`) or ENS (`.eth`)

### Domain Rotation Script
```javascript
// Add to your HTML head
const mirrors = [
  'https://mobilizacao.com',
  'https://mobilizacao.net', 
  'https://mobilizacao.info',
  'https://ipfs.io/ipfs/<hash>'
];

// Automatic failover logic
function checkAndRedirect() {
  // Implementation for automatic mirror switching
}
```

## 4. Tor Network Deployment

### Create .onion Service
1. Set up Tor hidden service
2. Configure nginx/apache for .onion domain
3. Distribute .onion address through secure channels

## 5. DNS Configuration

### DNSLink for IPFS
```
TXT record: _dnslink.example.com
Value: dnslink=/ipfs/<hash>
```

### Cloudflare Configuration
- Enable IPFS gateway
- Set up DNS rotation
- Configure DDoS protection

## 6. Security Considerations

### Static Site Security
- No server-side vulnerabilities
- No databases to compromise
- All data processing client-side

### Data Privacy
- No personal data collection
- Anonymous RSVP system
- No tracking or analytics

### Communication Security
- HTTPS everywhere
- Content Security Policy (CSP)
- Subresource Integrity (SRI)

## 7. Monitoring and Maintenance

### Uptime Monitoring
- UptimeRobot for traditional domains
- IPFS gateway monitoring
- Mirror domain health checks

### Update Process
1. Test changes locally
2. Deploy to staging IPFS hash
3. Update production after verification
4. Update DNSLink records
5. Notify mirror operators

## 8. Emergency Procedures

### If Primary Domain is Blocked
1. Activate mirror domains
2. Distribute new URLs via secure channels
3. Push updates to IPFS
4. Activate Tor .onion service

### Content Distribution
- Social media (encrypted messages)
- Messaging apps (Signal, Telegram)
- Email lists (encrypted)
- Physical distribution

## 9. Legal Considerations

### Hosting Jurisdiction
- Choose hosting outside authoritarian reach
- Use providers with strong free speech policies
- Consider countries with strong digital rights

### Content Guidelines
- Maintain political neutrality
- Focus on peaceful protest coordination
- Avoid partisan messaging
- Document defensive/protective purpose

## 10. Technical Requirements

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Progressive Web App (PWA) features
- Offline functionality for core features

### Performance
- Optimized for slow connections
- Minimal bandwidth usage
- CDN for static assets

## Build Commands Reference

```bash
# Development
npm run dev

# Production build
npm run build:static

# IPFS deployment
npm run deploy:ipfs

# Static export only
npm run export
```

## Environment Variables

```bash
# .env.local
NODE_ENV=production
NEXT_PUBLIC_IPFS_GATEWAY=https://ipfs.io/ipfs/
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

---

**Remember**: The goal is to ensure this platform remains accessible to Brazilian citizens regardless of government interference or censorship attempts.