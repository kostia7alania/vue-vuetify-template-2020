<template>
  <v-form @submit.prevent="getCalc">
    <div>0 - Категория</div>
    <v-flex xs12 sm6>
      <div>
        <v-select
          v-model="form.category_id"
          :items="CATEGORIES"
          item-text="title"
          item-value="id"
          :label="$t('calc.Category')"
        />
      </div>
    </v-flex>
    <div :class="{ isLoading: !form.category_id }">
      <div>1 — Параметры доставки</div>
      <v-flex xs12 sm6>
        <div>
          <v-select
            v-model="form.delivery_type"
            :items="deliveryTypesFiltered"
            item-text="text"
            item-value="id"
            :label="$t('calc.Delivery Type')"
          />
        </div>
      </v-flex>

      <!-- <Dadata v-model="form.source_address" /> -->
      <!-- deliveryTypesWithCustomSourceAddress -->
      <Dadata
        v-if="isCustomSourceAddress"
        v-model="form.source_address"
        :label="$t('calc.Source Address')"
        @set-coordinates="form.src_coordinates = $event"
      />

      <v-select
        v-else
        v-model="form.warehouse_id"
        :items="WAREHOUSES"
        :loading="isLoadingWarehouses"
        item-text="title"
        item-value="id"
        :placeholder="$t('calc.Source Address')"
        :label="$t('calc.Source Address')"
      >
        <div slot="no-data">
          {{ $t('calc.No Data') }}
        </div>
      </v-select>

      <!-- адрес назначения -->
      <v-select
        v-if="form.category_id === 3"
        v-model="form.delivery_point_id"
        :items="DELIVERY_POINTS"
        item-text="title"
        item-value="id"
        :placeholder="$t('calc.Source Address')"
        :label="$t('calc.Source Address')"
      />
      <Dadata
        v-else
        v-model="form.destination_address"
        :label="$t('calc.Destination Address')"
        @set-coordinates="form.dst_coordinates = $event"
      />

      {{ $t('calc.Delivery Date') }}
      <v-btn text :disabled="!canSelectTodayDate" :color="isSelectedToday ? 'primary' : ''" @click="toToday">
        {{ $t('calc.Today') }}
      </v-btn>
      <v-btn text :disabled="isDayInDay" :color="isSelectedTomorrow ? 'primary' : ''" @click="toTomorow">
        {{ $t('calc.Tomorrow') }}
      </v-btn>

      <v-flex xs12 sm6>
        <v-menu transition="scale-transition" offset-y max-width="290px" min-width="290px">
          <template #activator="{ on, attrs }">
            <v-text-field
              v-model="computedDateFormatted"
              :disabled="isDayInDay"
              readonly
              :hint="constants.dateFormat"
              persistent-hint
              prepend-icon="mdi-calendar"
              v-bind="attrs"
              v-on="on"
            />
          </template>
          <v-date-picker v-model="form.delivery_date" :min="minDate" no-title />
        </v-menu>
      </v-flex>
      <br />

      <!--  @TODO нет в предварительной версии
      {{ $t('calc.Delivery Interval') }}
      <IntervalSlots
        :key="isSelectedToday + isDayInDay"
        v-model="form.interval_slots[0]"
        :is-selected-today="isSelectedToday"
        :is-day-in-day="isDayInDay"
      /> -->
      <!-- <VTimepicker
        v-model="form.interval_slots[0].from"
        :hour-range="fromHourRange"
        :minute-range="fromMinuteRange"
        :minute-interval="5"
      />
      -
      <VTimepicker
        v-model="form.interval_slots[0].to"
        :hour-range="toHourRange"
        :minute-range="toMinuteRange"
        :minute-interval="5"
      /> -->

      <v-divider />

      <!-- {{ $t('calc.Places in the Nomenclature') }}

    <span class="ml-1 mr-1">·</span>
    <v-icon v-if="isEveryPackageFilled" left>mdi-package-variant-closed</v-icon>
    <v-icon v-else left>mdi-package-variant</v-icon>

    <span class="subheading">{{ form.nomenclatures[0].places.length }}</span> -->

      <!-- <v-btn rounded text @click="addPlace(0)">
      <v-icon>mdi-plus</v-icon>
    </v-btn> -->
      <div class="mt-5">2 — Добавить посылку</div>
      <NomenclaturePlace
        v-for="(place, i) in form.nomenclatures[0].places"
        :key="place.key"
        v-model="form.nomenclatures[0].places[i]"
        :i="i"
        class="place"
        :place="place"
        :show-remove="!!i && i === form.nomenclatures[0].places.length - 1"
        :show-add="i === form.nomenclatures[0].places.length - 1"
        @add="addPlace(0)"
        @delete="form.nomenclatures[0].places.splice(i, 1)"
      />

      <v-divider />
      <div class="mt-5">3 — Варианты оплаты</div>
      <v-container fluid>
        <v-row dense>
          <v-radio-group v-model="form.acquiring" hide-details>
            <v-radio label="наличными" color="red" :value="2" />
            <v-radio label="картой" color="red darken-3" :value="1" />
            <v-radio label="предоплата" color="orange darken-3" :value="3" />
          </v-radio-group>
        </v-row>
        <v-row dense>
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
              v-if="[1, 2].includes(form.acquiring)"
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
      </v-container>

      <div>
        <div>
          {{ $t('calc.Add Services') }}
        </div>
        <v-checkbox v-model="form.additional_services" label="возврат сопроводительной документации" />
      </div>
      <v-row justify="center" align="center">
        <v-btn type="submit" color="success" :disabled="!isValidForm">
          <v-icon left>mdi-calculator</v-icon>
          {{ $t('calc.Calculate') }}
        </v-btn>
      </v-row>
    </div>
  </v-form>
</template>

<script>
import deliveryTypes from '@/constants/deliveryTypes'
import constants from '@/config/constants'
import { mapActions, mapState } from 'vuex'

const isNumber = num => !Number.isNaN(Number.parseInt(num, 10))

export default {
  name: 'CalcForm',
  components: {
    Dadata: () => import(/* webpackChunkName: "Dadata" */ '@/components/calc/Dadata'),
    NomenclaturePlace: () => import(/* webpackChunkName: "NomenclaturePlace" */ '@/components/calc/NomenclaturePlace'),
    // Nomenclature: () => import(/* webpackChunkName: "Nomenclature" */ '@/components/calc/Nomenclature'),
    // IntervalSlots: () => import(/* webpackChunkName: "IntervalSlots" */ '@/components/calc/IntervalSlots'),
  },
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      form: {
        client_id: this.$route.query.id || +new Date(),
        source_address: '', // id
        // destination_address: 'Крымский пер., 119, Оренбург, Оренбургская обл',
        dst_coordinates: {
          // @awaiting for API
          // geo_lat: '42.9849159',
          // geo_lon: '47.5047181',
        },
        acquiring: 1, // 1 - оплата картой, 2 - оплата ДС, 3...
        // (если предоплата, то не важно какое значение, пусть будет 3 для общего понимания)
        delivery_date: '',

        // interval_slots: [ // нет в предварительной версии
        //   {
        //     from: '', // '10:00',
        //     to: '', // '14:00',
        //   },
        // ],

        nomenclatures: [
          {
            places: [{ weight: 1, dimensions: {}, key: 123 }],
          },
        ],
        // unlimite
        // {
        //   key: +new Date(), // for key
        //   name: 'Телевизор samsung',
        //   places: [
        //     // limit: 10
        //     {
        //       weight: 4,
        //       dimensions: {
        //         length: 170.1,
        //         width: 60.1,
        //         height: 45.1,
        //       },
        //     },
        //   ],
        // },
        // ],
        additional_services: 0,
        declared_order_value: 0,
        // cash_on_delivery: 0,
        delivery_type: 0,
      },
      lastTimeSlot: 18, // after 18:00 - you can ship only for tomorrow

      isLoadingWarehouses: false,
      isLoadingCategories: false,
    }
  },
  computed: {
    ...mapState('calc', ['WAREHOUSES', 'CATEGORIES', 'DELIVERY_POINTS']),
    deliveryTypesFiltered() {
      if (!('category_id' in this.form)) return []
      const { products } = this.CATEGORIES.find(e => e.id === this.form.category_id)

      return deliveryTypes.reduce((acc, obj) => {
        if (this.form.category_id === 3 && obj.id === 0) return acc // в ПВЗ не добавлять ВСЕ
        const { id } = products.find(({ title }) => title === obj.titleBack) || { id: obj.id }
        if (id || obj.default) acc.push({ ...obj, id })
        return acc
      }, [])
    },
    constants() {
      return constants
    },
    currentDeliveryTypeText() {
      const { titleBack } = this.deliveryTypesFiltered.find(({ id }) => id === this.form.delivery_type) || {}
      return titleBack
    },
    isDayInDay() {
      return this.currentDeliveryTypeText === 'same day'
    },
    isCustomSourceAddress() {
      // LOG-94: В заборной логистике адрес забора должен быть изменяемым
      if (this.form.category_id === 2 && this.form.delivery_type === 0) return true
      if (this.form.category_id === 3) return true // ПВЗ - кастом соурс адрес

      return ['first mile', 'first mile plus'].includes(this.currentDeliveryTypeText)
    },
    isEveryPackageFilled() {
      return this.form.nomenclatures[0].places.every(
        ({ weight, dimensions: { length: l, width: w, height: h } }) => weight && l && w && h
      )
    },
    formToSend() {
      const form = JSON.parse(JSON.stringify(this.form))
      // form.delivery_date += 'T11:45:26.371Z'
      if (typeof form.destination_address === 'object') {
        form.destination_address = form.destination_address.unrestricted_value
      }
      if (typeof form.source_address === 'object') {
        form.source_address = form.source_address.unrestricted_value
      }
      form.additional_services = form.additional_services ? 1 : 0
      /* @TODO  Alexey 2 job 23.11.20 пока не участвует в расчете. нужно будет битовую маску присылать выбраных услуг.
       там сейчас одна, возрат документации. может в будущем еще появятся */
      return form
    },
    isValidForm() {
      /*
      1) переключаемся на 1 категорию:
        удаляем source_address и src_coordinates
      2) переключаемся на 2 категорию:
        удаляем warehouse_id
      */
      const {
        category_id: cat,
        warehouse_id: warehouse,
        source_address: from,
        destination_address: to = {},
        nomenclatures,
        declared_order_value: price,
        delivery_point_id: point,
      } = this.form
      let isValid = true

      if (cat === 1) {
        // delivery
        isValid = isValid && warehouse
      }
      if (cat === 2) {
        // takeaway
        isValid = isValid && this.form.src_coordinates
        isValid = isValid && from
      }
      if (cat === 3) {
        isValid = isValid && point
      } else {
        // если не ПВЗ , то чекаем кастомный адрес
        isValid = isValid && to.isValid
      }
      return isValid && this.isValidInterval && nomenclatures.length && isNumber(price) && price
    },
    isValidInterval() {
      return true
      /* // @TODO нет в предварительной версии
      const [HHFrom, mmFrom] = this.form.interval_slots[0].from.split(':')
      const [HHTo, mmTo] = this.form.interval_slots[0].to.split(':')

      return [HHFrom, mmFrom, HHTo, mmTo].every(num => isNumber(num)) && HHTo - 4 >= HHFrom
      */
    },
    computedDateFormatted() {
      return this.formatDate(this.form.delivery_date)
    },
    // times() {
    //   const times = ['10-14', '14-18', '18-22']
    //   const isToday = dayjs(this.form.delivery_date).isToday()

    //   if (isToday && this.minDate === this.today) {
    //     const hours = new Date().getHours()
    //     if (hours > 10) times.splice(0, 1)
    //     if (hours > 14) times.splice(0, 1)
    //     if (hours > 18) times.splice(0, 1)
    //   }
    //   return times
    // },
    isTodayAndAfterLastTimeSlot() {
      const hours = new Date().getHours()
      return hours > this.lastTimeSlot
    },
    canSelectTodayDate() {
      const deliveryTypesForToday = []
      const sameDay = this.deliveryTypesFiltered.find(({ titleBack }) => titleBack === 'same day')
      if (sameDay) {
        deliveryTypesForToday.push('same day') // если оно уже дизейблед, то не выберется!
        if (!sameDay.disabled) deliveryTypesForToday.push(undefined) // all
      }
      return !this.isTodayAndAfterLastTimeSlot && deliveryTypesForToday.includes(this.currentDeliveryTypeText)
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
    isSelectedTomorrow() {
      return this.$global.date(this.form.delivery_date).isTomorrow()
    },

    // HHFromSelected() {
    //   const [HHFrom] = this.form.interval_slots[0].from.split(':')
    //   return +HHFrom
    // },
    fromHourRange() {
      let HHfrom = 10
      if (this.isSelectedToday) HHfrom = new Date().getHours()
      return [[HHfrom, 18]]
    },
    toHourRange() {
      let HHFrom = this.HHFromSelected || 10
      if (!isNumber(HHFrom)) HHFrom = 10
      return [[+HHFrom + 4, 22]]
    },
    fromMinuteRange() {
      if (this.HHFromSelected === 18) return [0]

      let MMfrom = 0
      if (this.isSelectedToday && this.HHFromSelected === new Date().getHours()) MMfrom = new Date().getMinutes()
      return [[MMfrom, 59]]
    },
    // toMinuteRange() {
    //   const [HHTo] = this.form.interval_slots[0].to.split(':')
    //   const [HHFrom] = this.form.interval_slots[0].from.split(':')
    //   if (+HHTo === 22 || +HHFrom === 18) return [0]
    //   return [[0, 59]]
    // },
  },
  watch: {
    'form.category_id': 'categoryIdWatcher',
    'form.delivery_date': 'dateChangeWatcher',
    'form.delivery_type': 'deliveryTypeWatcher',
    isCustomSourceAddress: 'isCustomSourceAddressWatcher',
    isDayInDay: 'isDayInDayWatcher',
    'form.acquiring': 'acquiringWatcher',
  },
  created() {
    this.init()
  },
  methods: {
    ...mapActions('calc', ['GET_WAREHOUSES', 'GET_CATEGORIES', 'GET_DELIVERY_POINTS']),
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
    },
    isDayInDayWatcher(value) {
      if (value) this.toToday() // ЭКСПРЕСС-доставка (день-в-день)
    },
    acquiringWatcher() {
      if (![1, 2].includes(this.form.acquiring)) {
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
    formatDate(date) {
      if (!date) return null

      const [year, month, day] = date.split('-') // 2020-11-19
      return `${day}.${month}.${year}`
    },
    toToday() {
      this.form.delivery_date = new Date().toISOString().substr(0, 10)
    },
    toTomorow() {
      this.form.delivery_date = this.tomorrow
    },
    categoryIdWatcher() {
      this.form.delivery_type = null // reset to ALL(0) (compatible with both category_id (1,2))
      if (this.form.category_id === 1) {
        delete this.form.source_address
        delete this.form.src_coordinates
      }
      if (this.form.category_id === 2) {
        delete this.form.warehouse_id
      }
    },
    dateChangeWatcher() {
      // const [times] = this.times
      // this.form.time = times
    },
    deliveryTypeWatcher() {
      if (!this.canSelectTodayDate && this.isSelectedToday) {
        this.form.delivery_date = this.tomorrow
      }
    },
    isCustomSourceAddressWatcher() {
      this.form.source_address = null
      delete this.form.src_coordinates
    },
    addNomenclature() {
      this.form.nomenclatures.push({ key: +new Date(), places: [] })
    },
    setNomenclature(i, $event) {
      console.log(i, $event)
      this.form.nomenclatures[i] = $event
    },
    addPlace(i) {
      const nomenclature = this.form.nomenclatures[i]
      nomenclature.places.push({ weight: 1, key: +new Date(), dimensions: {} })
    },
    getCalc() {
      this.$emit('get-calc', this.formToSend)
    },
  },
}
</script>
