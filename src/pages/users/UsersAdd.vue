<template>
  <!-- Login Module -->
  <div>
    <v-card class="mx-auto mt-5">
      <!--
        <v-card-title>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="headline text-center">
              <v-icon size="1.2em" left>mdi-account-plus</v-icon>
              {{ $t('users.Adding User') }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-card-title>
      -->
      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation :disabled="isLoading">
          <CommonInput
            v-model="form.first_name"
            :label="$t('auth.Name')"
            required
            type="text"
            prepend-icon="mdi-account-circle"
          />
          <CommonInput
            v-model="form.last_name"
            :label="$t('auth.Surname')"
            required
            prepend-icon="mdi-account-circle"
          />
          <CommonInput
            v-model="form.patronymic"
            :label="$t('auth.Patronymic')"
            required
            prepend-icon="mdi-account-circle"
          />

          <VDatepicker v-model="form.birth_date" label="Дата рождения" prepend-icon="mdi-cake" />
          <VDatepicker v-model="form.hire_date" label="Дата приема на работу" prepend-icon="mdi-briefcase" />

          <CommonInput v-model="form.email" required type="email" label="Почта" prepend-icon="mdi-at" />

          <CommonInput v-model="form.phone" label="Телефон" prepend-icon="mdi-cellphone" />
          <CommonInput v-model="form.address" label="Адрес" prepend-icon="mdi-map-marker" />
          <v-radio-group v-model="form.gender" label="Пол" row mandatory prepend-icon="mdi-gender-male-female">
            <!-- <template #label>
              <div>Пол</div>
            </template> -->
            <v-radio label="Мужской" value="M" />
            <v-radio label="Женский" value="F" />
          </v-radio-group>
          <v-select
            v-model="form.roles"
            prepend-icon="mdi-account-details"
            :items="roles"
            label="Роли"
            item-text="text"
            item-value="value"
            multiple
            chips
            hint="What are the target regions"
            persistent-hint
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
        <v-btn :disabled="isLoading || !valid" block color="success" @click="doRegister">
          <v-icon left>mdi-account-plus</v-icon>
          {{ $t('users.Add User') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'UsersAdd',
  data() {
    return {
      form: {},
      isLoading: false,
      valid: true,
    }
  },
  computed: {
    roles() {
      return [
        { text: 'Админ', value: 1 },
        { text: 'Менеджер', value: 2 },
        { text: 'Курьер', value: 3 },
      ]
    },
  },
  methods: {
    ...mapActions('users', ['USER_ADD']),
    validate() {
      return this.$refs.form.validate()
    },
    async doRegister() {
      if (!this.validate()) return false
      console.log('VALID')
      this.isLoading = true
      try {
        await this.USER_ADD(this.form)
        this.$global.toast.success.add.user(this.$t('notification.User Added'))
        this.$refs.form.reset()
      } catch (err) {
        this.$global.error(err)
      } finally {
        this.isLoading = false
      }
    },
  },
}
</script>
