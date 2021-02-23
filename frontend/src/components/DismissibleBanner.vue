<template>
  <q-breadcrumbs
    class="desktop-only text-grey"
    active-color="primary"
    style="font-size: 16px"
  >
  </q-breadcrumbs>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'DismissibleBanner',
  props: {
    routes: {
      type: Array,
      required: true,
    },
  },
  setup(/* props */) {
    return {};
  },
});
</script>
