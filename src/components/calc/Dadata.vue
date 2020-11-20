<template>
  <section>
    <VueDadata />
  </section>
</template>

<script>
export default {
  name: 'Dadata',
  components: {
    VueDadata: () => import(/* ebpackChunkName: "vue-dadata" */ 'vue-dadata'),
  },
}
</script>
