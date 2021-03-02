// import { GET, POST, API_ORDERS, API_ERP } from '@/service/http'

// const BACK = '/api/v1'
// const BACK_CALC = '/api/v1'
import PLAN from '@/store/mock/GET_PLAN'

const state = {
  PLAN,
}

const actions = {
  GET_PLAN: async () => {
    return PLAN
    // const { data } = await GET(`${API_ORDERS}/orders`)
    // commit('SET_ORDERS', data)
  },
}

export default {
  namespaced: true,
  state,
  actions,
}
