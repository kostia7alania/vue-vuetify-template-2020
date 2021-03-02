<template>
  <v-date-picker v-if="opened" v-model="model" :min="min" :max="max" no-title @input="isShown = false" />
  <v-menu
    v-else
    v-model="isShown"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    max-width="290px"
    min-width="auto"
  >
    <template #activator="{ on, attrs }">
      <v-text-field
        v-model="computedDateFormatted"
        :label="labelComputed"
        :hint="hint"
        persistent-hint
        :prepend-icon="prependIcon"
        readonly
        v-bind="attrs"
        v-on="on"
      />
    </template>
    <v-date-picker v-model="model" :min="min" :max="max" no-title @input="isShown = false" />
  </v-menu>
  <!--   @TODO если понадобятся кнопочки - в слоты впихнуть
  <v-btn text :disabled="!canSelectTodayDate" :color="isSelectedToday ? 'primary' : ''" @click="toToday">
        {{ $t('calc.Today') }}
      </v-btn>
      <v-btn text :disabled="isDayInDay" :color="isSelectedTomorrow ? 'primary' : ''" @click="toTomorow">
        {{ $t('calc.Tomorrow') }}
      </v-btn> -->
</template>

<script>
import { dateFormatter } from '@/setups/dayjs'
import { rulesMap } from '@/utils/rulesMap'

export default {
  name: 'VDatepicker',
  props: {
    value: {
      type: null,
      default: null,
    },
    required: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: '',
    },
    hint: {
      type: String,
      default: '',
    },
    prependIcon: {
      type: String,
      default: 'mdi-calendar',
    },
    min: {
      type: [Date, String],
      default: undefined,
    },
    max: {
      type: [Date, String],
      default: undefined,
    },
    rules: {
      /* ['req', ] */
      type: Array,
      default: () => [],
      validator: arr => arr.every(rule => ['req'].includes(rule)),
    },
    opened: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isShown: false,
    }
  },
  computed: {
    labelComputed() {
      if (this.required || this.rules.includes('req')) return `${this.label} *`
      return this.label
    },
    model: {
      get() {
        return this.value
      },
      set(date) {
        this.$emit('input', date)
      },
    },
    computedDateFormatted() {
      return dateFormatter(this.model)
    },
    rulesComputed() {
      const rules = Object.entries(rulesMap)
        .filter(([key]) => this.rules.includes(key))
        .map(([, rule]) => rule)
      if (this.required) rules.push(rules.req)
      return rules
    },
  },
}
</script>
