# 🚨 URGENT: Deploy "Apoiar" Routing Fix to Staging

## Current Issue
- Navigation "Apoie" link still points to `/doar` (incorrect)
- Homepage statistics show `0` instead of baseline numbers 
- Changes made locally but not deployed to staging

## Files to Update on Staging Server

**SSH into staging:** `root@148.230.85.210`

### 1. Update Navigation Component
```bash
cd /var/www/marchabrasil-staging
```

Copy this entire content to `/var/www/marchabrasil-staging/src/components/ui/Navigation.tsx`:
- The file `staging-Navigation.tsx` contains the updated navigation with `/support` links

### 2. Update Page Component 
Update `/var/www/marchabrasil-staging/src/app/page.tsx` line 167-173 to use Link instead of anchor:

```tsx
<div className="mt-4">
  <Link 
    href="/support" 
    className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur text-white border-2 border-white/30 rounded-lg hover:bg-white/30 transition-all text-lg font-bold shadow-lg"
  >
    <HeartIcon className="h-6 w-6 mr-2" />
    Apoiar Plataforma
  </Link>
</div>
```

### 3. Remove Old Page
```bash
rm -rf /var/www/marchabrasil-staging/src/app/doar
```

### 4. Rebuild and Restart
```bash
cd /var/www/marchabrasil-staging
npm run build
pm2 restart marchabrasil-staging
```

## Expected Results After Deploy:
1. ✅ Navigation "Apoie" link → `/support`
2. ✅ Homepage "Apoiar Plataforma" button → `/support` 
3. ✅ `/doar` route → 404 (removed)
4. ✅ Both lead to comprehensive support page

## Test After Deploy:
```bash
curl -s http://148.230.85.210:3001 | grep -A5 -B5 "href=\"/support\""
```

Should show both navigation and button pointing to `/support` instead of `/doar`.