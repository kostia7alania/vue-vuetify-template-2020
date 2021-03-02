<template>
  <!-- :key="value.id"
    @BUG при изменении ИД - он заново не выбирает!
    -->
  <CommonSelect
    v-bind="$attrs"
    :value="value"
    :items="addresses"
    :loading="isLoading"
    item-text="title"
    item-value="id"
    return-object
    :hint="`${value.city || ''} ${value.street || ''} ${value.house || ''}`"
    label="Офис отправителя"
    v-on="$listeners"
  />
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'ClientAddressPicker',
  props: {
    value: {
      // form.client.address
      type: Object,
      default: () => ({}),
    },
    clientId: {
      type: [Number, String],
      default: null,
    },
  },
  data() {
    return {
      isLoading: false,
    }
  },
  computed: {
    ...mapGetters('orders', ['CLIENT_ADDRESSES_GETTER']),
    // model: {
    //   get() {
    //     return this.addresses.find(e => e.id === this.value.id) // смотрит по ссылке объекта
    //   },
    //   set(e) {
    //     this.$emit('input', e)
    //   },
    // },
    addresses() {
      return this.CLIENT_ADDRESSES_GETTER
    },
  },
  created() {
    this.init()
  },
  methods: {
    ...mapActions('orders', ['GET_CLIENT_ADDRESSES']),
    async init() {
      this.isLoading = true
      try {
        await this.GET_CLIENT_ADDRESSES(this.clientId)
      } catch (err) {
        this.$global.error(err)
      } finally {
        this.isLoading = false
      }
    },
  },
}
</script>
