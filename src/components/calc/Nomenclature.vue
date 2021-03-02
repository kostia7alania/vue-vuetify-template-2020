<template>
  <v-container>
    <v-row>
      <!-- <v-col cols="6">
        <v-text-field v-model="nomenclature.name" label="Имя" outlined />
      </v-col>
      <v-col cols="6">
        <v-btn text rounded @click="$emit('delete')">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-row> -->
      Мест в номенклатуре ({{ nomenclature.places.length }})
      <v-btn rounded text @click="$emit('add-place')">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
      <NomenclaturePlace
        v-for="(place, i) in nomenclature.places"
        :key="i"
        class="place"
        :place="place"
        @delete="deletePlace(i)"
      />
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'Nomenclature',
  components: {
    NomenclaturePlace: () => import(/* webpackChunkName: "NomenclaturePlace" */ '@/components/calc/NomenclaturePlace'),
  },
  props: {
    nomenclature: {
      /*
       {
            name: 'Телевизор samsung',
            places: [
              // limit: 10
              {
                weight: 4,
                dimensions: {
                  length: 170.1,
                  width: 60.1,
                  height: 45.1,
                },
              },
            ],
          },
      */
      type: Object,
      default: () => ({}),
    },
  },
  methods: {
    setNomenclature(nomenclature) {
      this.$emit('set-nomenclature', nomenclature)
    },
    deletePlace(i) {
      const { nomenclature } = this
      nomenclature.places.splice(i, 1)
      this.setNomenclature(nomenclature)
    },
    setPlace(i, $event) {
      // eslint-disable-next-line vue/no-mutating-props
      this.nomenclature.places[i] = $event
      this.setNomenclature(this.nomenclature)
    },
  },
}
</script>

<style lang="scss" scoped>
.place {
  border-left: 1px solid;
  padding-left: 50px;
}
</style>
