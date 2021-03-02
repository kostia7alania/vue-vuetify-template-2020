const configDev = require('./vue.config.dev')
const configureWebpack = require('./vue.config.webpack')

module.exports = {
  ...configDev,
  configureWebpack,
  transpileDependencies: ['vuetify'],
  lintOnSave: process.env.NODE_ENV !== 'production',

  pluginOptions: {
    i18n: {
      locale: 'ru',
      fallbackLocale: 'ru',
      localeDir: 'locales',
      enableInSFC: false,
    },
  },
}
