<template>
  <CommonSelect
    v-model="deliveryServiceModel"
    v-bind="$attrs"
    :disabled="disabled || loading || isLoading"
    :rules="['req']"
    :items="DELIVERY_CERVICES"
    item-text="title"
    item-value="id"
    :label="$t('calc.Delivery Service')"
  />
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'DeliveryServicePicker',
  props: {
    value: {
      // form.delivery_service
      type: Number,
      default: null,
    },
    categoryId: {
      type: Number,
      default: undefined,
    },
    city: {
      type: String,
      default: undefined,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isLoading: false,
      DELIVERY_CERVICES: [],
    }
  },
  computed: {
    deliveryService() {
      return this.value
    },
    deliveryServiceModel: {
      get() {
        return this.deliveryService
      },
      set(deliveryService) {
        this.$emit('input', deliveryService)
      },
    },
  },
  created() {
    this.init()
  },
  methods: {
    ...mapActions('orders', ['GET_DELIVERY_CERVICES']),
    async init() {
      const { categoryId, city } = this
      if ((categoryId || categoryId === 0) && city) {
        this.DELIVERY_CERVICES = await this.doRequest(this.GET_DELIVERY_CERVICES({ categoryId, city }))
      }
    },
    async doRequest(callback, loading = 'isLoading') {
      this[loading] = true
      try {
        const data = await callback
        return data
      } catch (err) {
        this.$global.error(err)
      } finally {
        this[loading] = false
      }
    },
  },
}
</script>
