<template>
  <edit-customer creation-mode />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import EditCustomer from './EditCustomer.vue';

export default defineComponent({
  name: 'CreateCustomer',
  components: { EditCustomer },
  setup() {
    return {};
  },
});
</script>

<style></style>
