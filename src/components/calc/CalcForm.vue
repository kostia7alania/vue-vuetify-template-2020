<template>
  <v-form @submit.prevent="getCalc">
    <div>
      <v-select
        v-model="form.delivery_type"
        :items="deliveryTypes"
        item-text="text"
        item-value="value"
        label="Тип доставки"
      />
    </div>
    <v-row>
      <v-col>
        Адрес отправителя
        <!-- <Dadata v-model="form.source_address" /> -->
        <v-select v-model="form.source_address" :items="sourceAddresses" placeholder="Адрес отправителя"></v-select>
      </v-col>
      <v-col>
        Адрес получателя
        <Dadata v-model="form.destination_address" @set-coordinates="form.coordinates = $event" />
      </v-col>
    </v-row>

    <v-checkbox v-model="form.is_acquiring" label="Оплата картой" />

    Дата доставки
    <v-btn text :disabled="!canSelectTodayDate" :color="isSelectedToday ? 'primary' : ''" @click="toToday">
      сегодня
    </v-btn>
    <v-btn text :color="isSelectedTomorrow ? 'primary' : ''" @click="toTomorow">завтра</v-btn>

    <v-menu transition="scale-transition" offset-y max-width="290px" min-width="290px">
      <template #activator="{ on, attrs }">
        <v-text-field
          v-model="computedDateFormatted"
          readonly=""
          hint="ДД.ММ.ГГГГ"
          persistent-hint
          prepend-icon="mdi-calendar"
          v-bind="attrs"
          v-on="on"
        />
      </template>
      <v-date-picker v-model="form.delivery_date" :min="minDate" no-title />
    </v-menu>

    <br />

    Интервал доставки
    <div>
      <VTimepicker
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
      />
    </div>

    <br />
    <v-row>
      <v-col cols="12">
        Номенклатура ({{ form.nomenclatures.length }})
        <v-btn rounded text @click="addNomenclature">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-row v-for="(nomenclature, i) in form.nomenclatures" :key="nomenclature.key">
      <Nomenclature
        :nomenclature="nomenclature"
        @set-nomenclature="setNomenclature(i, $event)"
        @add-place="addPlace(i)"
        @delete="form.nomenclatures.splice(i, 1)"
      />
    </v-row>

    <br />

    <div>
      Объявленная ценность заказа
      <v-text-field
        v-model.number="form.declared_order_value"
        type="number"
        :min="0"
        :rules="rules.declared_order_value"
      />
    </div>

    <div>
      <div>
        Доп. услуги
      </div>
      <v-checkbox v-model="form.additional_services" label="возврат сопроводительной документации" />
    </div>
    <v-btn type="submit" :disabled="!isValidForm">
      Рассчитать
    </v-btn>
  </v-form>
</template>

<script>
import deliveryTypes from '@/constants/deliveryTypes'

const isNumber = num => !Number.isNaN(Number.parseInt(num, 10))
const sourceAddresses = [
  'Москва, ул.Складочная, дом 1, стр 18',
  'Санкт-Петербург, Лиговский проспект, д.50 литера «Н», № 116',
]
export default {
  name: 'CalcForm',
  components: {
    Dadata: () => import(/* webpackChunkName: "Dadata" */ '@/components/calc/Dadata'),
    Nomenclature: () => import(/* webpackChunkName: "Nomenclature" */ '@/components/calc/Nomenclature'),
  },
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      deliveryTypes,
      sourceAddresses,
      form: {
        client_id: this.$route.query.id || +new Date(),
        source_address: sourceAddresses[0], // '2-я Миусская ул., д. 1, Москва',
        // destination_address: 'Крымский пер., 119, Оренбург, Оренбургская обл',
        coordinates: {
          // @awaiting for API
          // geo_lat: '42.9849159',
          // geo_lon: '47.5047181',
        },
        is_acquiring: false,
        delivery_date: '',

        interval_slots: [
          {
            from: '', // '10:00',
            to: '', // '14:00',
          },
        ],

        nomenclatures: [
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
        ],
        additional_services: 0,
        declared_order_value: 0,
        delivery_type: 1,
      },
      lastTimeSlot: 18, // after 18:00 - you can ship only for tomorrow
      rules: {
        declared_order_value: [
          value => (!!value && value !== 0) || 'Введите число',
          value => value > 0 || 'Стоимость должна быть положительным числом',
          value => {
            const pattern = Number.isNaN(parseInt(value, 10))
            return !pattern || 'Введите валидное число'
          },
        ],
      },
    }
  },
  computed: {
    formToSend() {
      const form = JSON.parse(JSON.stringify(this.form))
      form.delivery_date += 'T11:45:26.371Z'
      form.source_address = form.source_address.unrestricted_value
      form.destination_address = form.destination_address.unrestricted_value
      form.additional_services = form.additional_services ? 0 : 0
      /* @TODO  Alexey 2 job 23.11.20 пока не участвует в расчете. нужно будет битовую маску присылать выбраных услуг.
       там сейчас одна, возрат документации. может в будущем еще появятся */
      return form
    },
    isValidForm() {
      const {
        source_address: from = {},
        destination_address: to = {},
        nomenclatures,
        declared_order_value: price,
      } = this.form

      return this.isValidInterval && from.isValid && to.isValid && nomenclatures.length && isNumber(price) && price
    },
    isValidInterval() {
      const [HHFrom, mmFrom] = this.form.interval_slots[0].from.split(':')
      const [HHTo, mmTo] = this.form.interval_slots[0].to.split(':')

      return [HHFrom, mmFrom, HHTo, mmTo].every(num => isNumber(num)) && HHTo - 4 >= HHFrom
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
      return !this.isTodayAndAfterLastTimeSlot && this.form.delivery_type !== 2 // next day
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

    HHFromSelected() {
      const [HHFrom] = this.form.interval_slots[0].from.split(':')
      return +HHFrom
    },
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
    toMinuteRange() {
      const [HHTo] = this.form.interval_slots[0].to.split(':')
      const [HHFrom] = this.form.interval_slots[0].from.split(':')
      if (+HHTo === 22 || +HHFrom === 18) return [0]
      return [[0, 59]]
    },
  },
  watch: {
    'form.delivery_date': 'dateChangeWatcher',
    'form.delivery_type': 'deliveryTypeWatcher',
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      if (this.canSelectTodayDate) {
        this.form.delivery_date = this.today
      } else {
        this.form.delivery_date = this.tomorrow // после 18 - незя!
      }
      // const [times] = this.times
      // this.form.time = times
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
    dateChangeWatcher() {
      // const [times] = this.times
      // this.form.time = times
    },
    deliveryTypeWatcher() {
      if (!this.canSelectTodayDate && this.isSelectedToday) {
        this.form.delivery_date = this.tomorrow
      }
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
      nomenclature.places.push({ key: +new Date(), dimensions: {} })
    },
    getCalc() {
      this.$emit('get-calc', this.formToSend)
    },
  },
}
</script>
