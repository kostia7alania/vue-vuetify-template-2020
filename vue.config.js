const configDev = require('./vue.config.dev')

module.exports = {
  ...configDev,
  transpileDependencies: ['vuetify'],
  lintOnSave: process.env.NODE_ENV !== 'production',

  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: false,
    },
  },
}
