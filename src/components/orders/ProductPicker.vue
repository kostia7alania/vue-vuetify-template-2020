<template>
  <CommonSelect
    v-model="productModel"
    v-bind="$attrs"
    :disabled="disabled || isLoading"
    :rules="['req']"
    :items="PRODUCTS"
    item-text="title"
    item-value="id"
    label="Продукт"
  />
  <!--:label="$t('calc.Delivery Service')"-->
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'ProductPicker',
  props: {
    value: {
      // form.product
      type: Number,
      default: null,
    },
    deliveryServiceId: {
      type: Number,
      default: undefined,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isLoading: false,
      PRODUCTS: [],
    }
  },
  computed: {
    product() {
      return this.value
    },
    productModel: {
      get() {
        return this.product
      },
      set(product) {
        this.$emit('input', product)
      },
    },
  },
  created() {
    this.init()
  },
  methods: {
    ...mapActions('orders', ['GET_PRODUCTS']),
    async init() {
      const { deliveryServiceId } = this
      if (deliveryServiceId || deliveryServiceId === 0) {
        this.PRODUCTS = await this.doRequest(this.GET_PRODUCTS({ deliveryServiceId }))
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
