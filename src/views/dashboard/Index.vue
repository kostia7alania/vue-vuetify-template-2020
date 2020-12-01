<template>
  <v-app>
    <DashboardCoreAppBar />
    <DashboardCoreDrawer />
    <v-main>
      <router-view />
      <DashboardCoreFooter />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'DashboardIndex',

  components: {
    DashboardCoreAppBar: () => import('./components/core/AppBar'),
    DashboardCoreDrawer: () => import('./components/core/Drawer'),
    DashboardCoreFooter: () => import('./components/core/Footer'),
  },

  data: () => ({
    expandOnHover: false,
  }),
}
</script>
