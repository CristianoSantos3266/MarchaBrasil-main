#!/bin/bash

# Direct local-to-server deployment script
set -euo pipefail

SERVER="claude@148.230.85.210"
BASE_DIR="/var/www/marchabrasil"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
NEW_RELEASE="$BASE_DIR/releases/local-$TIMESTAMP"
LOCAL_DIR="$(pwd)"

echo "🚀 Starting direct deployment from local to server..."

# Create release directory on server
ssh $SERVER "mkdir -p $NEW_RELEASE"

echo "📁 Syncing local files to server..."
# Sync all files except node_modules, .next, .git
rsync -avz --progress \
  --exclude='node_modules/' \
  --exclude='.next/' \
  --exclude='.git/' \
  --exclude='*.log' \
  --exclude='deploy-*.sh' \
  "$LOCAL_DIR/" "$SERVER:$NEW_RELEASE/"

echo "📋 Setting up environment and building on server..."
ssh $SERVER << EOF
set -euo pipefail

cd "$NEW_RELEASE"

# Copy existing .env.local if it exists
if [ -f "$BASE_DIR/current/.env.local" ]; then
  cp "$BASE_DIR/current/.env.local" .env.local
else
  echo "⚠️  No .env.local found - you may need to configure environment variables"
fi

# Install and build
echo "📦 Installing dependencies..."
npm ci

echo "🔧 Building application..."
npm run build

# Backup current release
CURRENT_BACKUP=\$(readlink "$BASE_DIR/current" 2>/dev/null || echo "")

echo "🔄 Switching to new release..."
ln -sfn "$NEW_RELEASE" "$BASE_DIR/current"

echo "🔄 Restarting application..."
# Kill current process
ps aux | grep 'node.*server.js' | grep -v grep | awk '{print \$2}' | xargs kill -TERM 2>/dev/null || true
sleep 3

# Start new process
cd "$BASE_DIR/current"
PORT=3003 NODE_ENV=production nohup node server.js > "$BASE_DIR/shared/app.log" 2> "$BASE_DIR/shared/app.err" &

echo "⏳ Waiting for application to start..."
sleep 5

echo "🏥 Health check..."
if curl -f -s http://127.0.0.1:3003/api/health > /dev/null; then
  echo "✅ Deployment successful!"
  echo "🗑️ Cleaning up old releases..."
  cd "$BASE_DIR/releases"
  ls -1t | tail -n +6 | xargs rm -rf 2>/dev/null || true
else
  echo "❌ Health check failed!"
  if [ -n "\$CURRENT_BACKUP" ] && [ -d "\$CURRENT_BACKUP" ]; then
    echo "🔙 Rolling back..."
    ln -sfn "\$CURRENT_BACKUP" "$BASE_DIR/current"
    cd "$BASE_DIR/current"
    PORT=3003 NODE_ENV=production nohup node server.js > "$BASE_DIR/shared/app.log" 2> "$BASE_DIR/shared/app.err" &
    echo "Rolled back to previous version"
    exit 1
  else
    echo "💥 No backup available"
    exit 1
  fi
fi
EOF

echo "🎉 Local deployment completed successfully!"
echo "🌐 Site: https://marchabrasil.com"