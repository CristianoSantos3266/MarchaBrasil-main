#!/bin/bash

# Safe deployment script - deploys from GitHub to server with rollback capability
set -euo pipefail

SERVER="claude@148.230.85.210"
PASSWORD="Helena3266##"
BASE_DIR="/var/www/marchabrasil"
REPO_URL="https://github.com/CristianoSantos3266/MarchaBrasil-main.git"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
NEW_RELEASE="$BASE_DIR/releases/deploy-$TIMESTAMP"

echo "🚀 Starting safe deployment to production server..."

# Deploy to server
ssh $SERVER << EOF
set -euo pipefail

echo "📁 Creating new release directory..."
mkdir -p "$NEW_RELEASE"

echo "📥 Cloning latest code from GitHub..."
git clone --depth=1 "$REPO_URL" "$NEW_RELEASE"

echo "📋 Copying environment file..."
if [ -f "$BASE_DIR/current/.env.local" ]; then
  cp "$BASE_DIR/current/.env.local" "$NEW_RELEASE/.env.local"
fi

echo "📦 Installing dependencies..."
cd "$NEW_RELEASE"
npm ci

echo "🔧 Building application..."
npm run build

echo "🔗 Backing up current symlink..."
CURRENT_BACKUP=\$(readlink "$BASE_DIR/current" 2>/dev/null || echo "")
if [ -n "\$CURRENT_BACKUP" ]; then
  echo "Current release backed up: \$CURRENT_BACKUP"
fi

echo "🔄 Switching to new release..."
ln -sfn "$NEW_RELEASE" "$BASE_DIR/current"

echo "🔄 Restarting application..."
# Kill current process gently
ps aux | grep 'node.*server.js' | grep -v grep | awk '{print \$2}' | xargs kill -TERM 2>/dev/null || true
sleep 3

# Start new process
cd "$BASE_DIR/current"
PORT=3003 NODE_ENV=production nohup node server.js > "$BASE_DIR/shared/app.log" 2> "$BASE_DIR/shared/app.err" &

echo "⏳ Waiting for application to start..."
sleep 5

echo "🏥 Health check..."
if curl -f -s http://127.0.0.1:3003/api/health > /dev/null; then
  echo "✅ Application started successfully!"
  echo "🗑️ Cleaning up old releases (keeping last 5)..."
  cd "$BASE_DIR/releases"
  ls -1t | tail -n +6 | xargs rm -rf 2>/dev/null || true
else
  echo "❌ Health check failed! Rolling back..."
  if [ -n "\$CURRENT_BACKUP" ] && [ -d "\$CURRENT_BACKUP" ]; then
    ln -sfn "\$CURRENT_BACKUP" "$BASE_DIR/current"
    cd "$BASE_DIR/current"
    PORT=3003 NODE_ENV=production nohup node server.js > "$BASE_DIR/shared/app.log" 2> "$BASE_DIR/shared/app.err" &
    echo "🔙 Rolled back to previous version"
    exit 1
  else
    echo "💥 No backup available - manual intervention needed"
    exit 1
  fi
fi

echo "🎉 Deployment completed successfully!"
echo "📊 Current release: $NEW_RELEASE"
echo "🌐 Site: https://marchabrasil.com"
EOF

echo "✅ Deployment finished!"