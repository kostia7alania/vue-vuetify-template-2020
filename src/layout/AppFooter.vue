<template>
  <v-footer color="primary lighten-1" padless>
    <v-row justify="center" no-gutters>
      <v-btn
        v-for="link in links"
        :key="link.title"
        :to="{ name: link.routeName }"
        color="white"
        text
        rounded
        class="my-2"
        exact
      >
        <v-icon left>{{ link.icon }}</v-icon>
        {{ link.title }}
      </v-btn>
      <v-col class="primary lighten-2 py-4 text-center white--text" cols="12">
        {{ new Date().getFullYear() }} —
        <strong>Vuetify</strong>
      </v-col>
    </v-row>
  </v-footer>
</template>

<script>
export default {
  data() {
    return {
      links: [
        {
          title: 'Главная',
          routeName: 'main',
          icon: 'mdi-home',
        },
        {
          title: 'Калькулятор',
          routeName: 'calc',
          icon: 'mdi-calculator ',
        },
        {
          title: 'Вход',
          routeName: 'auth',
          icon: 'mdi-login',
        },
      ],
    }
  },
}
</script>
