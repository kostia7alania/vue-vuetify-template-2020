<template>
  <div>
    <v-toolbar class="mt-5">
      <v-toolbar-title>Результат</v-toolbar-title>
    </v-toolbar>
    <v-data-table
      :headers="headersMap"
      :items="items"
      :single-expand="false"
      :expanded.sync="expanded"
      item-key="delivery_type_name"
      show-expand
      class="elevation-1"
      :items-per-page="5"
    >
      <template #expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          <br />
          <v-simple-table>
            <template #default>
              <thead>
                <tr>
                  <th>Услуга</th>
                  <th>Цена</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="{ name, price } in item.detalization" :key="name">
                  <td>{{ name }}</td>
                  <td>{{ price }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
          <br />
        </td>
      </template>
    </v-data-table>
  </div>
</template>

<script>
/*
const mock = [
  {
    delivery_type_name: 'string',
    price: 123.2,
    date: '2017-07-04',
    detalization: [
      { name: 'базовая цена', price: 375 },
      { name: 'услуга за превышение допустимого веса заказа', price: 100 },
      { name: 'услуга за превышение допустимых габаритов', price: 100 },
    ],
  },
]
*/

import { getDeliveryTypeByTitleBack } from '@/constants/deliveryTypes'

export default {
  name: 'CalcResult',
  props: {
    result: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      expanded: [],
    }
  },
  computed: {
    headersMap() {
      const headers = [
        {
          text: 'Тип доставки',
          align: 'start',
          value: 'title',
        },
        {
          text: 'Цена доставки',
          align: 'start',
          value: 'price',
        },
        { text: 'Дата доставки', value: 'date' },
      ]
      return headers
    },
    items() {
      return this.result.map(obj => {
        // obj.detalization.forEach(({ name, price }) => (obj[name] = price))
        console.log(obj.date, obj)
        const date = this.$global.format.date(obj.date) || '-'
        obj.title = getDeliveryTypeByTitleBack(obj.title)?.text || obj.title

        return {
          ...obj,
          date,
        }
      })
    },
  },
}
</script>
