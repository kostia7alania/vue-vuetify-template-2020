import axios from '@/service/http'
import constants from '@/config/constants'

const suggestionsApi = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address'
const headers = {
  withCredentials: '',
  Authorization: `Token ${constants.dadata}`,
}

const actions = {
  GET_CITIES: async ({ rootState }, { query, count = 10 }) => {
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
      locations: [
        // огр по странам: https://confluence.hflabs.ru/pages/viewpage.action?pageId=1023737939
        {
          country: 'Россия',
        },
      ],
      locations_boost: [],
      from_bound: { value: 'city' },
      to_bound: { value: 'city' },
      geoLocation: false, // геолокация вкл по умолч
    }

    const { data } = await axios.post(`${suggestionsApi}`, payload, { headers })
    // const cities = data.suggestions.map(({ data: { city } }) => city)
    // console.log('[GET_CITIES]', cities, data.suggestions)
    data.suggestions = data.suggestions.filter(e => e.data.city)
    return data.suggestions
  },
  GET_STREETS: async ({ rootState }, { city, query, count = 10 }) => {
    /* Получить список улиц в рамках города
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
      locations: [
        // огр по странам: https://confluence.hflabs.ru/pages/viewpage.action?pageId=1023737939
        {
          country: 'Россия',
          city,
        },
      ],
      locations_boost: [],
      from_bound: { value: 'street' },
      to_bound: { value: 'street' },
      geoLocation: false, // геолокация вкл по умолч
    }

    const { data } = await axios.post(`${suggestionsApi}`, payload, { headers })
    // const cities = data.suggestions.map(({ data: { city } }) => city)
    // console.log('[GET_CITIES]', cities, data.suggestions)
    data.suggestions = data.suggestions.filter(e => e.data.street_with_type)
    return data.suggestions
  },
  GET_HOUSES: async ({ rootState }, { query, count = 10, city, street }) => {
    /* Получить список домов в рамках города и улицы
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
      locations: [
        // огр по странам: https://confluence.hflabs.ru/pages/viewpage.action?pageId=1023737939
        {
          country: 'Россия',
          city,
          street,
        },
      ],

      // street_fias_id: 'dd08e4e2-82ff-43b5-81f7-93f59f013974',
      locations_boost: [],
      from_bound: { value: 'house' },
      to_bound: { value: 'house' },
      geoLocation: false, // геолокация вкл по умолч
    }

    const { data } = await axios.post(`${suggestionsApi}`, payload, { headers })
    // const cities = data.suggestions.map(({ data: { city } }) => city)
    // console.log('[GET_CITIES]', cities, data.suggestions)
    data.suggestions = data.suggestions.filter(e => e.data.house)
    return data.suggestions
  },
}

export default {
  namespaced: true,
  actions,
}
