<template>
  <v-autocomplete
    v-model.trim="select"
    :items="suggestions"
    :loading="isLoading"
    :label="label"
    placeholder="начинайте вводить"
    :search-input.sync="query"
    item-text="data.house"
    item-value="data.house"
    no-filter
    return-object
    clearable
    autocomplete="new-password"
    flat
    :rules="rules"
    error-count="5"
    required
    v-bind="$attrs"
    @click:clear="clearHandler"
  >
    <template #no-data>
      <v-list-item>
        <v-list-item-title>
          <span v-if="isLoading">{{ $t('Loading') }}...</span>
          <span v-else-if="isWaiting">{{ $t('Waiting') }}...</span>
          <span v-else-if="!query">{{ $t('Enter house number') }}</span>
          <span v-else-if="!suggestions.length">{{ $t('No Data') }}</span>
        </v-list-item-title>
      </v-list-item>
    </template>
  </v-autocomplete>
</template>

<script>
import constants from '@/config/constants'
import { mapActions } from 'vuex'
import { required } from 'vee-validate/dist/rules'

export default {
  name: 'VHouse',
  props: {
    value: {
      // house
      type: null,
      default: null,
    },
    label: {
      type: String,
      default: undefined,
    },
    city: {
      type: String,
      default: '',
      // required: true,
    },
    street: {
      type: String,
      default: '',
      // required: true,
    },
  },
  data() {
    return {
      isLoading: false,
      isWaiting: false,
      query: null,
      select: { data: { house: this.value } },
      constants,
      suggestions: [this.value || []].flat(),
      form: {
        data: {
          /* postal_code: '107258',
          country: 'Россия',
          country_iso_code: 'RU',
          federal_district: 'Центральный',
          region_fias_id: '0c5b2444-70a0-4932-980c-b4dc0d3f02b5',
          */
        },
        /*
        unrestricted_value: '107258, г Москва, Богородское р-н, ул Глебовская, д 1',
        value: 'г Москва, ул Глебовская, д 1',
        */
      },
      rules: [form => required.validate(form?.data?.house).valid || this.$t('Enter house number')],
    }
  },
  computed: {
    validMessage() {
      const { data } = this.form || { data: {} }
      if (!Object.keys(data).length) return this.$t('Enter the address')

      const errorsMap = {
        house: this.$t('Enter house number'),
      }

      const [, msg] = Object.entries(errorsMap).find(([key]) => !data[key]) || []
      return msg
    },
  },
  watch: {
    query: 'queryWatch',
    select: 'selectWatch',
  },
  created() {
    window.h = this
    const { value } = this
    // this.query = value
    this.form = { data: { house: value } }
    console.log('this.suggestions=>', [...this.suggestions])
    const { geo_lat: lat, geo_lon: lon } = this.suggestions.find(e => e.data?.house === this.value)?.data || {}
    this.setCoordinates(lat, lon)
  },
  beforeDestroy() {
    clearTimeout(this.$_tm)
  },
  i18n: {
    messages: {
      en: {
        Loading: 'Loading',
        Waiting: 'Waiting',
        'Required field': 'Required field',
        'Enter the address': 'Enter the address',
        'No Data': 'No Data',
        'Enter country': 'Enter the country',
        'Enter city': 'Enter the city',
        'Enter street': 'Enter the street',
        'Enter house number': 'Enter the house number',
        Country: 'Country',
        City: 'City',
        Street: 'Street',
        'House Number': 'House Number',
      },
      ru: {
        Loading: 'Загрузка',
        Waiting: 'Ожидание',
        'Required field': 'Обязательное поле',
        'Enter the address': 'Введите адрес',
        'No Data': 'Нет данных',
        'Enter country': 'Введите страну',
        'Enter city': 'Введите город',
        'Enter street': 'Введите улицу',
        'Enter house number': 'Введите дом',
        Country: 'Страна',
        City: 'Город',
        Street: 'Улица',
        'House Number': 'Дом',
      },
    },
  },
  methods: {
    ...mapActions('geo', ['GET_HOUSES']),
    selectWatch(form) {
      // this.query = form.value
      this.onChange(form || { data: {} })
    },
    clearHandler() {
      console.log('clear')
      this.suggestions = []
    },
    queryWatch(val) {
      if (val && val !== this.select) this.querySelections()
    },
    querySelections() {
      clearTimeout(this.$_tm)
      this.isWaiting = true
      this.$_tm = setTimeout(this.getSuggestions, 500)
    },
    async getSuggestions() {
      this.isWaiting = false
      const { query, city, street } = this
      const queryTrimmed = query?.trim()
      if (!queryTrimmed) return
      this.isLoading = true
      try {
        this.suggestions = await this.GET_HOUSES({ query: queryTrimmed, count: 15, city, street })
      } catch (err) {
        this.$global.error(err)
      } finally {
        this.isLoading = false
      }
    },
    onChange(form) {
      console.log({ ...form, data: { ...form.data } })
      this.form = form
      this.form.isValid = !this.validMessage
      const { value } = this
      this.$emit('input', this.form.data.house)
      if (value !== this.form.data.house) {
        // если изменилось значение, то сообщаем родителю
        this.$emit('updated')
      }
      this.setCoordinates(form.data.geo_lat, form.data.geo_lon)
    },
    setCoordinates(lat, lon) {
      this.$emit('set-coordinates', {
        lat: +lat,
        lon: +lon,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
::v-deep .vue-dadata__input {
  min-width: 300px;
}
.color-red {
  color: red;
}
</style>
