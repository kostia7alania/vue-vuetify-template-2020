<template>
  <v-form ref="form" v-model="isFormValid" lazy-validation @submit.prevent="addOrder">
    <div class="fill-fields">* Обязательные для заполнения поля</div>
    <h3 class="section-header">Регион и тип доставки</h3>
    <v-row>
      <v-col cols="12" sm="3">
        <VCity v-model="form.recipient.address.city" label="Город получатель *" />
      </v-col>
      <v-col cols="12" sm="3">
        <!-- тип отправки - курьерская (доставка, ид=1), почта, ПВЗ-->
        <CommonSelect
          v-model="form.category_id"
          :disabled="!form.recipient.address.city"
          :items="CATEGORIES"
          :rules="['req']"
          item-text="title"
          item-value="id"
          :label="$t('calc.Delivery Type')"
        />
      </v-col>
      <v-col cols="12" sm="3">
        <DeliveryServicePicker
          :key="form.category_id + form.recipient.address.city"
          v-model="form.delivery_service_id"
          :category-id="form.category_id"
          :city="form.recipient.address.city"
          :disabled="!form.category_id || !form.recipient.address.city || isLoading"
        />
      </v-col>
      <v-col cols="12" sm="3">
        <ProductPicker
          :key="form.category_id + form.recipient.address.city + form.delivery_service_id"
          v-model="form.product_id"
          :delivery-service-id="form.delivery_service_id"
          :disabled="!form.category_id || !form.recipient.address.city || !form.delivery_service_id || isLoading"
        />
      </v-col>
      <v-col v-if="isCustomSourceAddress" cols="12" sm="6">
        <Dadata
          v-if="isCustomSourceAddress"
          v-model="form.client.address"
          :label="$t('calc.Source Address')"
          @set-coordinates="form.client.coordinates = $event"
        />
      </v-col>
    </v-row>

    <section v-if="form.category_id === 1">
      <h3 class="section-header">Адрес отправки</h3>

      <v-row>
        <!-- адрес назначения при ТИП_ДОСТАВКИ = 1 (доставка). Там выбираем адр из списка , но можно менять -->
        <v-col cols="12" sm="4" md="2">
          <ClientAddressPicker v-model="form.client.address" :client-id="form.client.id" />
        </v-col>

        <v-col cols="12" sm="4" md="2">
          <VCity
            :key="form.client.address.city"
            v-model="form.client.address.city"
            label="Город *"
            @updated="cityWatcher"
          />
        </v-col>

        <v-col cols="12" sm="4" md="3">
          <v-street
            :key="form.client.address.street"
            v-model="form.client.address.street"
            label="Улица *"
            :city="form.client.address.city"
            :disabled="!form.client.address.city"
            @updated="streetWatcher"
          />
        </v-col>
        <!-- выбираем дом, когда не ПВЗ -->
        <v-col cols="12" sm="4" md="2">
          <v-house
            :key="form.client.address.house"
            v-model="form.client.address.house"
            :disabled="!form.client.address.city || !form.client.address.street"
            :city="form.client.address.city"
            :street="form.client.address.street"
            label="Дом *"
            @updated="houseWatcher"
            @set-coordinates="form.client.coordinates = $event"
          />
        </v-col>
        <v-col xs="4" md="1">
          <CommonInput
            v-model.number="form.client.address.flat"
            :rules="['num', 'num_pos']"
            type="number"
            label="Кв. / Оф."
          />
        </v-col>
        <v-col xs="4" md="1">
          <CommonInput
            v-model.number="form.client.address.entrance"
            :rules="['num_pos_or_null']"
            type="number"
            label="Подъезд"
          />
        </v-col>
        <v-col xs="4" md="1">
          <CommonInput
            v-model.number="form.client.address.floor"
            :rules="['num_pos_or_null']"
            type="number"
            label="Этаж"
          />
        </v-col>
      </v-row>
    </section>

    <!--
    <h3 class="section-header">Категория и тип доставки</h3>
    <v-row>
      <v-col cols="12" sm="6"></v-col>
      <v-col cols="12" sm="6" :class="{ isLoading: !form.category_id }">
        <CommonSelect
          v-model="form.product_id"
          :rules="['req']"
          :items="productIdsFiltered"
          item-text="text"
          item-value="id"
          :label="$t('calc.Delivery Type')"
        />
      </v-col>
    </v-row>
-->
    <div :class="{ isLoading22222: !form.category_id }">
      <div>
        <h3 class="section-header">Получатель</h3>
        <v-row>
          <v-col cols="12" sm="4" md="3">
            <CommonInput v-model.trim="form.recipient.firstname" :rules="['req']" label="Имя" />
          </v-col>
          <v-col cols="12" sm="4" md="3">
            <CommonInput v-model.trim="form.recipient.lastname" :rules="['req']" label="Фамилия" />
          </v-col>
          <v-col cols="12" sm="4" md="2">
            <CommonInput v-model.trim="form.recipient.patronymic" :rules="['req']" label="Отчество" />
          </v-col>
          <v-col cols="12" sm="6" md="2">
            <CommonInput v-model="form.recipient.email" prepend-icon="mdi-at" :rules="['email']" label="Эл. почта" />
          </v-col>
          <v-col cols="12" sm="6" md="2">
            <VPhone v-model="form.recipient.phone" prepend-icon="mdi-phone" label="Телефон" />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" sm="8" md="4">
            <!-- адрес назначения -->
            <!-- выбираем адрес назначения из списка, когда ПВЗ -->
            <CommonSelect
              v-if="form.category_id === 3"
              v-model="form.delivery_point_id"
              :rules="['req']"
              :items="DELIVERY_POINTS"
              prepend-icon="mdi-map-marker"
              item-text="title"
              item-value="id"
              :label="$t('calc.Destination Address')"
              :placeholder="$t('calc.Destination Address')"
            />
            <v-street
              v-else
              v-model="form.recipient.address.street"
              :disabled="!form.recipient.address.city"
              :label="$t('calc.Recipient Address')"
              :city="form.recipient.address.city"
            />
          </v-col>
          <!-- выбираем дом, когда не ПВЗ -->
          <v-col v-if="form.category_id !== 3" cols="12" sm="4" md="2">
            <v-house
              v-model="form.recipient.address.house"
              :disabled="!form.recipient.address.city || !form.recipient.address.street"
              :city="form.recipient.address.city"
              :street="form.recipient.address.street"
              label="Дом"
              @set-coordinates="form.recipient.coordinates = $event"
            />
          </v-col>
          <v-col xs="4" md="2">
            <CommonInput
              v-model.number="form.recipient.address.flat"
              :rules="['num', 'num_pos']"
              type="number"
              label="Кв. / Оф."
            />
          </v-col>
          <v-col xs="4" md="2">
            <CommonInput
              v-model.number="form.recipient.address.entrance"
              :rules="['num_pos_or_null']"
              type="number"
              label="Подъезд"
            />
          </v-col>
          <v-col xs="4" md="2">
            <CommonInput
              v-model.number="form.recipient.address.floor"
              :rules="['num_pos_or_null']"
              type="number"
              label="Этаж"
            />
          </v-col>
        </v-row>
      </div>
      <!-- productIdsWithCustomSourceAddress -->
      <!-- <Dadata
            v-if="isCustomSourceAddress"
            v-model="form.client.address"
            prepend-icon="mdi-map-marker"
            :label="$t('calc.Source Address')"
            @set-coordinates="form.client.coordinates = $event"
          />

          <CommonSelect
            v-else
            v-model="form.warehouse_id"
            :rules="['req']"
            :items="WAREHOUSES"
            :loading="isLoadingWarehouses"
            item-text="title"
            prepend-icon="mdi-map-marker"
            item-value="id"
            :placeholder="$t('calc.Source Address')"
            :label="$t('calc.Source Address')"
          />
        </v-col>
       -->
      <h3 class="section-header">
        Товарные позиции
        <v-tooltip bottom>
          <template #activator="{ on, attrs }">
            <v-badge bordered color="green" :content="form.nomenclatures.length" overlap>
              <v-btn v-bind="attrs" icon rounded text v-on="on" @click="form.nomenclatures.push({ key: +new Date() })">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </v-badge>
          </template>
          <span>Добавить позицию</span>
        </v-tooltip>
      </h3>
      <div v-for="(nomenclature, i) in form.nomenclatures" :key="nomenclature.key">
        <OrderNomenclature
          v-model="form.nomenclatures[i]"
          :i="i"
          :show-remove="form.nomenclatures.length > 1"
          :show-add="i === form.nomenclatures.length - 1"
          @add="form.nomenclatures.push({ key: +new Date() })"
          @delete="form.nomenclatures.splice(i, 1)"
        />
      </div>
      <v-row>
        <v-col cols="12" sm="4">
          <CommonInput disabled filled :value="weightSum" label="Общий вес">
            <template #append>кг</template>
          </CommonInput>
        </v-col>
        <v-col cols="12" sm="4">
          <CommonInput filled disabled :value="form.nomenclatures.length" label="Кол-во мест">
            <template #append>ед</template>
          </CommonInput>
        </v-col>
        <v-col cols="12" sm="4">
          <CommonInput filled disabled :value="pricesSum" label="Сумма">
            <template #append>₽</template>
          </CommonInput>
        </v-col>
      </v-row>

      <!-- PLACES -->
      <h3 class="section-header">
        Места в заказе
        <v-tooltip bottom>
          <template #activator="{ on, attrs }">
            <v-badge bordered color="green" :content="form.places.length" overlap>
              <v-btn v-bind="attrs" icon rounded text v-on="on" @click="form.places.push({ key: +new Date() })">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </v-badge>
          </template>
          <span>Добавить место</span>
        </v-tooltip>
      </h3>
      <div v-for="(place, i) in form.places" :key="place.key">
        <OrderPlace
          v-model="form.places[i]"
          :i="i"
          :show-remove="form.places.length > 1"
          :show-add="i === form.places.length - 1"
          @add="form.places.push({ key: +new Date() })"
          @delete="form.places.splice(i, 1)"
        />
      </div>
      <!-- <v-col cols="12" sm="6">
              <CommonInput filled disabled :value="form.places.length" label="Кол-во мест">
                <template #append>ед</template>
              </CommonInput>
            </v-col> -->

      <v-row>
        <v-col cols="12" lg="2">
          <h3 class="section-header">Заявка</h3>
          <v-row dense>
            <v-col cols="12" md="12">
              <PickupPicker v-model="form.pickup_id" :client-id="form.client.id" :rules="['req']" />
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12" lg="5">
          <h3 class="section-header">Заказ</h3>
          <v-row dense>
            <v-col cols="12" sm="12">
              <CommonInput v-model="form.client_order_number" :rules="['req']" label="Номер заказа" />
            </v-col>
            <v-col cols="12" sm="6">
              <VDatepicker
                v-model="form.delivery_date"
                :min="minDate"
                :disabled="isDayInDay"
                required
                :label="$t('calc.Delivery Date')"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <!--  @TODO нет в предварительной версии -->
              <IntervalPicker
                v-model="form.intervals"
                :disabled="!form.pickup_id && form.pickup_id !== 0"
                :pickup-id="form.pickup_id"
                :rules="['req']"
                :label="$t('calc.Delivery Interval')"
              />
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12" lg="5">
          <v-row dense>
            <v-col cols="12" sm="6">
              <v-checkbox
                v-model="form.additional_services"
                :false-value="0"
                :true-value="1"
                label="вернуть накладные"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <CommonInput v-model.number="form.weight" :rules="['req', 'num_pos']" type="number" label="Общий вес">
                <template #append>кг</template>
              </CommonInput>
            </v-col>
            <v-col cols="12">
              <v-textarea v-model="form.note" class="mx-0" label="Примечание" rows="4" prepend-icon="mdi-comment" />
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <h3 class="section-header">Условия оплаты</h3>

      <v-row dense>
        <v-col cols="12" sm="5" md="4" lg="3">
          <CommonSelect
            v-model="form.payment_type_id"
            :items="[
              { title: 'наличными', value: 2 },
              { title: 'картой', value: 1 },
              { title: 'предоплата', value: 3 },
            ]"
            prepend-icon="mdi-cash"
            :rules="['req']"
            item-text="title"
            item-value="value"
            label="Тип оплаты"
          />
        </v-col>

        <v-col cols="12" sm="5" md="4" lg="3">
          <CommonInput
            v-model.number="form.declared_order_value"
            :label="$t('calc.Declared Order Value')"
            type="number"
            :min="0"
            :rules="['req', 'num', 'num_pos']"
          >
            <template #append>₽</template>
          </CommonInput>
        </v-col>
        <v-col cols="12" sm="5" md="4" lg="3">
          <CommonInput
            v-if="[1, 2].includes(form.payment_type_id)"
            v-model.number="form.cash_on_delivery"
            label="Наложенный платеж"
            type="number"
            :min="0"
            :rules="['req', 'num', 'num_pos']"
          >
            <template #append>₽</template>
          </CommonInput>
        </v-col>
      </v-row>

      <v-row justify="center" align="center">
        <v-btn type="submit" color="success" :disabled="!isFormValid || isLoading">
          <v-icon left>mdi-cart-plus</v-icon>
          {{ $t('orders.Add Order') }}
        </v-btn>
      </v-row>
    </div>
  </v-form>
</template>

<script>
import productIds from '@/constants/productIds'

import constants from '@/config/constants'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'OrdersAddForm',
  components: {
    Dadata: () => import(/* webpackChunkName: "Dadata" */ '@/components/calc/Dadata'),
    OrderNomenclature: () =>
      import(/* webpackChunkName: "OrderNomenclature" */ '@/components/orders/OrderNomenclature'),
    OrderPlace: () => import(/* webpackChunkName: "OrderPlace" */ '@/components/orders/OrderPlace'),
    DeliveryServicePicker: () =>
      import(/* webpackChunkName: "DeliveryServicePicker" */ '@/components/orders/DeliveryServicePicker'),
    ProductPicker: () => import(/* webpackChunkName: "ProductPicker" */ '@/components/orders/ProductPicker'),
    PickupPicker: () => import(/* webpackChunkName: "PickupPicker" */ '@/components/orders/PickupPicker'),
    IntervalPicker: () => import(/* webpackChunkName: "IntervalPicker" */ '@/components/orders/IntervalPicker'),
    ClientAddressPicker: () =>
      import(/* webpackChunkName: "ClientAddressPicker" */ '@/components/orders/ClientAddressPicker'),
  },
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    id: {
      // url-params are in str-type
      type: Number,
      default: null,
    },
    isEditMode: {
      type: Boolean,
      default: false,
    },
    initFormValue: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      isFormValid: true,
      form: {
        product_id: 1, // delivery_type
        client: {
          id: 1,
          address: {
            city: 'Москва',
            street: 'Складочная',
            house: '1 стр 18',
          },
          coordinates: {
            lat: 55.777468,
            lon: 37.589153,
          },
        },
        recipient: {
          address: {
            // city: 'Москва',
            // street: '2-я Миусская ул., д. 1',
            // house: '1',
            // flat: 1,
            // entrance: 1,
            // floor: 1,
            // is_private_house: false,
          },
          coordinates: {
            // lat: 55.777468,
            // lon: 37.589153,
          },
        },
        pickup_id: this.$route.query.pickup_id || null,
        // recipient_address: 'Крымский пер., 119, Оренбург, Оренбургская обл',
        // dst_coordinates: {
        //   // @awaiting for API
        //   // geo_lat: '42.9849159',
        //   // geo_lon: '47.5047181',
        // },
        payment_type_id: 1, // 1 - оплата картой, 2 - оплата ДС, 3...
        // (если предоплата, то не важно какое значение, пусть будет 3 для общего понимания)
        delivery_date: '',
        // intervals: '9:00 - 12:00',
        // interval_slots: [
        //   // нет в предварительной версии
        //   {
        //     from: '', // '10:00',
        //     to: '', // '14:00',
        //   },
        // ],
        nomenclatures: [{ sku: 'qwerty123', name: 'Телевизор samsung', price: 40000.0, quantity: 2, weight: 4.3 }],
        places: [
          {
            name: 'Место 1',
            weight: 4.3,
            length: 50,
            width: 50,
            height: 50,
          },
        ],
        additional_services: 0,
        declared_order_value: null,
        // cash_on_delivery: 0,
      },
      lastTimeSlot: 18, // after 18:00 - you can ship only for tomorrow
      isLoading: false,
      isLoadingWarehouses: false,
      isLoadingCategories: false,
    }
  },
  computed: {
    ...mapState('calc', ['WAREHOUSES', 'CATEGORIES', 'DELIVERY_POINTS']),
    productIdsFiltered() {
      return productIds
      // if (!('category_id' in this.form)) return []
      // const { products } = this.CATEGORIES.find(e => e.id === this.form.category_id)

      // return productIds.reduce((acc, obj) => {
      //   if (this.form.category_id === 3 && obj.id === 0) return acc // в ПВЗ не добавлять ВСЕ
      //   const { id } = products.find(({ title }) => title === obj.titleBack) || { id: obj.id }
      //   if (id || obj.default) acc.push({ ...obj, id })
      //   return acc
      // }, [])
    },
    constants() {
      return constants
    },
    currentProductIdText() {
      const { titleBack } = this.productIdsFiltered.find(({ id }) => id === this.form.product_id) || {}
      return titleBack
    },
    isDayInDay() {
      return this.currentProductIdText === 'same day'
    },
    isCustomSourceAddress() {
      // LOG-94: В заборной логистике адрес забора должен быть изменяемым
      if (this.form.category_id === 2 && this.form.product_id === 0) return true
      if (this.form.category_id === 3) return true // ПВЗ - кастом соурс адрес

      return ['first mile', 'first mile plus'].includes(this.currentProductIdText)
    },
    formToSend() {
      const form = JSON.parse(JSON.stringify(this.form))
      /*
      1) переключаемся на 1 категорию:
        удаляем source_address и src_coordinates // UPD client.address / client.coordinates
      2) переключаемся на 2 категорию:
        удаляем warehouse_id

      Alexey job2 - 23.11.20, [17.02.21 18:48]
        если category_id === 1 значит подставляй адрес склада который выбрал клиент
        если category_id === 2 значит клиент сам пишет адрес
      */

      // form.delivery_date += 'T11:45:26.371Z'
      // form.recipient_address = form.recipient_address?.unrestricted_value || form.source_address
      // form.source_address = form.source_address?.unrestricted_value || form.source_address
      /* @TODO  Alexey 2 job 23.11.20 пока не участвует в расчете. нужно будет битовую маску присылать выбраных услуг.
       там сейчас одна, возрат документации. может в будущем еще появятся */
      return form
    },
    isTodayAndAfterLastTimeSlot() {
      const hours = new Date().getHours()
      return hours > this.lastTimeSlot
    },
    canSelectTodayDate() {
      const productIdsForToday = []
      const sameDay = this.productIdsFiltered.find(({ titleBack }) => titleBack === 'same day')
      if (sameDay) {
        productIdsForToday.push('same day') // если оно уже дизейблед, то не выберется!
        if (!sameDay.disabled) productIdsForToday.push(undefined) // all
      }
      return !this.isTodayAndAfterLastTimeSlot && productIdsForToday.includes(this.currentProductIdText)
    },
    minDate() {
      return this.canSelectTodayDate ? this.today : this.tomorrow
    },
    today() {
      const today = new Date()
      return today.toISOString().substr(0, 10) // `${year}-${month}-${day}`
    },
    tomorrow() {
      const today = new Date()
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      return tomorrow.toISOString().substr(0, 10)
    },
    isSelectedToday() {
      return this.$global.date(this.form.delivery_date).isToday()
    },
    placesSum() {
      return this.form.places.length
    },
    weightSum() {
      return this.form.nomenclatures.reduce((acc, { weight }) => acc + (weight || 0), 0)
    },
    pricesSum() {
      return this.form.nomenclatures.reduce((acc, { price }) => acc + (price || 0), 0)
    },
    placesWeightSum() {
      return this.form.places.reduce((acc, { weight }) => acc + (weight || 0), 0)
    },
  },
  watch: {
    'form.category_id': 'categoryIdWatcher',
    'form.delivery_date': 'dateChangeWatcher',
    'form.product_id': 'productIdWatcher',
    isCustomSourceAddress: 'isCustomSourceAddressWatcher',
    isDayInDay: 'isDayInDayWatcher',
    'form.payment_type_id': 'paymentTypeIdWatcher',
  },
  created() {
    this.init()
  },
  methods: {
    ...mapActions('calc', ['GET_WAREHOUSES', 'GET_CATEGORIES', 'GET_DELIVERY_POINTS']),
    ...mapActions('orders', ['ADD_ORDER', 'GET_ORDER']),
    // ...mapActions('orders', ['GET_ORDERS']),
    async init() {
      // this.GET_ORDERS()
      if (this.canSelectTodayDate) {
        this.form.delivery_date = this.today
      } else {
        this.form.delivery_date = this.tomorrow // после 18 - незя!
      }
      // const [times] = this.times
      // this.form.time = times
      this.getWarehouses()
      this.getCategories()
      this.doRequest(this.GET_DELIVERY_POINTS, 'isLoading')
      if (this.isEditMode) {
        this.form = this.initFormValue
      }
    },

    validate() {
      return this.$refs.form.validate()
    },
    cityWatcher() {
      this.form.client.address.id = null
      this.form.client.address.street = null
      this.form.client.address.house = null
    },
    streetWatcher() {
      this.form.client.address.id = null
      this.form.client.address.house = null
    },
    houseWatcher() {
      this.form.client.address.id = null
    },
    isDayInDayWatcher(value) {
      if (value) this.toToday() // ЭКСПРЕСС-доставка (день-в-день)
    },
    paymentTypeIdWatcher() {
      if (![1, 2].includes(this.form.payment_type_id)) {
        delete this.form.cash_on_delivery
      }
    },
    getCategories() {
      this.doRequest(this.GET_CATEGORIES, 'isLoadingCategories')
    },
    getWarehouses() {
      this.doRequest(this.GET_WAREHOUSES, 'isLoadingWarehouses')
    },
    async doRequest(callback, loading = 'isLoading') {
      this[loading] = true
      try {
        const data = await callback()
        return data
      } catch (err) {
        this.$global.error(err)
      } finally {
        this[loading] = false
      }
    },
    toToday() {
      this.form.delivery_date = new Date().toISOString().substr(0, 10)
    },
    toTomorow() {
      this.form.delivery_date = this.tomorrow
    },
    categoryIdWatcher() {
      this.form.product_id = null // reset to ALL(0) (compatible with both category_id (1,2))
      if (this.form.category_id === 1) {
        this.form.client.address = {}
        this.form.client.coordinates = {}
      }
      if (this.form.category_id === 2) {
        // delete this.form.warehouse_id
        /*
          Alexey job2 - 23.11.20, [17.02.21 19:31]
          warehouse это склад. он не нужен, потому что ты в структуре address мне адрес пришлешь,
          я по адресу пойму что это за склад. продукт это что мы предлагаем, шип фром стор,
          быстрая доставка, обычная доставка, хуе мое.
        */
      }
    },
    dateChangeWatcher() {
      // const [times] = this.times
      // this.form.time = times
    },
    productIdWatcher() {
      if (!this.canSelectTodayDate && this.isSelectedToday) {
        this.form.delivery_date = this.tomorrow
      }
    },
    isCustomSourceAddressWatcher() {
      this.form.client.address = {}
      this.form.client.coordinates = {}
    },
    async addOrder() {
      if (!this.validate()) {
        this.$global.toast.error('Проверьте форму')
        return
      }
      console.log('ADD_ORDER')
      this.isLoading = true
      try {
        const form = { ...this.formToSend, intervals: ['9:00', '12:00'] }
        const res = await this.ADD_ORDER(form)
        console.log('[ADD_ORDER] RES => ', res)
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
