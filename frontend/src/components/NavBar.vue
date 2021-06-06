<template>
  <q-toolbar class="bg-white q-pl-lg">
    <q-btn
      flat
      round
      dense
      icon="arrow_back"
      class="q-mr-sm"
      @click="$router.go(-1)"
    />

    <q-toolbar-title>{{ currentRouteLabel }}</q-toolbar-title>

    <breadcrumbs :routes="breadcrumbsRoutes" />
  </q-toolbar>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useRoute } from 'vue-router';
import Breadcrumbs from './Breadcrumbs.vue';

export default defineComponent({
  name: 'NavBar',
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

    return {
      breadcrumbsRoutes,
      currentRouteLabel,
    };
  },
});
</script>
