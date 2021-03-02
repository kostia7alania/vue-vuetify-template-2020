<template>
  <v-flex sm12 md8>
    <v-form @submit.prevent>
      <div>0 - Категория</div>
      <div>
        <v-select
          v-model="form.category_id"
          :items="CATEGORIES"
          item-text="title"
          item-value="id"
          :label="$t('calc.Category')"
        />
      </div>
      <div :class="{ isLoading: !form.category_id }">
        <div>1 — Параметры доставки</div>

        <div>
          <v-select
            v-model="form.product_id"
            :items="deliveryTypesFiltered"
            item-text="text"
            item-value="id"
            :label="$t('calc.Delivery Type')"
          />
        </div>

        <div>2 — Зоны доставки</div>
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
        <div v-else>
          <v-select
            v-model="form.city_id"
            :items="ZONES"
            item-text="title"
            item-value="id"
            :label="$t('calc.Delivery City')"
          />
          <v-select
            v-model="form.zone_id"
            :items="zonesFiltered"
            item-text="title"
            item-value="id"
            :label="$t('calc.Delivery Zone')"
          />
        </div>
        <v-row justify="center" align="center">
          <v-btn color="success" :loading="isLoading" :disabled="!isValidToGetTable" @click="getTable">
            <v-icon left>mdi-file-table</v-icon>
            {{ $t('calc-admin.Get Table') }}
          </v-btn>
        </v-row>
        <CalcAdminTable v-if="priceTable.length" :loading="isLoading" :table="priceTable" @save="saveTable" />
        <!--
        <v-row justify="center" align="center">
          <v-btn type="submit" color="success" :disabled="!isValidForm">
            <v-icon left>mdi-calculator</v-icon>
            {{ $t('calc.Calculate') }}
          </v-btn>
        </v-row>
        -->
      </div>
    </v-form>
  </v-flex>
</template>

<script>
import deliveryTypes from '@/constants/deliveryTypes'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'CalcAdminForm',
  components: {
    CalcAdminTable: () => import(/* webpackChunkName: "CalcAdminTable" */ '@/components/calc/CalcAdminTable'),
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
        // (если предоплата, то не важно какое значение, пусть будет 3 для общего понимания)
        product_id: 0,
      },
      isLoading: false,
      isLoadingCategories: false,
      priceTable: [],
    }
  },
  computed: {
    ...mapState('calc', ['CATEGORIES', 'ZONES', 'DELIVERY_POINTS']),
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
    zonesFiltered() {
      return this.ZONES.find(e => e.id === this.form.city_id)?.zones || []
    },
    isValidToGetTable() {
      let isValid = this.form.product_id
      if (this.form.category_id === 3) {
        /* https://jira.courierZ.com/browse/LOG-103
         если категория не 3, то city_id & zone_id
         иначе delivery_point_id */
        isValid = isValid && this.form.delivery_point_id
      } else {
        isValid = isValid && this.form.city_id && this.form.zone_id
      }
      return isValid
    },
    formToSend() {
      const form = JSON.parse(JSON.stringify(this.form))
      /* @TODO  Alexey 2 job 23.11.20 пока не участвует в расчете. нужно будет битовую маску присылать выбраных услуг.
       там сейчас одна, возрат документации. может в будущем еще появятся */
      return form
    },
    isValidForm() {
      const { category_id: cat } = this.form
      return cat
    },
  },
  watch: {
    'form.category_id': 'categoryIdWatcher',
  },
  created() {
    this.init()
  },
  methods: {
    ...mapActions('calc', ['GET_CATEGORIES', 'GET_ZONES', 'GET_TABLE', 'SAVE_TABLE', 'GET_DELIVERY_POINTS']),
    init() {
      this.GET_ZONES()
      this.getCategories()
      this.doRequest(this.GET_DELIVERY_POINTS, 'isLoading')
    },
    categoryIdWatcher() {
      this.form.delivery_type = null // reset to ALL(0) (compatible with both category_id (1,2))
    },
    getCategories() {
      this.doRequest(this.GET_CATEGORIES, 'isLoadingCategories')
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
    async getTable() {
      this.isLoading = true
      try {
        this.priceTable = await this.GET_TABLE(this.form)
      } catch (err) {
        this.$global.error(err)
      } finally {
        this.isLoading = false
      }
    },
    async saveTable(items) {
      this.isLoading = true
      try {
        await this.SAVE_TABLE({ form: this.form, items })
      } catch (err) {
        this.$global.error(err)
      } finally {
        this.isLoading = false
      }
    },
  },
}
</script>
