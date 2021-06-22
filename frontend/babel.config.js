/* eslint-env node */
module.exports = {
  presets: ['@quasar/babel-preset-app'],
  plugins: [
    [
      'babel-plugin-dotenv',
      {
        replacedModuleName: 'babel-dotenv',
      },
    ],
  ],
};
