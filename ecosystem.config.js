export default {
  apps: [{
    name: 'pdf-toolkit-pro',
    script: 'npm',
    args: 'run dev',
    cwd: '/home/user/webapp',
    env: {
      NODE_ENV: 'development',
      PORT: 5173
    },
    watch: false,
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s',
    log_file: '/home/user/webapp/pm2.log',
    out_file: '/home/user/webapp/pm2-out.log',
    error_file: '/home/user/webapp/pm2-error.log'
  }]
};