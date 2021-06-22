module.exports = {
  apps: [
    {
      name: 'Gotedo_Adonis_4.1_Api_Server',
      script: './server.js',
      watch: true,
      ignore_watch: ['public', 'private_uploads'],
      watch_options: {
        persistent: true,
        ignoreInitial: true,
      },
      env: {
        NODE_ENV: 'production',
      },
      instances: 1,
    },
  ],
};
