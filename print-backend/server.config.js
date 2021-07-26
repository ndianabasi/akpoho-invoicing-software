module.exports = {
  apps: [
    {
      name: 'Demo_Print_Server',
      script: './dist/ssr/index.js',
      watch: false,
      watch_options: {
        persistent: true,
        ignoreInitial: true,
      },
      env: {
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
};
