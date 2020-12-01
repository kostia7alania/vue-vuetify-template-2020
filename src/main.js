import Vue from 'vue'
import vuetify from '@/plugins/vuetify'
import App from '@/App'
import created from '@/utils/fixWrongUrl'

import './plugins/base'
import './plugins/chartist'
import './plugins/vee-validate'
import { dateFormatter, timeFormatter, dateTimeFormatter, date } from '@/setups/dayjs'

import $http from '@/service/http'
import router from '@/router/router'
import store from '@/store/store'
import i18n from './i18n'

// Globally register all `_base`-prefixed components
import '@/lib/components/ui/_globals'

Vue.config.productionTip = false

Vue.prototype.$http = $http

Vue.prototype.$global = { dateFormatter, timeFormatter, dateTimeFormatter, date }

window.vue = new Vue({
  router,
  store,
  vuetify,
  i18n,
  created,
  render: h => h(App),
}).$mount('#app')
