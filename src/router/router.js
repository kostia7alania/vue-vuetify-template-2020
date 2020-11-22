import Vue from 'vue'
import VueRouter from 'vue-router'
// import store from '@/store/store'
import routes from '@/router/routes'
import spinner from '@/setups/spinner'
import setPageTitle from '@/utils/setPageTitle'

Vue.use(VueRouter)

const originalPush = VueRouter.prototype.push

VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => {
    if (!String(err).match('redundant navigation')) throw err
    if (process.env.NODE_ENV !== 'production') {
      console.warn('router error prevented', err)
    }
  })
}

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  // linkActiveClass: 'is-active',
  scrollBehavior(to, from, savedPosition) {
    console.log('scrollBehavior', savedPosition)
    if (savedPosition) {
      return savedPosition
    }
    return { /* selector: '.board__view', */ x: 0, y: 0 }
  },
})

router.beforeResolve((to, from, next) => {
  if (to.path) spinner.start() // запустить спиннер
  // if (!store.state.auth.TOKEN) {
  //   if (to.path !== '/auth') next('/auth')
  //   else next()
  // } else next()
  next()
})

// router.beforeResolve((to, from, next) => { next() })

router.beforeEach((to, from, next) => {
  setPageTitle(to.meta.title)
  next()
})

router.afterEach(() => {
  spinner.done() // завершить анимацию спиннера
})

export default router
