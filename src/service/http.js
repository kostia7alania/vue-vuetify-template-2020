import axios from 'axios'

axios.defaults.withCredentials = true

const instance = axios.create({
  // headers: { withCredentials: 'true' },
})

// instance.interceptors.response.use(
//   response => {
//     const { vue } = window
//     // Any status code that lie within the range of 2xx cause this function to trigger
//     // Do something with response data
//     const redirectToMain = `<html><head><script type="text/javascript">if(window.parent) {window.parent.location.assign('/portal-ui'); } else {window.location.assign('/portal-ui');}</script></head><body></body></html>`
//     if (response?.data === redirectToMain /* && vue.$route.meta.withoutAuth */) {
//       vue.$router.push({ name: 'main' })
//     }
//     return response
//   },
//   async err => {
//     const { vue } = window
//     // Any status codes that falls outside the range of 2xx cause this function to trigger
//     // Do something with response error
//     if (err.response) {
//       if (
//         [401, 403].includes(err.response.status) &&
//         !vue.$route?.meta?.middleware?.some(e => e.toString().match('guest'))
//       ) {
//         if (['PERMISSION_DENIED', 'INSUFFICIENT_CREDENTIALS'].includes(err.response?.data?.type)) {
//           console.log('[RDP error] logout skipping', err.response)
//           return Promise.reject(err)
//         }
//         await vue.$store.dispatch('auth/LOGOUT')
//         const redirect = vue.$router.currentRoute.fullPath
//         console.log('[HTTP]', redirect, redirect)
//         vue.$router.push({ name: 'login', meta: { redirect }, query: { redirect } })
//       }
//     }
//     return Promise.reject(err)
//   }
// )

export const { get: GET, post: POST } = instance

export default instance
