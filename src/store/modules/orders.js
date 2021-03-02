import { GET, POST, API_ORDERS, API_ERP } from '@/service/http'

// const BACK = '/api/v1'
// const BACK_CALC = '/api/v1'
import GET_ORDERS from '@/store/mock/GET_ORDERS'
import GET_ORDER from '@/store/mock/GET_ORDER'
import PICKUPS from '@/store/mock/GET_PICKUPS'
import CLIENT_ADDRESSES from '@/store/mock/GET_CLIENT_ADDRESSES'

const state = {
  ORDERS: GET_ORDERS,
  PICKUPS,
  CLIENT_ADDRESSES,
}

const getters = {
  CLIENT_ADDRESSES_GETTER: state => {
    return state.CLIENT_ADDRESSES.map(value => ({
      ...value,
      title: `${value.city || ''} ${value.street || ''} ${value.house || ''}`,
    }))
  },
}

const mutations = {
  SET_ORDERS: (state, value) => (state.ORDERS = value),
  SET_PICKUPS: (state, value) => (state.PICKUPS = value),
  SET_CLIENT_ADDRESSES: (state, value) => (state.CLIENT_ADDRESSES = value),
}

const actions = {
  GET_ORDERS: async ({ commit }, pickupId) => {
    /* Получить список заказов
     @RESPONSE
      { id: 1 }
    */
    /*    const { data } = */ await GET(`${API_ORDERS}/orders?pickup_id=${pickupId}`)
    commit('SET_ORDERS', GET_ORDERS)
    return GET_ORDERS
  },
  ADD_ORDER: (_, form) => {
    /* Создать заказ
    @BODY большой. зависит от delivery/takeaway
     @RESPONSE
      { id: 1 } */
    return POST(`${API_ORDERS}/orders`, form)
  },
  GET_ORDER: (_, { id = 1, clientId = 1 } = {}) => {
    /* Получить заказ
    @GET https://orders-stage.courierZ.com/api/v1/orders/1?client_id=1
    */
    GET(`${API_ORDERS}/orders/${id}?client_id=${clientId}`)
    return GET_ORDER // @TODO remove
  },
  GET_DELIVERY_CERVICES: async (_, { city, categoryId }) => {
    const { data } = await GET(`${API_ERP}/delivery_services?city=${city}&category_id=${categoryId}`)
    return data
  },
  GET_PRODUCTS: async (_, deliveryServiceId) => {
    const { data } = await GET(`${API_ERP}/products?delivery_service_id=${deliveryServiceId}`)
    return data
  },
  GET_PICKUPS: async ({ commit }, clientId) => {
    const { data } = await GET(`${API_ORDERS}/pickups?client_id=${clientId}`)
    commit('SET_PICKUPS', data)
    return data
  },

  GET_CLIENT_ADDRESSES: async ({ commit }, clientId) => {
    // /client-addresses Получить адреса
    const { data } = await GET(`${API_ERP}/client-addresses?client_id=${clientId}`)
    commit('SET_CLIENT_ADDRESSES', data)
    return data
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
