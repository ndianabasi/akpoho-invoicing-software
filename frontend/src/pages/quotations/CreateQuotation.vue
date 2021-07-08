<template>
  <edit-company creation-mode />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import EditCompany from './EditQuotation.vue';

export default defineComponent({
  name: 'CreateQuotation',
  components: { EditCompany },
  setup() {
    return {};
  },
});
</script>

<style></style>
