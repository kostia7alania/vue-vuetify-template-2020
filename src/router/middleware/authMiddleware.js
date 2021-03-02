import store from '@/store/store'

const authMiddleware = ({ /* to, from */ to, redirect }) => {
  const isLoggedIn = store.getters['auth/IS_LOGGED_IN']
  console.log('[auth middle] isLoggedIn=>', isLoggedIn)
  if (!isLoggedIn) {
    console.log("isn't auth, redirect to login")
    redirect({ name: 'login', query: { redirect: to.name } })
  }
}

export default authMiddleware
