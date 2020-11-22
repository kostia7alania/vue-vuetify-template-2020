import Vue from 'vue'
import router from '@/router/router'
import store from '@/store/store'
import vuetify from '@/plugins/vuetify'
import App from '@/App'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app')
