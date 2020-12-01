<template>
  <span min-width="0" class="language-selector ">
    <!-- <b-tooltip
      v-for="loc in availableLocales"
      :key="loc"
      :label="$t('locale.loc.' + loc)"
      type="is-dark"
      position="is-bottom"
    >
      <span
        class="language-selector__item anim"
        :class="{ 'language-selector__item-current': loc === currentlocale && !toggle }"
        @click="ale(loc)"
      >
        <Flag :flag="loc" />
      </span>
    </b-tooltip> -->
    <v-tooltip bottom>
      <template #activator="{ on, attrs }">
        <v-btn min-width="0" color="primary" text v-bind="attrs" v-on="on" @click="nextLocale">
          <BaseFlag :flag="currentlocale" />
        </v-btn>
      </template>
      <span>{{ $t('lacale.' + currentlocale) }}</span>
    </v-tooltip>
  </span>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'LanguageSelector',
  // components: {
  //   Flag: () => import('@/components/header/Flag'),
  // },
  // props: {
  //   toggle: {
  //     type: Boolean,
  //     default: false,
  //   },
  // },
  data() {
    return {
      locales: ['ru', 'en'], // this.$i18n.availableLocales
    }
  },
  computed: {
    currentlocale() {
      return this.$i18n.locale
    },
    availableLocales() {
      // if (this.toggle) return [this.currentlocale]
      return this.locales
    },
  },
  watch: {
    currentLocale: 'localeChanged',
  },
  // i18n: {
  //   messages: {
  //     en: {
  //       ru: 'Русский',
  //       en: 'English',
  //     },
  //     ru: {
  //       ru: 'Русский',
  //       en: 'English',
  //     },
  //   },
  // },
  methods: {
    ...mapMutations('settings', ['SET_LOCALE']),
    async localeChanged() {
      const setPageTitle = (await import(/* webpackChunkName: "setPageTitle" */ '@/utils/setPageTitle')).default
      setPageTitle(this.$t(`title.${this.$route.name.replace(/\./g, '_')}`))
    },
    nextLocale() {
      const loc = this.currentlocale
      const locIndex = this.locales.findIndex(locale => locale === loc)
      if (locIndex === this.availableLocales.length - 1) return this.setLocale(this.availableLocales[0])
      this.setLocale(this.availableLocales[locIndex + 1])
    },
    async setLocale(locale) {
      let locCode = locale
      if (this.toggle) locCode = this.locales.find(loc => loc !== this.currentlocale)
      console.log('locCodes', locCode)
      const res = await this.$i18n.loadLanguageAsync(locCode)
      console.log('Loaded locale:', res)
      this.SET_LOCALE(locCode)
      this.localeChanged()
      // this.$i18n.locale = locale
    },
  },
}
</script>

<style lang="scss" scoped>
.language-selector {
  // display: flex;
  // align-items: inherit;

  &__item {
    cursor: pointer;
    /*transition: 0.3s;
    // margin-left: 6px;
    &:hover {
      transform: scale(1.1);
    }
    &:active {
      transform: scale(0.8);
    }*/
    &-current {
      /*
      opacity: 0.4;
      cursor: not-allowed;
      &:hover,
      &:active {
        transform: scale(1);
      }
      */
    }
  }
}
</style>
