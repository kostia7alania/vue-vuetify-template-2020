<template>
  <div>
    <h4 class="mb-5">Ближайшие даты получения возвратов на складе courier</h4>
    <v-data-table
      v-model="selected"
      :loading="loading || isLoading"
      :headers="headers"
      :items="PLAN"
      item-key="id"
      show-select
      class="elevation-1"
    >
      <!-- <template #top></template> -->
      <template #progress>
        <v-progress-linear color="purple" :height="10" indeterminate />
      </template>

      <!-- <template #body="{ items }">
        <tbody>
          <tr v-for="item in items" :key="item.id">
            <td>

            </td>
            <td v-for="header in headers" :key="header.value">{{ item[header.value] }}</td>
          </tr>
        </tbody>
      </template> -->

      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template #item.date="{ item }">
        {{ $global.format.date(item.date) }}
      </template>
    </v-data-table>
  </div>
</template>

<script>
// import constants from '@/config/constants'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'PlannerResult',
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isLoading: false,
      selected: [],
      headers: [
        {
          text: 'Дата',
          align: 'start',
          sortable: true,
          value: 'date',
        },
        { text: 'Время', value: 'time' },
        { text: 'Услуга', value: 'service' },
        { text: 'Номер заказа', value: 'number' },
        { text: 'Адрес', value: 'address' },
        { text: 'Статус', value: 'status' },
      ],
    }
  },
  computed: {
    ...mapState('planner', ['PLAN']),
  },
  methods: {
    ...mapActions('calc', ['GET_WAREHOUSES']),
    async addOrder() {
      if (!this.validate()) {
        this.$global.toast.error('Проверьте форму')
        return
      }
      this.isLoading = true
      try {
        await this.ADD_ORDER(this.formToSend)
        this.$global.toast.success('Заказ успешно добавлен')
        this.$router.push({ name: 'orders' })
      } catch (err) {
        this.$global.error(err)
      } finally {
        this.isLoading = false
      }
    },
  },
}
</script>
