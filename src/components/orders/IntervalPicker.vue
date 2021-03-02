<template>
  <CommonSelect v-bind="$attrs" prepend-icon="mdi-clock-outline" :items="intervals" v-on="$listeners" />
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'IntervalPicker',
  props: {
    pickupId: {
      type: [Number, String],
      default: null,
    },
  },
  computed: {
    ...mapState('orders', ['PICKUPS']),
    intervals() {
      return this.PICKUPS.find(e => e.id === this.pickupId)?.intervals || []
    },
  },
}
</script>
