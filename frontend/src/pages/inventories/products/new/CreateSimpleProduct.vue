<template>
  <EditProduct creation-mode product-type="simple_product" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import EditProduct from '../EditProduct.vue';

export default defineComponent({
  name: 'CreateProduct',
  components: { EditProduct },
  setup() {
    return {};
  },
});
</script>

<style></style>
