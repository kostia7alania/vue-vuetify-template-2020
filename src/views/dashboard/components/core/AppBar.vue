<template>
  <v-app-bar id="app-bar" absolute app flat height="50">
    <v-app-bar-nav-icon @click="SET_DRAWER(!DRAWER)" />
    <!-- <v-btn class="mr-3" elevation="1" fab small @click="SET_DRAWER(!DRAWER)">
      <v-icon v-if="DRAWER">mdi-chevron-left</v-icon>
      <v-icon v-else>mdi-dots-vertical</v-icon>
    </v-btn> -->

    <!-- <v-icon class="mx-4" large>mdi-youtube</v-icon> -->
    <!-- <v-toolbar-title class="mr-12 align-center">
      <span class="title">courier</span>
    </v-toolbar-title> -->
    <v-btn v-for="link in links" :key="link.title" class="hidden-sm-and-down" exact text :to="{ name: link.routeName }">
      <v-icon left>{{ link.icon }}</v-icon>
      {{ link.title }}
    </v-btn>
    <v-spacer />

    <!-- <v-text-field
      :label="$t('search')"
      color="secondary"
      class="hidden-sm-and-down"
      hide-details
      style="max-width: 165px;"
    >
      <template v-if="$vuetify.breakpoint.mdAndUp" #append-outer>
        <v-btn class="mt-n2" elevation="1" fab small>
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
      </template>
    </v-text-field> -->

    <div class="mx-3" />

    <!-- <v-icon>mdi-view-dashboard</v-icon> -->
    <v-btn v-if="$vuetify.breakpoint.mdAndUp" class="hidden-sm-and-down" text :href="`tel:${$global.constants.tel}`">
      <v-icon left>mdi-phone-outline</v-icon>
      {{ $global.constants.phone }}
    </v-btn>

    <!-- <span v-if="$vuetify.breakpoint.mdAndUp" class="ml-2">{{ $global.constants.company }}</span> -->
    <BaseLanguageSelector class="ma-1" />
    <SettingsDarkToggler class="ma-1" />
    <!--  <v-menu bottom left offset-y origin="top right" transition="scale-transition">
      <template #activator="{ attrs, on }">
        <v-btn class="ml-2" min-width="0" text v-bind="attrs" v-on="on">
          <v-badge color="red" overlap bordered>
            <template #badge>
              <span>5</span>
            </template>

            <v-icon>mdi-bell</v-icon>
          </v-badge>
        </v-btn>
      </template>

      <v-list :tile="false" nav>
        <div>
          <AppBarItem v-for="(n, i) in notifications" :key="`item-${i}`">
            <v-list-item-title v-text="n" />
          </AppBarItem>
        </div>
      </v-list>
    </v-menu>-->

    <v-btn min-width="0" text :to="{ name: 'user.profile' }">
      <v-icon>mdi-account</v-icon>
    </v-btn>

    <v-tooltip bottom>
      <template #activator="{ attrs,on }">
        <v-btn min-width="1" rouded text v-bind="attrs" :disabled="isLoading" v-on="on" @click="doLogout">
          <v-icon>mdi-logout</v-icon>
        </v-btn>
      </template>
      <span>Выйти</span>
    </v-tooltip>
  </v-app-bar>
</template>

<script>
// Components
// import { VHover, VListItem } from 'vuetify/lib'

// Utilities
import { mapState, mapMutations, mapActions } from 'vuex'

export default {
  name: 'DashboardCoreAppBar',

  components: {
    SettingsDarkToggler: () => import('@/views/dashboard/components/core/SettingsDarkToggler'),
    // AppBarItem: {
    //   render(h) {
    //     return h(VHover, {
    //       scopedSlots: {
    //         default: ({ hover }) => {
    //           return h(
    //             VListItem,
    //             {
    //               attrs: this.$attrs,
    //               class: {
    //                 'black--text': !hover,
    //                 'white--text secondary elevation-12': hover,
    //               },
    //               props: {
    //                 activeClass: '',
    //                 dark: hover,
    //                 link: true,
    //                 ...this.$attrs,
    //               },
    //             },
    //             this.$slots.default
    //           )
    //         },
    //       },
    //     })
    //   },
    // },
  },

  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    notifications: [
      'Новость 1',
      'Новость 2',
      'Новость 3',
      'Новость 4',
      'Новость 5',
      'Новость 6',
      'Новость 7',
      'Новость 8',
    ],
    isLoading: false,
  }),
  computed: {
    ...mapState('settings', ['DRAWER']),

    links() {
      return [
        {
          title: 'Калькулятор доставки',
          // title: this.$t('menu.calc'),
          routeName: 'calc',
          icon: 'mdi-calculator',
        },
        {
          title: this.$t('menu.orders'),
          // title: this.$t('menu.orders'),
          routeName: 'orders',
          icon: 'mdi-clipboard-list-outline ',
        },
        {
          title: 'Создание заказа',
          // title: this.$t('menu.orders/add'),
          routeName: 'orders/add',
          icon: 'mdi-cart-plus',
        },
      ]
    },
  },
  methods: {
    ...mapMutations('settings', ['SET_DRAWER']),
    ...mapActions('auth', ['LOGOUT']),
    async doLogout() {
      this.isLoading = true
      try {
        await this.LOGOUT()
        this.$router.push({ name: 'login' })
      } catch (err) {
        this.$global.error(err)
      } finally {
        this.isLoading = false
      }
    },
  },
}
</script>
