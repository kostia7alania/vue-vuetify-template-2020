import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from '@/router/routes'

// import store from '@/store/store'
import spinner from '@/setups/spinner'
import i18n from '@/setups/i18n'
import MiddlewarePlugin from 'vue-router-middleware-plugin'
import authMiddleware from './middleware/authMiddleware'

Vue.use(VueRouter)

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

Vue.use(MiddlewarePlugin, {
  router,
  middleware: [authMiddleware],
})

const originalPush = VueRouter.prototype.push

VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => {
    if (!String(err).match('redundant navigation')) throw err
    if (process.env.NODE_ENV !== 'production') {
      console.warn('router error prevented', err)
    }
  })
}

router.beforeResolve((to, from, next) => {
  if (to.path) spinner.start() // запустить спиннер
  // if (!store.state.auth.TOKEN) {
  //   if (to.path !== '/auth') next('/auth')
  //   else next()
  // } else next()
  next()
})

// router.beforeResolve((to, from, next) => { next() })

router.beforeEach(async (to, from, next) => {
  const setPageTitle = (await import(/* webpackChunkName: "setPageTitle" */ '@/utils/setPageTitle')).default
  setPageTitle(i18n.t(`title.${to.name.replace(/\./g, '_')}`))
  next()
})

router.afterEach(() => {
  spinner.done() // завершить анимацию спиннера
})

export default router
