<template>
  <div>
    <v-card>
      <v-card-title>
        <v-btn color="primary" :to="{ name: 'orders/add' }">
          <v-icon left>mdi-cart-plus</v-icon>
          Создать заказ
        </v-btn>
        <v-spacer></v-spacer>
        <v-text-field
          v-model.trim="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>

      <v-data-table
        :headers="headersMap"
        :items="filteredItems"
        :single-expand="false"
        :expanded.sync="expanded"
        item-key="pickup_id"
        show-expand
        class="elevation-1"
        :items-per-page="15"
        @click:row="handleClick"
      >
        <template #expanded-item="{ headers, item }">
          <td :colspan="headers.length">
            <br />
            <b>Номенклатура</b>
            <v-simple-table>
              <template #default>
                <thead>
                  <tr>
                    <th>Артикул</th>
                    <th>Название</th>
                    <th>Цена</th>
                    <th>Кол-во</th>
                    <th>Вес</th>
                    <th>НДС</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="nom in item.nomenclatures" :key="nom.sku">
                    <td>{{ nom.sku }}</td>
                    <td>{{ nom.name }}</td>
                    <td>{{ nom.price }}</td>
                    <td>{{ nom.quantity }}</td>
                    <td>{{ nom.weight }}</td>
                    <td>{{ nom.vat }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>

            <b>Посылки</b>
            <v-simple-table>
              <template #default>
                <thead>
                  <tr>
                    <th>Вес</th>
                    <th>Название</th>
                    <th>Длина</th>
                    <th>Ширина</th>
                    <th>Высота</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="place in item.places" :key="place.name">
                    <td>{{ place.weight }}</td>
                    <td>{{ place.name }}</td>
                    <td>{{ place.length }}</td>
                    <td>{{ place.width }}</td>
                    <td>{{ place.height }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
            <hr />

            <br />
          </td>
        </template>

        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template #item.actions="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)">
            mdi-pencil
          </v-icon>
          <v-icon small @click="deleteItemConfirm(item)">
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
    </v-card>
    <ConfirmModal ref="modal" />
  </div>
</template>

<script>
export default {
  name: 'OrdersResult',
  props: {
    result: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      expanded: [],
      search: '',
    }
  },
  computed: {
    headersMap() {
      const headers = [
        { text: '# Заказа', align: 'start', value: 'pickup_id' },
        { text: 'Дата доставки', align: 'start', value: 'delivery_date' },
        { text: 'Получатель', align: 'start', value: 'fio' },
        { text: 'Город', align: 'start', value: 'recipient.address.city' },
        { text: 'Адрес', align: 'start', value: 'addressTitle' },
        { text: 'Тип Доставки', align: 'start', value: 'pickup_id' },
        { text: 'Сумма к оплате', align: 'start', value: 'cash_on_delivery' },
        { text: 'Статус', align: 'start', value: 'pickup_id' },
        { text: 'Действия', value: 'actions', sortable: false },
        /*
        { text: 'Почта', value: 'recipient.email' },
        { text: 'Телефон', value: 'recipient.phone' },
        { text: 'Адрес', value: 'recipient.address.title' },
        { text: 'Категория', value: 'category_id' },
        { text: 'Продукт', value: 'product_id' },
        { text: 'Адрес забора', value: 'city' },
        { text: 'Адрес доставки', value: 'dst_city' },
        { text: 'Цена', value: 'price' },
        { text: 'Заметка', value: 'note' }, */
      ]
      return headers
    },
    items() {
      return this.result.map(obj => {
        // obj.detalization.forEach(({ name, price }) => (obj[name] = price))
        console.log(obj.date, obj)
        // const date = this.$global.format.date(obj.date) || '-'
        obj.fio = `${obj.recipient.firstname} ${obj.recipient.lastname} ${obj.recipient.patronymic?.[0] || ''}`
        obj.addressTitle = `${obj.recipient.address?.street} ${obj.recipient.address?.house} ${obj.recipient.address
          ?.flat || ''}`
        return {
          ...obj,
          // date,
        }
      })
    },
    filteredItems() {
      if (!this.search) return this.items
      return this.items.filter(order => {
        try {
          const { city, street, house, title } = order.client?.address || {}
          const { phone } = order.recipient || {}
          const nomName = order.nomenclatures?.[0]?.name
          const placeName = order.place?.[0]?.name
          const orderPrimitiveValues = Object.values(order).filter(e => ['string', 'number'].includes(e))
          console.log(city, street, house, title, phone, nomName, placeName)
          const res = [...orderPrimitiveValues, city, street, house, title, phone, nomName, placeName].some(
            e => e && String(e).match(this.search)
          )
          console.log('res', this.search, res)
          return res
        } catch (err) {
          console.log('err', err)
          return false
        }
      })
    },
  },
  methods: {
    handleClick(row) {
      console.log('r', row)
    },
    async deleteItemConfirm(item) {
      if (
        await this.$refs.modal.open(
          'Необратимое действие',
          `Вы уверены, что хотите удалить заказ #${item.pickup_id}?`,
          { icon: 'mdi-delete' }
        )
      ) {
        this.delete(item)
      }
    },
    delete(item) {
      console.log('REMOVEd', item)
    },
    editItem(item) {
      // @TODO item.id - потом удалить !
      this.$router.push({ name: 'orders/edit', params: { id: item.pickup_id || item.id } })
    },
  },
}
</script>

<style lang="scss" scoped>
.w200 {
  width: 200px;
}
</style>
