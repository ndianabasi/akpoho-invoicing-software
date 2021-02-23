<template>
  <q-page-scroller
    position="bottom-right"
    :scroll-offset="150"
    :offset="[18, 18]"
  >
    <q-btn fab icon="keyboard_arrow_up" color="accent" />
  </q-page-scroller>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'GoToTop',
});
</script>
