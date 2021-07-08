<template>
  <q-btn-dropdown :label="label" flat auto-close dense ripple size="sm">
    <q-list>
      <q-item
        v-for="(type, productNameTypeIndex) in productNameTypeOptions"
        :key="'product_name_type__' + productNameTypeIndex"
        clickable
        @click="$emit('typeSelected', { index: rowIndex, type: type.value })"
      >
        <q-item-section>
          <q-item-label>{{ type.label }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ProductNameTypeSelect',
  props: {
    rowIndex: {
      type: Number,
      required: true,
    },
    productNameTypeOptions: {
      type: Array,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
  },
  emits: ['typeSelected'],
});
</script>
