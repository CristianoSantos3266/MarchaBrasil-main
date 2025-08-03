# 🚨 EXPEDITED MANUAL STAGING FIX

## SSH Connection Issue
Password authentication not working via CLI. Need manual terminal session.

## 📋 COPY/PASTE THESE COMMANDS

**1. Open Terminal and Connect:**
```bash
ssh root@148.230.85.210
# Enter password: Helena3266
```

**2. Navigate and Fix:**
```bash
cd /var/www/marchabrasil-staging

# Fix navigation links (/doar -> /support)
sed -i 's|href="/doar"|href="/support"|g' src/components/ui/Navigation.tsx

# Fix homepage button (<a> -> <Link>)  
sed -i 's|<a href="/support"|<Link href="/support"|g' src/app/page.tsx
sed -i 's|</a>|</Link>|g' src/app/page.tsx

# Remove old doar page
rm -rf src/app/doar

# Rebuild application
npm run build

# Restart staging
pm2 restart marchabrasil-staging
```

**3. Verify Fix:**
```bash
curl -s http://localhost:3001 | grep -c 'href="/support"'
# Should return: 2
```

## ✅ Expected Results:
- Navigation "Apoie" link → `/support`
- Homepage "Apoiar Plataforma" button → `/support` 
- `/doar` route removed completely
- Both lead to comprehensive support page

**ETA: 2-3 minutes** 🚀