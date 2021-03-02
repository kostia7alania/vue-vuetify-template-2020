import store from '@/store/store'

// import { checkRightsInFunctions } from '@/router/middleware/rbacMiddleware'
// const checkRightsByRouteName = routeName => functions.includes(routeName)

export const checkRightsInFunctions = (route /* functions */) => {
  const fn = route?.meta?.function
  if (fn === '*') return true
  const functions = store.state.user.CURRENT_USER?.functions || []
  const res = functions.includes(fn)
  console.log('checkRightsInFunctions', res, route?.name, fn)
  return res
}

export const routesFilter = routes => {
  return routes.reduce((acc, route) => {
    if (route.children) {
      const routeChildren = { ...route, children: routesFilter(route.children) }
      if (routeChildren.children.length) return [...acc, routeChildren]
    }
    // if (checkRightsInFunctions(route))
    return [...acc, route]
    // return acc
  }, [])
}

export default routesFilter
