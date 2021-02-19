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
      v-for="route in breadcrumbsRoutes"
      :key="'route:' + route.name"
      :label="route.meta.label"
      :icon="route.meta.icon"
      :to="{ name: route.name }"
    />
  </q-breadcrumbs>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'Breadcrumbs',
  props: {
    /* routes: {
      type: Array,
      required: true,
    }, */
  },
  setup(/* props */) {
    const route = useRoute();
    return {
      breadcrumbsRoutes: computed(() => {
        return route.matched.map((route) => ({
          meta: route.meta,
          path: route.path,
          name: route.name,
        }));
      }),
    };
  },
});
</script>
