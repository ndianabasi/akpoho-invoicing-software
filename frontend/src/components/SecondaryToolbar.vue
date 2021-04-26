<template>
  <q-page-sticky expand position="top" style="z-index: 10">
    <q-toolbar class="bg-white text-primary q-pl-lg">
      <q-btn
        @click="$router.go(-1)"
        flat
        round
        dense
        icon="arrow_back"
        class="q-mr-sm"
      />

      <q-toolbar-title>{{ currentRouteLabel }}</q-toolbar-title>

      <breadcrumbs :routes="breadcrumbsRoutes" />
    </q-toolbar>
  </q-page-sticky>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import Breadcrumbs from './Breadcrumbs.vue';
import { useMeta } from 'quasar';

export default defineComponent({
  name: 'SecondaryToolbar',
  components: {
    Breadcrumbs,
  },
  props: {
    /* routes: {
      type: Array,
      required: true,
    }, */
  },
  setup(/* props */) {
    const route = useRoute();

    const title = ref(''); // we define the "title" prop

    // NOTICE the parameter here is a function
    // Under the covers, it is converted to a Vue computed prop for reactivity
    useMeta(() => {
      return {
        // whenever "title" from above changes, your meta will automatically update
        title: title.value,
        ogTitle: { name: title.value },
      };
    });

    function setPageTitle(newTitle: string) {
      title.value = newTitle; // will automatically trigger a Meta update due to the binding
    }

    const breadcrumbsRoutes = computed(() => {
      return route.matched.map((route) => ({
        meta: route.meta,
        path: route.path,
        name: route.name,
      }));
    });

    const currentRouteLabel = computed(() => {
      return breadcrumbsRoutes.value
        .filter((_route, index, routes) => index === routes.length - 1)
        .reduce((_prev, cur) => `${cur.meta.label as string}`, '');
    });

    watchEffect(() => {
      setPageTitle(currentRouteLabel.value);
    });

    return {
      breadcrumbsRoutes,
      currentRouteLabel,
    };
  },
});
</script>
