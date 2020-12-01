import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'

import localeStorageSpace from '@/utils/localeStorageSpace'
import modules from './modules'

const isDev = process.env.NODE_ENV !== 'production'

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  strict: isDev,
  key: 'vuex',
  reducer(state) {
    if (isDev) {
      localeStorageSpace()
    }

    if (state.auth.TOKEN)
      return {
        auth: state.auth,
        // license: state.license,
        // dashboard: state.dashboard,
        nav: state.nav,
        settings: state.settings,
        route: state.route, // <== vuex-router-sync
      }
    return {}
  },
})

Vue.use(Vuex)

export default new Vuex.Store({
  modules,
  // Enable strict mode in development to get a warning
  // when mutating state outside of a mutation.
  // https://vuex.vuejs.org/guide/strict.html
  strict: isDev,
  plugins: [vuexLocal.plugin],
})
