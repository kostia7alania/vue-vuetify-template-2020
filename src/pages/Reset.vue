<template>
  <!-- Login Module -->
  <div>
    <v-card width="500" class="mx-auto mt-5">
      <v-card-title>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="headline text-center">
              <v-icon size="1.2em" left>mdi-sync</v-icon>
              {{ $t('auth.Password Reset') }}
              <BaseLanguageSelector />
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-card-title>
      <v-card-text>
        <v-form>
          <v-text-field v-model="form.email" label="Почта" prepend-icon="mdi-account-circle" />

          <v-text-field
            v-model="form.password"
            prepend-icon="mdi-lock"
            :append-icon="isShownPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :type="isShownPassword ? 'text' : 'password'"
            :label="$t('auth.Password')"
            @click:append="isShownPassword = !isShownPassword"
          />
        </v-form>
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <!-- <v-btn :to="{ name: 'login' }">
          <v-icon>mdi-account-key-outline</v-icon>
          {{ $t('auth.Login') }}
        </v-btn>
        <v-spacer /> -->
        <v-btn block color="success" @click="doRegister">
          <v-icon>mdi-check-all</v-icon>
          {{ $t('auth.Password Reset') }}
        </v-btn>
      </v-card-actions>
    </v-card>
    <div class="text-center">
      {{ $t('auth.Remembered Password') }}?
      <router-link :to="{ name: 'login' }">{{ $t('auth.Login') }}</router-link>
    </div>
  </div>
</template>

<script>
export default {
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
