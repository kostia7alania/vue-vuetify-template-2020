import { POST, API_AUTH } from '@/service/http'

const profile = {
  name: 'eboaba',
  is_admin: false,
  pages: [
    {
      name: 'caculator',
      permission: 2, // write
    },
    {
      name: 'hr',
      permission: 1, // read
    },
  ],
}

const state = {
  PROFILE: profile,
}

const getters = {}

const mutations = {
  // SET_TOKEN: (state, value) => (state.IS_LOGGED_IN = value),
}

const actions = {
  USER_ADD: (_, form) => POST(`${API_AUTH}/user/registration`, form),
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
