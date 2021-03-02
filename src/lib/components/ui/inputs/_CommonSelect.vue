<template>
  <v-select v-bind="$attrs" :label="labelComputed" :type="type" :rules="rulesComputed" v-on="inputListeners">
    <div slot="no-data">{{ $t('calc.No Data') }}</div>

    <!-- pass through scoped slots -->
    <template v-for="(_, scopedSlotName) in $scopedSlots" #[scopedSlotName]="slotData">
      <slot :name="scopedSlotName" v-bind="slotData" />
    </template>

    <!-- pass through normal slots -->
    <template v-for="(_, slotName) in $slots" #[slotName]>
      <slot :name="slotName" />
    </template>
  </v-select>
</template>

<script>
import { rulesMap } from '@/utils/rulesMap'

export default {
  name: 'CommonSelect',
  props: {
    value: {
      type: null,
      default: null,
    },
    type: {
      type: String,
      default: 'text',
    },
    required: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: '',
    } /*
    hint: {
      type: String,
      default: '',
    },
    prependIcon: {
      type: String,
      default: undefined,
    }, */,
    rules: {
      /* ['req', 'num', 'num_pos', ] */
      type: Array,
      default: () => [],
      validator: arr => arr.every(rule => ['req', 'num', 'num_pos', 'email', 'tel'].includes(rule)),
    },
  },
  computed: {
    labelComputed() {
      if (this.required || this.rules.includes('req')) return `${this.label} *`
      return this.label
    },
    rulesComputed() {
      const rules = Object.entries(rulesMap)
        .filter(([key]) => this.rules.includes(key))
        .map(([, rule]) => rule)
      if (this.required) rules.push(rules.req)
      if (this.type === 'email') rules.push(rulesMap.email)
      return rules
    },
    inputListeners() {
      // @SOURCE https://ru.vuejs.org/v2/guide/components-custom-events.html
      // const vm = this
      // `Object.assign` объединяет объекты вместе, чтобы получить новый объект
      return {
        // Мы добавляем все слушатели из родителя
        ...this.$listeners,
        // Затем мы можем добавить собственные слушатели или
        // перезаписать поведение некоторых существующих.
        // Это обеспечит, что будет работать v-model на компоненте
        // input(event) {
        //   vm.$emit('input', event.target.value)
        // },
      }
    },
  },
}
</script>
