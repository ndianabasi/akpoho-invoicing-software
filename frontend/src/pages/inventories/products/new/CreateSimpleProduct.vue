<template>
  <EditProduct creation-mode />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import EditProduct from '../EditProduct.vue';

export default defineComponent({
  name: 'CreateSimpleProduct',
  components: { EditProduct },
  setup() {
    return {};
  },
});
</script>

<style></style>
