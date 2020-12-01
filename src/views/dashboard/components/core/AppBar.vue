<template>
  <v-app-bar id="app-bar" absolute app color="transparent" flat height="75">
    <v-btn class="mr-3" elevation="1" fab small @click="SET_DRAWER(!DRAWER)">
      <v-icon v-if="value">
        mdi-view-quilt
      </v-icon>

      <v-icon v-else>
        mdi-dots-vertical
      </v-icon>
    </v-btn>

    <v-toolbar-title class="hidden-sm-and-down font-weight-light" v-text="$route.meta.title" />

    <v-spacer />

    <v-text-field :label="$t('search')" color="secondary" hide-details style="max-width: 165px;">
      <template v-if="$vuetify.breakpoint.mdAndUp" #append-outer>
        <v-btn class="mt-n2" elevation="1" fab small>
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
      </template>
    </v-text-field>

    <div class="mx-3" />

    <!-- <v-icon>mdi-view-dashboard</v-icon> -->
    <BaseLanguageSelector class="ml-2" />

    <v-menu bottom left offset-y origin="top right" transition="scale-transition">
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
    </v-menu>

    <v-btn class="ml-2" min-width="0" text :to="{ name: 'user.profile' }">
      <v-icon>mdi-account</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script>
// Components
import { VHover, VListItem } from 'vuetify/lib'

// Utilities
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'DashboardCoreAppBar',

  components: {
    AppBarItem: {
      render(h) {
        return h(VHover, {
          scopedSlots: {
            default: ({ hover }) => {
              return h(
                VListItem,
                {
                  attrs: this.$attrs,
                  class: {
                    'black--text': !hover,
                    'white--text secondary elevation-12': hover,
                  },
                  props: {
                    activeClass: '',
                    dark: hover,
                    link: true,
                    ...this.$attrs,
                  },
                },
                this.$slots.default
              )
            },
          },
        })
      },
    },
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
  }),

  computed: {
    ...mapState('settings', ['DRAWER']),
  },

  methods: {
    ...mapMutations('settings', ['SET_DRAWER']),
  },
}
</script>
