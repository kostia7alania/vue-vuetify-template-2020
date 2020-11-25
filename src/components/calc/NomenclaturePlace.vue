<template>
  <v-container>
    <v-row justify="center">
      <div>
        <v-row>
          <v-col cols="2">
            <v-text-field v-model.number="place.weight" type="number" label="Вес" outlined />
          </v-col>
          <v-col cols="3">
            <v-text-field v-model.number="length" type="number" label="Длина" outlined />
          </v-col>
          <v-col cols="3">
            <v-text-field v-model.number="width" type="number" label="Ширина" outlined />
          </v-col>
          <v-col cols="3">
            <v-text-field v-model.number="height" type="number" label="Высота" outlined />
          </v-col>
          <v-col cols="1" class="items-center">
            <v-btn text rounded @click="$emit('delete')">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </div>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'NomenclaturePlace',
  props: {
    place: {
      /* {
          weight: 4,
          dimensions: {
            length: 170.1,
            width: 60.1,
            height: 45.1,
          },
      */
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    weight: {
      get() {
        return this.place.weight
      },
      set(weight) {
        this.place.weight = weight
        // this.$emit('set-place', { ...this.place, weight })
      },
    },
    length: {
      get() {
        return this.place.dimensions.length
      },
      set(length) {
        this.place.dimensions.length = length
        // this.$emit('set-place', { ...this.place, dimensions: { ...this.place.dimensions, length } })
      },
    },
    width: {
      get() {
        return this.place.dimensions.width
      },
      set(width) {
        this.place.dimensions.width = width
        // this.$emit('set-place', { ...this.place, dimensions: { ...this.place.dimensions, width } })
      },
    },
    height: {
      get() {
        return this.place.dimensions.height
      },
      set(height) {
        this.place.dimensions.height = height
        // this.$emit('set-place', { ...this.place, dimensions: { ...this.place.dimensions, height } })
      },
    },
  },
}
</script>
<style lang="scss" scoped>
.items-center {
  align-items: center;
}
</style>
