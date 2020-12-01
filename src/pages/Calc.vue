<template>
  <v-container class="fill-height">
    <v-row justify="center" align="center">
      <v-col>
        <div class="text-center">
          <h1 class="title">
            Простой калькулятор
            <span v-if="isLoading">[ЗАГРУЗКА]</span>
          </h1>
        </div>

        <CalcForm :loading="isLoading" @get-calc="getCalc" />

        <CalcResult v-if="Object.keys(result).length" :result="result" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'CalcSimple',
  components: {
    CalcForm: () => import(/* webpackChunkName: "CalcForm" */ '@/components/calc/CalcForm'),
    CalcResult: () => import(/* webpackChunkName: "CalcResult" */ '@/components/calc/CalcResult'),
  },
  data() {
    return {
      isLoading: false,
      result: {},
    }
  },
  methods: {
    ...mapActions('calc', ['GET_CALC']),
    async getCalc(form) {
      this.isLoading = true
      try {
        this.result = await this.GET_CALC(form)
      } catch (err) {
        window.err = err
        console.log('err', err)
      } finally {
        this.isLoading = false
      }
    },
  },
}
</script>
