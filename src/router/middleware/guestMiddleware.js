import store from '@/store/store'

const guestMiddleware = async ({ /* to, from, */ redirect }) => {
  const isLoggedIn = store.getters['auth/IS_LOGGED_IN']
  console.log('[guest middle] isLoggedIn=>', isLoggedIn)

  if (isLoggedIn) {
    console.log('is logged in, redirect to main')
    redirect({ name: 'main' })
  }
}

export default guestMiddleware
