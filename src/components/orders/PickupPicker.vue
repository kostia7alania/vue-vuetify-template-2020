<template>
  <CommonSelect
    v-bind="$attrs"
    :items="PICKUPS"
    :loading="isLoading"
    item-text="id"
    item-value="id"
    label="№ заявки на пикап"
    v-on="$listeners"
  />
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'PickupPicker',
  props: {
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
    ...mapState('orders', ['PICKUPS']),
  },
  created() {
    this.init()
  },
  methods: {
    ...mapActions('orders', ['GET_PICKUPS']),
    async init() {
      this.isLoading = true
      try {
        await this.GET_PICKUPS(this.clientId)
      } catch (err) {
        this.$global.error(err)
      } finally {
        this.isLoading = false
      }
    },
  },
}
</script>
