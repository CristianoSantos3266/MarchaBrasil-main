#!/bin/bash

set -e  # Exit on any error

echo "🚀 Starting deployment to staging server..."

# Configuration
STAGING_HOST="148.230.85.210"
STAGING_USER="root"
APP_DIR="/var/www/marchabrasil"  # Adjust this path as needed
BACKUP_DIR="/var/backups/marchabrasil"
PORT="3001"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

echo_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

echo_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Function to run commands on remote server
run_remote() {
    ssh ${STAGING_USER}@${STAGING_HOST} "$1"
}

echo "📋 Pre-deployment checks..."

# Check if server is reachable
if ! ping -c 1 ${STAGING_HOST} &> /dev/null; then
    echo_error "Cannot reach staging server ${STAGING_HOST}"
    exit 1
fi

echo_success "Server is reachable"

# Check if SSH connection works
if ! ssh -o ConnectTimeout=10 ${STAGING_USER}@${STAGING_HOST} "echo 'SSH connection successful'" &> /dev/null; then
    echo_error "SSH connection failed to ${STAGING_HOST}"
    echo "Please ensure SSH keys are set up or use: ssh-copy-id ${STAGING_USER}@${STAGING_HOST}"
    exit 1
fi

echo_success "SSH connection verified"

echo "📦 Deploying to staging server..."

# Deployment steps
run_remote "
set -e

echo '🔄 Navigating to app directory...'
cd ${APP_DIR} || { echo 'App directory not found'; exit 1; }

echo '💾 Creating backup...'
mkdir -p ${BACKUP_DIR}
cp -r . ${BACKUP_DIR}/backup-\$(date +%Y%m%d-%H%M%S) || echo 'Backup failed but continuing...'

echo '📥 Pulling latest changes...'
git fetch origin
git reset --hard origin/main

echo '📦 Installing dependencies...'
npm ci --production

echo '🏗️ Building application...'
npm run build

echo '🔄 Restarting application...'
if command -v pm2 &> /dev/null; then
    pm2 restart marchabrasil || pm2 start ecosystem.config.js
elif systemctl is-active --quiet marchabrasil; then
    systemctl restart marchabrasil
else
    echo 'No process manager found. Please start the application manually.'
fi

echo '⏳ Waiting for application to start...'
sleep 10

echo '🔍 Running health check...'
if curl -f http://localhost:${PORT} &> /dev/null; then
    echo '✅ Health check passed'
else
    echo '❌ Health check failed'
    exit 1
fi
"

if [ $? -eq 0 ]; then
    echo_success "Deployment completed successfully!"
    echo "🌐 Staging URL: http://${STAGING_HOST}:${PORT}"
    echo "📊 Deployment log saved on server"
else
    echo_error "Deployment failed!"
    exit 1
fi

echo "🏁 Deployment complete!"