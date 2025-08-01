#!/bin/bash

# Emergency deployment fix script
# Run this on your production server

echo "🚨 Emergency fix deployment starting..."

# Stop the application
echo "Stopping PM2..."
pm2 stop marchabrasil

# Backup current state
echo "Creating backup..."
cd /var/www
if [ -d "marchabrasil-backup" ]; then
    rm -rf marchabrasil-backup-old
    mv marchabrasil-backup marchabrasil-backup-old
fi
cp -r marchabrasil marchabrasil-backup

# Copy the working .next build
echo "Copying fixed build files..."
cd marchabrasil

# Remove the broken .next directory
rm -rf .next

# Get the working build from your local development
# You'll need to upload marcha-fixed-build.tar.gz to /var/www/ first
cd /var/www
if [ -f "marcha-fixed-build.tar.gz" ]; then
    echo "Extracting fixed build..."
    cd marchabrasil
    tar -xzf ../marcha-fixed-build.tar.gz --overwrite
else
    echo "❌ marcha-fixed-build.tar.gz not found in /var/www/"
    echo "Please upload it first, then run this script again"
    exit 1
fi

# Restart PM2
echo "Restarting PM2..."
pm2 restart marchabrasil

echo "✅ Emergency fix deployment complete!"
echo "Check https://marchabrasil.com to verify it's working"