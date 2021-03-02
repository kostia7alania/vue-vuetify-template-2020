import jwtDecode from 'jwt-decode'
import { GET, POST, API_AUTH } from '@/service/http'

const state = {
  LOGIN: {
    /*
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbXBsb3llZV9pZCI6MSwiZXhwIjoxNjExOTAyMTI0fQ.k0801FzXVSJuNUW_bvDOR-NDO5D6L9LI_nN_Pplbtrw"
      token_expire: "2021-01-29T09:35:24.106118975+03:00"
    */
  },
}

const getters = {
  TOKEN: state => state.LOGIN.token,
  TOKEN_DECODED: state => jwtDecode(state.token),
  IS_LOGGED_IN: state => state.LOGIN.token,
}

const mutations = {
  SET_LOGIN: (state, value) => (state.LOGIN = value),
  UNSET_LOGIN: state => (state.LOGIN = {}),
}

const actions = {
  async LOGIN({ commit }, { login, password }) {
    const { data } = await POST(`${API_AUTH}/user/login`, { login, password })
    commit('SET_LOGIN', data)
  },
  async LOGIN_REFRESH({ commit }) {
    const { data } = await GET(`${API_AUTH}/token/refresh`)
    commit('SET_LOGIN', data)
    return data.token
  },
  async LOGOUT({ commit }) {
    commit('SET_LOGIN', {})
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
