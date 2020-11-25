<template>
  <v-container>
    <v-row>
      <v-col cols="6">
        <v-text-field v-model="nameModel" label="Имя" outlined />
      </v-col>
      <v-col cols="6">
        <v-btn text rounded @click="$emit('delete')">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <NomenclaturePlace v-for="place in nomenclature.places" :key="place.key" :place="place" />
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
}
</script>
