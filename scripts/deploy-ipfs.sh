#!/bin/bash

# IPFS Deployment Script for Civic Mobilization Platform
# This script builds and prepares the app for IPFS deployment

echo "🛡️ Building Civic Mobilization Platform for IPFS..."

# Build the static export
npm run build:static

if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    echo ""
    echo "📁 Static files are ready in the 'out' directory"
    echo ""
    echo "🌐 To deploy to IPFS:"
    echo "1. Install IPFS Desktop or IPFS CLI"
    echo "2. Run: ipfs add -r out/"
    echo "3. Pin the hash to make it permanent: ipfs pin add <hash>"
    echo "4. Access via: https://ipfs.io/ipfs/<hash>"
    echo ""
    echo "📋 Alternative deployment options:"
    echo "• Pinata: https://pinata.cloud"
    echo "• Fleek: https://fleek.co"
    echo "• IPFS Cluster: https://cluster.ipfs.io"
    echo ""
    echo "🔄 For automatic updates, consider setting up:"
    echo "• GitHub Actions with IPFS deployment"
    echo "• DNSLink for domain name resolution"
    echo "• Mirror domains for censorship resistance"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi