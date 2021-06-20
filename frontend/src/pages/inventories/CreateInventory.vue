<template>
  <edit-inventory creation-mode />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import EditInventory from './EditInventory.vue';

export default defineComponent({
  name: 'CreateInventory',
  components: { EditInventory },
  setup() {
    return {};
  },
});
</script>

<style></style>
