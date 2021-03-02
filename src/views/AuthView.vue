<template>
  <v-app>
    <v-main class="auth">
      <v-container fill-height="fill-height">
        <v-layout align-center="align-center" justify-center="justify-center">
          <v-flex class="login-form text-xs-center">
            <!-- <div class="display-1 mb-3"><v-icon class="mr-2" large="large">Courier</v-icon></div> -->
            <router-view />
          </v-flex>
        </v-layout>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'AuthView',
}
</script>

<style lang="scss" scoped>
::v-deep .v-main__wrap {
  align-self: center;
}
// .auth {
//   background-color: $primary-color;
// }
</style>
