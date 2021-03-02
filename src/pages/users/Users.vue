<template>
  <!-- Login Module -->
  <div>
    список
  </div>
</template>

<script>
export default {
  name: 'Users',
  data() {
    return {
      form: {
        birthDate: '1989-03-14',
      },
      isShownPassword: false,
    }
  },
  methods: {
    doRegister() {
      console.log('doRegister')
    },
  },
}
</script>
