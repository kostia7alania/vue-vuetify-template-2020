<template>
  <div>
    <v-list dense nav>
      <v-list-item id="settings" link>
        <v-list-item-avatar class="py-2 px-4" color="rgba(0, 0, 0, .3)" dark flat contain>
          <v-icon>mdi-cog</v-icon>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title class="display-1" v-text="$t('Settings')" />
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      activator="#settings"
      bottom
      content-class="v-settings"
      left
      nudge-left="8"
      offset-x
      origin="top right"
      transition="scale-transition"
    >
      <v-card class="text-center mb-0" width="300">
        <v-card-text>
          <strong class="mb-3 d-inline-block">
            <v-icon left>
              mdi-cog
            </v-icon>
            {{ $t('Sidebar Filters') }}
          </strong>

          <v-list class="transparent">
            <v-list-item v-for="(themeColor, key) in themeColors" :key="key">
              <v-list-item-icon>
                <v-icon>mdi-palette</v-icon>
              </v-list-item-icon>

              <v-list-item-title>{{ key.toUpperCase() }}</v-list-item-title>

              <v-list-item-subtitle class="text-right">
                <v-avatar
                  :class="{ 'v-settings__item--active': key === themeColorKeyActive }"
                  :color="themeColor"
                  class="v-settings__item"
                  size="25"
                  @click="toggleThemeColorKeyActive(key, themeColor)"
                />
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>

          <v-item-group v-if="themeColorKeyActive" v-model="color">
            <v-item v-for="colorDef in colors" :key="colorDef" :value="colorDef">
              <template #default="{  toggle }">
                <v-avatar
                  :class="{ 'v-settings__item--active': colorDef === themeColors[themeColorKeyActive] }"
                  :color="colorDef"
                  class="v-settings__item"
                  size="25"
                  @click="toggle"
                />
              </template>
            </v-item>
          </v-item-group>

          <v-divider class="my-4 secondary" />

          <v-row align="center" no-gutters>
            <v-col cols="auto">
              {{ $t('Dark Mode') }}
            </v-col>

            <v-spacer />

            <v-col cols="auto">
              <v-switch v-model="isDark" class="ma-0 pa-0" color="secondary" hide-details />
            </v-col>
          </v-row>

          <v-divider class="my-4 secondary" />

          <v-row align="center" no-gutters>
            <v-col cols="auto">
              {{ $t('Sidebar Image') }}
            </v-col>

            <v-spacer />

            <v-col cols="auto">
              <v-switch v-model="showImg" class="ma-0 pa-0" color="secondary" hide-details />
            </v-col>
          </v-row>

          <div class="my-12" />
        </v-card-text>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
// Mixins
import Proxyable from 'vuetify/lib/mixins/proxyable'
import { mapMutations, mapState } from 'vuex'

export default {
  name: 'DashboardCoreSettings',

  mixins: [Proxyable],

  data: () => ({
    publicPath: process.env.BASE_URL,
    color: '#E91E63',
    colors: ['#9C27b0', '#00CAE3', '#4CAF50', '#ff9800', '#E91E63', '#FF5252', '#FB8C00'],
    menu: false,
    saveImage: '',
    themeColorKeyActive: '',
    /* { accent: "#9C27b0" ..} */
    themeColors: {},
  }),

  computed: {
    ...mapState('settings', ['IS_DARK', 'BAR_IMAGE']),
    isDark: {
      get() {
        return this.IS_DARK
      },
      set(e) {
        this.SET_IS_DARK(e)
        this.initThemeColors()
      },
    },
    showImg: {
      get() {
        return this.BAR_IMAGE
      },
      set(e) {
        this.SET_BAR_IMAGE(e ? 'https://picsum.photos/400' : null)
      },
    },
  },
  i18n: {
    messages: {
      en: {
        Settings: 'Settings',
        'Sidebar Filters': 'Sidebar Filters',
        'Sidebar Image': 'Sidebar Image',
        'Dark Mode': 'Dark Mode',
      },
      ru: {
        Settings: 'Настройки',
        'Sidebar Filters': 'Настройки темы',
        'Sidebar Image': 'Картинка на фоне',
        'Dark Mode': 'Темная тема',
      },
    },
  },
  watch: {
    color: 'colorWatcher',
    image(val) {
      this.SET_BAR_IMAGE(val)
    },
  },
  created() {
    this.initThemeColors()
  },
  methods: {
    ...mapMutations('settings', ['SET_IS_DARK', 'SET_BAR_IMAGE']),
    initThemeColors() {
      this.themeColors = this.$vuetify.theme.themes[this.isDark ? 'dark' : 'light']
      console.log('this.themeColors', { ...this.themeColors })
    },
    toggleThemeColorKeyActive(key, color) {
      this.themeColorKeyActive = this.themeColorKeyActive === key ? '' : key
      this.color = color
    },
    colorWatcher(color) {
      if (!color) return
      this.$vuetify.theme.themes[this.isDark ? 'dark' : 'light'][this.themeColorKeyActive] = color
      this.initThemeColors()
    },
  },
}
</script>

<style lang="sass">
.v-settings
  .v-item-group > *
    cursor: pointer

  &__item
    border-width: 3px
    border-style: solid
    border-color: transparent !important

    &--active
      border-color: #00cae3 !important
</style>
