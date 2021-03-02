<template>
  <v-autocomplete
    v-model.trim="select"
    :items="suggestions"
    :loading="isLoading"
    :label="label"
    placeholder="начинайте вводить"
    :search-input.sync="query"
    item-text="data.street"
    item-value="data.street"
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
          <span v-else-if="!query">{{ $t('Enter street') }}</span>
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
  name: 'VStreet',
  props: {
    value: {
      // street
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
  },
  data() {
    return {
      isLoading: false,
      isWaiting: false,
      query: null,
      select: { data: { street: this.value } },
      constants,
      suggestions: [this.value ? { data: { street: this.value } } : []].flat(),
      form: {
        data: {
          street: this.value,
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
      rules: [form => required.validate(form?.data?.street).valid || this.$t('Enter street')],
    }
  },
  computed: {
    validMessage() {
      const { data } = this.form || { data: {} }
      if (!Object.keys(data).length) return this.$t('Enter the address')

      const errorsMap = {
        street: this.$t('Enter street'),
      }

      const [, msg] = Object.entries(errorsMap).find(([key]) => !data[key]) || []
      return msg
    },
  },
  watch: {
    query: 'queryWatch',
    select: 'selectWatch',
  },
  beforeDestroy() {
    clearTimeout(this.$_tm)
  },

  methods: {
    ...mapActions('geo', ['GET_STREETS']),
    selectWatch(form) {
      // this.query = form.value
      this.onChange(form || { data: {} })
    },
    clearHandler() {
      console.log('clear')
      this.suggestions = []
    },
    queryWatch(val) {
      if (val && val !== this.select?.data?.street) this.querySelections()
    },
    querySelections() {
      clearTimeout(this.$_tm)
      this.isWaiting = true
      this.$_tm = setTimeout(this.getSuggestions, 500)
    },
    async getSuggestions() {
      this.isWaiting = false
      const { query, city } = this
      const queryTrimmed = query?.trim()
      if (!queryTrimmed) return
      this.isLoading = true
      try {
        this.suggestions = await this.GET_STREETS({ query: queryTrimmed, count: 15, city })
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
      this.$emit('input', this.form.data.street)
      if (value !== this.form.data.street) {
        // если изменилось значение, то сообщаем родителю, что надо сбросить дома
        this.$emit('updated')
      }
      this.$emit('set-coordinates', {
        lat: +form.data.geo_lat,
        lon: +form.data.geo_lon,
      })
    },
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
