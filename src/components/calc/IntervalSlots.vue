<template>
  <v-container fluid>
    <v-radio-group v-model="model" row>
      <v-radio v-for="slot in slots" :key="slot" :label="slot" :value="slot" />
    </v-radio-group>
  </v-container>
</template>

<script>
const getSlots = (start, end) => {
  return new Array(end + 1).fill().reduce((acc, res, i) => {
    if (i >= start && i <= end) return [...acc, `${i}-${i + 4}`]
    return acc
  }, [])
}

export default {
  name: 'IntervalSlots',
  props: {
    value: {
      /* form.interval_slots[0] */
      type: Object,
      default: () => ({}),
    },
    isSelectedToday: {
      type: Boolean,
      default: false,
    },
    isDayInDay: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    model: {
      get() {
        const { from, to } = this.value || { from: '', to: '' }
        return `${from.replace(':00', '')}-${to.replace(':00', '')}`
      },
      set(e) {
        console.log('e', e)
        const [from, to] = e.split('-')
        this.$emit('input', { from: `${from}:00`, to: `${to}:00` })
      },
    },
    slots() {
      if (this.isSelectedToday) {
        if (this.isDayInDay) {
          const h = new Date().getHours()
          const mapping = {
            '18-22': h < 18,
            '18-00': h < 18,
            '20-00': h < 20,
          }
          return Object.entries(mapping)
            .filter(([, value]) => value)
            .reduce((acc, [key]) => [...acc, key], [])
        }
        return getSlots(new Date().getHours(), 18)
      }
      return getSlots(9, 18)
    },
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      // eslint-disable-next-line prefer-destructuring
      if (this.slots.length && !this.slots.includes(this.model)) this.model = this.slots[0]
    },
  },
}
</script>
