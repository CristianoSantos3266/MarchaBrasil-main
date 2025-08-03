# 🔐 SSH Key Setup for Automated Deployment

## Step 1: Copy Public Key to Server

**Manual SSH into server:**
```bash
ssh root@148.230.85.210
# Password: Helena3266##
```

**Add this public key to authorized_keys:**
```bash
mkdir -p ~/.ssh
echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAICL5CVkjB8fB+6xE+G1rPLTI1iWxTU+OL/LF2TNs6Ut/ claude@marchabrasil" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh
exit
```

## Step 2: Test SSH Key Access

After adding the key, I can deploy automatically:
```bash
ssh marchabrasil-staging "cd /var/www/marchabrasil-staging && pm2 status"
```

## Step 3: Complete the Fix

Once SSH keys work, I can:
1. Fix the port 3001 issue
2. Verify navigation links are working
3. Complete the apoiar routing fix

**Current Status:**
✅ Build completed successfully  
✅ `/doar` route removed from build  
❌ Port 3001 not accessible (need to fix PM2 startup)  

**Next Steps:**
1. Add SSH key to server (copy command above)
2. I'll automatically fix port and verify navigation links