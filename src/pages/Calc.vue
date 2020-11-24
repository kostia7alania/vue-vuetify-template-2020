<template>
  <v-container class="fill-height">
    <v-row justify="center" align="center">
      <v-col class="shrink">
        <Dadata />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  components: {
    Dadata: () => import(/* webpackChunkName: "Dadata" */ '@/components/calc/Dadata'),
  },
}
</script>
