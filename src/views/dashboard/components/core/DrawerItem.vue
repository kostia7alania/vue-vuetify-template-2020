<template>
  <v-list-item
    :href="resolvedRoute.href"
    rel="noopener"
    :to="to"
    exact
    :active-class="`primary ${!isDark ? 'black' : 'white'}--text`"
  >
    <v-list-item-icon v-if="text" class="v-list-item__icon--text" v-text="menuTitleInitials" />
    <v-list-item-icon v-else-if="menuIcon">
      <v-icon v-text="menuIcon" />
    </v-list-item-icon>

    <v-list-item-content v-if="menuTitle || menuSubTitle">
      <v-list-item-title v-if="menuTitle" v-text="menuTitle" />
      <v-list-item-subtitle v-if="menuSubTitle" v-text="menuSubTitle" />
    </v-list-item-content>
  </v-list-item>
</template>

<script>
import Themeable from 'vuetify/lib/mixins/themeable'

export default {
  name: 'DrawerItem',

  mixins: [Themeable],

  props: {
    route: {
      type: Object,
      default: () => ({
        to: undefined,
        meta: {
          // icon: undefined,
          // subtitle: undefined,
          // title: undefined,
          menu: {
            icon: undefined,
          },
        },
      }),
    },
    text: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    resolvedRoute() {
      return this.$router.resolve(this.route)
    },
    menuIcon() {
      return this.route.meta.menu.icon
    },
    menuTitle() {
      const routeName = this.route.name.replace(/\./g, '_')
      const translateRoute = `menu.${routeName}`
      if (!this.$te(translateRoute)) return ''
      const menuSubTitle = this.$t(translateRoute).replace(/^menu./, '')
      return menuSubTitle
    },
    menuSubTitle() {
      const routeName = this.route.name.replace(/\./g, '_')
      const translateRoute = `menu.subtitle.${routeName}`
      if (!this.$te(translateRoute)) return ''
      const menuSubTitle = this.$t(translateRoute).replace(/^menu.subtitle./, '')
      return menuSubTitle
    },
    menuTitleInitials() {
      return this.menuTitle.split(' ').reduce((acc, el) => acc + el.substring(0, 1), '')
    },
    to() {
      return this.route.to || { name: this.route.name }
    },
  },
}
</script>
