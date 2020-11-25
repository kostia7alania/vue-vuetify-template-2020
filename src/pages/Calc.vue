<template>
  <v-container class="fill-height">
    <v-row justify="center" align="center">
      <div class="text-center">
        <h1 class="title">Простой калькулятор</h1>
      </div>
    </v-row>
    <v-row justify="center" align="center">
      <v-form>
        <v-col>
          <v-row>
            <v-col>
              Адрес отправления
              <Dadata v-model="form.source_address" />
            </v-col>
            <v-col>
              Адрес доставки
              <Dadata v-model="form.destination_address" />
            </v-col>
          </v-row>

          <v-checkbox v-model="form.is_acquiring" label="Оплата картой" />

          Дата доставки
          <v-btn text :disabled="!canSelectTodayDate" :color="isSelectedToday ? 'primary' : ''" @click="toToday">
            сегодня
          </v-btn>
          <v-btn text :color="isSelectedTomorrow ? 'primary' : ''" @click="toTomorow">завтра</v-btn>

          <v-menu transition="scale-transition" offset-y max-width="290px" min-width="290px">
            <template v-slot:activator="{ on, attrs }">
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
            <VueTimepicker v-model="form.interval_slots[0].from" :hour-range="timeRangeStart" />
            -
            <VueTimepicker v-model="form.interval_slots[0].to" :hour-range="timeRangeEnd" />
          </div>

          <br />
          <v-row>
            <v-col cols="12">
              Номенклатура ({{ form.nomenclatures.length }})
              <v-btn rounded text @click="form.nomenclatures.push({ key: +new Date() })">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-row v-for="(nomenclature, i) in form.nomenclatures" :key="nomenclature.key">
            <Nomenclature
              :nomenclature="nomenclature"
              @set-nomenclature="form.nomenclatures[i] = $event"
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
            <v-select :items="deliveryTypesArr" label="Тип доставки" />
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
        </v-col>
      </v-form>
    </v-row>
  </v-container>
</template>

<script>
import dayjs from '@/setups/dayjs'
import VueTimepicker from 'vue2-timepicker/src/vue-timepicker'

// // Main JS (in UMD format)
// import VueTimepicker from 'vue2-timepicker'

// // CSS
// import 'vue2-timepicker/dist/VueTimepicker.css'

const deliveryTypes = [
  { value: 1, title: 'next day' },
  { value: 2, title: 'same day' },
  { value: 3, title: 'first mile' },
  { value: 4, title: 'first mile plus' },
  { value: 5, title: 'ship from store' },
]

export default {
  name: 'CalcSimple',
  components: {
    VueTimepicker,
    Dadata: () => import(/* webpackChunkName: "Dadata" */ '@/components/calc/Dadata'),
    Nomenclature: () => import(/* webpackChunkName: "Nomenclature" */ '@/components/calc/Nomenclature'),
  },
  data() {
    return {
      deliveryTypesArr: deliveryTypes.map(e => e.title),

      form: {
        client_id: this.$route.query.id,
        shipping_address: '2-я Миусская ул., д. 1, Москва',
        destination_address: 'Крымский пер., 119, Оренбург, Оренбургская обл',
        coordinats: {
          geo_lat: '42.9849159',
          geo_lon: '47.5047181',
        },
        is_acquiring: null,
        delivery_date: '',

        interval_slots: [
          {
            from: '10:00',
            to: '14:00',
          },
        ],
        pack: [],

        nomenclatures: [
          // unlimite
          {
            key: +new Date(), // for key
            name: 'Телевизор samsung',
            places: [
              // limit: 10
              {
                weight: 4,
                dimensions: {
                  length: 170.1,
                  width: 60.1,
                  height: 45.1,
                },
              },
            ],
          },
        ],
        additional_services: 0,
        declared_order_value: 0,
        delivery_type: 1,
        region_kladr_id: '7700000000000',
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
    isValidForm() {
      const { source_address: from = {}, destination_address: to = {}, declared_order_value: price } = this.form
      return from.isValid && to.isValid && !Number.isNaN(parseInt(price, 10))
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
    minDate() {
      return this.isTodayAndAfterLastTimeSlot ? this.tomorrow : this.today
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
      return dayjs(this.form.delivery_date).isToday()
    },
    isSelectedTomorrow() {
      return dayjs(this.form.delivery_date).isTomorrow()
    },
    canSelectTodayDate() {
      return !this.isTodayAndAfterLastTimeSlot
    },
    timeRangeStart() {
      return [[10, 22]]
    },
    timeRangeEnd() {
      return [[10, 22]]
    },
  },
  watch: {
    'form.delivery_date': 'dateChangeWatcher',
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      if (this.isTodayAndAfterLastTimeSlot) {
        // после 18 - незя!
        this.form.delivery_date = this.tomorrow
      } else {
        this.form.delivery_date = this.today
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
  },
}
</script>
