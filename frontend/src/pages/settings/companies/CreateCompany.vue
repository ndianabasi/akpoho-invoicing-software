<template>
  <edit-company creation-mode />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import EditCompany from './EditCompany.vue';

export default defineComponent({
  name: 'CreateCompany',
  components: { EditCompany },
  setup() {
    return {};
  },
});
</script>

<style></style>
