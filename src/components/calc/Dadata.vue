<template>
  <section>
    {{ constants }}
    <VueDadata :token="constants.dadata" />
  </section>
</template>

<script>
import constants from '@/config/constants'

export default {
  name: 'Dadata',
  components: {
    VueDadata: () => import(/* ebpackChunkName: "vue-dadata" */ 'vue-dadata'),
  },
  data() {
    return {
      constants,
    }
  },
}
</script>
