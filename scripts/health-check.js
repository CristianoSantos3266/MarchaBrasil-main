#!/usr/bin/env node

const http = require('http');
const fs = require('fs');

const HEALTH_CHECK_URL = 'http://localhost:3001';
const MAX_RETRIES = 5;
const RETRY_DELAY = 2000;

async function healthCheck(retries = 0) {
  return new Promise((resolve, reject) => {
    const req = http.get(HEALTH_CHECK_URL, (res) => {
      if (res.statusCode === 200) {
        console.log('✅ Health check passed');
        resolve(true);
      } else {
        console.log(`❌ Health check failed with status: ${res.statusCode}`);
        if (retries < MAX_RETRIES) {
          console.log(`🔄 Retrying in ${RETRY_DELAY/1000}s... (${retries + 1}/${MAX_RETRIES})`);
          setTimeout(() => {
            healthCheck(retries + 1).then(resolve).catch(reject);
          }, RETRY_DELAY);
        } else {
          reject(new Error(`Health check failed after ${MAX_RETRIES} retries`));
        }
      }
    });

    req.on('error', (err) => {
      console.log(`❌ Health check error: ${err.message}`);
      if (retries < MAX_RETRIES) {
        console.log(`🔄 Retrying in ${RETRY_DELAY/1000}s... (${retries + 1}/${MAX_RETRIES})`);
        setTimeout(() => {
          healthCheck(retries + 1).then(resolve).catch(reject);
        }, RETRY_DELAY);
      } else {
        reject(err);
      }
    });

    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Health check timeout'));
    });
  });
}

// Log deployment info
const deployInfo = {
  timestamp: new Date().toISOString(),
  nodeVersion: process.version,
  environment: process.env.NODE_ENV || 'development'
};

console.log('🚀 Starting deployment health check...');
console.log('📊 Deployment Info:', JSON.stringify(deployInfo, null, 2));

healthCheck()
  .then(() => {
    console.log('✅ Deployment verification successful!');
    
    // Write success log
    const logEntry = `${new Date().toISOString()} - Deployment successful\n`;
    fs.appendFileSync('./logs/deployment.log', logEntry);
    
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Deployment verification failed:', error.message);
    
    // Write error log
    const logEntry = `${new Date().toISOString()} - Deployment failed: ${error.message}\n`;
    fs.appendFileSync('./logs/deployment.log', logEntry);
    
    process.exit(1);
  });