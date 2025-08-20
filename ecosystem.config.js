module.exports = {
  apps: [{
    name: 'marchabrasil',
    script: 'server.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    // Logging
    out_file: './logs/out.log',
    error_file: './logs/error.log',
    log_file: './logs/combined.log',
    time: true,
    
    // Advanced PM2 features
    exec_mode: 'cluster',
    instances: 'max',
    max_restarts: 10,
    min_uptime: '10s',
    
    // Health monitoring
    health_check_url: 'http://localhost:3001',
    health_check_grace_period: 3000
  }]
};