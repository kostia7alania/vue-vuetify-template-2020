<template>
  <div>
    <h1>Результат</h1>
    <v-data-table
      :headers="headers"
      :items="items"
      :items-per-page="5"
      item-key="name"
      class="elevation-1"
      :footer-props="{
        showFirstLastPage: true,
        firstIcon: 'mdi-arrow-collapse-left',
        lastIcon: 'mdi-arrow-collapse-right',
        prevIcon: 'mdi-minus',
        nextIcon: 'mdi-plus',
      }"
    />
  </div>
</template>

<script>
export default {
  name: 'CalcResult',
  props: {
    result: {
      /*
        [{
            "delivery_type_name": "next day",
            "price": 380,
            "date": "2020-11-25T16:53:27.266719193+03:00"
        }]
      */
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      headers: [
        {
          text: 'Тип доставки',
          align: 'start',
          value: 'delivery_type_name',
        },
        {
          text: 'Цена доставки',
          align: 'start',
          value: 'price',
        },
        { text: 'Дата доставки', value: 'date' },
      ],
    }
  },

  computed: {
    items() {
      return this.result.map(result => ({
        ...result,
        date: this.$global.dateTimeFormatter(result.date) || '-',
      }))
    },
  },
}
</script>
