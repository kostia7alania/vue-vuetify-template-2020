const routes = [
  {
    path: '/',
    name: 'Home',
    meta: {
      menu: { title: 'Главная' },
      title: 'Главная',
    },
    component: () => import('@/views/AppHome'),
  },
]
export default routes
