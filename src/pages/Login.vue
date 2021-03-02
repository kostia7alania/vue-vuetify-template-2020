<template>
  <!-- Login Module -->
  <div>
    <v-form ref="form" @submit.prevent="doLogin">
      <v-card width="500" class="mx-auto">
        <v-card-title>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="headline text-center">
                <v-icon size="1.2em" left>mdi-account-key-outline</v-icon>
                {{ $t('auth.Auth') }}
                <BaseLanguageSelector />
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <v-card-text>
          <CommonInput
            v-model.trim="form.login"
            :rules="['req']"
            :label="$t('auth.Username')"
            prepend-icon="mdi-account-circle"
          />
          <CommonInput
            v-model.trim="form.password"
            prepend-icon="mdi-lock"
            :append-icon="isShownPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :type="isShownPassword ? 'text' : 'password'"
            :rules="['req']"
            :label="$t('auth.Password')"
            @click:append="isShownPassword = !isShownPassword"
          />
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <!-- <v-btn :to="{ name: 'register' }">
        <v-icon>mdi-account-plus-outline</v-icon>
        {{ $t('auth.Registration') }}
      </v-btn> -->
          <v-btn block :disabled="!canLogin" color="success" type="submit">
            <v-icon>mdi-check-all</v-icon>
            {{ $t('auth.Login') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
    <div class="text-center">
      <router-link :to="{ name: 'Reset' }">{{ $t('auth.Forgot password') }}</router-link>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'Login',
  data() {
    return {
      form: {
        login: '',
        password: '',
        // login: 'rrabotnikov1989',
        // password: 'test123',
      },
      isShownPassword: false,
      isLoading: false,
    }
  },
  computed: {
    isValid() {
      return Object.entries(this.form).every(([, value]) => value)
    },
    canLogin() {
      return this.isValid && !this.isLoading
    },
  },
  methods: {
    ...mapActions('auth', ['LOGIN']),
    validate() {
      return this.$refs.form.validate()
    },
    async doLogin() {
      if (!this.validate()) return false
      if (!this.canLogin) return
      this.isLoading = true
      try {
        await this.LOGIN(this.form)
        this.goMain()
      } catch (err) {
        this.$global.error(err)
      } finally {
        this.isLoading = false
      }
    },
    goMain() {
      const { redirect } = this.$route.query
      if (
        redirect &&
        !['404', 'logout'].includes(this.$route.query.redirect)
        /* &&
          !Object.values(this.$route.meta.middleware.ignore || this.$route.meta.middleware)
            .flat()
            .some(e => e.toString().match('guest')) */
      ) {
        return this.$router.replace({ name: redirect })
      }

      this.$router.replace({ name: 'main' })
    },
  },
}
</script>
