# 🇧🇷 Marcha Brasil Platform

A censorship-resistant Civic Mobilization Platform for Brazil, designed to coordinate peaceful mass demonstrations nationwide with advanced security features.

## 🎯 Purpose

This platform serves as neutral civic infrastructure for:
- Sharing real-time information about upcoming protests
- Coordinating mass motorcades, marches, and regional actions  
- Enabling anonymous confirmation of attendance
- Showing the scale and composition of each action
- Withstanding censorship, blocks, or takedown attempts

## ✨ Key Features

### 🗺️ Interactive Brazil Map with Mapbox
- State-by-state clickable selection
- Real-time protest listings per region
- Professional mapping with convoy routes
- Visual overview of nationwide activity

### 📝 Anonymous RSVP System
- No personal data collection
- Participant category breakdown:
  - 🚛 Caminhoneiros (Truckers)
  - 🏍️ Motociclistas (Motorcyclists)  
  - 🚗 Carros (Cars)
  - 🌾 Produtores Rurais (Rural Producers)
  - 🛍️ Comerciantes (Merchants)
  - 👥 População Geral (General Population)

### 💰 Donation System
- **PIX Integration**: Instant Brazilian payments
- **Stripe**: Credit/debit card processing
- **Crypto**: Bitcoin, USDT, Monero support
- Complete donation tracking and analytics

### 🛣️ Convoy Coordination
- Route mapping for carreatas/motociatas
- Start/end points with coordinates
- Departure times and waypoints
- Join location options (start, route, destination)

### 🔐 Admin Dashboard
- Secure admin panel with role-based access
- Complete event management system
- Real-time analytics and reporting
- User and organizer management
- Financial tracking and donation oversight

### 📱 Progressive Web App (PWA)
- Offline functionality with service worker
- Push notifications for event updates
- Mobile app-like experience
- Background sync capabilities

### 🌐 Censorship Resistance
- Static site export for IPFS deployment
- Multiple mirror domain support
- Anti-censorship detection and alerts
- DNS rotation and failover

## 🚀 Quick Start

### Development
```bash
# Clone and install
git clone https://github.com/CristianoSantos3266/MarchaBrasil-Platform.git
cd MarchaBrasil-Platform
npm install

# Set up environment variables
cp .env.example .env.local
# Add your Supabase, Stripe, and Mapbox credentials

# Start development server
npm run dev
```

### Production Deployment
```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 + React 19 + TypeScript
- **Styling**: Tailwind CSS  
- **Database**: Supabase (PostgreSQL)
- **Payments**: Stripe + PIX integration
- **Maps**: Mapbox GL JS
- **Authentication**: Supabase Auth
- **Deployment**: Static export for maximum portability

## 🔒 Security & Privacy

### Data Protection
- **Minimal data collection**: Only essential information
- **LGPD compliant**: Brazilian data protection compliance
- **Encrypted communications**: All data in transit encrypted
- **Server-side validation**: Admin role protection

### Censorship Resistance
- **Multiple deployment options**: Traditional hosting + IPFS
- **Mirror detection**: Automatic failover systems
- **Tor compatibility**: Accessible via .onion addresses
- **VPN friendly**: Works with all VPN services

## 📊 Platform Components

### Core Pages
- **Home**: Platform overview and featured events
- **Manifestações**: Event listings and search
- **Como Agir**: Action guides and resources
- **Apoie**: Donation and support page
- **Admin**: Secure management dashboard

### Advanced Features
- **Real-time updates**: Live event information
- **Email notifications**: Event alerts and updates
- **Social sharing**: WhatsApp, Twitter, Facebook integration
- **Multi-language**: Portuguese with internationalization ready

## 🏛️ Legal & Ethical

### Peaceful Purpose
- **Defensive tool**: Designed to protect freedom of assembly
- **Political neutrality**: Not tied to any party or leader
- **Constitutional rights**: Supports Brazilian Constitution Article 5, XVI
- **Non-violence**: Explicitly promotes peaceful demonstration

### Compliance
- **LGPD compliant**: Minimal data collection, user consent
- **Transparency**: Open source code for audit
- **Legal use only**: Platform cannot be used for illegal activities

## 📞 Support & Contact

For technical issues or questions:
- **GitHub Issues**: Report bugs and feature requests
- **Email**: Contact maintainers for support
- **Security**: Private security vulnerability reporting

---

**Remember**: This platform is designed to protect and enable peaceful civic participation. Use it responsibly and in accordance with Brazilian laws while supporting the fundamental right to freedom of assembly.