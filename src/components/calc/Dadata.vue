<template>
  <!-- <section> -->
  <!-- <VueDadata :placeholder="$t('Enter the address')"
     :token="constants.dadata" :query="query" :on-change="onChange" /> -->
  <v-autocomplete
    v-model="select"
    :items="suggestions"
    :loading="isLoading"
    :label="labelComputed"
    :placeholder="$t('Enter the address')"
    :search-input.sync="search"
    item-text="value"
    item-value="value"
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
          {{ $t('No Data') }}
        </v-list-item-title>
      </v-list-item>
    </template>

    <template #selection="{ attr, on, item, selected }">
      <v-chip v-bind="attr" :input-value="selected" color="blue-grey" class="white--text" v-on="on">
        <v-icon left>
          mdi-bitcoin
        </v-icon>
        <span v-text="item.value"></span>
      </v-chip>
    </template>

    <template #item="{ item }">
      <v-list-item-avatar color="indigo" class="headline font-weight-light white--text">
        {{ item.value.charAt(0) }}
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title v-text="item.value"></v-list-item-title>
        <v-list-item-subtitle v-text="item.unrestricted_value"></v-list-item-subtitle>
      </v-list-item-content>
      <!-- <v-list-item-action>
          <v-icon>mdi-bitcoin</v-icon>
        </v-list-item-action> -->
    </template>
  </v-autocomplete>
  <!--
    <div v-if="Object.keys(form.data).length">
      <v-subheader v-if="validMessage" class="color-red">
        {{ validMessage }}
      </v-subheader>
      <div>
        <div :class="{ 'color-red': !form.data.country }">{{ $t('Country') }}: {{ form.data.country }}</div>
        <div :class="{ 'color-red': !form.data.city }">{{ $t('City') }}: {{ form.data.city }}</div>
        <div :class="{ 'color-red': !form.data.street }">{{ $t('Street') }}: {{ form.data.street }}</div>
        <div :class="{ 'color-red': !form.data.house }">{{ $t('House Number') }}: {{ form.data.house }}</div>
      </div>
    </div>
  </section> -->
</template>

<script>
import constants from '@/config/constants'
import { mapActions } from 'vuex'
import { required } from 'vee-validate/dist/rules'

export default {
  name: 'Dadata',
  // components: {
  //   VueDadata: () => import(/* ebpackChunkName: "vue-dadata" */ 'vue-dadata'),
  // },
  props: {
    query: {
      type: Object,
      default: undefined,
    },
    label: {
      type: String,
      default: undefined,
    },
    // case: {
    //   type: Array,
    //   default: () => ['city'], // RU https://dadata.ru/api/clean/address/
    // },
  },
  data() {
    return {
      isLoading: false,
      search: null,
      select: null,
      constants,
      suggestions: [],
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
      rules: [
        // form => required.validate(form).valid || this.$t('Required field'),
        // form => required.validate(form?.data?.country).valid || this.$t('Enter country'),
        form => required.validate(form?.data?.city).valid || this.$t('Enter city'),
        form => required.validate(form?.data?.street).valid || this.$t('Enter street'),
        form => required.validate(form?.data?.house).valid || this.$t('Enter house number'),
      ],
    }
  },
  computed: {
    labelComputed() {
      return `${this.label} *`
    },
    validMessage() {
      const { data } = this.form || { data: {} }
      if (!Object.keys(data).length) return this.$t('Enter the address')

      const errorsMap = {
        // country: this.$t('Enter country'),
        city: this.$t('Enter city'),
        street: this.$t('Enter street'),
        house: this.$t('Enter house number'),
      }

      const [, msg] = Object.entries(errorsMap).find(([key]) => !data[key]) || []
      return msg
    },
  },
  watch: {
    search: 'searchWatch',
    select: 'selectWatch',
  },
  beforeDestroy() {
    clearTimeout(this.$_tm)
  },
  i18n: {
    messages: {
      en: {
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
    ...mapActions('calc', ['GET_SUGGESTIONS']),
    selectWatch(form) {
      // this.search = form.value
      this.onChange(form || { data: {} })
    },
    clearHandler() {
      console.log('clear')
      this.suggestions = []
    },
    searchWatch(val) {
      if (val && val !== this.select) this.querySelections()
    },
    querySelections() {
      clearTimeout(this.$_tm)
      this.$_tm = setTimeout(this.getSuggestions, 500)
    },
    async getSuggestions() {
      this.isLoading = true
      try {
        this.suggestions = await this.GET_SUGGESTIONS({ query: this.search, count: 10 })
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
      this.$emit('input', this.form)

      this.$emit('set-coordinates', {
        geo_lat: +form.data.geo_lat,
        geo_lon: +form.data.geo_lon,
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
