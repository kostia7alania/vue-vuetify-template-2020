<template>
  <VueTimepicker
    v-model="model"
    :auto-scroll="autoScroll"
    :hour-range="hourRange"
    :minute-range="minuteRange"
    :hide-disabled-items="hideDisabledItems"
    :minute-interval="minuteInterval"
  />
</template>

<script>
import VueTimepicker from 'vue2-timepicker/src/vue-timepicker'

export default {
  name: 'VTimepicker',
  components: {
    VueTimepicker,
  },
  props: {
    value: {
      type: null,
      default: null,
    },
    hourRange: {
      type: Array,
      default: () => [],
    },
    minuteRange: {
      type: Array,
      default: () => [],
    },
    hideDisabledItems: {
      type: Boolean,
      default: true,
    },
    autoScroll: {
      type: Boolean,
      default: true,
    },
    minuteInterval: {
      type: Number,
      default: 1,
    },
  },
  computed: {
    model: {
      get() {
        return '00:00'
      },
      set(e) {
        this.$emit('input', e)
      },
    },
  },
}
</script>
