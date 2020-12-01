/* VIEWS */
// () => import(/* webpackChunkName: "MainView" */ '@/views/MainView')
const MainView = () => import(/* webpackChunkName: "MainView" */ '@/views/dashboard/Index')
const AuthView = () => import(/* webpackChunkName: "AuthView" */ '@/views/AuthView')

/* PAGES */
const Dashboard = () => import(/* webpackChunkName: "Dashboard" */ '@/views/dashboard/Dashboard')
const Calc = () => import(/* webpackChunkName: "calc" */ '@/pages/Calc')
const Auth = () => import(/* webpackChunkName: "Auth" */ '@/pages/Auth')

const routes = [
  {
    path: '/',
    component: MainView,
    children: [
      // Dashboard
      {
        path: '', // parent path
        name: 'main',
        component: Dashboard,
        meta: {
          menu: { icon: 'mdi-view-dashboard' },
        },
      },
      // Pages
      {
        path: 'calc',
        name: 'calc',
        component: Calc,
        meta: {
          menu: { icon: 'mdi-calculator' },
        },
      },
      {
        name: 'user.profile',
        path: 'pages/user',
        meta: {
          menu: { icon: 'mdi-account' },
        },
        component: () => import('@/views/dashboard/pages/UserProfile'),
      },
      {
        name: 'notifications',
        path: 'components/notifications',
        meta: {
          menu: { icon: 'mdi-clipboard-outline' },
        },
        component: () => import('@/views/dashboard/component/Notifications'),
      },
      {
        name: 'icons',
        path: 'components/icons',
        meta: {
          menu: { icon: 'mdi-chart-bubble' },
        },
        component: () => import('@/views/dashboard/component/Icons'),
        children: [
          {
            name: 'icons',
            path: 'components/icons',
            meta: {
              menu: { icon: 'mdi-chart-bubble' },
            },
            component: () => import('@/views/dashboard/component/Icons'),
          },
        ],
      },
      {
        name: 'typography',
        path: 'components/typography',
        meta: {
          menu: { icon: 'mdi-format-font' },
        },
        component: () => import('@/views/dashboard/component/Typography'),
      },
      // Tables
      {
        name: 'tables.regular',
        path: 'tables/regular-tables',
        component: () => import('@/views/dashboard/tables/RegularTables'),
      },
      // Maps
      {
        name: 'maps.google',
        path: 'maps/google-maps',
        meta: {
          menu: { icon: 'mdi-map-marker' },
        },
        component: () => import('@/views/dashboard/maps/GoogleMaps'),
      },
    ],
  },
  {
    path: '/auth',
    component: AuthView,
    children: [
      {
        path: '', // get the parent path
        name: 'auth',
        component: Auth,
      },
    ],
  },
  {
    path: '*',
    redirect: {
      name: 'main',
    },
  },
]

export default routes
