<template>
  <q-icon
    v-if="field !== ''"
    name="close"
    @click="$emit('clear')"
    class="cursor-pointer"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'InputClear',
  props: {
    field: {
      type: [String, Number, Array, Object],
      required: true,
    },
  },
  emits: ['clear'],
  setup(/* props */) {
    return {};
  },
});
</script>
