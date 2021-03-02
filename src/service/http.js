import axios from 'axios'

const ACCESS_TOKEN = () => window.vue.$store.state.auth.LOGIN.token
const LOGIN_REFRESH = () => window.vue.$store.dispatch('auth/LOGIN_REFRESH')

// axios.defaults.withCredentials = true

const options = {
  // baseURL: 'BASE_API_URL',
  timeout: 20000,
  headers: {
    // withCredentials: 'true',
    // Authorization: 'bearer ',
    // 'Content-Type': 'application/json',
  },
}

const setAndGetAuthHeaders = () => {
  options.headers = {
    ...options.headers,
    Authorization: `Bearer ${ACCESS_TOKEN()}`,
  }
  return options.headers
}

const axiosApiInstance = axios.create(options)

// Request interceptor for API calls
axiosApiInstance.interceptors.request.use(
  async config => {
    // eslint-disable-next-line no-param-reassign
    config.headers = setAndGetAuthHeaders()
    return config
  },
  error => Promise.reject(error)
)

const logout = async req => {
  const { vue } = window

  await vue.$store.dispatch('auth/LOGOUT')
  const redirect = vue.$router.currentRoute.name
  if (vue.$route.name === 'login') console.log('already in login form')
  else vue.$router.push({ name: 'login', query: { redirect } })
  return req
}
// Response interceptor for API calls
axiosApiInstance.interceptors.response.use(
  response => {
    return response
  },
  async error => {
    const originalRequest = error.config
    const { status } = error.response || {}

    if (status === 403) {
      await logout()
      return Promise.reject(error)
    }

    if (status === 401) {
      if (originalRequest._retry || originalRequest.url.endsWith('token/refresh'))
        return Promise.reject(await logout(error))
      originalRequest._retry = true
      const refreshedToken = await LOGIN_REFRESH()
      console.log('[http] New Token: ', refreshedToken)
      // axiosApiInstance.headers.common.Authorization = `Bearer ${refreshedToken}`
      axiosApiInstance.headers = setAndGetAuthHeaders()
      originalRequest.headers = setAndGetAuthHeaders()
      console.log('[http] Original Request: ', originalRequest)

      return axiosApiInstance(originalRequest)
    }
    const { vue } = window
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    let isGuest
    const middleware = vue?.$route?.meta?.middleware?.attach || vue?.$route?.meta?.middleware
    if (middleware) isGuest = middleware?.some(e => e.toString().match('guest'))
    if ([401, 403].includes(status) && !isGuest) {
      await logout()
    }
    return Promise.reject(error)
  }
)

export const { get: GET, post: POST, delete: DELETE } = axiosApiInstance

export const API_ERP = process.env.VUE_APP_API_PROXY_ERP
export const API_CALC = process.env.VUE_APP_API_PROXY_CALC
export const API_AUTH = process.env.VUE_APP_API_PROXY_AUTH
export const API_ORDERS = process.env.VUE_APP_API_PROXY_ORDERS

export default axios
