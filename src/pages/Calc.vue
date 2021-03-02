<template>
  <div>
    <CalcForm :loading="isLoading" @get-calc="getCalc" />
    <CalcResult v-if="result.length" :result="result" />
  </div>
</template>

<script>
import { mapActions } from 'vuex'

/*
const mock = [
  {
    delivery_type_name: 'string',
    price: 123.2,
    date: '2017-07-04',
    detalization: [
      { name: 'базовая цена', price: 375 },
      { name: 'услуга за превышение допустимого веса заказа', price: 100 },
      { name: 'услуга за превышение допустимых габаритов', price: 100 },
    ],
  },
  {
    delivery_type_name: 'string2',
    price: 222,
    date: '2018-07-04',
    detalization: [
      { name: '1 базовая цена', price: 222 },
      { name: '2 услуга за превышение допустимого веса заказа', price: 33 },
      { name: '3услуга за превышение допустимых габаритов', price: 44 },
    ],
  },
]
*/

export default {
  name: 'CalcSimple',
  components: {
    CalcForm: () => import(/* webpackChunkName: "CalcForm" */ '@/components/calc/CalcForm'),
    CalcResult: () => import(/* webpackChunkName: "CalcResult" */ '@/components/calc/CalcResult'),
  },
  data() {
    return {
      isLoading: false,
      result: [],
    }
  },
  methods: {
    ...mapActions('calc', ['GET_CALC']),
    async getCalc(form) {
      this.isLoading = true
      try {
        this.result = await this.GET_CALC(form)
        if (!this.result.length) this.$global.toast.warning(this.$t('calc.No results'))
      } catch (err) {
        this.$global.error(err)
      } finally {
        this.isLoading = false
      }
    },
  },
}
</script>
