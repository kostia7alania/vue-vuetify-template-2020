import Vue from 'vue'
import vuetify from '@/plugins/vuetify'
import App from '@/App'
import created from '@/utils/fixWrongUrl'

// Globally register all `_base`-prefixed components
import '@/components/core/_globals'

import './plugins/base'
import './plugins/chartist'
import './plugins/vee-validate'

import errorHandler from '@/utils/errorHandler'
// import confirm from '@/mixins/confirm'
import toast from '@/setups/toast'
import { dateFormatter, timeFormatter, dateTimeFormatter, date } from '@/setups/dayjs'

import constants from '@/config/constants'

import $http from '@/service/http'
import router from '@/router/router'
import store from '@/store/store'
import i18n from './setups/i18n'

// Globally register all `_base`-prefixed components
import '@/lib/components/ui/_globals'

Vue.config.productionTip = false

Vue.prototype.$http = $http

Vue.prototype.$global = {
  toast,
  error: errorHandler,
  date,
  format: {
    date: dateFormatter,
    time: timeFormatter,
    dateTime: dateTimeFormatter,
  },
  constants,
}

window.vue = new Vue({
  router,
  store,
  vuetify,
  i18n,
  created,
  render: h => h(App),
}).$mount('#app')

console.table({
  'BUILD DATE': process.env.VUE_APP_BUILD_DATE,
  'COMMIT DATE': process.env.VUE_APP_COMMITDATE,
  'PACKAGE VERSION': process.env.VUE_APP_PACKAGE_VERSION,
  'GIT VERSION': process.env.VUE_APP_GIT_VERSION,
  'GIT BRANCH': process.env.VUE_APP_BRANCH,
  'GIT COMMIT HASH': process.env.VUE_APP_COMMITHASH,
})
