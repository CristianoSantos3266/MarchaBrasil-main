# 🚀 Pre-Launch Testing Guide - Marcha Brasil Platform

## 📋 Testing Checklist Overview

This guide covers all critical features that need testing before launch. Test each section systematically and note any issues.

---

## 🔐 **1. Authentication & User Management**

### Basic Authentication
- [ ] **Register new account** - Sign up with email/password
- [ ] **Email verification** - Check if verification emails are sent
- [ ] **Login/Logout** - Test login flow and session management
- [ ] **Password reset** - Test forgotten password functionality
- [ ] **User profiles** - Create and edit user profile information

### Role-Based Access
- [ ] **Regular user access** - Default permissions for new users
- [ ] **Organizer role** - Test organizer profile creation and approval
- [ ] **Admin access** - Full admin dashboard functionality
- [ ] **Role transitions** - User → Organizer → Admin progression

---

## 🌍 **2. Event Creation & Management**

### Domestic Events (Brazil)
- [ ] **Create Brazilian event** - Standard event in any state
- [ ] **National events** - Test "Evento Nacional" for all 27 capitals
- [ ] **Event types** - Test all: Manifestação, Marcha, Caminhoneiros, etc.
- [ ] **Date/time selection** - Portuguese calendar system
- [ ] **Location details** - States, cities, meeting points
- [ ] **Expected attendance** - Number input validation

### International Events
- [ ] **International toggle** - Enable "Brasileiros no Exterior" option
- [ ] **Country selection** - Test all 19+ countries in dropdown
- [ ] **Mutual exclusion** - Can't select both National + International
- [ ] **International placeholders** - Proper city/location examples
- [ ] **Form validation** - Required fields for international events

### Event Features
- [ ] **Event descriptions** - Rich text formatting and display
- [ ] **Image uploads** - Thumbnail upload and display
- [ ] **Meeting points** - Clear location descriptions
- [ ] **Event status** - Pending → Approved workflow

---

## 🎯 **3. Admin Dashboard**

### Event Management
- [ ] **View all events** - Complete event list with filters
- [ ] **Filter events** - By status: All, Pending, Approved, Rejected, Flagged
- [ ] **Search events** - By title, organizer, city
- [ ] **Event details modal** - Complete event information display
- [ ] **Approve events** - Change status to approved
- [ ] **Reject events** - Change status to rejected with reason
- [ ] **Flag events** - Mark suspicious events
- [ ] **Delete events** - **CRITICAL: Test persistence across page refresh**
- [ ] **Contact organizers** - Email and WhatsApp integration

### User Management
- [ ] **View users** - All registered users
- [ ] **Organizer approvals** - Approve/reject organizer applications
- [ ] **Role management** - Change user roles
- [ ] **User profiles** - View detailed user information

---

## 💳 **4. Payment System (International Stripe)**

### Donation Flow
- [ ] **Access donation page** - Navigate to /doar
- [ ] **Currency detection** - Auto-detect user's currency
- [ ] **Payment methods** - Cards working (boleto disabled temporarily)
- [ ] **Stripe checkout** - Redirect to Stripe payment page
- [ ] **Payment completion** - Return to success page
- [ ] **Error handling** - Test failed payments

### Multi-Currency Support
- [ ] **Test currencies** - BRL, USD, EUR, GBP, CAD, AUD, etc.
- [ ] **Regional detection** - Timezone-based currency selection
- [ ] **Payment confirmation** - Webhook processing

### Alternative Payment Methods
- [ ] **PIX placeholder** - Shows as "coming soon"
- [ ] **Bitcoin placeholder** - Displays placeholder address
- [ ] **Sharing functionality** - "Divulgação" button copies site link

---

## 🎮 **5. Gamification System**

### Engagement Indicators ("Engajamento")
- [ ] **Progress rings** - Color changes: Gray → Green → Yellow → Orange → Red
- [ ] **Percentage calculation** - Based on views, shares, confirmations
- [ ] **Dynamic scaling** - Proper thresholds (0-19%, 20-39%, etc.)
- [ ] **Icon display** - Heart icon instead of emojis
- [ ] **Stats display** - Eye, share, checkmark icons with counts

### Regional Impact
- [ ] **State rankings** - Top states by engagement
- [ ] **National stats** - Total events, confirmations, states
- [ ] **Momentum levels** - Começando → Iniciando → Crescendo → Aquecendo → Incendiando
- [ ] **Mobilization banner** - Checkmark icon with call-to-action

### User Badges & Progress
- [ ] **Badge earning** - Presente, Resistente, Mobilizador, Marchador Nacional
- [ ] **Milestone notifications** - 50, 100, 250, 500, 1000+ confirmations
- [ ] **Participation tracking** - Cities visited, states, events organized

---

## 📱 **6. User Experience & Interface**

### Navigation
- [ ] **Main navigation** - All menu items working
- [ ] **Mobile menu** - Responsive hamburger menu
- [ ] **Footer** - Present on all pages: "© 2025 Marcha Brasil • Desenvolvido por AlphaFlare"
- [ ] **Breadcrumbs** - Clear navigation paths

### Content Pages
- [ ] **Homepage** - Event feed and call-to-actions
- [ ] **Event listings** - /manifestacoes with BR/International/All filters
- [ ] **Event details** - Individual event pages with RSVP
- [ ] **FAQ page** - Complete with categories and search
- [ ] **Como Agir** - Guidelines for peaceful demonstrations
- [ ] **Videos** - Video upload and display functionality

### Responsive Design
- [ ] **Mobile compatibility** - Test on phones/tablets
- [ ] **Desktop layout** - Proper scaling on large screens
- [ ] **Form usability** - Easy input on all devices

---

## 🎪 **7. RSVP & Participation**

### Event Participation
- [ ] **RSVP modal** - Opens when clicking "Confirmar Presença"
- [ ] **Participant types** - Caminhoneiro, Motociclista, População Geral, etc.
- [ ] **Anonymous participation** - No personal data required
- [ ] **Verified participation** - Optional email/phone verification
- [ ] **Convoy locations** - For convoy-type events
- [ ] **Confirmation feedback** - Success messages and gamification

### Data Management
- [ ] **RSVP counting** - Accurate participant counts
- [ ] **Data persistence** - RSVPs survive page refreshes
- [ ] **Privacy compliance** - No public display of personal data

---

## 🔍 **8. Search & Discovery**

### Event Discovery
- [ ] **Event filters** - By type, location, date
- [ ] **Search functionality** - Find events by keywords
- [ ] **Map integration** - Geographic event display
- [ ] **Upcoming events** - Chronological sorting

### Content Search
- [ ] **FAQ search** - Category-based filtering
- [ ] **Admin search** - Event and user search in admin panel

---

## 🛡️ **9. Security & Privacy**

### Data Protection
- [ ] **Personal data handling** - Minimal collection, secure storage
- [ ] **Admin access control** - Proper role-based permissions
- [ ] **Input validation** - Prevent malicious inputs
- [ ] **HTTPS enforcement** - Secure connections

### Content Moderation
- [ ] **Event approval** - Manual review process
- [ ] **Content guidelines** - Peaceful demonstration focus
- [ ] **Reporting system** - Flag inappropriate content

---

## 📊 **10. Performance & Reliability**

### Loading & Speed
- [ ] **Page load times** - Under 3 seconds for main pages
- [ ] **Loading animations** - Professional spinners and skeletons
- [ ] **Image optimization** - Proper thumbnail sizing
- [ ] **Mobile performance** - Smooth experience on slower connections

### Data Persistence
- [ ] **LocalStorage reliability** - Demo data survives browser restarts
- [ ] **Form state preservation** - Complex forms maintain state
- [ ] **Error recovery** - Graceful handling of network issues

---

## 🚨 **Critical Issues to Watch For**

### High Priority
1. **Admin deletions not persisting** - MUST work for launch
2. **Payment failures** - Stripe integration must be solid
3. **International events** - Country selection and form validation
4. **Mobile responsiveness** - Platform must work on phones
5. **Authentication flow** - Login/register must be seamless

### Medium Priority
1. **Gamification accuracy** - Percentages and badges working correctly
2. **Email notifications** - Verification and admin alerts
3. **Search functionality** - Users must find relevant events
4. **Content moderation** - Admin tools must be efficient

---

## 🎯 **Final Launch Recommendations**

### Before Launch
1. **Test on real devices** - iPhone, Android, various screen sizes
2. **Load testing** - Simulate multiple simultaneous users
3. **Content review** - Ensure all text is appropriate and professional
4. **Legal compliance** - Privacy policy, terms of service
5. **Backup strategy** - Data export/import capabilities

### Launch Day Preparation
1. **Admin monitoring** - Have admins ready to moderate content
2. **Support channels** - WhatsApp, email for user assistance
3. **Analytics setup** - Track user behavior and engagement
4. **Performance monitoring** - Server resources and response times

### Post-Launch Priorities
1. **User feedback collection** - Gather improvement suggestions
2. **Feature usage analysis** - See what's working vs unused
3. **Security monitoring** - Watch for abuse or attacks
4. **Content growth** - Encourage quality event creation

---

## 📞 **Emergency Contacts & Resources**

- **Stripe Dashboard**: Monitor payment issues
- **Admin Panel**: `/admin` for content moderation
- **Server Logs**: Check for technical errors
- **User Feedback**: Collect through WhatsApp/email

---

**Good luck with the launch! 🇧🇷 The platform is well-built and ready to empower civic participation.**