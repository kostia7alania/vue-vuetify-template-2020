import Vue from 'vue'
import VueI18n from 'vue-i18n'

import http from '@/service/http'
import store from '@/store/store'

import en from 'vuetify/lib/locale/en'
import ru from 'vuetify/lib/locale/ru'

Vue.use(VueI18n)

// function loadLocaleMessages() {
//   const locales = require.context('@/locales', true, /[A-Za-z0-9-_,\s]+\.json$/i)
//   const messages = {}
//   locales.keys().forEach(key => {
//     const matched = key.match(/([A-Za-z0-9-_]+)\./i)
//     if (matched && matched.length > 1) {
//       const locale = matched[1]
//       messages[locale] = locales(key)
//       messages[locale].$vuetify = key === 'en' ? en : ru // @TODO:@REF
//     }
//   })
//   return messages
// }

const messages = {
  en: {
    // eslint-disable-next-line global-require
    ...require('@/locales/en.json'),
    $vuetify: en,
  },
  ru: {
    // eslint-disable-next-line global-require
    ...require('@/locales/ru.json'),
    $vuetify: ru,
  },
  // ...loadLocaleMessages(),
}

const GET_LOCALE = () => store.state.settings.LOCALE

const i18n = new VueI18n({
  locale: GET_LOCALE() || process.env.VUE_APP_I18N_LOCALE || 'en',
  fallbackLocale: GET_LOCALE() || process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en',
  messages,
  // silentTranslationWarn: false,
})

const loadedLanguages = [GET_LOCALE()] // our default language that is preloaded

function setI18nLanguage(lang) {
  i18n.locale = lang

  store.commit('settings/SET_LOCALE', lang)

  http.defaults.headers.common['Accept-Language'] = lang
  document.querySelector('html').setAttribute('lang', lang)
  return lang
}

i18n.loadLanguageAsync = async lang => {
  console.log('[Load Language Async]', lang)
  // If the same language
  if (i18n.locale === lang) return setI18nLanguage(lang)

  // If the language was already loaded
  if (loadedLanguages.includes(lang)) return setI18nLanguage(lang)

  // If the language hasn't been loaded yet
  const words = await import(/* webpackChunkName: "lang-[request]" */ `@/locales/${lang}.json`)
  i18n.setLocaleMessage(lang, words.default)
  loadedLanguages.push(lang)
  return setI18nLanguage(lang)
}
// alert(GET_LOCALE())
i18n.loadLanguageAsync(GET_LOCALE())

export default i18n
