<template>
  <!-- Login Module -->
  <v-card width="400" class="mx-auto mt-5">
    <v-card-title>
      <div class="display-1">
        Авторизация
      </div>
    </v-card-title>
    <v-card-text>
      <v-form>
        <v-text-field prepend-icon="mdi-account-circle" label="Логин" />
        <v-text-field
          prepend-icon="mdi-lock"
          :append-icon="isShownPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="isShownPassword ? 'text' : 'password'"
          label="Пароль"
          @click:append="isShownPassword = !isShownPassword"
        />
      </v-form>
    </v-card-text>
    <v-divider />
    <v-card-actions>
      <v-btn color="success">Регистрация</v-btn>
      <v-spacer />
      <v-btn color="info">Войти</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      isShownPassword: false,
    }
  },
}
</script>
