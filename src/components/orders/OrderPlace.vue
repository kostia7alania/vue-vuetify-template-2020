<template>
  <section>
    <!-- <v-divider v-if="showRemove" /> -->
    <v-row no-gutters justify="center" align="center" dense>
      <v-col cols="auto" justify="start" align="left" class="pb-0 text-left">
        <!--        <v-row justify="center" align="center" dense>
          <v-avatar size="50" class="2v-card--material__avatar">
            <v-icon v-if="!name || !weight || !length || !width || !height" size="x-large">mdi-package-variant</v-icon>
            <v-icon v-else size="x-large">mdi-package-variant-closed</v-icon>
          </v-avatar>
        </v-row>
        <v-row justify="center" align="center" dense>Место {{ i + 1 }}</v-row>
    -->
        <span class="font-weight-bold">Место {{ i + 1 }}</span>
      </v-col>
      <v-col cols="auto" class="place">
        <v-tooltip bottom>
          <template #activator="{ on, attrs }">
            <v-btn v-bind="attrs" icon rounded text :disabled="!showRemove" v-on="on" @click="$emit('delete')">
              <v-icon>mdi-delete-outline</v-icon>
            </v-btn>
          </template>
          <span>Удалить</span>
        </v-tooltip>
      </v-col>
    </v-row>
    <v-row justify="center" align="center" dense>
      <v-col cols="12">
        <v-row>
          <!-- <CommonInput
              v-model.number="orderId"
              :rules="['num', 'num_pos', 'req']"
              type="number"
              label="Номер заказа"
            /> -->
          <v-col cols="12" sm="3">
            <CommonInput v-model.number="weight" :rules="['req', 'num_pos']" type="number" label="Вес">
              <template #append>кг</template>
            </CommonInput>
          </v-col>
          <!-- <v-col cols="12" md="4" sm="8">
            <CommonInput v-model.trim="name" :rules="['req']" label="Наименование" />
          </v-col>-->
          <v-col cols="4" sm="3" class="pr-2">
            <CommonInput v-model.number="length" :rules="['req', 'num_pos']" type="number" label="Длина">
              <template #append>см</template>
              <template #append-outer>x</template>
            </CommonInput>
          </v-col>
          <v-col cols="4" sm="3" class="pl-0 pr-2">
            <CommonInput v-model.number="width" :rules="['req', 'num_pos']" type="number" label="Ширина">
              <template #append>см</template>
              <template #append-outer>x</template>
            </CommonInput>
          </v-col>
          <v-col cols="4" sm="3" class="pl-0">
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
    <!-- <v-btn v-if="showAdd" rounded text @click="$emit('add')">
      <v-icon left>mdi-plus</v-icon>
      Добавить
    </v-btn> -->
    <!-- <v-btn v-if="showRemove" rounded text @click="$emit('delete')">
      <v-icon left>mdi-delete</v-icon>
      Удалить
    </v-btn> -->
  </section>
</template>

<script>
export default {
  name: 'OrderPlace',
  props: {
    value: {
      /*
      "places": [
        {
            "name": "Место 1",
            "weight": 4.3,
            "length": 50,
            "width": 50,
            "height": 50
          }
      ],
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
    orderId: {
      get() {
        return this.value.orderId
      },
      set(orderId) {
        this.emitHandler('orderId', orderId)
      },
    },
    name: {
      get() {
        return this.value.name
      },
      set(name) {
        this.emitHandler('name', name)
      },
    },
    weight: {
      get() {
        return this.value.weight
      },
      set(weight) {
        this.emitHandler('weight', weight)
      },
    },
    length: {
      get() {
        return this.value.length
      },
      set(length) {
        this.emitHandler('length', length)
      },
    },
    width: {
      get() {
        return this.value.width
      },
      set(width) {
        this.emitHandler('width', width)
      },
    },
    height: {
      get() {
        return this.value.height
      },
      set(height) {
        this.emitHandler('height', height)
      },
    },
  },
  methods: {
    emitHandler(key, value) {
      this.$emit('input', { ...this.value, [key]: value })
    },
  },
}
</script>
