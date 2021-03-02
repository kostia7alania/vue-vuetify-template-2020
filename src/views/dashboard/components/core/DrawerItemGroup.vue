<template>
  <v-list-group
    :group="group"
    :prepend-icon="menuIcon"
    :sub-group="subGroup"
    append-icon="mdi-menu-down"
    :color="BAR_COLOR !== 'rgba(255, 255, 255, 1), rgba(255, 255, 255, 0.7)' ? 'white' : 'grey darken-1'"
  >
    <template #activator>
      <v-list-item-icon v-if="text" class="v-list-item__icon--text" v-text="menuTitleInitials" />

      <v-list-item-avatar v-else-if="menuAvatar" class="align-self-center" color="white" contain>
        <v-img src="https://picsum.photos/48" />
      </v-list-item-avatar>

      <v-list-item-content>
        <v-list-item-title v-text="menuTitle" />
      </v-list-item-content>
    </template>

    <template v-for="(child, i) in route.children">
      <DrawerItemSubGroup v-if="child.children" :key="`sub-group-${i}`" :route="child" />

      <DrawerItem v-else :key="`item-${i}`" :route="child" text />
    </template>
  </v-list-group>
</template>

<script>
// Utilities
import kebabCase from 'lodash/kebabCase'
import { mapState } from 'vuex'

export default {
  name: 'DrawerItemGroup',
  components: {
    DrawerItem: () => import('@/views/dashboard/components/core/DrawerItem'),
    DrawerItemSubGroup: () => import('@/views/dashboard/components/core/DrawerItemSubGroup'),
  },

  inheritAttrs: false,
  props: {
    route: {
      type: Object,
      default: () => ({
        avatar: undefined,
        group: undefined,
        title: undefined,
        children: [],
      }),
    },
    subGroup: {
      type: Boolean,
      default: false,
    },
    text: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    ...mapState('settings', ['BAR_COLOR']),
    resolvedRoute() {
      return this.$router.resolve(this.route)
    },
    menuIcon() {
      return this.route.meta.menu.icon
    },
    menuTitle() {
      return this.$t(`menu.${this.route.name.replace(/\./g, '_')}`).replace(/^menu./, '')
    },
    menuTitleInitials() {
      return this.menuTitle.split(' ').reduce((acc, el) => acc + el.substring(0, 1), '')
    },

    menuAvatar() {
      return this.route.meta.menu.avatar
    },
    group() {
      return this.genGroup(this.route.children)
    },
  },

  methods: {
    genGroup(children) {
      return children
        .filter(item => item.to)
        .map(item => {
          const parent = item?.meta?.menu?.isGroup || this.route.meta?.menu?.isGroup
          let group = `${parent}/${kebabCase(item.to)}`

          if (item.children) {
            group = `${group}|${this.genGroup(item.children)}`
          }

          return group
        })
        .join('|')
    },
  },
}
</script>

<style>
.v-list-group__activator p {
  margin-bottom: 0;
}
</style>
