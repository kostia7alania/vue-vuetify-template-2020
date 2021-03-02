<template>
  <v-row>
    <v-col cols="12" sm="6" md="5" lg="4">
      <PlannerForm />
    </v-col>
    <v-col cols="12" sm="6" md="7" lg="8">
      <PlannerResult />
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'Planner',
  components: {
    PlannerForm: () => import(/* webpackChunkName: "PlannerForm" */ '@/components/planner/PlannerForm'),
    PlannerResult: () => import(/* webpackChunkName: "PlannerResult" */ '@/components/planner/PlannerResult'),
  },
}
</script>
