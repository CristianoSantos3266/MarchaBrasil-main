# MarchaBrasil Platform v2 - Deployment Instructions

## Current Status
- ✅ All deployment files created locally
- ✅ Enhanced CSS fixes for icon sizing
- ✅ Service worker disabled to prevent offline issues
- ✅ GitHub Actions workflow configured
- ❌ Git push timing out - manual upload needed

## Solution: Manual Repository Upload

### Step 1: Upload Code to GitHub

Since git push is timing out, use one of these methods:

#### Option A: GitHub Web Interface (Recommended)
1. Go to: https://github.com/CristianoSantos3266/MarchaBrasil-Platform-v2
2. Click "uploading an existing file"
3. Drag and drop all files/folders EXCEPT:
   - `node_modules/`
   - `.next/`
   - `*.log` files
   - `.git/` folder

#### Option B: Create ZIP and Upload
```bash
# Create deployment ZIP (excluding large files)
tar -czf marchabrasil-deployment.tar.gz \
  --exclude=node_modules \
  --exclude=.next \
  --exclude=.git \
  --exclude="*.log" \
  .
```

Then upload the ZIP file to GitHub.

### Step 2: Set Up GitHub Actions Secrets

Once code is uploaded:

1. Go to GitHub repo → **Settings** → **Secrets and variables** → **Actions**
2. Add these secrets:
   - `STAGING_HOST`: `148.230.85.210`
   - `STAGING_USER`: `root`
   - `STAGING_PASSWORD`: `HelenaReis3266##`

### Step 3: Deploy to Staging

#### Option A: GitHub Actions (Automatic)
- Push any change to main branch
- GitHub Actions will automatically deploy

#### Option B: Manual Deployment Script
```bash
# Run the deployment script
./deploy-staging.sh
```

#### Option C: Manual Commands
```bash
# SSH to server
ssh root@148.230.85.210

# Clone/update repository
cd /var/www/ || cd /opt/
git clone https://github.com/CristianoSantos3266/MarchaBrasil-Platform-v2.git marchabrasil
cd marchabrasil

# Install and build
npm ci --production
npm run build

# Start with PM2
npm install -g pm2
pm2 start ecosystem.config.js

# Verify deployment
curl http://localhost:3001
```

## Deployment Features Included

✅ **GitHub Actions Workflow** (`.github/workflows/deploy-staging.yml`)
- Automatic deployment on push to main
- Build verification
- Health checks
- Rollback capability

✅ **PM2 Configuration** (`ecosystem.config.js`)
- Production-ready process management
- Auto-restart on failure
- Logging
- Cluster mode

✅ **Health Check Script** (`scripts/health-check.js`)
- Automated verification
- Retry logic
- Deployment logging

✅ **Manual Deployment Script** (`deploy-staging.sh`)
- Safe deployment with backup
- Verification steps
- Error handling

## Verification Checklist

After deployment, verify:
- [ ] Main page: http://148.230.85.210:3001
- [ ] Login page: http://148.230.85.210:3001/login
- [ ] Icons display at correct size (not giant)
- [ ] Navigation works between pages
- [ ] No "offline" messages appear

## Troubleshooting

### If deployment fails:
```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs marchabrasil

# Restart if needed
pm2 restart marchabrasil
```

### If icons are still giant:
- Clear browser cache
- Check CSS loading in DevTools
- Verify build completed successfully

### If pages show offline:
- Service worker has been disabled
- Clear browser cache
- Check server logs

## Files Created for Deployment

- `.github/workflows/deploy-staging.yml` - GitHub Actions
- `ecosystem.config.js` - PM2 configuration  
- `scripts/health-check.js` - Health verification
- `deploy-staging.sh` - Manual deployment script
- Enhanced `src/app/globals.css` - Fixed icon sizing
- Updated `src/app/layout.tsx` - Disabled service worker

Ready to deploy! 🚀