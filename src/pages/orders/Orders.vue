<template>
  <!-- <v-row>
      <v-col> -->
  <!-- <CalcForm :loading="isLoading" @get-calc="getCalc" />-->
  <OrdersResult v-if="ORDERS.length" :result="ORDERS" />
  <!-- </v-col>
    </v-row> -->
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'Orders',
  components: {
    OrdersResult: () => import(/* webpackChunkName: "OrdersResult" */ '@/components/orders/OrdersResult'),
  },
  data() {
    return {
      isLoading: false,
    }
  },
  computed: {
    ...mapState('orders', ['ORDERS']),
  },
  created() {
    this.init()
  },
  methods: {
    ...mapActions('orders', ['GET_ORDERS']),
    async init() {
      this.isLoading = true
      try {
        this.result = await this.GET_ORDERS(1)
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
