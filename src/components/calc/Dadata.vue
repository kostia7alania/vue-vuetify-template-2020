<template>
  <section>
    <VueDadata placeholder="Введите адрес" :token="constants.dadata" :query="query" :on-change="onChange" />
    <div v-if="Object.keys(form.data).length">
      <v-subheader v-if="validMessage" class="color-red">
        {{ validMessage }}
      </v-subheader>
      <div>
        <div :class="{ 'color-red': !form.data.country }">Страна: {{ form.data.country }}</div>
        <div :class="{ 'color-red': !form.data.city }">Город: {{ form.data.city }}</div>
        <div :class="{ 'color-red': !form.data.street }">Улица: {{ form.data.street }}</div>
        <div :class="{ 'color-red': !form.data.house }">Дом: {{ form.data.house }}</div>
      </div>
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
  props: {
    query: {
      type: Object,
      default: undefined,
    },
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
      console.log({ ...form, data: { ...form.data } })
      this.form = form
      this.form.isValid = !this.validMessage

      this.$emit('input', this.form)
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
