const configDev = require('./vue.config.dev')

module.exports = {
  ...configDev,
  transpileDependencies: ['vuetify'],
  lintOnSave: process.env.NODE_ENV !== 'production',
}
