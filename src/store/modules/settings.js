const state = {
  LOCALE: process.env.VUE_APP_I18N_LOCALE || 'ru',
  IS_DARK: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches, // https://stackoverflow.com/questions/56393880/how-do-i-detect-dark-mode-using-javascript
  BAR_COLOR: 'rgba(0, 0, 0, .8), rgba(0, 0, 0, .8)',
  BAR_IMAGE: 'https://picsum.photos/400',
  DRAWER: null,
}

const getters = {}

const mutations = {
  SET_LOCALE: (state, locale) => (state.LOCALE = locale),
  SET_IS_DARK: (state, value) => (state.IS_DARK = value),
  SET_BAR_IMAGE: (state, payload) => (state.BAR_IMAGE = payload),
  SET_DRAWER: (state, payload) => (state.DRAWER = payload),
}

const actions = {}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
