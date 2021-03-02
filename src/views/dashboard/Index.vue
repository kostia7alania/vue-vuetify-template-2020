<template>
  <v-app class="grey--text text--darken-2">
    <DashboardCoreAppBar />
    <DashboardCoreDrawer />
    <v-main>
      <v-container fluid class="main">
        <h2 class="items-center font-weight-bold text-uppercase mb-3">
          <v-icon left>
            {{ $route.meta.menu.icon }}
          </v-icon>
          <span class="">
            {{ $t('title.' + $route.name.replace(/\./g, '_')) }}
          </span>
        </h2>
        <div class="router-view mb-5 tab-content">
          <router-view />
        </div>
        <DashboardCoreFooter />
      </v-container>
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

<style lang="scss" scoped>
.main {
  padding: 15px;
  position: relative;
  margin-bottom: auto;
}

.tab-content {
  padding: 15px;
  box-shadow: 0px 0px 8px rgb(0 0 0 / 10%);
  position: relative;
  z-index: 2;
  border-radius: 3px;
  min-height: calc(100vh - 192px);
}
</style>
