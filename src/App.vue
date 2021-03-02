<template>
  <router-view />
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'

export default {
  name: 'App',
  computed: {
    ...mapState('settings', ['IS_DARK']),
    ...mapGetters('auth', ['IS_LOGGED_IN']),
  },
  created() {
    this.initAuth()
    this.initTheme()
  },
  methods: {
    ...mapMutations('auth', ['UNSET_LOGIN']),
    initAuth() {
      if (!this.IS_LOGGED_IN) this.UNSET_LOGIN()
    },
    initTheme() {
      this.$vuetify.noDataText = 'Нет данных'
      this.$vuetify.theme.dark = this.IS_DARK
    },
  },
}
</script>

<style lang="scss">
@import '@/assets/scss/global.scss';
</style>
