<template>
  <v-text-field v-bind="$attrs" :label="labelComputed" :type="type" :rules="rulesComputed" v-on="inputListeners">
    <!-- pass through scoped slots -->
    <template v-for="(_, scopedSlotName) in $scopedSlots" #[scopedSlotName]="slotData">
      <slot :name="scopedSlotName" v-bind="slotData" />
    </template>

    <!-- pass through normal slots -->
    <template v-for="(_, slotName) in $slots" #[slotName]>
      <slot :name="slotName" />
    </template>
  </v-text-field>
</template>

<script>
import { rulesMap } from '@/utils/rulesMap'
import sanitizePhone from '@/utils/sanitizePhone'

export default {
  name: 'VPhone',
  props: {
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
    },
    rules: {
      /* ['req', 'num'] */
      type: Array,
      default: () => ['req', 'tel'],
      validator: arr => arr.every(rule => ['req', 'tel'].includes(rule)),
    },
    country: {
      type: String,
      default: 'RU',
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
      return rules
    },
    inputListeners() {
      // @SOURCE https://ru.vuejs.org/v2/guide/components-custom-events.html
      // const vm = this
      // `Object.assign` объединяет объекты вместе, чтобы получить новый объект

      const vm = this

      return {
        // Мы добавляем все слушатели из родителя
        ...this.$listeners,
        // Затем мы можем добавить собственные слушатели или
        // перезаписать поведение некоторых существующих.
        // Это обеспечит, что будет работать v-model на компоненте
        input(input) {
          vm.$emit('input', sanitizePhone(input, vm.country))
        },
        blur() {
          vm.$emit('input', sanitizePhone(vm.$attrs?.value, vm.country))
        },
      }
    },
  },
}
</script>
