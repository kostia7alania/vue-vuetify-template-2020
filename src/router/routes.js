/* VIEWS */
const MainView = () => import(/* webpackChunkName: "MainView" */ '@/views/MainView')
const AuthView = () => import(/* webpackChunkName: "AuthView" */ '@/views/AuthView')

/* PAGES */
const Home = () => import(/* webpackChunkName: "Home" */ '@/pages/Home')
const Calc = () => import(/* webpackChunkName: "calc" */ '@/pages/Calc')
const Auth = () => import(/* webpackChunkName: "Auth" */ '@/pages/Auth')

const routes = [
  {
    path: '/',
    component: MainView,
    children: [
      {
        path: '', // parent path
        name: 'main',
        component: Home,
        meta: {
          menu: { title: 'Главная' },
          title: 'Главная',
        },
      },
      {
        path: 'calc',
        name: 'calc',
        component: Calc,
        meta: {
          menu: { title: 'Калькулятор' },
          title: 'Калькулятор',
        },
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
        meta: {
          menu: { title: 'Авторизация' },
          title: 'Авторизация',
        },
      },
    ],
  },
]

export default routes
