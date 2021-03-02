<template>
  <v-navigation-drawer
    id="core-navigation-drawer"
    v-model="drawer"
    :dark="BAR_COLOR !== 'rgba(228, 226, 226, 1), rgba(255, 255, 255, 0.7)'"
    :expand-on-hover="expandOnHover"
    :right="$vuetify.rtl"
    :src="BAR_IMAGE"
    :mobile-breakpoint="mobileMenuWidth"
    app
    width="260"
    :mini-variant-width="80"
    v-bind="$attrs"
  >
    <template #img="props">
      <v-img :gradient="`to bottom, ${BAR_COLOR}`" v-bind="props" />
    </template>

    <v-divider class="mb-1" />

    <v-list dense nav>
      <v-list-item class="px-2">
        <v-list-item-avatar class="align-self-center" contain>
          <!--<v-img src="https://picsum.photos/48/48" max-height="30" />-->
          <v-icon>mdi-package-variant-closed</v-icon>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title class="display-1">
            <!-- <span class="title">D</span> -->
            courier
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-divider class="mb-2" />

    <v-list expand nav>
      <!-- Style cascading bug  -->
      <!-- https://github.com/vuetifyjs/vuetify/pull/8574 -->
      <div />

      <template v-for="route in menuFiltered">
        <DrawerItemGroup v-if="route.children" :key="route.name" :route="route">
          <ul>
            <li v-for="child in route.children" :key="child.name">{{ child.name }}</li>
          </ul>
        </DrawerItemGroup>

        <DrawerItem v-else :key="`item-${route.name}`" :route="route" />
      </template>

      <!-- Style cascading bug  -->
      <!-- https://github.com/vuetifyjs/vuetify/pull/8574 -->
      <div />
    </v-list>

    <template #append>
      <!-- <base-item :item="{ title: $t('upgrade'), icon: 'mdi-package-up', to: { name: 'upgrade' }, }" /> -->
      <!-- <DashboardCoreSettings /> -->
    </template>
  </v-navigation-drawer>
</template>

<script>
// Utilities
import { mapMutations, mapState } from 'vuex'
import { routesFilter } from '@/router/rbac'

export default {
  name: 'DashboardCoreDrawer',
  components: {
    // DashboardCoreSettings: () => import('@/views/dashboard/components/core/Settings'),
    DrawerItem: () => import('@/views/dashboard/components/core/DrawerItem'),
    DrawerItemGroup: () => import('@/views/dashboard/components/core/DrawerItemGroup'),
  },
  data() {
    return {
      mobileMenuWidth: 960,
      sidebarMenu: true,
      toggleMini: false,
    }
  },
  computed: {
    ...mapState('settings', ['BAR_COLOR', 'BAR_IMAGE', 'DRAWER']),
    mini: {
      get() {
        return this.$vuetify.breakpoint.smAndDown || this.toggleMini
      },
      set(e) {
        this.toggleMini = e
      },
    },
    drawer: {
      get() {
        return this.DRAWER
      },
      set(val) {
        this.SET_DRAWER(val)
      },
    },
    expandOnHover() {
      if (this.$vuetify.breakpoint.mdAndUp) {
        if (this.drawer) return true
      }
      // this.$vuetify.application.framework.breakpoint.width > this.mobileMenuWidth
    },
    menuFiltered() {
      /*
        href: undefined,
        icon: undefined,
        subtitle: undefined,
        title: undefined,
        to: undefined,
      */
      const menu = this.$router.options.routes
        .find(({ name }) => name === 'dashboard')
        .children.filter(route => route.meta?.menu?.showInMenu)
      const menuFiltered = menu.map(route => {
        if (!route.children) return route
        const children = route.children.filter(childRoute => childRoute.meta?.menu?.showInMenu)
        return { ...route, children }
      })
      const routesFiltered = routesFilter(menuFiltered)
      return routesFiltered
    },
    /*
    computedMenu() {
      const menu = this.$router.options.routes[0].children
      const filteredChild = menu.map(route => {
        const newRoute = { ...route, ...route.meta?.menu, title: this.$t(`menu.${route.name.replace(/\./g, '_')}`) }
        if (route.children) {
          newRoute.children = newRoute.children
            .filter(child => child.meta?.menu)
            .map(child => ({ ...child, ...child.meta?.menu, title: this.$t(`menu.${child.name.replace(/\./g, '_')}`) }))
        }
        return newRoute
      })
      const filteredMenu = filteredChild.filter(route => route.meta?.menu)
      return filteredMenu
    },
    */
    profile() {
      return {
        avatar: true,
        title: this.$t('avatar'),
      }
    },
  },
  methods: {
    ...mapMutations('settings', ['SET_DRAWER']),
    routeMapper(route) {
      return { ...route, icon: route?.meta?.menu?.icon, title: this.$t(`menu.${route.name.replace(/\./g, '_')}`) }
    },
  },
}
</script>

<style lang="scss">
#core-navigation-drawer .v-list-item {
  justify-content: space-between;
}
</style>

<style lang="sass">

#core-navigation-drawer
  .v-list-group__header.v-list-item--active:before
    opacity: .24

  .v-list-item
    &__icon--text,
    &__icon:first-child
      justify-content: center
      text-align: center
      width: 20px



  .v-list--dense
    .v-list-item
      &__icon--text,
      &__icon:first-child
        margin-top: 10px

  .v-list-group--sub-group


    .v-list-group__header


      .v-list-item__icon--text
        margin-top: 19px
        order: 0

      .v-list-group__header__prepend-icon
        order: 2
</style>
