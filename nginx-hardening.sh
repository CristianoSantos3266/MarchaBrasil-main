#!/bin/bash
set -euo pipefail

echo "🔒 Starting Nginx Security Hardening..."

# 3.1 Backup current files
echo "📦 Backing up current configuration..."
sudo cp -a /etc/nginx/nginx.conf /etc/nginx/nginx.conf.bak.$(date +%s)
sudo cp -a /etc/nginx/sites-available/marchabrasil.conf /etc/nginx/sites-available/marchabrasil.conf.bak.$(date +%s)

# 3.2 Create security headers snippet
echo "🛡️ Creating security headers snippet..."
sudo tee /etc/nginx/snippets/security-headers-min.conf > /dev/null <<'EOF'
# Keep server_tokens only in ONE place (here OR nginx.conf, not both)
server_tokens off;

add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "geolocation=(self), camera=(), microphone=(), payment=(self)" always;

# HSTS only if HTTPS; safe for production
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
EOF

# 3.3 Create rate limiting snippet
echo "⚡ Creating rate limiting snippet..."
sudo tee /etc/nginx/snippets/ratelimit.conf > /dev/null <<'EOF'
# ~5 req/sec per IP with short burst
limit_req_zone $binary_remote_addr zone=api_zone:10m rate=5r/s;
EOF

echo "✅ Configuration snippets created"
echo "📝 Next: You need to manually update /etc/nginx/sites-available/marchabrasil.conf"
echo ""
echo "Add these lines to your marchabrasil.conf:"
echo ""
echo "1. At the top (outside server blocks):"
echo "   include /etc/nginx/snippets/ratelimit.conf;"
echo ""
echo "2. Inside both server blocks:"
echo "   include /etc/nginx/snippets/security-headers-min.conf;"
echo "   client_max_body_size 20m;"
echo "   client_body_timeout 15s;"
echo "   send_timeout 15s;"
echo "   keepalive_timeout 30s;"
echo "   gzip on;"
echo "   gzip_types text/plain text/css application/javascript application/json application/ld+json image/svg+xml;"
echo ""
echo "3. Update /api/ location block:"
echo "   location /api/ {"
echo "       limit_req zone=api_zone burst=20 nodelay;"
echo "       proxy_pass http://127.0.0.1:3002;"
echo "       proxy_http_version 1.1;"
echo "       proxy_set_header Host \$host;"
echo "       proxy_set_header X-Real-IP \$remote_addr;"
echo "       proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;"
echo "       proxy_set_header X-Forwarded-Proto \$scheme;"
echo "   }"
echo ""
echo "4. Test and reload:"
echo "   sudo nginx -t && sudo systemctl reload nginx"