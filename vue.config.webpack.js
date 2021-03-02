const gitprocess = require('child_process')
const webpack = require('webpack')

// require('events').EventEmitter.defaultMaxListeners = 0

// const fs = require('fs')
// const packageJson = fs.readFileSync('./package.json')
// const version = JSON.parse(packageJson).version || 0

const LoadCommitDate = gitprocess.execSync('git log -1 --date=format:"%d.%m.%Y %T" --format="%ad"').toString()

const GitRevisionPlugin = require('git-revision-webpack-plugin')

const gitRevisionPlugin = new GitRevisionPlugin()

process.env.VUE_APP_PACKAGE_VERSION = require('./package.json').version

process.env.VUE_APP_BUILD_DATE = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })

const configureWebpack = {
  plugins: [
    gitRevisionPlugin,
    new webpack.DefinePlugin({
      'process.env': {
        // VUE_APP_PACKAGE_VERSION: '"' + version + '"',
        // VUE_APP_BUILD_DATE: now,
        VUE_APP_COMMITDATE: JSON.stringify(LoadCommitDate),
        VUE_APP_GIT_VERSION: JSON.stringify(gitRevisionPlugin.version()),
        VUE_APP_COMMITHASH: JSON.stringify(gitRevisionPlugin.commithash()),
        VUE_APP_BRANCH: JSON.stringify(gitRevisionPlugin.branch()),
      },
    }),
  ],
}

module.exports = configureWebpack
