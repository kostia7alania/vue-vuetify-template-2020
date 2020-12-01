<template>
  <router-view />
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'App',
  computed: {
    ...mapState('settings', ['IS_DARK']),
  },
  watch: {
    IS_DARK: 'init',
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.$vuetify.theme.dark = this.IS_DARK
    },
  },
}
</script>

<style lang="scss">
@import '@/assets/scss/global.scss';
</style>
