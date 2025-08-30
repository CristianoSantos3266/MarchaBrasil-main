# GitHub Upload Strategy - Too Large for Single Upload

## CHUNK 1: Core Application Files (Upload First)
Essential files for the app to work:

**Root Files:**
- package.json
- package-lock.json
- next.config.js (if exists)
- ecosystem.config.js
- deploy-staging.sh
- DEPLOYMENT_INSTRUCTIONS.md

**Key Directories:**
- src/ (entire folder)
- public/ (entire folder)
- .github/ (entire folder)

## CHUNK 2: Configuration Files
- .gitignore
- .env.example (if exists)
- tailwind.config.js
- scripts/ folder

## FILES TO SKIP (Too Large or Unnecessary)
❌ node_modules/ (will be installed on server)
❌ .next/ (will be built on server)
❌ .git/ (GitHub will create new git history)
❌ *.log files
❌ apoie-bundle.bundle
❌ Any backup files
❌ deployment-package/ folder
❌ full-deployment/ folder

## UPLOAD STEPS:

1. Go to: https://github.com/CristianoSantos3266/MarchaBrasil-Platform-v2
2. Click "uploading an existing file"
3. Upload CHUNK 1 files first
4. Commit with: "Core application files and deployment setup"
5. Repeat for CHUNK 2 if needed

## ALTERNATIVE: Create Essential-Only Package
Run this to create a smaller package:
```bash
tar -czf essential-files.tar.gz \
  package.json package-lock.json \
  ecosystem.config.js deploy-staging.sh \
  src/ public/ .github/ scripts/ \
  --exclude="src/**/*.log" \
  --exclude="public/**/*.log"
```

This should be much smaller and uploadable!