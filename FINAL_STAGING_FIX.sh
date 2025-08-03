#!/bin/bash
# 🚨 FINAL STAGING FIX - Copy/Paste Into SSH Session

echo "🔧 Starting final apoiar routing fix..."

cd /var/www/marchabrasil-staging

echo "📍 Current directory: $(pwd)"

echo "🔍 Checking current navigation links..."
grep -n "doar\|support" src/components/ui/Navigation.tsx

echo "🛠️ Replacing ALL /doar with /support in navigation..."
sed -i 's|/doar|/support|g' src/components/ui/Navigation.tsx

echo "🗑️ Removing doar page completely..."
rm -rf src/app/doar

echo "🧹 Cleaning build cache..."
rm -rf .next

echo "🔨 Building application..."
npm run build

echo "🔄 Restarting staging..."
pm2 restart marchabrasil-staging

echo "✅ Verifying fix..."
echo "Support links found: $(curl -s http://localhost:3001 | grep -c 'href="/support"')"
echo "Doar links found: $(curl -s http://localhost:3001 | grep -c 'href="/doar"')"

echo "🎯 Expected: Support=2, Doar=0"
echo "✅ Fix completed!"