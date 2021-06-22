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
      env_production: {
        NODE_ENV: 'production',
      },
      env_demo: {
        NODE_ENV: 'demo',
      },
      instances: 1,
      autorestart: true,
      exec_mode: 'cluster',
    },
  ],
}
