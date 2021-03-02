<template>
  <v-btn min-width="0" text @click="isDark = !isDark">
    <v-icon :color="color" center v-text="icon" />
  </v-btn>
  <!-- <v-switch v-model="isDark" class="ma-0 pa-0" color="secondary" hide-details /> -->
</template>

<script>
import { mapMutations, mapState } from 'vuex'

export default {
  name: 'SettingsDarkToggler',
  computed: {
    ...mapState('settings', ['IS_DARK']),
    icon() {
      return this.IS_DARK ? 'mdi-weather-sunny' : 'mdi-white-balance-sunny'
    },
    color() {
      return this.IS_DARK ? 'yellow' : 'red lighten-2'
    },
    isDark: {
      get() {
        return this.IS_DARK
      },
      set(e) {
        this.SET_IS_DARK(e)
        this.initThemeColors()
      },
    },
  },
  i18n: {
    messages: {
      en: {
        'Dark Mode': 'Dark Mode',
      },
      ru: {
        'Dark Mode': 'Темная тема',
      },
    },
  },
  created() {
    this.initThemeColors()
  },
  methods: {
    ...mapMutations('settings', ['SET_IS_DARK']),
    initThemeColors() {
      this.$vuetify.theme.dark = this.IS_DARK
      this.themeColors = this.$vuetify.theme.themes[this.isDark ? 'dark' : 'light']
      console.log('this.themeColors', { ...this.themeColors })
    },
  },
}
</script>
