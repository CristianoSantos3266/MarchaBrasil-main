#\!/bin/bash
cat << 'DEPLOYEOF'
cd /var/www/marchabrasil-staging
sed -i 's < /dev/null | href="/doar"|href="/support"|g' src/components/ui/Navigation.tsx
sed -i 's|<a href="/support"|<Link href="/support"|g' src/app/page.tsx
sed -i 's|</a>|</Link>|g' src/app/page.tsx
rm -rf src/app/doar
npm run build
pm2 restart marchabrasil-staging
curl -s http://localhost:3001 | grep -c 'href="/support"'
DEPLOYEOF
