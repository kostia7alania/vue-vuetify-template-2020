<template>
  <section>
    <VueDadata :token="constants.dadata" :on-change="onChange" />
    <div v-if="Object.keys(form.data).length">
      <div>Страна: {{ form.data.country }}</div>
      <div>Город: {{ form.data.city }}</div>
      <div>Улица: {{ form.data.street }}</div>
      <div>Дом: {{ form.data.house }}</div>
      <v-alert v-if="validMessage" border="top" color="red lighten-2" dark>{{ validMessage }}</v-alert>
    </div>
  </section>
</template>

<script>
import constants from '@/config/constants'

export default {
  name: 'Dadata',
  components: {
    VueDadata: () => import(/* ebpackChunkName: "vue-dadata" */ 'vue-dadata'),
  },
  data() {
    return {
      constants,
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
    }
  },
  computed: {
    validMessage() {
      const { data } = this.form || {}
      if (!Object.keys(data).length) return false

      const errorsMap = {
        country: 'Введите страну',
        city: 'Введите город',
        street: 'Введите улицу',
        house: 'Введите дом',
      }

      const [, msg] = Object.entries(errorsMap).find(([key]) => !data[key]) || []
      return msg
    },
  },
  methods: {
    onChange(form) {
      console.log({ ...form.data })
      this.form = form
      if (this.validMessage) {
        this.$emit('input', form)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
::v-deep .vue-dadata__input {
  min-width: 300px;
}
</style>
