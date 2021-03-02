<template>
  <v-form ref="form" v-model="isFormValid" lazy-validation @submit.prevent="addOrder">
    <div class="fill-fields">* Обязательные для заполнения поля</div>
    <v-row>
      <v-col cols="12">
        <v-row>
          <v-col cols="12">
            <CommonSelect
              v-model="form.delivery_point_id"
              :rules="['req']"
              :items="WAREHOUSES"
              prepend-icon="mdi-map-marker"
              item-text="title"
              item-value="id"
              :label="$t('planner.Pick-Up Address')"
              :placeholder="$t('planner.Pick-Up Address')"
            />
          </v-col>

          <v-col cols="12">
            <VDatepicker v-model="form.date" :min="minDate" :label="$t('planner.Date')" />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <!--  @TODO нет в предварительной версии -->
            <CommonSelect
              v-model="form.interval_slots[0]"
              :rules="['req']"
              prepend-icon="mdi-clock-outline"
              :items="[{ title: '9:00 - 13:00' }, { title: '13:00 - 16:00' }]"
              item-text="title"
              item-value="title"
              :label="$t('retrun.Time Interval')"
            />
          </v-col>
          <v-col cols="12">
            <v-checkbox v-model="form.additional_services" label="вернуть накладные" />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-textarea
              v-model="form.comments"
              outlined
              class="mx-0"
              label="Примечание"
              rows="3"
              prepend-icon="mdi-comment"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col justify="center" align="center" cols="12" sm="12" md="10" lg="8">
            <v-btn block type="submit" color="success" :disabled="!isFormValid || isLoading">
              <v-icon left>mdi-send</v-icon>
              {{ $t('planner.Make Plan') }}
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
      <v-col></v-col>
    </v-row>
  </v-form>
</template>

<script>
import constants from '@/config/constants'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'PlannerForm',
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isFormValid: true,
      form: {
        client_id: 1, // this.$route.query.id || +new Date(),
        source_address: '', // id
        date: '',
        interval_slots: [
          // нет в предварительной версии
          {
            from: '', // '10:00',
            to: '', // '14:00',
          },
        ],
        additional_services: 0,
      },
      lastTimeSlot: 18, // after 18:00 - you can ship only for tomorrow
      isLoading: false,
    }
  },
  computed: {
    ...mapState('calc', ['WAREHOUSES']),
    constants() {
      return constants
    },
    formToSend() {
      const form = JSON.parse(JSON.stringify(this.form))
      return form
    },
    isValidForm() {
      /*
      1) переключаемся на 1 категорию:
        удаляем source_address и src_coordinates
      2) переключаемся на 2 категорию:
        удаляем warehouse_id
      */
    },
    isValidInterval() {
      return true
      /* // @TODO нет в предварительной версии
      const [HHFrom, mmFrom] = this.form.interval_slots[0].from.split(':')
      const [HHTo, mmTo] = this.form.interval_slots[0].to.split(':')

      return [HHFrom, mmFrom, HHTo, mmTo].every(num => isNumber(num)) && HHTo - 4 >= HHFrom
      */
    },
    isTodayAndAfterLastTimeSlot() {
      const hours = new Date().getHours()
      return hours > this.lastTimeSlot
    },
    canSelectTodayDate() {
      return !this.isTodayAndAfterLastTimeSlot
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
      return this.$global.date(this.form.date).isToday()
    },
    isSelectedTomorrow() {
      return this.$global.date(this.form.date).isTomorrow()
    },
  },
  created() {
    this.init()
  },
  methods: {
    ...mapActions('calc', ['GET_WAREHOUSES']),
    ...mapActions('orders', ['ADD_ORDER']),
    // ...mapActions('orders', ['GET_ORDERS']),
    async init() {
      // this.GET_ORDERS()
      if (this.canSelectTodayDate) {
        this.form.date = this.today
      } else {
        this.form.date = this.tomorrow // после 18 - незя!
      }
      this.doRequest(this.GET_WAREHOUSES, 'isLoading')
    },
    validate() {
      return this.$refs.form.validate()
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
      this.form.date = new Date().toISOString().substr(0, 10)
    },
    toTomorow() {
      this.form.date = this.tomorrow
    },
    async addOrder() {
      if (!this.validate()) {
        this.$global.toast.error('Проверьте форму')
        return
      }
      console.log('ADD_ORDER')
      this.isLoading = true
      try {
        const res = await this.ADD_ORDER(this.formToSend)
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
