#!/bin/bash

# Deploy script for "Apoiar" routing fix to staging
# Run this on the staging server: root@148.230.85.210

echo "🔗 Deploying 'Apoiar' routing fix to staging..."

cd /var/www/marchabrasil-staging

# Pull latest changes (this assumes you have git access)
echo "📥 Pulling latest changes..."
git pull origin main || echo "⚠️ Git pull failed - manual file upload may be needed"

# Install any new dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building application..."
npm run build

# Restart the staging process
echo "🔄 Restarting staging process..."
pm2 restart marchabrasil-staging

# Check process status
echo "📊 Checking process status..."
pm2 status marchabrasil-staging

echo "✅ Deployment complete!"
echo "🌐 Test the fix at: http://148.230.85.210:3001"
echo ""
echo "🧪 Test checklist:"
echo "  1. Navigate to homepage"
echo "  2. Click 'Apoiar Plataforma' button -> should go to /support"
echo "  3. Click navigation 'Apoie' link -> should go to same /support page"
echo "  4. Verify /doar route no longer exists (should 404)"
echo ""
echo "📋 Changes made:"
echo "  - Navigation 'Apoie' link now points to /support"
echo "  - Homepage button converted to Next.js Link"
echo "  - Removed duplicate /doar page"
echo "  - Both routes now lead to comprehensive support page"