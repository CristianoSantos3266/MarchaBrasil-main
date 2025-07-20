# 🛡️ Global Civic Mobilization Platform

A censorship-resistant web platform for coordinating peaceful protests and civic demonstrations worldwide.

## 🎯 Purpose

This platform serves as neutral civic infrastructure for:
- Sharing real-time information about upcoming protests
- Coordinating mass motorcades, marches, and regional actions  
- Enabling anonymous confirmation of attendance
- Showing the scale and composition of each action
- Withstanding censorship, blocks, or takedown attempts

## ✨ Features

### 🗺️ Interactive Global Map
- Clickable country and region selection
- Support for Brazil, Argentina, USA, France, Canada and more
- Real-time protest listings per region
- Visual overview of worldwide activity

### 📝 Anonymous RSVP System
- No personal data collection
- Participant category breakdown:
  - 🚛 Caminhoneiros (Truckers)
  - 🏍️ Motociclistas (Motorcyclists)  
  - 🚗 Carros (Cars)
  - 🌾 Produtores Rurais (Rural Producers)
  - 🛍️ Comerciantes (Merchants)
  - 👥 População Geral (General Population)

### 🛣️ Convoy Coordination
- Route mapping for carreatas/motociatas
- Start/end points with coordinates
- Departure times and waypoints
- Join location options (start, route, destination)

### 📬 Email Alerts
- Subscribe to specific states and protest types
- Anonymous email storage
- No tracking or personal data collection

### 🔐 Admin Panel
- Password-protected content management
- Create and edit protest events
- Manage convoy routes and details

### 🌐 Censorship Resistance
- Static site export for IPFS deployment
- Multiple mirror domain support
- Tor .onion service compatibility
- Automatic domain health checking
- DNS rotation and failover

## 🚀 Quick Start

### Development
```bash
# Clone and install
git clone <repository-url>
cd civic-mobilization
npm install

# Start development server
npm run dev
```

### Production Deployment

#### Traditional Hosting
```bash
# Build for standard hosting
npm run build

# Deploy to Vercel
vercel --prod
```

#### IPFS Deployment (Censorship-Resistant)
```bash
# Build static files for IPFS
npm run deploy:ipfs

# Upload 'out' folder to IPFS
ipfs add -r out/
```

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 + React 19 + TypeScript
- **Styling**: Tailwind CSS  
- **Maps**: Leaflet.js + React Leaflet
- **Date Handling**: date-fns
- **Deployment**: Static export for maximum portability

## 📱 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Works on mobile devices
- Progressive Web App (PWA) features

## 🔒 Security & Privacy

### Data Protection
- **No personal data collection**: Only anonymous email addresses for alerts
- **No tracking**: No analytics, cookies, or user identification
- **Client-side only**: All processing happens in the browser
- **No server vulnerabilities**: Static site deployment

### Censorship Resistance
- **Multiple domains**: Automatic mirror detection and failover
- **IPFS deployment**: Decentralized hosting immune to takedowns
- **Tor compatibility**: Accessible via .onion addresses
- **VPN friendly**: Works with all VPN services

## 🏛️ Legal & Ethical

### Peaceful Purpose
- **Defensive tool**: Designed to protect freedom of assembly
- **Political neutrality**: Not tied to any party or leader
- **Constitutional rights**: Supports Article 5, XVI of Brazilian Constitution
- **Non-violence**: Explicitly promotes peaceful demonstration

### Compliance
- **LGPD compliant**: Minimal data collection, user consent
- **International law**: Supports UN Declaration of Human Rights Article 20
- **Transparency**: Open source code for audit

## 💰 Donation System

Support the platform at `/support`:

**Traditional Donations (Stripe):**
- **Base Supporter** ($10): Infrastructure support
- **Builder** ($50): Feature development  
- **Defender** ($200): Advanced security features

**Crypto Donations:**
- Bitcoin, USDT (TRC20), Monero, Litecoin
- QR codes for easy sending
- Complete anonymity

## 📊 Analytics & Monitoring

**Real-time Metrics:**
- Trending events by RSVP growth
- Platform-wide statistics  
- Regional activity breakdown
- User engagement tracking

## 📖 Admin Panel

Access the admin panel at `/admin` with passwords: `admin123` or `civic2024!`

**Features:**
- Create and edit protest events globally
- Manage convoy routes and coordinates
- Session management (8-hour timeout)
- Multi-country support
- Delete inappropriate content
- Monitor RSVP counts

## 🆘 Emergency Access

If the main domain is blocked:

1. **Try mirrors**: Check alternative domains listed in censorship alert
2. **Use VPN**: Psiphon, Outline, or other circumvention tools
3. **Tor Browser**: Access via .onion address
4. **IPFS Gateway**: Direct IPFS hash access
5. **Local copy**: Keep offline version for emergencies

## 📞 Support

For technical issues or security concerns:
- **GitHub Issues**: Report bugs and feature requests
- **Security**: Contact maintainers privately for vulnerabilities
- **Legal**: Consult local lawyers for jurisdiction-specific advice

---

**Remember**: This platform is designed to protect and enable peaceful civic participation. Use it responsibly and in accordance with local laws while supporting the fundamental right to freedom of assembly.
