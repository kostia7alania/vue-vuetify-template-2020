<template>
  <v-app>
    <AppNav :is-shown-menu="isShownMenu" />
    <AppHeader @toggle-menu="isShownMenu = !isShownMenu" />
    <v-main>
      <router-view />
    </v-main>
    <AppFooter />
  </v-app>
</template>

<script>
// @ is an alias to /src
export default {
  name: 'MainView',
  components: {
    AppNav: () => import(/* webpackChunkName: "AppNav" */ '@/layout/AppNav'),
    AppHeader: () => import(/* webpackChunkName: "AppHeader" */ '@/layout/AppHeader'),
    AppFooter: () => import(/* webpackChunkName: "AppFooter" */ '@/layout/AppFooter'),
  },
  data() {
    return {
      isShownMenu: false,
    }
  },
}
</script>
