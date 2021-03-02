<template>
  <v-container fluid>
    <!-- <v-divider v-if="i" inset /> -->
    <v-row justify="center" align="center" dense>
      <v-col cols="12" sm="12" md="2" lg="2" xl="2" align-self="center" class="place">
        <v-row justify="center" align="center" dense>
          <v-avatar size="50" class="2v-card--material__avatar">
            <v-icon v-if="!weight || !length || !width || !height" size="x-large">mdi-package-variant</v-icon>
            <v-icon v-else size="x-large">mdi-package-variant-closed</v-icon>
          </v-avatar>
        </v-row>
        <v-row justify="center" align="center" dense>Место {{ i + 1 }}</v-row>
      </v-col>
      <v-col cols="12" sm="4" md="3">
        <v-row dense>Вес</v-row>
        <v-row>
          <v-col>
            <CommonInput v-model.number="weight" :rules="['req', 'num_pos']" type="number" label="Вес">
              <template #append>кг</template>
            </CommonInput>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" sm="8" md="7">
        <v-row dense>Габариты</v-row>
        <v-row>
          <v-col cols="12" sm="4">
            <CommonInput v-model.number="length" :rules="['req', 'num_pos']" type="number" label="Длина">
              <template #append>см</template>
              <template #append-outer>x</template>
            </CommonInput>
          </v-col>
          <v-col cols="12" sm="4">
            <CommonInput v-model.number="width" :rules="['req', 'num_pos']" type="number" label="Ширина">
              <template #append>см</template>
              <template #append-outer>x</template>
            </CommonInput>
          </v-col>
          <v-col cols="12" sm="4">
            <CommonInput v-model.number="height" :rules="['req', 'num_pos']" type="number" label="Высота">
              <template #append>см</template>
            </CommonInput>
          </v-col>
        </v-row>
      </v-col>
      <!-- <v-col align="left">
        <v-btn v-if="showRemove" text rounded @click="$emit('delete')">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </v-col> -->
    </v-row>

    <v-btn v-if="showAdd" rounded text @click="$emit('add')">
      <v-icon left>mdi-plus</v-icon>
      Добавить место
    </v-btn>
    <v-btn v-if="showRemove" rounded text @click="$emit('delete')">
      <v-icon left>mdi-delete</v-icon>
      Удалить место
    </v-btn>
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
    i: {
      type: Number,
      default: 0,
    },
    showRemove: {
      type: Boolean,
      default: false,
    },
    showAdd: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    weight: {
      get() {
        return this.place.weight
      },
      set(weight) {
        this.$emit('input', { ...this.place, weight })
      },
    },
    length: {
      get() {
        return this.place.dimensions.length
      },
      set(length) {
        this.$emit('input', { ...this.place, dimensions: { ...this.place.dimensions, length } })
      },
    },
    width: {
      get() {
        return this.place.dimensions.width
      },
      set(width) {
        this.$emit('input', { ...this.place, dimensions: { ...this.place.dimensions, width } })
      },
    },
    height: {
      get() {
        return this.place.dimensions.height
      },
      set(height) {
        this.$emit('input', { ...this.place, dimensions: { ...this.place.dimensions, height } })
      },
    },
  },
}
</script>

<style lang="scss" scoped>
.place {
  min-width: 109px;
}
</style>
