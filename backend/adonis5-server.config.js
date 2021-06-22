module.exports = {
  apps: [
    {
      name: 'Adonis5_Demo_Api_Server',
      script: './build/server.js',
      watch: true,
      ignore_watch: ['public', 'private_uploads'],
      watch_options: {
        persistent: true,
        ignoreInitial: true,
      },
      env: {
        // Set this as the default environment for this demo config file
        NODE_ENV: 'demo',
      },
      env_production: {
        NODE_ENV: 'production',
      },
      instances: 1,
      autorestart: true,
      exec_mode: 'cluster',
      kill_timeout: 3000,
      wait_ready: true,
      listen_timeout: 3000,
    },
  ],
}
