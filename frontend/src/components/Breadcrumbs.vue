<template>
  <q-breadcrumbs
    class="desktop-only text-grey"
    active-color="primary"
    style="font-size: 16px"
  >
    <template #separator>
      <q-icon size="1.2em" name="arrow_forward" color="secondary" />
    </template>
    <q-breadcrumbs-el
      v-for="route in routes"
      :key="'route:' + route.name"
      :label="route.meta.label"
      :icon="route.meta.icon"
      :to="{ name: route.name }"
    />
  </q-breadcrumbs>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Breadcrumbs',
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
