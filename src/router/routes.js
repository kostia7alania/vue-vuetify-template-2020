/* VIEWS */
// () => import(/* webpackChunkName: "MainView" */ '@/views/MainView')
import guestMiddleware from './middleware/guestMiddleware'
import authMiddleware from './middleware/authMiddleware'

const MainView = () => import(/* webpackChunkName: "MainView" */ '@/views/dashboard/Index')
const AuthView = () => import(/* webpackChunkName: "AuthView" */ '@/views/AuthView')

/* PAGES */
const Dashboard = () => import(/* webpackChunkName: "Dashboard" */ '@/views/dashboard/Dashboard')
const Calc = () => import(/* webpackChunkName: "calc" */ '@/pages/Calc')
const CalcAdmin = () => import(/* webpackChunkName: "CalcAdmin" */ '@/pages/CalcAdmin')
const Login = () => import(/* webpackChunkName: "Login" */ '@/pages/Login')
const Reset = () => import(/* webpackChunkName: "Reset" */ '@/pages/Reset')
const Users = () => import(/* webpackChunkName: "Users" */ '@/pages/users/Users')
const UsersAdd = () => import(/* webpackChunkName: "UsersAdd" */ '@/pages/users/UsersAdd')

const Orders = () => import(/* webpackChunkName: "Orders" */ '@/pages/orders/Orders')
const OrdersAdd = () => import(/* webpackChunkName: "OrdersAdd" */ '@/pages/orders/OrdersAdd')

const Planner = () => import(/* webpackChunkName: "Planner" */ '@/pages/planner/Planner')

const routes = [
  {
    path: '/',
    component: MainView,
    name: 'dashboard',
    children: [
      // Dashboard
      {
        name: 'main',
        path: '', // parent path
        component: Dashboard,
        meta: {
          menu: { showInMenu: true, icon: 'mdi-home' },
        },
      },
      // Pages
      {
        path: 'orders',
        name: 'orders-parent',
        meta: { menu: { showInMenu: true, icon: 'mdi-cart-outline' } },
        component: {
          render(c) {
            return c('router-view')
          },
        },
        children: [
          {
            path: '',
            name: 'orders',
            meta: { menu: { showInMenu: true, icon: 'mdi-clipboard-list-outline' } },
            component: Orders,
          },
          {
            name: 'orders/add',
            path: 'add',
            meta: { menu: { showInMenu: true, icon: 'mdi-cart-plus' } },
            component: OrdersAdd,
          },
          {
            name: 'orders/show',
            path: 'show/:id',
            props: true,
            meta: { menu: { icon: 'mdi-cart-check' } },
            component: OrdersAdd,
          },
          {
            name: 'orders/edit',
            path: 'edit/:id',
            props: true,
            meta: { menu: { icon: 'mdi-cart-arrow-down' } },
            component: OrdersAdd,
          },
        ],
      },
      {
        path: 'planner',
        name: 'planner',
        meta: { menu: { showInMenu: true, icon: 'mdi-truck' } },
        component: Planner,
      },
      {
        path: 'calc',
        name: 'calc',
        component: Calc,
        meta: { menu: { showInMenu: true, icon: 'mdi-calculator' } },
      },
      {
        path: 'calc-admin',
        name: 'calc-admin',
        component: CalcAdmin,
        meta: { menu: { showInMenu: true, icon: 'mdi-calculator-variant-outline' } },
      },
      {
        name: 'user.profile',
        path: 'pages/user',
        meta: { menu: { showInMenu: true, icon: 'mdi-account' } },
        component: () => import('@/views/dashboard/pages/UserProfile'),
      },
      {
        path: 'users',
        name: 'users-parent',
        meta: { menu: { showInMenu: true, icon: 'mdi-account-circle-outline' } },
        component: {
          render(c) {
            return c('router-view')
          },
        },
        children: [
          {
            path: '',
            name: 'users',
            meta: { menu: { showInMenu: true, icon: 'mdi-account-circle' } },
            component: Users,
          },
          {
            name: 'users/add',
            path: 'add',
            meta: { menu: { showInMenu: true, icon: 'mdi-account-plus' } },
            component: UsersAdd,
          },
        ],
      },
      /*    {
        name: 'notifications',
        path: 'components/notifications',
        meta: { menu: { icon: 'mdi-clipboard-outline' } },
        component: () => import('@/views/dashboard/component/Notifications'),
      },
      {
        name: 'icons',
        path: 'components/icons',
        meta: { menu: { icon: 'mdi-chart-bubble' } },
        component: () => import('@/views/dashboard/component/Icons'),
        children: [
          {
            name: 'icons',
            path: 'components/icons',
            meta: { menu: { icon: 'mdi-chart-bubble' } },
            component: () => import('@/views/dashboard/component/Icons'),
          },
        ],
      },
      {
        name: 'typography',
        path: 'components/typography',
        meta: { menu: { icon: 'mdi-format-font' } },
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
        meta: { menu: { icon: 'mdi-map-marker' } },
        component: () => import('@/views/dashboard/maps/GoogleMaps'),
      },
      */
    ],
  },
  {
    path: '/auth',
    component: AuthView,
    meta: {
      middleware: {
        ignore: [authMiddleware],
        attach: [guestMiddleware],
      },
    },
    children: [
      {
        path: '', // get the parent path
        name: 'login',
        component: Login,
        meta: {
          middleware: {
            ignore: [authMiddleware],
            attach: [guestMiddleware],
          },
        },
      },
      {
        path: 'reset', // get the parent path
        name: 'Reset',
        component: Reset,
        meta: {
          middleware: {
            ignore: [authMiddleware],
            attach: [guestMiddleware],
          },
        },
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
