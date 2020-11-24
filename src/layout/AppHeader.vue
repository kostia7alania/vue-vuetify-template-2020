<template>
  <v-app-bar app clipped-left color="primary" dense dark>
    <v-app-bar-nav-icon @click.stop="$emit('toggle-menu')" />
    <v-icon class="mx-4" large>mdi-youtube</v-icon>
    <v-toolbar-title class="mr-12 align-center">
      <span class="title">Brand</span>
    </v-toolbar-title>
    <v-row align="center" style="max-width: 500px">
      <v-text-field
        :append-icon-cb="() => {}"
        placeholder="Поиск..."
        single-line
        append-icon="mdi-magnify"
        color="white"
        hide-details
      />
    </v-row>

    <v-spacer />

    <v-btn v-for="link in links" :key="link.title" exact text rouded :to="{ name: link.routeName }">
      <v-icon left>{{ link.icon }}</v-icon>
      {{ link.title }}
    </v-btn>
  </v-app-bar>
</template>

<script>
export default {
  name: 'AppHeader',
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
