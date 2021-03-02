<template>
  <v-footer id="dashboard-core-footer">
    <v-container fluid>
      <v-row justify="space-between" align="start" s>
        <v-col class="text-center" cols="12" sm="6" md="4">
          <v-btn text>
            <v-icon left>mdi-email-edit-outline</v-icon>
            Написать коммерческому директору
          </v-btn>
        </v-col>
        <v-col class="text-center" cols="12" sm="6" md="4">
          <!-- <a :href="`tel:${$global.constants.tel}`" class="grey--text text--darken-3">
            <v-icon left>mdi-phone-outline</v-icon>
            {{ $global.constants.phone }}
          </a> -->
          <v-btn text :href="`tel:${$global.constants.tel}`">
            <v-icon left>mdi-phone-outline</v-icon>
            {{ $global.constants.phone }}
          </v-btn>
        </v-col>
        <v-col class="text-center font-weight-light" cols="12" sm="12" md="4">
          <v-tooltip top>
            <template #activator="{ on, attrs }">
              <span v-bind="attrs" v-on="on">
                <!-- &copy; {{ years }}, made with <v-icon size="18">mdi-heart</v-icon> -->
                <p class="mt-3">© {{ $global.constants.company }}</p>
              </span>
            </template>
            <span>{{ label }}</span>
          </v-tooltip>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script>
export default {
  name: 'DashboardCoreFooter',
  computed: {
    years() {
      const thisYear = new Date().getFullYear()
      const startYear = 2020
      let year = 2020
      if (thisYear !== startYear) year = `${startYear}-${thisYear}`
      return `${year}`
    },
    buildDate() {
      return process.env.VUE_APP_COMMITDATE || ''
    },
    version() {
      return process.env.VUE_APP_PACKAGE_VERSION || ''
    },
    label() {
      return `${this.$global.constants.brand} v${this.version} | ${this.buildDate} (msk)`
    },
  },
}
</script>

<style lang="sass" scoped>
#dashboard-core-footer
  // font-size: 12px
  padding: 0px 0 0px 0px
  a
    font-size: .825rem
    font-weight: 500
    text-decoration: none
    // text-transform: uppercase
</style>
