<template>
  <OrdersAddForm
    v-if="!isLoading"
    :id="+id"
    v-bind="$attrs"
    :is-edit-mode="isEditMode"
    :init-form-value="initFormValue"
  />
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'OrdersAdd',
  components: {
    OrdersAddForm: () => import(/* webpackChunkName: "OrdersAddForm" */ '@/components/orders/OrdersAddForm'),
  },
  props: {
    id: {
      // url-params are in str-type
      type: [String, Number], // number из редактирования, string - из урл
      default: null,
    },
  },
  data() {
    return {
      initFormValue: {},
      isLoading: false,
    }
  },
  computed: {
    isEditMode() {
      return this.id !== null
    },
  },
  created() {
    if (this.isEditMode) {
      this.initOrder()
    }
  },
  methods: {
    ...mapActions('orders', ['GET_ORDER']),
    async initOrder() {
      this.isLoading = true
      try {
        this.initFormValue = await this.GET_ORDER(this.id)
      } catch (err) {
        this.$global.error(err)
      } finally {
        this.isLoading = false
      }
    },
  },
}
</script>
