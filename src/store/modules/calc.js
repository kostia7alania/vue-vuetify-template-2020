import axios, { POST, GET, API_ERP, API_CALC } from '@/service/http'
import constants from '@/config/constants'

const state = {
  WAREHOUSES: [],
  CATEGORIES: [],
  ZONES: [],
  DELIVERY_POINTS: [],
}

const mutations = {
  SET_WAREHOUSES: (state, value) => (state.WAREHOUSES = value),
  SET_CATEGORIES: (state, value) => (state.CATEGORIES = value),
  SET_ZONES: (state, value) => (state.ZONES = value),
  SET_DELIVERY_POINTS: (state, value) => (state.DELIVERY_POINTS = value),
}

const suggestionsApi = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address'

const actions = {
  GET_SUGGESTIONS: async ({ rootState }, { query, count = 10 }) => {
    /* Получить список адресов
     @RESPONSE
      { "suggestions":[{
        "value":"г Москва, ул Глебовская, д 10А",
        "unrestricted_value":"107258, г Москва, Богородское р-н, ул Глебовская, д 10А",
        "data":{"postal_code":"107258","country":"Россия","country_iso_code":"RU",....}}]}
    */
    const payload = {
      query,
      count,
      language: rootState.settings.LOCALE || 'ru',
      locations: [],
      locations_boost: [],
      from_bound: {},
      to_bound: {},
    }
    const headers = {
      withCredentials: '',
      Authorization: `Token ${constants.dadata}`,
    }
    const { data } = await axios.post(`${suggestionsApi}`, payload, { headers })
    console.log('GET_SUGGESTIONS', data.suggestions)
    return data.suggestions
  },
  GET_CALC: async (_, form) => {
    /* Рассчитать стоимость доставки в личном кабинете
     @RESPONSE
      [ {
          "delivery_type_name": "next day",
          "price": 380,
          "date": "2020-11-25T16:53:27.266719193+03:00"
      } ]
    */
    const { data } = await POST(`${API_CALC}/preliminary`, form)
    console.log('data', data)
    return data
  },

  GET_WAREHOUSES: async ({ commit }) => {
    /* Получить склады
    @RESPONSE
      [ {
        "id": "1",
        "title": "Москва, ул.Складочная, дом 1, стр 18"
      } ]
    */
    const { data } = await GET(`${API_ERP}/warehouses`)
    commit('SET_WAREHOUSES', data)
    return data
  },

  GET_CATEGORIES: async ({ commit }) => {
    /* Получить склады
    @RESPONSE
      [ {
        "id": "1",
        "title": "Москва, ул.Складочная, дом 1, стр 18"
      } ]
    */
    const { data } = await GET(`${API_ERP}/categories`)
    commit('SET_CATEGORIES', data)
    return data
  },
  GET_DELIVERY_POINTS: async ({ commit }) => {
    /* Получить склады
    @RESPONSE
      [ {
        "id": "1",
        "title": "Москва, ул.Складочная, дом 1, стр 18"
      } ]
    */
    const { data } = await GET(`${API_ERP}/delivery_points`)
    commit('SET_DELIVERY_POINTS', data)
    return data
  },
  GET_ZONES: async ({ commit }) => {
    /* Получить города и их зоны
    @RESPONSE  [ {
    "id": 1,
    "title": "москва",
    "zones": [
      {
        "id": 1,
        "title": "Зона 1 Москва"
      },
      {
        "id": 2,
        "title": "Зона 2 Москва (0-10 км от МКАД)"
      },
      {
        "id": 3,
        "title": "Зона 3 Москва (10-30 км от МКАД)"
      },
      {
        "id": 4,
        "title": "Зона 4 Москва (30-50 км от МКАД)"
      },
      {
        "id": 5,
        "title": "Зона 5 Москва (50 и более км от МКАД)"
      }
    ]
  },
  {
    "id": 2,
    "title": "питер",
    "zones": [
      {
        "id": 7,
        "title": "Зона 1 Спб"
      }
    ]
  }]
    */
    const { data } = await GET(`${API_ERP}/zones`)
    commit('SET_ZONES', data)
    return data
  },
  GET_TABLE: async (_, form) => {
    const { data } = await GET(`${API_ERP}/price/table?${new URLSearchParams(form)}`)
    // city_id=${form.city_id}&zone_id=${form.zone_id}&product_id=${form.product_id}&category_id=${form.category_id}`

    return data
  },
  SAVE_TABLE: async (_, { form, items }) => {
    const { data } = await POST(
      `${API_ERP}/price/table?city_id=${form.city_id}&zone_id=${form.zone_id}&product_id=${form.product_id}`,
      items
    )
    return data
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
