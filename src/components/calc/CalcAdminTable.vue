<template>
  <div class="calc-admin-table">
    <v-toolbar class="mt-5">
      <v-toolbar-title>
        <v-icon left>mdi-cash-100</v-icon>

        Таблица значений
      </v-toolbar-title>
    </v-toolbar>
    <v-data-table
      :loading="loading"
      :headers="headersMap"
      :items="items"
      :single-expand="false"
      :expanded.sync="expanded"
      item-key="weight_id"
      show-expand
      class="elevation-1"
      :items-per-page="5"
    >
      <template #expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          <v-simple-table>
            <template #default>
              <thead>
                <tr>
                  <th>Заказов</th>
                  <th>Цена</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="line in item.line" :key="item.weight_id + line.orders_num_id">
                  <td>
                    {{ line.orders_num }}
                  </td>
                  <td>
                    <v-text-field
                      v-model="line.price"
                      class="input-number"
                      :min="0"
                      @blur="line.price = line.price || 0"
                      @input="line.modification = true"
                    >
                      <template #append>₽</template>
                    </v-text-field>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </td>
      </template>
    </v-data-table>

    <v-row justify="center" align="center" class="mt-5">
      <v-btn type="submit" :loading="loading" color="success" @click="$emit('save', items)">
        <v-icon left>mdi-calculator</v-icon>
        {{ $t('buttons.Save') }}
      </v-btn>
    </v-row>
  </div>
</template>

<script>
/*
const mock = [
  {
    weight: 10,
    weight_id: 4,
    line: [
      { price_id: 0, price: 0, orders_num: 50, orders_num_id: 1, modification: false },
      { price_id: 0, price: 0, orders_num: 500, orders_num_id: 3, modification: false },
      { price_id: 0, price: 0, orders_num: 1500, orders_num_id: 4, modification: false },
      { price_id: 0, price: 0, orders_num: 1501, orders_num_id: 5, modification: false },
    ],
  },
  {
    weight: 15,
    weight_id: 5,
    line: [
      { price_id: 0, price: 0, orders_num: 50, orders_num_id: 1, modification: false },
      { price_id: 0, price: 0, orders_num: 500, orders_num_id: 3, modification: false },
      { price_id: 0, price: 0, orders_num: 1500, orders_num_id: 4, modification: false },
      { price_id: 0, price: 0, orders_num: 1501, orders_num_id: 5, modification: false },
    ],
  },
]
*/

export default {
  name: 'CalcAdminTable',
  props: {
    table: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      expanded: [],
      items: this.table.map(obj => ({ ...obj })),
    }
  },
  computed: {
    headersMap() {
      const headers = [
        {
          text: 'Вес',
          align: 'start',
          value: 'weight',
        },
      ]
      return headers
    },
  },
}
</script>
<style lang="scss">
.calc-admin-table {
  .input-number {
    max-width: 80px;
  }
}
</style>
