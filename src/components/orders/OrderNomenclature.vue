<template>
  <!--<v-container fluid> -->
  <!-- <v-divider v-if="showRemove" /> -->
  <section>
    <v-row no-gutters justify="center" align="center" dense>
      <v-col cols="auto" class="place">
        <v-row justify="center" align="center" dense>
          <v-avatar size="50" class="2v-card--material__avatar">
            <v-icon v-if="!price || !quantity || !weight || !sku || !name" size="x-large">mdi-package-variant</v-icon>
            <v-icon v-else size="x-large">mdi-package-variant-closed</v-icon>
          </v-avatar>
        </v-row>
        <v-row justify="center" align="center" dense>Позиция {{ i + 1 }}</v-row>
      </v-col>
      <v-col cols="auto" class="place">
        <v-btn v-if="showRemove" rounded text @click="$emit('delete')">
          <v-icon left>mdi-close</v-icon>
          Удалить
        </v-btn>
      </v-col>
    </v-row>
    <v-row justify="center" align="center" dense>
      <v-col cols="12">
        <v-row>
          <v-col cols="12" sm="3" md="4" lg="2">
            <CommonInput v-model.trim="sku" label="Артикул" />
          </v-col>
          <v-col cols="12" sm="6" md="4" lg="3">
            <CommonInput v-model.trim="name" :rules="['req']" label="Наименование" />
          </v-col>
          <v-col cols="6" sm="3" md="4" lg="1">
            <CommonInput v-model.trim="barCode" label="Штрих-код" />
          </v-col>
          <!-- вторая строка на SM-- -->
          <v-col cols="6" sm="4" md="2" lg="1">
            <CommonInput v-model.number="weight" :rules="['req', 'num_pos']" type="number" label="Вес">
              <template #append>кг</template>
            </CommonInput>
          </v-col>

          <v-col cols="6" sm="4" md="2" lg="1">
            <CommonInput
              v-model.number="quantity"
              label="Кол-во"
              type="number"
              :min="0"
              :rules="['req', 'num', 'num_pos']"
            >
              <template #append>ед</template>
            </CommonInput>
          </v-col>

          <v-col cols="6" sm="4" md="2" lg="1">
            <CommonInput
              v-model.number="price"
              label="Стоимость"
              type="number"
              :min="0"
              :rules="['req', 'num', 'num_pos']"
            >
              <template #append>₽</template>
            </CommonInput>
          </v-col>

          <v-col cols="6" sm="6" md="3" lg="1">
            <CommonInput v-model.number="vat" label="НДС" type="number" :min="0" :rules="['num', 'num_pos']">
              <template #append>₽</template>
            </CommonInput>
          </v-col>

          <v-col cols="6" sm="6" md="3" lg="2">
            <CommonInput v-model="label" label="Маркировка" />
          </v-col>
        </v-row>
      </v-col>
      <!-- <v-col align="left">
        <v-btn v-if="showRemove" text rounded @click="$emit('delete')">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </v-col> -->
    </v-row>
  </section>
  <!-- <v-btn v-if="showAdd" rounded text @click="$emit('add')">
      <v-icon left>mdi-plus</v-icon>
      Добавить
    </v-btn> -->
  <!-- <v-btn v-if="showRemove" rounded text @click="$emit('delete')">
      <v-icon left>mdi-delete</v-icon>
      Удалить
    </v-btn> -->
  <!-- </v-container>-->
</template>

<script>
export default {
  name: 'OrderNomenclature',
  props: {
    value: {
      /*
        "nomenclatures": [
          {
            "id": 1,
            "weight": 4.3,
            "sku": "qwerty123",
            "status_id": 1,
            "name": "Номенклатура 1"
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
    sku: {
      get() {
        return this.value.sku
      },
      set(sku) {
        this.emitHandler('sku', sku)
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
    barCode: {
      get() {
        return this.value.bar_code
      },
      set(barCode) {
        this.emitHandler('bar_code', barCode)
      },
    },
    price: {
      get() {
        return this.value.price
      },
      set(price) {
        this.emitHandler('price', price)
      },
    },
    quantity: {
      get() {
        return this.value.quantity
      },
      set(quantity) {
        this.emitHandler('quantity', quantity)
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
    vat: {
      get() {
        return this.value.vat
      },
      set(vat) {
        this.emitHandler('vat', vat)
      },
    },
    label: {
      get() {
        return this.value.label
      },
      set(label) {
        this.emitHandler('label', label)
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
