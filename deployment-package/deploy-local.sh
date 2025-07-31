#!/bin/bash

# Deploy to Hostinger VPS
echo "🚀 Deploying Marcha Brasil platform..."

# Upload via SCP (will be prompted for password)
echo "📤 Uploading files..."
scp marchabrasil-complete.tar.gz u537066198@147.93.42.174:/tmp/

# SSH and deploy
echo "🔧 Deploying on server..."
ssh u537066198@147.93.42.174 << 'EOF'
cd /var/www
sudo rm -rf marchabrasil
sudo mkdir marchabrasil
sudo chown -R u537066198:u537066198 marchabrasil
cd marchabrasil
tar -xzf /tmp/marchabrasil-complete.tar.gz
npm install --production --silent
pm2 stop marchabrasil 2>/dev/null || true
pm2 delete marchabrasil 2>/dev/null || true
pm2 start server.js --name marchabrasil
pm2 save
echo "✅ Deployment complete - Platform running at http://147.93.42.174:3000"
EOF